import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function PlayingInteraction() {
  const ball = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ball.current) return;
    const t = clock.getElapsedTime();
    ball.current.position.x = Math.sin(t * 2.4) * 1.05;
    ball.current.position.y = -0.35 + Math.abs(Math.sin(t * 2.4)) * 0.38;
    ball.current.rotation.x += 0.08;
    ball.current.rotation.z += 0.05;
  });
  return <mesh ref={ball} position={[0.8, -0.28, 0.65]} castShadow>
    <sphereGeometry args={[0.18, 32, 32]} />
    <meshStandardMaterial color="#22c55e" roughness={0.42} />
  </mesh>;
}
