import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import App from './App';
beforeEach(()=>{ localStorage.clear(); vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline')))); });
describe('App MVP', () => { it('renders home headline and subject flow in demo mode', async () => { const user = userEvent.setup(); render(<App/>); expect(screen.getByText('Готовься к ОГЭ и ЕГЭ системно')).toBeInTheDocument(); await user.click(screen.getByText('Выбрать предмет')); expect(await screen.findByText('Математика ОГЭ')).toBeInTheDocument(); }); it('supports demo login fallback', async () => { const user = userEvent.setup(); render(<App/>); await user.click(screen.getByText('Войти')); await user.click(screen.getByRole('button', { name: 'Войти' })); expect(await screen.findByText('Демо Ученик')).toBeInTheDocument(); }); });
