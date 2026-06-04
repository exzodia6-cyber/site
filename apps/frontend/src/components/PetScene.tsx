import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { getItem } from '../data/items';
import type { ActiveInteraction, PetAnimationState, SceneMode } from '../types/animation';
import { InteractionController } from './InteractionController';
import { PetEnvironment } from './PetEnvironment';

const BASE_SCALE = 1;
const IDLE_AMOUNT = 0.025;
const MIN_SAFE_SCALE = BASE_SCALE - IDLE_AMOUNT;
const MAX_SAFE_SCALE = BASE_SCALE + IDLE_AMOUNT;
const CAMERA_POSITION = [0, 1.5, 6] as [number, number, number];
const CAMERA_FOV = 45;
const CONTROLS_TARGET = [0, 1, 0] as [number, number, number];

function getIdleScale(elapsedTime: number) {
  const idleScale = BASE_SCALE + Math.sin(elapsedTime * 2) * IDLE_AMOUNT;
  return THREE.MathUtils.clamp(idleScale, MIN_SAFE_SCALE, MAX_SAFE_SCALE);
}

const attachPoints = {
  head: [0, 1.35, 0] as [number, number, number],
  face: [0, 0.88, 0.48] as [number, number, number],
  body: [0, 0.12, 0] as [number, number, number],
  neck: [0, 0.55, 0.35] as [number, number, number],
  paw: [0.58, -0.38, 0.35] as [number, number, number]
};

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

function PetModel({ equippedItemIds, petAnimationState }: { equippedItemIds: string[]; petAnimationState: PetAnimationState }) {
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const sleepy = petAnimationState === 'sleepy' || petAnimationState === 'sleeping';
    const energy = petAnimationState === 'happy' || petAnimationState === 'playing' ? 1.5 : sleepy ? 0.55 : 1;
    if (group.current) {
      group.current.scale.setScalar(getIdleScale(t));
      group.current.position.y = Math.sin(t * 1.8 * energy) * 0.045 * energy;
      group.current.rotation.y = Math.sin(t * 0.7) * 0.1;
      group.current.rotation.z = petAnimationState === 'sleeping' ? -0.52 : petAnimationState === 'playing' ? Math.sin(t * 9) * 0.18 : 0;
      group.current.position.x = petAnimationState === 'playing' ? Math.sin(t * 2.4) * 0.24 : petAnimationState === 'sleeping' ? -0.92 : 0;
    }
    if (head.current) {
      head.current.rotation.y = petAnimationState === 'eating' ? 0.42 + Math.sin(t * 8) * 0.05 : Math.sin(t * 0.9) * 0.08;
      head.current.rotation.x = petAnimationState === 'dirty' ? -0.12 : petAnimationState === 'eating' ? Math.sin(t * 10) * 0.05 : 0;
    }
    if (tail.current) tail.current.rotation.z = Math.sin(t * (petAnimationState === 'happy' || petAnimationState === 'playing' ? 8 : 3)) * 0.55;
    const blinkScale = sleepy ? 0.12 : Math.sin(t * 2.8) > 0.965 ? 0.12 : 1;
    leftEye.current?.scale.set(1, blinkScale, 1);
    rightEye.current?.scale.set(1, blinkScale, 1);
  });
  const bodyColor = petAnimationState === 'washing' ? '#8be9fd' : petAnimationState === 'dirty' ? '#d8b4a0' : '#f9a8d4';
  const mouthOpen = petAnimationState === 'eating';
  const happyMouth = petAnimationState === 'happy' || petAnimationState === 'playing';
  return <group ref={group} scale={BASE_SCALE} castShadow>
    <mesh position={[0, 0, 0]} castShadow><sphereGeometry args={[0.62, 48, 48]} /><meshStandardMaterial color={bodyColor} roughness={0.55} /></mesh>
    <mesh ref={tail} position={[-0.64, 0.1, -0.08]} rotation={[0.45, 0.2, -0.4]} castShadow><capsuleGeometry args={[0.09, 0.48, 8, 18]} /><meshStandardMaterial color="#f9a8d4" roughness={0.52} /></mesh>
    <group ref={head} position={[0, 0.82, 0]}>
      <mesh castShadow><sphereGeometry args={[0.48, 48, 48]} /><meshStandardMaterial color="#fbcfe8" roughness={0.5} /></mesh>
      <mesh position={[-0.3, 0.38, 0]} rotation={[0, 0, -0.25]} castShadow><coneGeometry args={[0.18, 0.42, 32]} /><meshStandardMaterial color="#f9a8d4" /></mesh>
      <mesh position={[0.3, 0.38, 0]} rotation={[0, 0, 0.25]} castShadow><coneGeometry args={[0.18, 0.42, 32]} /><meshStandardMaterial color="#f9a8d4" /></mesh>
      <mesh ref={leftEye} position={[-0.16, 0.08, 0.42]}><sphereGeometry args={[0.045]} /><meshStandardMaterial color="#111827" /></mesh>
      <mesh ref={rightEye} position={[0.16, 0.08, 0.42]}><sphereGeometry args={[0.045]} /><meshStandardMaterial color="#111827" /></mesh>
      <mesh position={[0, -0.09, 0.48]} scale={[happyMouth ? 1.4 : 1, mouthOpen ? 1.6 : 1, 1]}><sphereGeometry args={[0.055]} /><meshStandardMaterial color={mouthOpen ? '#7f1d1d' : '#db2777'} /></mesh>
      {petAnimationState === 'dirty' && <mesh position={[0.24, -0.05, 0.44]}><sphereGeometry args={[0.045]} /><meshStandardMaterial color="#92400e" /></mesh>}
    </group>
    <mesh position={[-0.34, -0.5, 0.1]} castShadow><sphereGeometry args={[0.18]} /><meshStandardMaterial color="#f9a8d4" /></mesh>
    <mesh position={[0.34, -0.5, 0.1]} castShadow><sphereGeometry args={[0.18]} /><meshStandardMaterial color="#f9a8d4" /></mesh>
    {equippedItemIds.map((id) => <Accessory itemId={id} key={id} />)}
  </group>;
}

function CustomImagePet({ image }: { image: string }) {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => new THREE.TextureLoader().load(image), [image]);
  useFrame(({ clock }) => {
    group.current?.scale.setScalar(getIdleScale(clock.elapsedTime));
  });
  return <group ref={group} scale={BASE_SCALE}><mesh position={[0, 0.3, 0.4]}><planeGeometry args={[1.9, 1.9]} /><meshBasicMaterial map={texture} transparent /></mesh></group>;
}

export function PetScene({ equippedItemIds, customImage, customImageMode, sceneMode, petAnimationState, interaction }: { equippedItemIds: string[]; customImage?: string; customImageMode?: boolean; sceneMode: SceneMode; petAnimationState: PetAnimationState; interaction?: ActiveInteraction }) {
  return <Canvas camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }} shadows>
    <Suspense fallback={null}>
      <PetEnvironment mode={sceneMode} />
      {customImageMode && customImage ? <CustomImagePet image={customImage} /> : <PetModel equippedItemIds={equippedItemIds} petAnimationState={petAnimationState} />}
      <InteractionController interaction={interaction} />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={8}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        target={CONTROLS_TARGET}
      />
    </Suspense>
  </Canvas>;
}
