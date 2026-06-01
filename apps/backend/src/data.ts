import bcrypt from 'bcryptjs';

export type Subject = { id: string; title: string; examType: 'ОГЭ'|'ЕГЭ'; description: string; topicCount: number; taskCount: number; progress: number };
export type Topic = { id: string; subjectId: string; title: string; description: string };
export type Task = { id: string; topicId: string; question: string; type: 'MULTIPLE_CHOICE'|'TEXT'; options: { label: string; text: string }[]; correctAnswer: string; explanation: string; difficulty: number };
export type User = { id: string; name: string; email: string; passwordHash: string; role: 'student'|'admin' };

const subjectSeed = [
  ['rus-oge','Русский язык ОГЭ','ОГЭ','Орфография, пунктуация, изложение и сочинение.'],
  ['math-oge','Математика ОГЭ','ОГЭ','Алгебра, геометрия, вероятность и практические задачи.'],
  ['soc-oge','Обществознание ОГЭ','ОГЭ','Человек, общество, право, экономика и политика.'],
  ['eng-oge','Английский язык ОГЭ','ОГЭ','Лексика, грамматика, чтение и письмо.'],
  ['rus-ege','Русский язык ЕГЭ','ЕГЭ','Задания тестовой части и сочинение по проблеме текста.'],
  ['math-ege','Математика ЕГЭ','ЕГЭ','Профильные задания по алгебре, геометрии и анализу.'],
  ['soc-ege','Обществознание ЕГЭ','ЕГЭ','Расширенная подготовка к заданиям ЕГЭ.'],
  ['hist-ege','История ЕГЭ','ЕГЭ','Даты, личности, карты и историческое сочинение.'],
  ['info-ege','Информатика ЕГЭ','ЕГЭ','Алгоритмы, программирование, логика и таблицы.'],
  ['eng-ege','Английский язык ЕГЭ','ЕГЭ','Аудирование, чтение, грамматика, письмо и говорение.']
] as const;
const topicMap: Record<string,string[]> = {
  'math-oge':['Числа и вычисления','Алгебраические выражения','Уравнения','Неравенства','Функции','Геометрия','Вероятность и статистика','Текстовые задачи'],
  'rus-oge':['Орфография','Пунктуация','Синтаксис','Изложение','Сочинение','Анализ текста'],
  'soc-oge':['Человек и общество','Экономика','Социальные отношения','Политика','Право'],
  'eng-oge':['Лексика','Грамматика','Чтение','Письмо'],
  'rus-ege':['Паронимы','Нормы ударения','Синтаксис','Пунктуация','Сочинение'],
  'math-ege':['Производная','Планиметрия','Стереометрия','Вероятность'],
  'soc-ege':['Экономика','Право','Политика','Социология'],
  'hist-ege':['Древняя Русь','Российская империя','XX век'],
  'info-ege':['Логика','Алгоритмы','Python','Базы данных'],
  'eng-ege':['Grammar','Vocabulary','Reading','Writing']
};
export const topics: Topic[] = Object.entries(topicMap).flatMap(([sid,names]) => names.map((title,i) => ({ id: `${sid}-t${i+1}`, subjectId: sid, title, description: `Тренировка темы «${title}»: теория, задания и разбор ошибок.` })));
export const tasks: Task[] = topics.flatMap((topic, i) => Array.from({length: 3}, (_, j) => {
  const n = i * 3 + j + 1;
  return { id: `task-${n}`, topicId: topic.id, question: `Демонстрационное задание ${n} по теме «${topic.title}». Выберите верное утверждение или ответ.`, type: j === 2 ? 'TEXT' : 'MULTIPLE_CHOICE', options: j === 2 ? [] : [{label:'A',text:'Вариант с типичной ошибкой'},{label:'B',text:'Верный ответ'},{label:'C',text:'Неполный ответ'}], correctAnswer: j === 2 ? '42' : 'B', explanation: `Правильный ответ связан с базовым правилом темы «${topic.title}». Проверьте определение и исключите варианты с распространёнными ошибками.`, difficulty: (j % 3) + 1 };
}));
export const subjects: Subject[] = subjectSeed.map(([id,title,examType,description]) => ({ id, title, examType, description, topicCount: topics.filter(t=>t.subjectId===id).length, taskCount: tasks.filter(task=>topics.find(t=>t.id===task.topicId)?.subjectId===id).length, progress: id.includes('oge') ? 35 : 18 }));
export const users: User[] = [
  { id:'demo-user', name:'Демо Ученик', email:'demo@example.ru', passwordHash: bcrypt.hashSync('demo1234', 8), role:'student' },
  { id:'admin-user', name:'Администратор', email:'admin@example.ru', passwordHash: bcrypt.hashSync('admin1234', 8), role:'admin' }
];
export const results: any[] = [];
export const sessions: any[] = [];
