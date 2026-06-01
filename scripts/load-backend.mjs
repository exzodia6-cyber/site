import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (!existsSync(resolve(root,'apps/backend/dist/server.js'))) await import('./build-backend.mjs');
const port = 5200 + Math.floor(Math.random()*1000); const child = spawn(process.execPath, [resolve(root,'apps/backend/dist/server.js')], { env:{...process.env, PORT:String(port)}, stdio:'ignore' });
await new Promise(r=>setTimeout(r,500)); const started=Date.now();
try { await Promise.all(Array.from({length:50},()=>fetch('http://localhost:'+port+'/subjects').then(r=>{if(!r.ok) throw new Error(String(r.status)); return r.text()}))); const ms=Date.now()-started; console.log(`Load smoke: 50 GET /subjects requests in ${ms}ms`); if(ms>5000) throw new Error('Load smoke exceeded 5s'); } finally { child.kill(); }
