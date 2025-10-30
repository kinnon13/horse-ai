import fs from 'node:fs';
import path from 'node:path';

const IGNORES = [/\.types\.ts$/, /\.interfaces\.ts$/, /\.constants\.ts$/, /\.schema\.ts$/, /\.mapper\.ts$/, /\.view\.tsx$/];
const isCode = l => {
  const t = l.trim();
  return t && !t.startsWith('//') && !t.startsWith('/*') && !t.startsWith('*');
};

function walk(dir, acc = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if ((/\.tsx?$/.test(p)) && !IGNORES.some(rx => rx.test(p))) acc.push(p);
  }
  return acc;
}

const root = process.argv[2] || 'src';
const files = walk(root);
const bad = [];
for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  const lines = code.split('\n').filter(isCode).length;
  if (lines > 50) bad.push({ f, lines });
}
bad.sort((a, b) => b.lines - a.lines);
console.log(JSON.stringify(bad, null, 2));
process.exit(bad.length ? 1 : 0);




