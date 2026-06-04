import { Progress } from '@vkontakte/vkui';
import type { CSSProperties } from 'react';

const meta = {
  hunger: { label: 'Голод', icon: '🍽️', color: '#fb923c', hint: 'чем меньше, тем сытнее' },
  cleanliness: { label: 'Чистота', icon: '🫧', color: '#38bdf8', hint: 'блеск шерстки' },
  mood: { label: 'Настроение', icon: '💖', color: '#d946ef', hint: 'радость питомца' },
  energy: { label: 'Энергия', icon: '⚡', color: '#22c55e', hint: 'силы на игры' }
};

type StatKey = keyof typeof meta;

export function StatusBars({ stats }: { stats: Record<StatKey, number> }) {
  return <div className="stats-grid status-bars">
    {(Object.entries(stats) as [StatKey, number][]).map(([key, value]) => <div className={`stat-card stat-card--${key}`} key={key}>
      <div className="stat-card__head"><span className="stat-card__icon">{meta[key].icon}</span><span>{meta[key].label}</span><b>{value}%</b></div>
      <Progress value={value} style={{ '--vkui--color_accent_blue': meta[key].color } as CSSProperties} />
      <small>{meta[key].hint}</small>
    </div>)}
  </div>;
}
