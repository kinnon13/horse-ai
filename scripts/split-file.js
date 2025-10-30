const fs = require('fs');
const path = require('path');
const recast = require('recast');
const babelParser = require('@babel/parser');
const prettier = require('prettier');

const format = (code) => prettier.format(code, { parser: 'babel-ts' });

const parser = { parse: (code) => babelParser.parse(code, { sourceType: 'module', plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy', 'importAssertions', 'topLevelAwait', 'doExpressions', 'optionalChaining', 'nullishCoalescingOperator', 'objectRestSpread'], errorRecovery: true }) };

function safeParse(code, file) {
  try { return recast.parse(code, { parser }); }
  catch (e) { console.error(`[PARSE FAIL] ${file}: ${e.message}`); return null; }
}

function writeOut(baseFile, suffix, nodes) {
  if (!nodes.length) return null;
  const base = baseFile.replace(/\.(tsx|ts)$/, '');
  const outFile = `${base}${suffix}`;
  const code = nodes.map(n => recast.print(n).code).join('\n\n');
  fs.writeFileSync(outFile, format(code), 'utf8');
  nodes.forEach(n => n.prune());
  return path.basename(outFile);
}

function splitOne(file) {
  const src = fs.readFileSync(file, 'utf8');
  const ast = safeParse(src, file);
  if (!ast) return false;

  const types = [];
  const schemas = [];
  const consts = [];
  const renders = [];
  const { visit } = recast.types;
  const b = recast.types.builders;

  visit(ast, {
    visitTSInterfaceDeclaration(p) { types.push(p); return false; },
    visitTSTypeAliasDeclaration(p) { types.push(p); return false; },
    visitVariableDeclaration(p) {
      const code = recast.print(p).code;
      if (/z\.object|z\.array|yup\.object|Zod/.test(code)) { schemas.push(p); return false; }
      if ((/\=\s*\[/.test(code) || /columns\s*=/.test(code) || /as const/.test(code)) && code.split('\n').length >= 6) { consts.push(p); return false; }
      this.traverse(p);
    },
    visitFunctionDeclaration(p) {
      const name = p.node.id?.name || '';
      if (name.startsWith('render') || /^[A-Z]\w*View$/.test(name)) { renders.push(p); return false; }
      this.traverse(p);
    },
    visitVariableDeclarator(p) {
      const id = p.node.id;
      const init = p.node.init;
      const name = id && id.name ? id.name : '';
      const isFn = init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression');
      if (isFn && name.startsWith('render')) { renders.push(this.parent); return false; }
      this.traverse(p);
    }
  });

  const wrote = { types: writeOut(file, '.types.ts', types), schema: writeOut(file, '.schema.ts', schemas), constants: writeOut(file, '.constants.ts', consts), view: writeOut(file, '.view.tsx', renders) };

  const imports = [];
  if (wrote.types) imports.push(b.importDeclaration([b.importNamespaceSpecifier(b.identifier('Types'))], b.stringLiteral(`./${wrote.types}`)));
  if (wrote.schema) imports.push(b.importDeclaration([b.importNamespaceSpecifier(b.identifier('Schema'))], b.stringLiteral(`./${wrote.schema}`)));
  if (wrote.constants) imports.push(b.importDeclaration([b.importNamespaceSpecifier(b.identifier('CONSTS'))], b.stringLiteral(`./${wrote.constants}`)));
  if (wrote.view) imports.push(b.importDeclaration([b.importSpecifier(b.identifier('CompView'), b.identifier('CompView'))], b.stringLiteral(`./${wrote.view}`)));

  if (imports.length) ast.program.body.unshift(...imports);
  fs.writeFileSync(file, format(recast.print(ast).code), 'utf8');
  console.log(`[SPLIT OK] ${file}`);
  return true;
}

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/split-file.js src/path/File.tsx|ts'); process.exit(1); }
try { process.exit(splitOne(file) ? 0 : 2); }
catch (e) { console.error(`[SPLIT ERROR] ${file}: ${e.message}`); process.exit(3); }
