import { Button, Header, Title } from '@vkontakte/vkui';
import { DailyTaskList } from '../components/DailyTaskList';
import type { DailyTask } from '../types/game';

export function TasksScreen({ tasks, onClaim, onBack }: { tasks: DailyTask[]; onClaim: (taskId: string) => void; onBack: () => void }) {
  return <div className="screen"><Button mode="tertiary" onClick={onBack}>← К питомцу</Button><Header>Ежедневные задания</Header><Title level="1">Заработайте монеты и опыт</Title><DailyTaskList tasks={tasks} onClaim={onClaim} /></div>;
}
