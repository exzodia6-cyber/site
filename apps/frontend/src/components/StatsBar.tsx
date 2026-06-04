import { Progress } from '@vkontakte/vkui';
import type { CSSProperties } from 'react';

const labels: Record<string, string> = { hunger: 'Голод', cleanliness: 'Чистота', mood: 'Настроение', energy: 'Энергия' };
const colors: Record<string, string> = { hunger: '#ff8a65', cleanliness: '#4fc3f7', mood: '#ba68c8', energy: '#81c784' };

export function StatsBar({ stats }: { stats: Record<'hunger' | 'cleanliness' | 'mood' | 'energy', number> }) {
  return <div className="stats-grid">
    {Object.entries(stats).map(([key, value]) => <div className="stat-card" key={key}>
      <span>{labels[key]}</span><b>{value}%</b><Progress value={value} style={{ '--vkui--color_accent_blue': colors[key] } as CSSProperties} />
    </div>)}
  </div>;
}
