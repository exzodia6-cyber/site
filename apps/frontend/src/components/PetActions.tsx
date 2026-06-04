import { Button, ButtonGroup } from '@vkontakte/vkui';

interface Props {
  onFeed: () => void;
  onWash: () => void;
  onPlay: () => void;
  onSleep: () => void;
  onTasks: () => void;
  onShop: () => void;
  onWardrobe: () => void;
}

export function PetActions({ onFeed, onWash, onPlay, onSleep, onTasks, onShop, onWardrobe }: Props) {
  return <ButtonGroup mode="vertical" stretched className="actions-grid">
    <Button size="l" onClick={onFeed}>🍎 Покормить</Button>
    <Button size="l" appearance="positive" onClick={onWash}>🫧 Помыть</Button>
    <Button size="l" appearance="accent" onClick={onPlay}>🎾 Поиграть</Button>
    <Button size="l" appearance="neutral" onClick={onSleep}>🌙 Уложить спать</Button>
    <Button size="l" mode="secondary" onClick={onTasks}>📋 Задания</Button>
    <Button size="l" mode="secondary" onClick={onShop}>🛍 Магазин</Button>
    <Button size="l" mode="secondary" onClick={onWardrobe}>🧥 Гардероб</Button>
  </ButtonGroup>;
}
