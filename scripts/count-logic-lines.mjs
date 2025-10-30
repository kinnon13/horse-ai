import fs from 'node:fs';
import path from 'node:path';

const IGNORES = [
  /\.types\.ts$/, /\.interfaces\.ts$/, /\.constants\.ts$/,
  /\.schema\.ts$/, /\.mapper\.ts$/, /\.view\.tsx$/
];

const isCode = (l) => {
  const t = l.trim();
  return t && !t.startsWith('//') && !t.startsWith('/*') && !t.startsWith('*') && !t.startsWith('* ');
};

function walk(dir, out=[]) {
  for (const e of fs.readdirSync(dir)) {
    const p = path.join(dir, e);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if ((/\.tsx?$/.test(p)) && !IGNORES.some(rx => rx.test(p))) out.push(p);
  }
  return out;
}

const root = process.argv[2] || 'src';
const files = walk(root);
const rows = files.map(f => {
  const code = fs.readFileSync(f, 'utf8');
  const lines = code.split('\n').filter(isCode).length;
  return { file: f, lines };
});
const offenders = rows.filter(r => r.lines > 50).sort((a,b)=>b.lines-a.lines);
console.log(JSON.stringify({ total: files.length, offenders }, null, 2));
process.exit(offenders.length ? 1 : 0);
