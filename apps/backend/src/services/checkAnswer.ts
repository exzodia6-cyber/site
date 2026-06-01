export function normalizeAnswer(answer: string) {
  return answer.trim().toLowerCase().replace(/ё/g, 'е');
}
export function isAnswerCorrect(answer: string, correctAnswer: string) {
  return normalizeAnswer(answer) === normalizeAnswer(correctAnswer);
}
export function recommendation(weakTopics: string[]) {
  if (weakTopics.length === 0) return 'Отличный результат. Закрепите материал тренировочным тестом на 20 заданий.';
  return `Повторите темы: ${weakTopics.join(', ')}. Начните с разбора ошибок и решите по 5 заданий на каждую тему.`;
}
