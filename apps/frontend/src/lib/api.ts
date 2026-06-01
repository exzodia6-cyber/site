import { subjects, tasks, topics } from './mockData';
import { defaultProgress, loadProgress } from './storage';
const API = import.meta.env.VITE_API_URL ?? '/api';
export type User = { id:string; name:string; email:string; role:string };
export async function apiFetch<T>(path:string, init?:RequestInit): Promise<T> { const token = localStorage.getItem('oge-token'); const res = await fetch(`${API}${path}`, { ...init, headers:{ 'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}) , ...(init?.headers||{}) } }); if (!res.ok) throw new Error(await res.text()); return res.json(); }
export async function login(email:string, password:string) { try { const data = await apiFetch<{token:string;user:User}>('/auth/login',{method:'POST',body:JSON.stringify({email,password})}); localStorage.setItem('oge-token', data.token); localStorage.setItem('oge-user', JSON.stringify(data.user)); return { ...data, demo:false }; } catch { const user = { id:'demo-user', name:'Демо Ученик', email: email || 'demo@example.ru', role:'student' }; localStorage.setItem('oge-user', JSON.stringify(user)); localStorage.setItem('oge-demo','true'); return { token:'demo', user, demo:true }; } }
export async function register(name:string,email:string,password:string) { try { const data = await apiFetch<{token:string;user:User}>('/auth/register',{method:'POST',body:JSON.stringify({name,email,password})}); localStorage.setItem('oge-token', data.token); localStorage.setItem('oge-user', JSON.stringify(data.user)); return data; } catch { return login(email,password); } }
export function currentUser(): User | null { try { return JSON.parse(localStorage.getItem('oge-user') || 'null'); } catch { return null; } }
export function logout() { localStorage.removeItem('oge-user'); localStorage.removeItem('oge-token'); localStorage.removeItem('oge-demo'); }
export async function getSubjects() { try { return await apiFetch<typeof subjects>('/subjects'); } catch { return subjects; } }
export async function getTopics(subjectId:string) { try { return await apiFetch<typeof topics>(`/subjects/${subjectId}/topics`); } catch { return topics.filter(t=>t.subjectId===subjectId); } }
export async function getTasks(topicId:string) { try { return await apiFetch<typeof tasks>(`/topics/${topicId}/tasks`); } catch { return tasks.filter(t=>t.topicId===topicId); } }
export async function getProgress() { try { return await apiFetch<typeof defaultProgress>('/progress'); } catch { return loadProgress(); } }
