import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const foodColors: Record<string, string> = { apple: '#ef4444', 'pet-food': '#d97706', treat: '#f5deb3' };

export function FeedingInteraction({ foodId = 'apple' }: { foodId?: string }) {
  const food = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!food.current) return;
    const t = clock.getElapsedTime();
    food.current.position.x = 1.05 - Math.min(1, (Math.sin(t * 1.7) + 1) / 2) * 0.65;
    food.current.position.y = 0.18 + Math.sin(t * 5) * 0.035;
    food.current.rotation.z += 0.03;
  });
  const color = foodColors[foodId] ?? '#ef4444';
  return <group ref={food} position={[1.05, 0.2, 0.45]}>
    {foodId === 'pet-food' ? <><mesh><cylinderGeometry args={[0.2, 0.26, 0.14, 32]} /><meshStandardMaterial color="#f8fafc" /></mesh><mesh position={[0, 0.08, 0]}><sphereGeometry args={[0.12, 24, 24]} /><meshStandardMaterial color={color} /></mesh></> : <mesh><sphereGeometry args={[0.16, 32, 32]} /><meshStandardMaterial color={color} roughness={0.45} /></mesh>}
    {foodId === 'treat' && <mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.08, 0.28, 8, 18]} /><meshStandardMaterial color={color} /></mesh>}
  </group>;
}
