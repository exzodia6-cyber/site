import { spawnSync } from 'node:child_process';

const command = process.argv.includes('--preview') ? 'preview' : '--host';
const args = command === 'preview' ? ['vite', 'preview', '--host', '0.0.0.0'] : ['vite', '--host', '0.0.0.0'];
const result = spawnSync('npx', args, {
  cwd: new URL('../apps/frontend', import.meta.url),
  stdio: 'inherit',
  shell: process.platform === 'win32'
});
process.exit(result.status ?? 1);
