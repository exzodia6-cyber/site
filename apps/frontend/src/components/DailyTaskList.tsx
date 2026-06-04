import type { DailyTask } from '../types/game';
import { TaskCard } from './TaskCard';

export function DailyTaskList({ tasks, onClaim }: { tasks: DailyTask[]; onClaim: (taskId: string) => void }) {
  return <div className="list-stack">{tasks.map((task) => <TaskCard key={task.id} task={task} onClaim={onClaim} />)}</div>;
}
