import { Button, Header, Tabs, TabsItem, Title } from '@vkontakte/vkui';
import { useState } from 'react';
import { ItemCard } from '../components/ItemCard';
import { shopItems } from '../data/items';
import type { ItemType } from '../types/game';

const tabs: Array<{ id: ItemType; label: string }> = [
  { id: 'food', label: 'Еда' }, { id: 'clothes', label: 'Одежда' }, { id: 'accessory', label: 'Аксессуары' }, { id: 'toy', label: 'Игрушки' }
];

export function ShopScreen({ coins, inventory, ownedItems, onBuy, onBack }: { coins: number; inventory: Record<string, number>; ownedItems: string[]; onBuy: (itemId: string) => void; onBack: () => void }) {
  const [tab, setTab] = useState<ItemType>('food');
  const filtered = shopItems.filter((item) => item.type === tab);
  return <div className="screen"><Button mode="tertiary" onClick={onBack}>← К питомцу</Button><Header>Магазин</Header><div className="hero-card hero-card--small"><Title level="1">Выберите подарок</Title><b>{coins} 🪙</b></div><Tabs>{tabs.map((item) => <TabsItem key={item.id} selected={tab === item.id} onClick={() => setTab(item.id)}>{item.label}</TabsItem>)}</Tabs><div className="shop-grid">{filtered.map((item) => {
    const owned = ownedItems.includes(item.id);
    const disabled = item.type !== 'food' && owned;
    return <ItemCard key={item.id} item={item} owned={owned} count={inventory[item.id]} disabled={disabled || coins < item.price} actionLabel={owned && item.type !== 'food' ? 'Куплено' : 'Купить'} onAction={onBuy} />;
  })}</div></div>;
}
