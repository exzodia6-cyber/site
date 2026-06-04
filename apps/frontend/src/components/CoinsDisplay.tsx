import { Caption } from '@vkontakte/vkui';

export function CoinsDisplay({ coins }: { coins: number }) {
  return <div className="coins-display" aria-label={`Монеты: ${coins}`}><span className="coin-burst">🪙</span><Caption level="1" weight="1">{coins}</Caption></div>;
}
