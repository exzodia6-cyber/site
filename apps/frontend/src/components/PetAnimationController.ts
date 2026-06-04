import type { PetStats } from '../types/game';
import type { ActiveInteraction, PetAnimationState, SceneMode } from '../types/animation';
import { getPetAnimationState, getSceneMode } from '../types/animation';

export interface PetAnimationSnapshot {
  petAnimationState: PetAnimationState;
  sceneMode: SceneMode;
  currentInteraction?: ActiveInteraction;
  interactionQueue: ActiveInteraction[];
  isBusy: boolean;
}

export function createPetAnimationSnapshot(stats: PetStats, currentInteraction?: ActiveInteraction): PetAnimationSnapshot {
  return {
    petAnimationState: getPetAnimationState(stats, currentInteraction),
    sceneMode: getSceneMode(currentInteraction),
    currentInteraction,
    interactionQueue: currentInteraction ? [currentInteraction] : [],
    isBusy: Boolean(currentInteraction)
  };
}
