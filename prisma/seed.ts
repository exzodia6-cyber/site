import { PrismaClient, ExamType, TaskType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { subjects, tasks, topics } from '../apps/backend/src/data.js';
const prisma = new PrismaClient();
async function main() {
  await prisma.testAnswer.deleteMany(); await prisma.testSession.deleteMany(); await prisma.userTaskResult.deleteMany(); await prisma.userProgress.deleteMany(); await prisma.answerOption.deleteMany(); await prisma.task.deleteMany(); await prisma.topic.deleteMany(); await prisma.subject.deleteMany(); await prisma.user.deleteMany();
  await prisma.user.createMany({ data: [
    { id:'demo-user', name:'Демо Ученик', email:'demo@example.ru', passwordHash:bcrypt.hashSync('demo1234', 8), role:'student' },
    { id:'admin-user', name:'Администратор', email:'admin@example.ru', passwordHash:bcrypt.hashSync('admin1234', 8), role:'admin' }
  ]});
  for (const subject of subjects.slice(0, 10)) await prisma.subject.create({ data: { id: subject.id, title: subject.title, examType: subject.examType === 'ОГЭ' ? ExamType.OGE : ExamType.EGE, description: subject.description } });
  for (const topic of topics) await prisma.topic.create({ data: topic });
  for (const task of tasks) await prisma.task.create({ data: { id: task.id, topicId: task.topicId, question: task.question, type: task.type as TaskType, correctAnswer: task.correctAnswer, explanation: task.explanation, difficulty: task.difficulty, answerOptions: { create: task.options } } });
  for (const subject of subjects.slice(0, 6)) await prisma.userProgress.create({ data: { userId:'demo-user', subjectId:subject.id, solvedTasks: 8, correctAnswers: 5, weakTopics: ['Пунктуация','Уравнения'], progressPercent: subject.progress } });
}
main().finally(() => prisma.$disconnect());
