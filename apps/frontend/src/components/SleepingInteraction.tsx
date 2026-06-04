import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export function SleepingInteraction() {
  const zeds = useMemo(() => [-0.2, 0, 0.2], []);
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current?.children.forEach((child, index) => {
      child.position.y = 1.25 + ((t * 0.35 + index * 0.22) % 0.8);
      child.position.x = -0.2 + index * 0.18 + Math.sin(t + index) * 0.03;
      child.scale.setScalar(0.8 + ((t + index) % 1) * 0.25);
    });
  });
  return <group ref={group}>{zeds.map((x, index) => <mesh key={index} position={[x, 1.3 + index * 0.2, 0.52]}><boxGeometry args={[0.16, 0.05, 0.02]} /><meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.12} /></mesh>)}</group>;
}
