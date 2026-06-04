import { Button, Card, Caption, Text, Title } from '@vkontakte/vkui';
import type { ShopItem } from '../types/game';

interface Props {
  item: ShopItem;
  owned?: boolean;
  equipped?: boolean;
  count?: number;
  actionLabel: string;
  disabled?: boolean;
  onAction: (itemId: string) => void;
  onPreview?: (itemId: string) => void;
}

export function ItemCard({ item, owned, equipped, count, actionLabel, disabled, onAction, onPreview }: Props) {
  return <Card className={`game-card item-card ${equipped ? 'item-card--equipped' : ''}`}>
    <div className="item-card__preview">{item.previewImage}</div>
    <Title level="3">{item.name}</Title>
    <Text>{item.description}</Text>
    <Caption level="1">{item.type} {item.attachPoint ? `· ${item.attachPoint}` : ''}</Caption>
    <div className="item-card__footer"><b>{item.price} 🪙</b>{typeof count === 'number' && <span>В наличии: {count}</span>}</div>
    <div className="item-card__actions">
      {onPreview && <Button mode="secondary" onClick={() => onPreview(item.id)}>Предпросмотр</Button>}
      <Button disabled={disabled} onClick={() => onAction(item.id)}>{equipped ? 'Снять' : owned ? actionLabel : actionLabel}</Button>
    </div>
  </Card>;
}
