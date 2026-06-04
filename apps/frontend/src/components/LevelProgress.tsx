import { Progress, Title } from '@vkontakte/vkui';

export function LevelProgress({ level, xp }: { level: number; xp: number }) {
  return <div className="level-progress">
    <div><Title level="3">Уровень {level}</Title><span>{xp}/100 XP</span></div>
    <Progress value={xp} />
  </div>;
}
