import { ActionPanel } from './ActionPanel';

interface Props {
  disabled?: boolean;
  onFeed: () => void;
  onWash: () => void;
  onPlay: () => void;
  onSleep: () => void;
  onTasks: () => void;
  onShop: () => void;
  onWardrobe: () => void;
}

export function PetActions(props: Props) {
  return <ActionPanel {...props} />;
}
