import type { ShopItem } from '../types/game';
import { ItemCard } from './ItemCard';

interface Props {
  items: ShopItem[];
  ownedItems: string[];
  equippedItems: string[];
  onEquip: (itemId: string) => void;
  onUnequip: (itemId: string) => void;
  onPreview: (itemId: string) => void;
}

export function InventoryGrid({ items, ownedItems, equippedItems, onEquip, onUnequip, onPreview }: Props) {
  const visible = items.filter((item) => ownedItems.includes(item.id));
  if (visible.length === 0) return <div className="empty-state">В гардеробе пока пусто. Купите одежду или аксессуары в магазине.</div>;
  return <div className="shop-grid">{visible.map((item) => {
    const equipped = equippedItems.includes(item.id);
    return <ItemCard key={item.id} item={item} owned equipped={equipped} actionLabel={equipped ? 'Снять' : 'Надеть'} onAction={equipped ? onUnequip : onEquip} onPreview={onPreview} />;
  })}</div>;
}
