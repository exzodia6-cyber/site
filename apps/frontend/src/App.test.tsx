import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import App from './App';

vi.mock('@vkontakte/vk-bridge', () => ({ default: { send: vi.fn() } }));
vi.mock('@react-three/fiber', () => ({ Canvas: ({ children }: { children: ReactNode }) => <div data-testid="canvas">{children}</div>, useFrame: vi.fn() }));
vi.mock('@react-three/drei', () => ({ OrbitControls: () => <div />, useGLTF: Object.assign(() => ({ scene: { clone: () => ({}) } }), { preload: vi.fn() }) }));

beforeEach(() => localStorage.clear());

describe('PetLife VK', () => {
  it('renders the pet home screen with core stats and actions', () => {
    render(<App />);
    expect(screen.getByText('PetLife VK')).toBeInTheDocument();
    expect(screen.getByText('Пушок')).toBeInTheDocument();
    expect(screen.getByText('🍎 Покормить')).toBeInTheDocument();
    expect(screen.getByText('Гардероб')).toBeInTheDocument();
  });
});
