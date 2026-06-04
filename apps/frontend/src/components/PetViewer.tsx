import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { ChangeEvent, Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { getItem } from '../data/items';

interface Props {
  equippedItemIds: string[];
  customImage?: string;
  customImageMode?: boolean;
  animation?: 'feed' | 'wash' | 'play' | 'sleep';
  onUploadImage: (image: string) => void;
  onToggleImageMode: (enabled: boolean) => void;
}

const attachPoints = {
  head: [0, 1.35, 0] as [number, number, number],
  face: [0, 0.88, 0.48] as [number, number, number],
  body: [0, 0.12, 0] as [number, number, number],
  neck: [0, 0.55, 0.35] as [number, number, number],
  paw: [0.58, -0.38, 0.35] as [number, number, number]
};

function ModelSlot({ modelPath }: { modelPath?: string }) {
  if (!modelPath) return null;
  return <Suspense fallback={null}><LoadableModel modelPath={modelPath} /></Suspense>;
}

function LoadableModel({ modelPath }: { modelPath: string }) {
  const model = useGLTF(modelPath);
  return <primitive object={model.scene.clone()} scale={0.35} />;
}

function Accessory({ itemId }: { itemId: string }) {
  const item = getItem(itemId);
  if (!item?.attachPoint) return null;
  const position = attachPoints[item.attachPoint];
  return <group position={position}>
    {item.id === 'glasses' && <group><mesh position={[-0.16, 0, 0]}><torusGeometry args={[0.13, 0.018, 12, 32]} /><meshStandardMaterial color="#111827" /></mesh><mesh position={[0.16, 0, 0]}><torusGeometry args={[0.13, 0.018, 12, 32]} /><meshStandardMaterial color="#111827" /></mesh><mesh><boxGeometry args={[0.1, 0.025, 0.025]} /><meshStandardMaterial color="#111827" /></mesh></group>}
    {item.id === 'hat' && <mesh position={[0, 0.12, 0]}><coneGeometry args={[0.34, 0.55, 32]} /><meshStandardMaterial color="#7c3aed" roughness={0.45} /></mesh>}
    {item.id === 'bow' && <group><mesh position={[-0.14, 0, 0]} rotation={[0, 0, 0.8]}><coneGeometry args={[0.15, 0.24, 3]} /><meshStandardMaterial color="#ec4899" /></mesh><mesh position={[0.14, 0, 0]} rotation={[0, 0, -0.8]}><coneGeometry args={[0.15, 0.24, 3]} /><meshStandardMaterial color="#ec4899" /></mesh><mesh><sphereGeometry args={[0.06]} /><meshStandardMaterial color="#be185d" /></mesh></group>}
    {item.id === 'tshirt' && <mesh><cylinderGeometry args={[0.48, 0.54, 0.78, 32]} /><meshStandardMaterial color="#38bdf8" transparent opacity={0.86} /></mesh>}
    {item.id === 'pajamas' && <mesh><cylinderGeometry args={[0.5, 0.55, 0.82, 32]} /><meshStandardMaterial color="#a78bfa" transparent opacity={0.88} /></mesh>}
    {item.id === 'suit' && <mesh><cylinderGeometry args={[0.48, 0.52, 0.82, 32]} /><meshStandardMaterial color="#1f2937" transparent opacity={0.92} /></mesh>}
  </group>;
}

function PetPrimitive({ equippedItemIds, animation }: { equippedItemIds: string[]; animation?: Props['animation'] }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 1.8) * 0.045;
    group.current.rotation.y = Math.sin(t * 0.7) * 0.08;
    if (animation === 'play') group.current.rotation.z = Math.sin(t * 12) * 0.18;
    else if (animation === 'sleep') group.current.rotation.z = -0.18;
    else group.current.rotation.z = 0;
  });
  const bodyColor = animation === 'wash' ? '#8be9fd' : '#f9a8d4';
  return <group ref={group}>
    <mesh position={[0, 0, 0]}><sphereGeometry args={[0.62, 48, 48]} /><meshStandardMaterial color={bodyColor} roughness={0.55} /></mesh>
    <mesh position={[0, 0.82, 0]}><sphereGeometry args={[0.48, 48, 48]} /><meshStandardMaterial color="#fbcfe8" roughness={0.5} /></mesh>
    <mesh position={[-0.3, 1.2, 0]} rotation={[0, 0, -0.25]}><coneGeometry args={[0.18, 0.42, 32]} /><meshStandardMaterial color="#f9a8d4" /></mesh>
    <mesh position={[0.3, 1.2, 0]} rotation={[0, 0, 0.25]}><coneGeometry args={[0.18, 0.42, 32]} /><meshStandardMaterial color="#f9a8d4" /></mesh>
    <mesh position={[-0.16, 0.9, 0.42]}><sphereGeometry args={[0.045]} /><meshStandardMaterial color="#111827" /></mesh>
    <mesh position={[0.16, 0.9, 0.42]}><sphereGeometry args={[0.045]} /><meshStandardMaterial color="#111827" /></mesh>
    <mesh position={[0, 0.73, 0.48]}><sphereGeometry args={[0.065]} /><meshStandardMaterial color="#db2777" /></mesh>
    <mesh position={[-0.34, -0.5, 0.1]}><sphereGeometry args={[0.18]} /><meshStandardMaterial color="#f9a8d4" /></mesh>
    <mesh position={[0.34, -0.5, 0.1]}><sphereGeometry args={[0.18]} /><meshStandardMaterial color="#f9a8d4" /></mesh>
    {animation === 'feed' && <mesh position={[0.75, 0.3, 0.2]}><sphereGeometry args={[0.12]} /><meshStandardMaterial color="#ef4444" /></mesh>}
    {equippedItemIds.map((id) => <Accessory itemId={id} key={id} />)}
  </group>;
}

function CustomImagePet({ image }: { image: string }) {
  const texture = useMemo(() => new THREE.TextureLoader().load(image), [image]);
  return <mesh><planeGeometry args={[2.1, 2.1]} /><meshBasicMaterial map={texture} transparent /></mesh>;
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
  return canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/webp', 0.92);
}

export function PetViewer({ equippedItemIds, customImage, customImageMode, animation, onUploadImage, onToggleImageMode }: Props) {
  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return;
    onUploadImage(await cropToSquare(file));
  };

  return <div className={`pet-viewer pet-viewer--${animation ?? 'idle'}`}>
    <Canvas camera={{ position: [0, 0.7, 4], fov: 42 }} shadows>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} castShadow />
      <Suspense fallback={null}>{customImage && customImageMode ? <CustomImagePet image={customImage} /> : <PetPrimitive equippedItemIds={equippedItemIds} animation={animation} />}</Suspense>
      <OrbitControls enablePan={false} minDistance={2.6} maxDistance={5.2} />
    </Canvas>
    <div className="pet-viewer__toolbar">
      <label className="upload-button">📷 Загрузить питомца<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} /></label>
      {customImage && <button className="mode-toggle" onClick={() => onToggleImageMode(!customImageMode)}>{customImageMode ? '3D модель' : 'Моя картинка'}</button>}
    </div>
    <div className="model-note">GLB/GLTF-ready: аксессуары привязаны к head, face, body, neck и paw.</div>
  </div>;
}

