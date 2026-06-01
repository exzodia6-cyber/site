import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = resolve(root,'apps/frontend/dist/index.html');
if (!existsSync(indexPath)) await import('./build-frontend.mjs');
const html = () => readFileSync(indexPath);
createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(html())}).listen(5173,()=>console.log('Frontend: http://localhost:5173'));
