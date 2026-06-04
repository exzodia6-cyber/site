import { readFileSync } from 'node:fs';

const files = [
  'src/App.tsx',
  'src/components/PetViewer.tsx',
  'src/hooks/useGameStore.ts',
  'src/store/gameStorage.ts',
  'src/data/items.ts',
  'src/data/tasks.ts'
];
const combined = files.map((file) => readFileSync(new URL(`../apps/frontend/${file}`, import.meta.url), 'utf8')).join('\n');
for (const check of ['VKWebAppInit', 'Canvas', 'OrbitControls', 'feedPet', 'claimTaskReward', 'localStorage', 'createDailyTasks', 'Очки', 'Пижама']) {
  if (!combined.includes(check)) throw new Error(`Frontend smoke check failed: ${check}`);
}
console.log('Frontend PetLife VK smoke passed');
