import { useCallback, useEffect, useMemo, useState } from 'react';
import { getItem, wearableTypes } from '../data/items';
import { loadGame, resetGame as resetPersistedGame, saveGame } from '../store/gameStorage';
import type { GameState, RewardToast } from '../types/game';
import { addXpAndLevel, clampStat, incrementTask } from '../utils/game';

const toast = (text: string, kind: RewardToast['kind']): RewardToast => ({ id: crypto.randomUUID(), text, kind });

export function useGameStore() {
  const [state, setState] = useState<GameState>(() => loadGame());
  const [toasts, setToasts] = useState<RewardToast[]>([]);
  const [lastAnimation, setLastAnimation] = useState<'feed' | 'wash' | 'play' | 'sleep' | undefined>();

  useEffect(() => saveGame(state), [state]);
  useEffect(() => {
    if (toasts.length === 0) return;
    const timeout = window.setTimeout(() => setToasts((items) => items.slice(1)), 2800);
    return () => window.clearTimeout(timeout);
  }, [toasts]);

  const notify = useCallback((text: string, kind: RewardToast['kind'] = 'care') => {
    setToasts((items) => [...items, toast(text, kind)]);
  }, []);

  const mutate = useCallback((updater: (state: GameState) => GameState, animation?: typeof lastAnimation) => {
    setState((current) => updater(current));
    if (animation) {
      setLastAnimation(animation);
      window.setTimeout(() => setLastAnimation(undefined), 1200);
    }
  }, []);

  const feedPet = useCallback((foodId: string) => {
    const item = getItem(foodId);
    if (!item || item.type !== 'food') return notify('Такую еду найти не удалось', 'error');
    mutate((current) => ({
      ...current,
      pet: { ...current.pet, hunger: clampStat(current.pet.hunger + (item.hungerEffect ?? 0)) },
      tasks: incrementTask(current.tasks, 'feed-once')
    }), 'feed');
    notify(`${item.name}: голод уменьшен`, 'care');
  }, [mutate, notify]);

  const washPet = useCallback(() => {
    mutate((current) => ({ ...current, pet: { ...current.pet, cleanliness: clampStat(current.pet.cleanliness + 25) }, tasks: incrementTask(current.tasks, 'wash-once') }), 'wash');
    notify('Питомец сияет чистотой!', 'care');
  }, [mutate, notify]);

  const playWithPet = useCallback(() => {
    mutate((current) => ({ ...current, pet: { ...current.pet, mood: clampStat(current.pet.mood + 18), energy: clampStat(current.pet.energy - 12) }, tasks: incrementTask(current.tasks, 'play-once') }), 'play');
    notify('Весёлая игра подняла настроение', 'care');
  }, [mutate, notify]);

  const sleepPet = useCallback(() => {
    mutate((current) => ({ ...current, pet: { ...current.pet, energy: clampStat(current.pet.energy + 35), mood: clampStat(current.pet.mood + 4) }, tasks: incrementTask(current.tasks, 'sleep-once') }), 'sleep');
    notify('Питомец хорошо отдохнул', 'care');
  }, [mutate, notify]);

  const buyItem = useCallback((itemId: string) => {
    const item = getItem(itemId);
    if (!item) return notify('Предмет не найден', 'error');
    mutate((current) => {
      if (current.pet.coins < item.price) {
        notify('Недостаточно монет', 'error');
        return current;
      }
      if (wearableTypes.has(item.type) && current.pet.ownedItems.includes(item.id)) {
        notify('Этот предмет уже куплен', 'error');
        return current;
      }
      const inventory = { ...current.inventory, [item.id]: (current.inventory[item.id] ?? 0) + 1 };
      const ownedItems = wearableTypes.has(item.type) ? [...current.pet.ownedItems, item.id] : current.pet.ownedItems;
      return { ...current, inventory, pet: { ...current.pet, coins: current.pet.coins - item.price, ownedItems } };
    });
    notify(`Покупка: ${item.name}`, 'coins');
  }, [mutate, notify]);

  const equipItem = useCallback((itemId: string) => {
    const item = getItem(itemId);
    if (!item || !wearableTypes.has(item.type)) return notify('Этот предмет нельзя надеть', 'error');
    mutate((current) => {
      if (!current.pet.ownedItems.includes(itemId)) return current;
      const selectedClothes = current.pet.selectedClothes.filter((selectedId) => {
        const selected = getItem(selectedId);
        return selected?.attachPoint !== item.attachPoint && selected?.type !== item.type;
      });
      return { ...current, pet: { ...current.pet, selectedClothes: [...selectedClothes, itemId] } };
    });
    notify(`${item.name} надет`, 'care');
  }, [mutate, notify]);

  const unequipItem = useCallback((itemId: string) => {
    mutate((current) => ({ ...current, pet: { ...current.pet, selectedClothes: current.pet.selectedClothes.filter((id) => id !== itemId) } }));
    notify('Предмет снят', 'care');
  }, [mutate, notify]);

  const completeTask = useCallback((taskId: string) => {
    mutate((current) => ({ ...current, tasks: incrementTask(current.tasks, taskId) }));
  }, [mutate]);

  const claimTaskReward = useCallback((taskId: string) => {
    mutate((current) => {
      const task = current.tasks.find((item) => item.id === taskId);
      if (!task || !task.completed || task.claimed) return current;
      const leveled = addXpAndLevel({ ...current.pet, coins: current.pet.coins + task.rewardCoins }, task.rewardXp);
      if (leveled.levelsGained > 0) notify(`Новый уровень: ${leveled.pet.level}! +${leveled.levelsGained * 50} монет`, 'level');
      notify(`Награда: +${task.rewardCoins} монет, +${task.rewardXp} XP`, 'coins');
      return {
        ...current,
        tasks: current.tasks.map((item) => item.id === taskId ? { ...item, claimed: true } : item),
        pet: { ...leveled.pet, completedTasks: [...new Set([...current.pet.completedTasks, taskId])] }
      };
    });
  }, [mutate, notify]);

  const setCustomImage = useCallback((image: string) => {
    mutate((current) => ({ ...current, pet: { ...current.pet, customImage: image, customImageMode: true } }));
    notify('Новый образ питомца сохранён локально', 'care');
  }, [mutate, notify]);

  const setCustomImageMode = useCallback((enabled: boolean) => {
    mutate((current) => ({ ...current, pet: { ...current.pet, customImageMode: enabled && Boolean(current.pet.customImage) } }));
  }, [mutate]);

  const resetGame = useCallback(() => {
    const fresh = resetPersistedGame();
    setState(fresh);
    notify('Игра начата заново', 'care');
  }, [notify]);

  return useMemo(() => ({ state, toasts, lastAnimation, feedPet, washPet, playWithPet, sleepPet, buyItem, equipItem, unequipItem, completeTask, claimTaskReward, setCustomImage, setCustomImageMode, resetGame }), [state, toasts, lastAnimation, feedPet, washPet, playWithPet, sleepPet, buyItem, equipItem, unequipItem, completeTask, claimTaskReward, setCustomImage, setCustomImageMode, resetGame]);
}
