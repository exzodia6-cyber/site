import request from 'supertest';
import { app } from '../src/app.js';
const started = Date.now();
const calls = Array.from({ length: 50 }, () => request(app).get('/subjects').expect(200));
await Promise.all(calls);
const ms = Date.now() - started;
console.log(`Load smoke: 50 GET /subjects requests in ${ms}ms`);
if (ms > 5000) throw new Error('Load smoke exceeded 5s budget');
