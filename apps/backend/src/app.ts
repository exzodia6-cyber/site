import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { admin, auth, signToken } from './auth.js';
import { results, sessions, subjects, tasks, topics, users } from './data.js';
import { buildProgress, subjectProgress } from './services/progress.js';
import { isAnswerCorrect, recommendation } from './services/checkAnswer.js';

export const app = express();
app.use(cors());
app.use(express.json());

const credentials = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().min(2).optional() });
const publicTask = (task: any) => ({ ...task, correctAnswer: undefined });
const userFromReq = (req: any) => users.find(u => u.id === req.user?.sub)!;

app.get('/health', (_req, res) => res.json({ ok: true, service: 'oge-ege-backend' }));
app.post('/auth/register', (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success || !parsed.data.name) return res.status(400).json({ message: 'Введите имя, email и пароль от 6 символов' });
  if (users.some(u => u.email === parsed.data.email)) return res.status(409).json({ message: 'Пользователь уже существует' });
  const user = { id: `user-${Date.now()}`, name: parsed.data.name, email: parsed.data.email, passwordHash: bcrypt.hashSync(parsed.data.password, 8), role: 'student' as const };
  users.push(user);
  res.status(201).json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
app.post('/auth/login', (req, res) => {
  const parsed = credentials.omit({ name: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Некорректные данные входа' });
  const user = users.find(u => u.email === parsed.data.email);
  if (!user || !bcrypt.compareSync(parsed.data.password, user.passwordHash)) return res.status(401).json({ message: 'Неверный email или пароль' });
  res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
app.get('/me', auth, (req, res) => { const user = userFromReq(req); res.json({ user: { id:user.id, name:user.name, email:user.email, role:user.role }, progress: buildProgress(user.id) }); });

app.get('/subjects', (_req, res) => res.json(subjects));
app.get('/subjects/:id', (req, res) => { const subject = subjects.find(s => s.id === req.params.id); if (!subject) return res.status(404).json({ message:'Предмет не найден' }); res.json(subject); });
app.get('/subjects/:id/topics', (req, res) => res.json(topics.filter(t => t.subjectId === req.params.id)));
app.get('/topics/:id/tasks', (req, res) => res.json(tasks.filter(t => t.topicId === req.params.id).map(publicTask)));
app.get('/tasks/:id', (req, res) => { const task = tasks.find(t => t.id === req.params.id); if (!task) return res.status(404).json({ message:'Задание не найдено' }); res.json(publicTask(task)); });
app.post('/tasks/:id/answer', auth, (req, res) => {
  const task = tasks.find(t => t.id === req.params.id); if (!task) return res.status(404).json({ message:'Задание не найдено' });
  const answer = String(req.body.answer ?? ''); const isCorrect = isAnswerCorrect(answer, task.correctAnswer);
  results.push({ id:`r-${Date.now()}`, userId:(req as any).user.sub, taskId: task.id, answer, isCorrect, createdAt: new Date().toISOString() });
  res.json({ isCorrect, correctAnswer: task.correctAnswer, explanation: task.explanation });
});

app.post('/tests/start', auth, (req, res) => {
  const subjectId = String(req.body.subjectId); const count = Number(req.body.count || 5);
  const topicIds = topics.filter(t => t.subjectId === subjectId).map(t => t.id);
  const selected = tasks.filter(t => topicIds.includes(t.topicId)).slice(0, count);
  const session = { id:`test-${Date.now()}`, userId:(req as any).user.sub, subjectId, status:'IN_PROGRESS', totalTasks:selected.length, score:0, createdAt:new Date().toISOString(), answers:selected.map(t=>({ taskId:t.id, answer:null, isCorrect:null })) };
  sessions.push(session); res.status(201).json({ ...session, tasks: selected.map(publicTask) });
});
app.post('/tests/:id/answer', auth, (req, res) => {
  const session = sessions.find(s => s.id === req.params.id && s.userId === (req as any).user.sub); if (!session) return res.status(404).json({ message:'Тест не найден' });
  const task = tasks.find(t => t.id === req.body.taskId); if (!task) return res.status(404).json({ message:'Задание не найдено' });
  const answerRow = session.answers.find((a:any)=>a.taskId===task.id); answerRow.answer = String(req.body.answer ?? ''); answerRow.isCorrect = isAnswerCorrect(answerRow.answer, task.correctAnswer);
  res.json({ isCorrect: answerRow.isCorrect });
});
app.post('/tests/:id/finish', auth, (req, res) => {
  const session = sessions.find(s => s.id === req.params.id && s.userId === (req as any).user.sub); if (!session) return res.status(404).json({ message:'Тест не найден' });
  session.status = 'FINISHED'; session.score = session.answers.filter((a:any)=>a.isCorrect).length; session.finishedAt = new Date().toISOString();
  const wrongTopics = session.answers.filter((a:any)=>a.isCorrect === false).map((a:any)=>topics.find(t=>t.id===tasks.find(task=>task.id===a.taskId)?.topicId)?.title).filter(Boolean);
  res.json({ score: session.score, percent: session.totalTasks ? Math.round(session.score/session.totalTasks*100) : 0, mistakes: session.answers.filter((a:any)=>a.isCorrect===false), weakTopics: [...new Set(wrongTopics)], recommendation: recommendation([...new Set(wrongTopics)] as string[]) });
});
app.get('/tests/history', auth, (req, res) => res.json(sessions.filter(s => s.userId === (req as any).user.sub)));
app.get('/progress', auth, (req, res) => res.json(buildProgress((req as any).user.sub)));
app.get('/progress/subjects/:id', auth, (req, res) => res.json(subjectProgress((req as any).user.sub, req.params.id)));

app.post('/admin/subjects', auth, admin, (req, res) => { const subject = { id:`subject-${Date.now()}`, title:req.body.title, examType:req.body.examType, description:req.body.description ?? '', topicCount:0, taskCount:0, progress:0 }; subjects.push(subject); res.status(201).json(subject); });
app.post('/admin/topics', auth, admin, (req, res) => { const topic = { id:`topic-${Date.now()}`, subjectId:req.body.subjectId, title:req.body.title, description:req.body.description ?? '' }; topics.push(topic); res.status(201).json(topic); });
app.post('/admin/tasks', auth, admin, (req, res) => { const task = { id:`task-${Date.now()}`, topicId:req.body.topicId, question:req.body.question, type:req.body.type ?? 'TEXT', options:req.body.options ?? [], correctAnswer:req.body.correctAnswer, explanation:req.body.explanation ?? '', difficulty:Number(req.body.difficulty ?? 1) }; tasks.push(task); res.status(201).json(task); });
app.put('/admin/tasks/:id', auth, admin, (req, res) => { const task = tasks.find(t=>t.id===req.params.id); if (!task) return res.status(404).json({message:'Задание не найдено'}); Object.assign(task, req.body); res.json(task); });
app.get('/admin/users', auth, admin, (_req, res) => res.json(users.map(({passwordHash, ...u})=>u)));
app.get('/admin/stats', auth, admin, (_req, res) => res.json({ users: users.length, subjects: subjects.length, topics: topics.length, tasks: tasks.length, answers: results.length }));
