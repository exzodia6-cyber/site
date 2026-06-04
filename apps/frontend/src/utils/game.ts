import type { DailyTask, Pet } from '../types/game';

export const clampStat = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
export const todayKey = () => new Date().toISOString().slice(0, 10);

export const applyOfflineTime = (pet: Pet, now = Date.now()): Pet => {
  const hours = Math.max(0, Math.floor((now - pet.lastUpdatedAt) / 3_600_000));
  if (hours === 0) return { ...pet, lastUpdatedAt: now };
  return {
    ...pet,
    hunger: clampStat(pet.hunger + hours * 5),
    cleanliness: clampStat(pet.cleanliness - hours * 3),
    mood: clampStat(pet.mood - hours * 2),
    energy: clampStat(pet.energy - hours * 2),
    lastUpdatedAt: now
  };
};

export const addXpAndLevel = (pet: Pet, xpToAdd: number) => {
  let xp = pet.xp + xpToAdd;
  let level = pet.level;
  let coins = pet.coins;
  let levelsGained = 0;
  while (xp >= 100) {
    xp -= 100;
    level += 1;
    coins += 50;
    levelsGained += 1;
  }
  return { pet: { ...pet, xp, level, coins }, levelsGained };
};

export const incrementTask = (tasks: DailyTask[], taskId: string) => tasks.map((task) => {
  if (task.id !== taskId || task.claimed) return task;
  const progress = Math.min(task.target, task.progress + 1);
  return { ...task, progress, completed: progress >= task.target };
});
