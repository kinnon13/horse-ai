import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';

const root = process.argv[2] || 'src';

const PLUGINS = [
  'typescript','jsx','classProperties','decorators-legacy','importAssertions',
  'topLevelAwait','doExpressions','optionalChaining','nullishCoalescingOperator','objectRestSpread'
];

const read = (p)=>fs.readFileSync(p,'utf8');
const walk = (dir, out=[]) => {
  for (const e of fs.readdirSync(dir)) {
    const p = path.join(dir,e);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p,out);
    else if (/\.(ts|tsx)$/.test(p)) out.push(p);
  }
  return out;
};

function roleOf(file) {
  const b = path.basename(file);
  if (/\.view\.tsx$/.test(b)) return 'view';
  if (/\.types\.ts$/.test(b)) return 'types';
  if (/\.constants\.ts$/.test(b)) return 'constants';
  if (/\.schema\.ts$/.test(b)) return 'schema';
  if (/\.repo\.ts$/.test(b)) return 'repo';
  if (/route\.(ts|tsx)$/.test(b)) return 'orchestrator';
  if (/page\.(ts|tsx)$/.test(b)) return 'orchestrator';
  if (/use[A-Z].*\.ts$/.test(b)) return 'hook';
  if (/Container\.(ts|tsx)$/.test(b) || /orchestrator\.(ts|tsx)$/.test(b)) return 'orchestrator';
  return 'other';
}

function analyze(file) {
  const code = read(file);
  let ast;
  try { ast = parse(code, { sourceType:'module', plugins: PLUGINS, errorRecovery:true }); }
  catch(e){ return { file, parseError: e.message }; }

  let hasJSX=false, imports=[], calls=new Set(), hasUseEffect=false;
  let bigArray=false, hasZod=false, hasYup=false, hasIO=false;

  const visit = (node) => {
    if (!node || typeof node!=='object') return;
    switch (node.type) {
      case 'ImportDeclaration': {
        const s=node.source?.value||'';
        imports.push(s);
        if (s.includes('zod')) hasZod=true;
        if (s.includes('yup')) hasYup=true;
        if (/(axios|node-fetch|cross-fetch|ky|@tanstack\/react-query|swr|supabase|@prisma|mongoose|pg|mysql|mysql2|postgres)/.test(s)) hasIO=true;
        break;
      }
      case 'CallExpression': {
        const cal = node.callee;
        if (cal?.type==='Identifier') {
          calls.add(cal.name);
          if (cal.name==='fetch') hasIO=true;
          if (cal.name==='useEffect') hasUseEffect=true;
        } else if (cal?.type==='MemberExpression' && cal.object?.name==='z') {
          hasZod = true;
        }
        break;
      }
      case 'JSXElement':
      case 'JSXFragment':
        hasJSX=true; break;
      case 'VariableDeclarator': {
        const init=node.init;
        if (init?.type==='ArrayExpression' && (init.elements?.length||0) > 8) bigArray=true;
        break;
      }
    }
    for (const k in node) {
      const v=node[k];
      if (Array.isArray(v)) v.forEach(visit);
      else if (v && typeof v==='object') visit(v);
    }
  };
  visit(ast.program);

  return {
    file, role: roleOf(file),
    hasJSX, hasUseEffect, imports, calls: Array.from(calls),
    hasZod, hasYup, hasIO, bigArray
  };
}

function passesSingleTask(info) {
  const { role, hasJSX, hasIO, hasZod, hasYup, bigArray, hasUseEffect, file } = info;
  const violations = [];

  if (role==='orchestrator' || role==='hook') {
    if (hasZod || hasYup) violations.push('orchestrator contains schema (zod/yup) — move to *.schema.ts');
    if (bigArray)       violations.push('orchestrator contains large const array — move to *.constants.ts');
    if (hasIO)          violations.push('orchestrator/hook does network/db I/O — move to *.repo.ts');
  }
  if (role==='view') {
    if (!hasJSX)        violations.push('view file without JSX');
    if (hasIO)          violations.push('view imports/uses network/db — move to *.repo.ts');
    if (hasUseEffect)   violations.push('view uses useEffect — avoid side-effects in views');
  }
  if (role==='repo') {
    if (hasJSX)         violations.push('repo contains JSX — move UI to *.view.tsx');
  }
  if (role==='schema') {
    if (hasJSX)         violations.push('schema contains JSX — invalid');
  }
  if (role==='types' || role==='constants') {
    if (hasJSX)         violations.push(`${role} contains JSX — invalid`);
  }
  // Treat "other" as warning if mixed concerns
  if (role==='other') {
    if (hasJSX && hasIO) violations.push('mixed concerns in file: UI + IO — split into view/repo');
    if (hasZod && hasJSX) violations.push('UI + schema in same file — split to *.schema.ts');
    if (bigArray && hasJSX) violations.push('UI + large constants — move constants out');
  }

  return { ok: violations.length===0, violations };
}

const files = walk(root);
const report = [];
for (const f of files) {
  const info = analyze(f);
  if (info.parseError) {
    report.push({ file:f, role: roleOf(f), ok:false, errors:[`parse: ${info.parseError}`] });
    continue;
    }
  const res = passesSingleTask(info);
  report.push({ file:f, role:info.role, ok:res.ok, violations:res.violations });
}

const offenders = report.filter(r=>!r.ok);
console.log(JSON.stringify({ total: files.length, offenders }, null, 2));
process.exit(offenders.length ? 1 : 0);


