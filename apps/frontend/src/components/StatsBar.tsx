import { StatusBars } from './StatusBars';

export function StatsBar({ stats }: { stats: Record<'hunger' | 'cleanliness' | 'mood' | 'energy', number> }) {
  return <StatusBars stats={stats} />;
}
