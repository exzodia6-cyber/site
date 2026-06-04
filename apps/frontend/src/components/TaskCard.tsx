import { Button, Card, Progress, Text, Title } from '@vkontakte/vkui';
import type { DailyTask } from '../types/game';

export function TaskCard({ task, onClaim }: { task: DailyTask; onClaim: (taskId: string) => void }) {
  return <Card className="game-card task-card">
    <Title level="3">{task.title}</Title>
    <Text>{task.description}</Text>
    <Progress value={(task.progress / task.target) * 100} />
    <div className="task-card__footer">
      <span>{task.progress}/{task.target}</span>
      <b>+{task.rewardCoins} 🪙 · +{task.rewardXp} XP</b>
      <Button disabled={!task.completed || task.claimed} onClick={() => onClaim(task.id)}>{task.claimed ? 'Получено' : 'Получить'}</Button>
    </div>
  </Card>;
}
