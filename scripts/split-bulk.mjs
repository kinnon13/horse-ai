import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const viol = JSON.parse(fs.readFileSync('violations.json', 'utf8'));
for (const { f } of viol) {
  const r = spawnSync('node', ['scripts/split-file.js', f], { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`[SKIP] ${f} (split failed)`);
  }
}





