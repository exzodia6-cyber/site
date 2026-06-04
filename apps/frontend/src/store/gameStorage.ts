import { createDailyTasks } from '../data/tasks';
import type { GameState, Pet } from '../types/game';
import { applyOfflineTime, todayKey } from '../utils/game';

const STORAGE_KEY = 'petlife-vk-game';

export const createStarterPet = (): Pet => ({
  id: 'starter-pet',
  name: 'Пушок',
  level: 1,
  xp: 0,
  coins: 100,
  hunger: 20,
  cleanliness: 80,
  mood: 80,
  energy: 80,
  ownedItems: [],
  selectedClothes: [],
  completedTasks: [],
  lastUpdatedAt: Date.now(),
  customImageMode: false
});

export const createInitialGame = (): GameState => ({
  pet: createStarterPet(),
  tasks: createDailyTasks(),
  inventory: {},
  currentDay: todayKey()
});

export function saveGame(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadGame(): GameState {
  const fallback = createInitialGame();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as GameState;
    const currentDay = todayKey();
    const dailyTasks = parsed.currentDay === currentDay ? parsed.tasks : createDailyTasks();
    return {
      ...fallback,
      ...parsed,
      currentDay,
      tasks: dailyTasks,
      pet: applyOfflineTime({ ...fallback.pet, ...parsed.pet })
    };
  } catch {
    return fallback;
  }
}

export function resetGame(): GameState {
  const state = createInitialGame();
  saveGame(state);
  return state;
}
