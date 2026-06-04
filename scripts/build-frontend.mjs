import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['vite', 'build'], {
  cwd: new URL('../apps/frontend', import.meta.url),
  stdio: 'inherit',
  shell: process.platform === 'win32'
});
process.exit(result.status ?? 1);
