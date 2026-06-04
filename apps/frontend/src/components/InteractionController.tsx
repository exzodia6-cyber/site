import type { ActiveInteraction } from '../types/animation';
import { FeedingInteraction } from './FeedingInteraction';
import { PlayingInteraction } from './PlayingInteraction';
import { SleepingInteraction } from './SleepingInteraction';
import { WashingInteraction } from './WashingInteraction';

export function InteractionController({ interaction }: { interaction?: ActiveInteraction }) {
  if (!interaction) return null;
  if (interaction.type === 'feed') return <FeedingInteraction foodId={interaction.foodId} />;
  if (interaction.type === 'wash') return <WashingInteraction />;
  if (interaction.type === 'play') return <PlayingInteraction />;
  return <SleepingInteraction />;
}
