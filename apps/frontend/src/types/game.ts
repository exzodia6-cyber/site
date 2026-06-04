export type ItemType = 'food' | 'clothes' | 'accessory' | 'toy';
export type AttachPoint = 'head' | 'face' | 'body' | 'neck' | 'paw';

export interface PetStats {
  hunger: number;
  cleanliness: number;
  mood: number;
  energy: number;
}

export interface Pet extends PetStats {
  id: string;
  name: string;
  level: number;
  xp: number;
  coins: number;
  ownedItems: string[];
  selectedClothes: string[];
  completedTasks: string[];
  lastUpdatedAt: number;
  customImage?: string;
  customImageMode: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  type: ItemType;
  price: number;
  description: string;
  previewImage: string;
  modelPath: string;
  attachPoint?: AttachPoint;
  hungerEffect?: number;
  moodEffect?: number;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardXp: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}

export interface GameState {
  pet: Pet;
  tasks: DailyTask[];
  inventory: Record<string, number>;
  currentDay: string;
}

export interface RewardToast {
  id: string;
  text: string;
  kind: 'coins' | 'level' | 'care' | 'error';
}
