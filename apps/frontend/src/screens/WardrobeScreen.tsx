import { Button, Header, Title } from '@vkontakte/vkui';
import { useState } from 'react';
import { InventoryGrid } from '../components/InventoryGrid';
import { PetViewer } from '../components/PetViewer';
import { shopItems } from '../data/items';
import type { Pet } from '../types/game';

export function WardrobeScreen({ pet, onEquip, onUnequip, onBack, onUploadImage, onToggleImageMode }: { pet: Pet; onEquip: (itemId: string) => void; onUnequip: (itemId: string) => void; onBack: () => void; onUploadImage: (image: string) => void; onToggleImageMode: (enabled: boolean) => void }) {
  const [preview, setPreview] = useState<string | undefined>();
  const previewItems = preview && !pet.selectedClothes.includes(preview) ? [...pet.selectedClothes, preview] : pet.selectedClothes;
  const wearables = shopItems.filter((item) => item.type === 'clothes' || item.type === 'accessory');
  return <div className="screen"><Button mode="tertiary" onClick={onBack}>← К питомцу</Button><Header>Гардероб</Header><Title level="1">Вещи и предпросмотр</Title><div className="main-grid"><div className="game-card pet-stage"><PetViewer equippedItemIds={previewItems} customImage={pet.customImage} customImageMode={pet.customImageMode} onUploadImage={onUploadImage} onToggleImageMode={onToggleImageMode} /></div><InventoryGrid items={wearables} ownedItems={pet.ownedItems} equippedItems={pet.selectedClothes} onEquip={onEquip} onUnequip={onUnequip} onPreview={setPreview} /></div></div>;
}
