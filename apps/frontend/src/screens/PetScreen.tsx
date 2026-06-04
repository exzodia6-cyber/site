import { Button, Card, Header, Title } from '@vkontakte/vkui';
import { shopItems } from '../data/items';
import { PetViewer } from '../components/PetViewer';
import { CoinsDisplay } from '../components/CoinsDisplay';
import { LevelProgress } from '../components/LevelProgress';
import { PetActions } from '../components/PetActions';
import { StatsBar } from '../components/StatsBar';
import type { GameState } from '../types/game';

interface Props {
  state: GameState;
  animation?: 'feed' | 'wash' | 'play' | 'sleep';
  onFeed: (foodId: string) => void;
  onWash: () => void;
  onPlay: () => void;
  onSleep: () => void;
  onNavigate: (panel: 'tasks' | 'shop' | 'wardrobe') => void;
  onUploadImage: (image: string) => void;
  onToggleImageMode: (enabled: boolean) => void;
  onReset: () => void;
}

export function PetScreen({ state, animation, onFeed, onWash, onPlay, onSleep, onNavigate, onUploadImage, onToggleImageMode, onReset }: Props) {
  const bestFood = shopItems.find((item) => item.id === 'pet-food')?.id ?? 'apple';
  return <div className="screen pet-screen">
    <div className="hero-card">
      <div><span className="eyebrow">PetLife VK</span><Title level="1">{state.pet.name}</Title><p>Виртуальный питомец для VK Mini Apps: забота, задания, магазин и гардероб без backend.</p></div>
      <CoinsDisplay coins={state.pet.coins} />
    </div>
    <div className="main-grid">
      <Card className="game-card pet-stage"><Header>3D питомец</Header><PetViewer equippedItemIds={state.pet.selectedClothes} customImage={state.pet.customImage} customImageMode={state.pet.customImageMode} animation={animation} onUploadImage={onUploadImage} onToggleImageMode={onToggleImageMode} /></Card>
      <div className="side-stack">
        <Card className="game-card"><LevelProgress level={state.pet.level} xp={state.pet.xp} /></Card>
        <StatsBar stats={{ hunger: state.pet.hunger, cleanliness: state.pet.cleanliness, mood: state.pet.mood, energy: state.pet.energy }} />
        <PetActions onFeed={() => onFeed(bestFood)} onWash={onWash} onPlay={onPlay} onSleep={onSleep} onTasks={() => onNavigate('tasks')} onShop={() => onNavigate('shop')} onWardrobe={() => onNavigate('wardrobe')} />
        <Button mode="tertiary" onClick={onReset}>Сбросить игру</Button>
      </div>
    </div>
  </div>;
}
