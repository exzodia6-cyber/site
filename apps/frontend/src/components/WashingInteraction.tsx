import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export function WashingInteraction() {
  const drops = useMemo(() => Array.from({ length: 22 }, (_, index) => ({ x: -0.45 + (index % 7) * 0.15, z: 0.22 + (index % 4) * 0.09, speed: 0.9 + (index % 5) * 0.15, offset: index * 0.11 })), []);
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current?.children.forEach((child, index) => {
      const data = drops[index];
      child.position.y = 1.4 - ((t * data.speed + data.offset) % 1.7);
    });
  });
  return <group>
    <group position={[1.12, 1.18, 0.5]} rotation={[0.15, 0, -0.65]}>
      <mesh><cylinderGeometry args={[0.1, 0.1, 0.52, 18]} /><meshStandardMaterial color="#94a3b8" metalness={0.35} /></mesh>
      <mesh position={[0, -0.34, 0]}><sphereGeometry args={[0.18, 24, 24]} /><meshStandardMaterial color="#67e8f9" /></mesh>
    </group>
    <group ref={group}>{drops.map((drop, index) => <mesh key={index} position={[drop.x, 1.1, drop.z]}><sphereGeometry args={[0.025, 12, 12]} /><meshStandardMaterial color="#38bdf8" transparent opacity={0.72} /></mesh>)}</group>
    <mesh position={[0, 0.16, 0.52]}><sphereGeometry args={[0.18, 24, 24]} /><meshStandardMaterial color="#e0f2fe" transparent opacity={0.7} /></mesh>
    <mesh position={[-0.24, 0.45, 0.48]}><sphereGeometry args={[0.13, 24, 24]} /><meshStandardMaterial color="#f0f9ff" transparent opacity={0.72} /></mesh>
  </group>;
}
