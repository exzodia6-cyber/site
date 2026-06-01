import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins:[react()], server:{ port:5173, proxy:{ '/api':'http://backend:4000' } }, test:{ environment:'jsdom', setupFiles:'./src/test/setup.ts', coverage:{ reporter:['text','json','html'], thresholds:{ lines:70, functions:65, branches:60, statements:70 } } } });
