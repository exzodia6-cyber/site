import type { SceneMode } from '../types/animation';

const wallColors: Record<SceneMode, string> = {
  home: '#fde7f3',
  feeding: '#fff4c7',
  washing: '#d9f4ff',
  playing: '#e5f9d4',
  sleeping: '#d9ddff'
};

function ToyShelf() {
  return <group position={[-1.9, 1.15, -1.72]}>
    <mesh><boxGeometry args={[1.15, 0.12, 0.18]} /><meshStandardMaterial color="#b77948" /></mesh>
    <mesh position={[-0.35, 0.2, 0]}><boxGeometry args={[0.2, 0.32, 0.16]} /><meshStandardMaterial color="#60a5fa" /></mesh>
    <mesh position={[0, 0.22, 0]}><boxGeometry args={[0.18, 0.38, 0.16]} /><meshStandardMaterial color="#f472b6" /></mesh>
    <mesh position={[0.36, 0.18, 0]}><sphereGeometry args={[0.16, 24, 24]} /><meshStandardMaterial color="#facc15" /></mesh>
  </group>;
}

function Window({ night }: { night: boolean }) {
  return <group position={[1.55, 1.25, -1.76]}>
    <mesh><boxGeometry args={[1, 0.82, 0.06]} /><meshStandardMaterial color={night ? '#312e81' : '#93c5fd'} emissive={night ? '#1e1b4b' : '#bae6fd'} emissiveIntensity={0.25} /></mesh>
    <mesh position={[0, 0, 0.04]}><boxGeometry args={[1.1, 0.08, 0.08]} /><meshStandardMaterial color="#fff7ed" /></mesh>
    <mesh position={[0, 0, 0.06]} rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[0.9, 0.08, 0.08]} /><meshStandardMaterial color="#fff7ed" /></mesh>
    {!night && <mesh position={[0.26, 0.16, 0.08]}><sphereGeometry args={[0.14, 24, 24]} /><meshStandardMaterial color="#fde047" emissive="#f59e0b" emissiveIntensity={0.45} /></mesh>}
  </group>;
}

function RoomProps({ mode }: { mode: SceneMode }) {
  const isWash = mode === 'washing';
  const isSleep = mode === 'sleeping';
  return <>
    <mesh position={[-1.25, -0.54, 0.82]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.78, 48]} /><meshStandardMaterial color={isSleep ? '#c4b5fd' : '#f9a8d4'} roughness={0.8} /></mesh>
    <mesh position={[1.2, -0.42, 0.7]}><cylinderGeometry args={[0.32, 0.32, 0.16, 32]} /><meshStandardMaterial color={isWash ? '#bae6fd' : '#fde68a'} /></mesh>
    <mesh position={[1.2, -0.31, 0.7]}><cylinderGeometry args={[0.22, 0.22, 0.05, 32]} /><meshStandardMaterial color="#fef3c7" /></mesh>
    <mesh position={[-1.45, -0.34, -0.45]}><boxGeometry args={[0.9, 0.25, 0.55]} /><meshStandardMaterial color={isSleep ? '#a78bfa' : '#fda4af'} /></mesh>
    <mesh position={[-1.45, -0.18, -0.45]}><boxGeometry args={[0.78, 0.18, 0.46]} /><meshStandardMaterial color="#fff7ed" /></mesh>
    <mesh position={[1.72, -0.38, 0.1]}><sphereGeometry args={[0.18, 32, 32]} /><meshStandardMaterial color="#fb923c" /></mesh>
    <mesh position={[1.95, -0.48, 0.12]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.16, 0.035, 12, 24]} /><meshStandardMaterial color="#a78bfa" /></mesh>
  </>;
}

export function PetEnvironment({ mode }: { mode: SceneMode }) {
  const night = mode === 'sleeping';
  return <group>
    <ambientLight intensity={night ? 0.48 : 0.82} />
    <directionalLight position={[2.5, 4, 3]} intensity={night ? 0.75 : 1.25} castShadow shadow-mapSize={[1024, 1024]} />
    <pointLight position={[-2, 2.2, 1.5]} intensity={night ? 0.8 : 0.45} color={night ? '#a78bfa' : '#fff7ad'} />
    <mesh position={[0, -0.62, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[5.2, 4.2]} /><meshStandardMaterial color={night ? '#9ca3af' : '#fdebd3'} roughness={0.72} /></mesh>
    <mesh position={[0, 0.7, -1.82]} receiveShadow><boxGeometry args={[5.2, 3, 0.08]} /><meshStandardMaterial color={wallColors[mode]} roughness={0.88} /></mesh>
    <mesh position={[0, -0.6, -0.35]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.82, 1.25, 64]} /><meshStandardMaterial color="#fff7ed" roughness={0.75} /></mesh>
    <Window night={night} />
    <ToyShelf />
    <RoomProps mode={mode} />
  </group>;
}
