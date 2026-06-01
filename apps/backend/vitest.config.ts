import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', coverage: { reporter: ['text','json','html'], thresholds: { lines: 70, functions: 65, branches: 60, statements: 70 } } } });
