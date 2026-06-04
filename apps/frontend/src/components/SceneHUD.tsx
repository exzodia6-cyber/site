import type { PetAnimationState, SceneMode } from '../types/animation';
import { FloatingReward } from './FloatingReward';
import { PetSpeechBubble } from './PetSpeechBubble';

const sceneLabels: Record<SceneMode, string> = {
  home: 'Уютная комната',
  feeding: 'Кормление',
  washing: 'Ванная зона',
  playing: 'Игровая зона',
  sleeping: 'Сонная комната'
};

const messages: Record<PetAnimationState, { text: string; mood: 'normal' | 'happy' | 'sleepy' | 'need' }> = {
  idle: { text: 'Погладь меня или выбери действие!', mood: 'normal' },
  happy: { text: 'Мне весело!', mood: 'happy' },
  hungry: { text: 'Хочу кушать…', mood: 'need' },
  sleepy: { text: 'Я устал, можно поспать?', mood: 'sleepy' },
  dirty: { text: 'Кажется, пора купаться', mood: 'need' },
  playing: { text: 'Лови мячик!', mood: 'happy' },
  washing: { text: 'Буль-буль! Уже чище!', mood: 'happy' },
  eating: { text: 'М-м-м, спасибо!', mood: 'happy' },
  sleeping: { text: 'Zzz… сладких снов', mood: 'sleepy' }
};

const rewardText: Partial<Record<SceneMode, string>> = {
  feeding: '+сытость',
  washing: '+чистота',
  playing: '+настроение',
  sleeping: '+энергия'
};

export function SceneHUD({ sceneMode, petAnimationState, isInteracting }: { sceneMode: SceneMode; petAnimationState: PetAnimationState; isInteracting: boolean }) {
  const message = messages[petAnimationState];
  return <div className="scene-hud">
    <div className="scene-hud__badge">✨ {sceneLabels[sceneMode]}</div>
    <PetSpeechBubble message={message.text} mood={message.mood} />
    <FloatingReward text={rewardText[sceneMode] ?? ''} visible={isInteracting && sceneMode !== 'home'} kind={sceneMode === 'sleeping' ? 'xp' : 'care'} />
  </div>;
}
