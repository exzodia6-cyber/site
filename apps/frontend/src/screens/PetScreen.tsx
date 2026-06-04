import { Button, Card, Header, Title } from '@vkontakte/vkui';
import { shopItems } from '../data/items';
import { PetViewer } from '../components/PetViewer';
import { CoinsDisplay } from '../components/CoinsDisplay';
import { LevelProgress } from '../components/LevelProgress';
import { PetActions } from '../components/PetActions';
import { StatsBar } from '../components/StatsBar';
import { createPetAnimationSnapshot } from '../components/PetAnimationController';
import type { GameState } from '../types/game';
import type { ActiveInteraction } from '../types/animation';

interface Props {
  state: GameState;
  currentInteraction?: ActiveInteraction;
  isInteracting?: boolean;
  onFeed: (foodId: string) => void;
  onWash: () => void;
  onPlay: () => void;
  onSleep: () => void;
  onNavigate: (panel: 'tasks' | 'shop' | 'wardrobe') => void;
  onUploadImage: (image: string) => void;
  onToggleImageMode: (enabled: boolean) => void;
  onReset: () => void;
}

export function PetScreen({ state, currentInteraction, isInteracting, onFeed, onWash, onPlay, onSleep, onNavigate, onUploadImage, onToggleImageMode, onReset }: Props) {
  const bestFood = shopItems.find((item) => item.id === 'pet-food')?.id ?? 'apple';
  const animation = createPetAnimationSnapshot(state.pet, currentInteraction);
  return <div className="screen pet-screen">
    <div className="hero-card pet-hero">
      <div className="pet-hero__copy">
        <span className="eyebrow">PetLife VK</span>
        <Title level="1">{state.pet.name}</Title>
        <p>Уютная мини-игра о заботе: кормление, купание, игры, сон, задания и гардероб без backend.</p>
      </div>
      <div className="pet-hero__meta">
        <CoinsDisplay coins={state.pet.coins} />
        <LevelProgress level={state.pet.level} xp={state.pet.xp} />
      </div>
    </div>
    <div className="main-grid">
      <Card className="game-card pet-stage">
        <Header mode="secondary">Комната питомца</Header>
        <PetViewer equippedItemIds={state.pet.selectedClothes} customImage={state.pet.customImage} customImageMode={state.pet.customImageMode} sceneMode={animation.sceneMode} petAnimationState={animation.petAnimationState} currentInteraction={currentInteraction} onUploadImage={onUploadImage} onToggleImageMode={onToggleImageMode} />
      </Card>
      <div className="side-stack">
        <Card className="game-card care-summary">
          <span className="eyebrow eyebrow--light">Состояние</span>
          <Title level="3">{animation.isBusy ? 'Питомец занят действием' : 'Готов к заботе'}</Title>
          <p>{animation.isBusy ? 'Показатели изменятся после завершения анимации.' : 'Выбери действие — питомец отреагирует движением и эмоцией.'}</p>
        </Card>
        <StatsBar stats={{ hunger: state.pet.hunger, cleanliness: state.pet.cleanliness, mood: state.pet.mood, energy: state.pet.energy }} />
        <PetActions disabled={isInteracting} onFeed={() => onFeed(bestFood)} onWash={onWash} onPlay={onPlay} onSleep={onSleep} onTasks={() => onNavigate('tasks')} onShop={() => onNavigate('shop')} onWardrobe={() => onNavigate('wardrobe')} />
        <Button mode="tertiary" onClick={onReset}>Сбросить игру</Button>
      </div>
    </div>
  </div>;
}
