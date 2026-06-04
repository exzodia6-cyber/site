import { Button, ButtonGroup } from '@vkontakte/vkui';

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

export function ActionPanel({ disabled, onFeed, onWash, onPlay, onSleep, onTasks, onShop, onWardrobe }: Props) {
  return <section className="action-panel" aria-label="Действия питомца">
    <div className="action-panel__title">Что делаем?</div>
    <ButtonGroup mode="vertical" stretched className="actions-grid">
      <Button size="l" className="action-button action-button--feed" disabled={disabled} onClick={onFeed}>🍎 Покормить</Button>
      <Button size="l" className="action-button action-button--wash" disabled={disabled} appearance="positive" onClick={onWash}>🫧 Помыть</Button>
      <Button size="l" className="action-button action-button--play" disabled={disabled} appearance="accent" onClick={onPlay}>🎾 Поиграть</Button>
      <Button size="l" className="action-button action-button--sleep" disabled={disabled} appearance="neutral" onClick={onSleep}>🌙 Спать</Button>
      <Button size="l" mode="secondary" onClick={onTasks}>📋 Задания</Button>
      <Button size="l" mode="secondary" onClick={onShop}>🛍 Магазин</Button>
      <Button size="l" mode="secondary" onClick={onWardrobe}>🧥 Гардероб</Button>
    </ButtonGroup>
    {disabled && <div className="action-panel__hint">Идёт анимация — дождись реакции питомца</div>}
  </section>;
}
