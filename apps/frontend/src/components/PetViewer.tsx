import type { ChangeEvent } from 'react';
import type { PetAnimationState, SceneMode, ActiveInteraction } from '../types/animation';
import { PetScene } from './PetScene';
import { SceneHUD } from './SceneHUD';

// PetScene owns the Three.js Canvas and OrbitControls so PetViewer can focus on UI chrome.

interface Props {
  equippedItemIds: string[];
  customImage?: string;
  customImageMode?: boolean;
  sceneMode: SceneMode;
  petAnimationState: PetAnimationState;
  currentInteraction?: ActiveInteraction;
  onUploadImage: (image: string) => void;
  onToggleImageMode: (enabled: boolean) => void;
}

async function cropToSquare(file: File) {
  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = dataUrl;
  });
  const side = Math.min(image.width, image.height);
  const sx = (image.width - side) / 2;
  const sy = (image.height - side) / 2;
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 768;
  const context = canvas.getContext('2d');
  context?.drawImage(image, sx, sy, side, side, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(file.type || 'image/png', 0.92);
}

export function PetViewer({ equippedItemIds, customImage, customImageMode, sceneMode, petAnimationState, currentInteraction, onUploadImage, onToggleImageMode }: Props) {
  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onUploadImage(await cropToSquare(file));
    event.target.value = '';
  };

  return <div className={`pet-viewer pet-viewer--${sceneMode}`}>
    <PetScene equippedItemIds={equippedItemIds} customImage={customImage} customImageMode={customImageMode} sceneMode={sceneMode} petAnimationState={petAnimationState} interaction={currentInteraction} />
    <SceneHUD sceneMode={sceneMode} petAnimationState={petAnimationState} isInteracting={Boolean(currentInteraction)} />
    <div className="pet-viewer__toolbar">
      <label className="upload-button">📷 Свой образ<input type="file" accept="image/*" onChange={handleUpload} /></label>
      <button className="mode-toggle" type="button" onClick={() => onToggleImageMode(!customImageMode)} disabled={!customImage}>{customImageMode ? 'Вернуть 3D' : 'Показать фото'}</button>
    </div>
    <div className="model-note">Можно вращать сцену жестом. Фото питомца хранится только локально.</div>
  </div>;
}
