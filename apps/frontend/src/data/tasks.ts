import type { DailyTask } from '../types/game';

export const createDailyTasks = (): DailyTask[] => [
  { id: 'feed-once', title: 'Покормить питомца 1 раз', description: 'Любая еда засчитывается.', rewardCoins: 10, rewardXp: 5, progress: 0, target: 1, completed: false, claimed: false },
  { id: 'wash-once', title: 'Помыть питомца 1 раз', description: 'Верните чистоту и свежесть.', rewardCoins: 10, rewardXp: 5, progress: 0, target: 1, completed: false, claimed: false },
  { id: 'play-once', title: 'Поиграть с питомцем 1 раз', description: 'Поднимите настроение питомцу.', rewardCoins: 15, rewardXp: 10, progress: 0, target: 1, completed: false, claimed: false },
  { id: 'sleep-once', title: 'Уложить питомца спать', description: 'Восстановите энергию.', rewardCoins: 10, rewardXp: 5, progress: 0, target: 1, completed: false, claimed: false },
  { id: 'login-today', title: 'Зайти в игру сегодня', description: 'Откройте PetLife VK сегодня.', rewardCoins: 20, rewardXp: 10, progress: 1, target: 1, completed: true, claimed: false }
];
