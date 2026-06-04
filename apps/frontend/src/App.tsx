import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';
import { AdaptivityProvider, AppRoot, ConfigProvider, Panel, PanelHeader, SplitCol, SplitLayout, View } from '@vkontakte/vkui';
import { useEffect, useState } from 'react';
import { PetScreen } from './screens/PetScreen';
import { ShopScreen } from './screens/ShopScreen';
import { TasksScreen } from './screens/TasksScreen';
import { WardrobeScreen } from './screens/WardrobeScreen';
import { useGameStore } from './hooks/useGameStore';
import './styles.css';

type PanelName = 'pet' | 'tasks' | 'shop' | 'wardrobe';

export default function App() {
  const [panel, setPanel] = useState<PanelName>('pet');
  const game = useGameStore();

  useEffect(() => {
    bridge.send('VKWebAppInit');
  }, []);

  return <ConfigProvider appearance="light">
    <AdaptivityProvider>
      <AppRoot mode="full">
        <SplitLayout header={<PanelHeader delimiter="none">PetLife VK</PanelHeader>}>
          <SplitCol>
            <View activePanel={panel}>
              <Panel id="pet"><PetScreen state={game.state} animation={game.lastAnimation} onFeed={game.feedPet} onWash={game.washPet} onPlay={game.playWithPet} onSleep={game.sleepPet} onNavigate={setPanel} onUploadImage={game.setCustomImage} onToggleImageMode={game.setCustomImageMode} onReset={game.resetGame} /></Panel>
              <Panel id="tasks"><TasksScreen tasks={game.state.tasks} onClaim={game.claimTaskReward} onBack={() => setPanel('pet')} /></Panel>
              <Panel id="shop"><ShopScreen coins={game.state.pet.coins} inventory={game.state.inventory} ownedItems={game.state.pet.ownedItems} onBuy={game.buyItem} onBack={() => setPanel('pet')} /></Panel>
              <Panel id="wardrobe"><WardrobeScreen pet={game.state.pet} onEquip={game.equipItem} onUnequip={game.unequipItem} onUploadImage={game.setCustomImage} onToggleImageMode={game.setCustomImageMode} onBack={() => setPanel('pet')} /></Panel>
            </View>
          </SplitCol>
        </SplitLayout>
        <div className="toast-layer">{game.toasts.map((toast) => <div className={`toast toast--${toast.kind}`} key={toast.id}>{toast.text}</div>)}</div>
      </AppRoot>
    </AdaptivityProvider>
  </ConfigProvider>;
}
