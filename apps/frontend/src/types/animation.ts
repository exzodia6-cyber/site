import type { PetStats } from './game';

export type InteractionType = 'feed' | 'wash' | 'play' | 'sleep';
export type SceneMode = 'home' | 'feeding' | 'washing' | 'playing' | 'sleeping';
export type PetAnimationState = 'idle' | 'happy' | 'hungry' | 'sleepy' | 'dirty' | 'playing' | 'washing' | 'eating' | 'sleeping';

export interface ActiveInteraction {
  id: string;
  type: InteractionType;
  startedAt: number;
  foodId?: string;
}

export interface QueuedInteraction {
  type: InteractionType;
  foodId?: string;
}

export function getSceneMode(interaction?: ActiveInteraction): SceneMode {
  if (!interaction) return 'home';
  if (interaction.type === 'feed') return 'feeding';
  if (interaction.type === 'wash') return 'washing';
  if (interaction.type === 'play') return 'playing';
  return 'sleeping';
}

export function getPetAnimationState(stats: PetStats, interaction?: ActiveInteraction): PetAnimationState {
  if (interaction?.type === 'feed') return 'eating';
  if (interaction?.type === 'wash') return 'washing';
  if (interaction?.type === 'play') return 'playing';
  if (interaction?.type === 'sleep') return 'sleeping';
  if (stats.energy <= 30) return 'sleepy';
  if (stats.cleanliness <= 35) return 'dirty';
  if (stats.hunger >= 70) return 'hungry';
  if (stats.mood >= 75) return 'happy';
  return 'idle';
}
