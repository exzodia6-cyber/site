export type Subject = { id:string; title:string; examType:'ОГЭ'|'ЕГЭ'; description:string; topicCount:number; taskCount:number; progress:number };
export type Topic = { id:string; subjectId:string; title:string; description:string };
export type Task = { id:string; topicId:string; question:string; type:'MULTIPLE_CHOICE'|'TEXT'; options:{label:string;text:string}[]; correctAnswer?:string; explanation:string; difficulty:number };
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
'eng-ege':['Grammar','Vocabulary','Reading','Writing']};
export const topics: Topic[] = Object.entries(topicMap).flatMap(([subjectId,names]) => names.map((title,i)=>({ id:`${subjectId}-t${i+1}`, subjectId, title, description:`Короткая теория, практика и разбор ошибок по теме «${title}».` })));
export const subjects: Subject[] = [
['rus-oge','Русский язык ОГЭ','ОГЭ','Орфография, пунктуация, изложение и сочинение.'],['math-oge','Математика ОГЭ','ОГЭ','Алгебра, геометрия, вероятность и практические задачи.'],['soc-oge','Обществознание ОГЭ','ОГЭ','Человек, общество, право, экономика и политика.'],['eng-oge','Английский язык ОГЭ','ОГЭ','Лексика, грамматика, чтение и письмо.'],['rus-ege','Русский язык ЕГЭ','ЕГЭ','Сочинение и тестовая часть ЕГЭ.'],['math-ege','Математика ЕГЭ','ЕГЭ','Профильная математика: анализ, алгебра, геометрия.'],['soc-ege','Обществознание ЕГЭ','ЕГЭ','ЕГЭ по обществознанию с акцентом на аргументацию.'],['hist-ege','История ЕГЭ','ЕГЭ','Даты, карты, личности и причинно-следственные связи.'],['info-ege','Информатика ЕГЭ','ЕГЭ','Алгоритмы, Python, логика и базы данных.'],['eng-ege','Английский язык ЕГЭ','ЕГЭ','Чтение, грамматика, письмо и говорение.']].map(([id,title,examType,description],i)=>({id,title,examType:examType as 'ОГЭ'|'ЕГЭ',description,topicCount:topics.filter(t=>t.subjectId===id).length,taskCount:topics.filter(t=>t.subjectId===id).length*3,progress:i<3?32+i*7:12+i*3}));
export const tasks: Task[] = topics.flatMap((topic, i)=>Array.from({length:3},(_,j)=>({ id:`task-${i*3+j+1}`, topicId:topic.id, question:`Тренировочное задание по теме «${topic.title}»: выберите наиболее точный ответ.`, type:j===2?'TEXT':'MULTIPLE_CHOICE', options:j===2?[]:[{label:'A',text:'Типичная ошибка'},{label:'B',text:'Верный ответ'},{label:'C',text:'Слишком общий ответ'}], correctAnswer:j===2?'42':'B', explanation:`Ответ опирается на ключевое правило темы «${topic.title}». Сначала определите условие, затем исключите неверные варианты.`, difficulty:(j%3)+1 })));
