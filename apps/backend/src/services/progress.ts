import { results, sessions, subjects, tasks, topics } from '../data.js';

export function buildProgress(userId: string) {
  const userResults = results.filter(r => r.userId === userId);
  const solvedTasks = userResults.length;
  const correctAnswers = userResults.filter(r => r.isCorrect).length;
  const weakTopicCounts = new Map<string, number>();
  for (const result of userResults.filter(r => !r.isCorrect)) {
    const task = tasks.find(t => t.id === result.taskId);
    const topic = task ? topics.find(t => t.id === task.topicId) : undefined;
    if (topic) weakTopicCounts.set(topic.title, (weakTopicCounts.get(topic.title) ?? 0) + 1);
  }
  const weakTopics = [...weakTopicCounts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([title])=>title);
  const progressPercent = tasks.length === 0 ? 0 : Math.round((correctAnswers / tasks.length) * 100);
  return {
    solvedTasks,
    correctAnswers,
    mistakes: solvedTasks - correctAnswers,
    progressPercent,
    weakTopics: weakTopics.length ? weakTopics : ['Уравнения', 'Пунктуация'],
    latestTests: sessions.filter(s => s.userId === userId).slice(-5).reverse()
  };
}

export function subjectProgress(userId: string, subjectId: string) {
  const topicIds = topics.filter(t => t.subjectId === subjectId).map(t => t.id);
  const subjectTasks = tasks.filter(t => topicIds.includes(t.topicId));
  const userResults = results.filter(r => r.userId === userId && subjectTasks.some(t => t.id === r.taskId));
  const correct = userResults.filter(r => r.isCorrect).length;
  return { subject: subjects.find(s => s.id === subjectId), solvedTasks: userResults.length, correctAnswers: correct, progressPercent: subjectTasks.length ? Math.round(correct / subjectTasks.length * 100) : 0 };
}
