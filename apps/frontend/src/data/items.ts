import type { ShopItem } from '../types/game';

export const shopItems: ShopItem[] = [
  { id: 'apple', name: 'Яблоко', type: 'food', price: 5, description: 'Сочное яблоко. Эффект: -10 голода.', previewImage: '🍎', modelPath: '', hungerEffect: -10 },
  { id: 'pet-food', name: 'Корм', type: 'food', price: 15, description: 'Сбалансированный корм. Эффект: -30 голода.', previewImage: '🥣', modelPath: '', hungerEffect: -30 },
  { id: 'treat', name: 'Лакомство', type: 'food', price: 25, description: 'Праздничное угощение. Эффект: -50 голода.', previewImage: '🦴', modelPath: '', hungerEffect: -50 },
  { id: 'glasses', name: 'Очки', type: 'accessory', price: 50, description: 'Стильные круглые очки.', previewImage: '👓', modelPath: '/models/glasses.glb', attachPoint: 'face' },
  { id: 'hat', name: 'Шапка', type: 'accessory', price: 75, description: 'Тёплая шапка-конус.', previewImage: '🎩', modelPath: '/models/hat.glb', attachPoint: 'head' },
  { id: 'bow', name: 'Бант', type: 'accessory', price: 60, description: 'Милый бант на голову.', previewImage: '🎀', modelPath: '/models/bow.glb', attachPoint: 'head' },
  { id: 'tshirt', name: 'Футболка', type: 'clothes', price: 100, description: 'Яркая футболка для прогулок.', previewImage: '👕', modelPath: '/models/tshirt.glb', attachPoint: 'body' },
  { id: 'pajamas', name: 'Пижама', type: 'clothes', price: 150, description: 'Уютная пижама для сна.', previewImage: '🛌', modelPath: '/models/pajamas.glb', attachPoint: 'body' },
  { id: 'suit', name: 'Костюм', type: 'clothes', price: 200, description: 'Парадный костюм.', previewImage: '🤵', modelPath: '/models/suit.glb', attachPoint: 'body' },
  { id: 'ball', name: 'Мячик', type: 'toy', price: 40, description: 'Повышает настроение во время игры.', previewImage: '⚽', modelPath: '/models/ball.glb', attachPoint: 'paw', moodEffect: 8 },
  { id: 'yarn', name: 'Клубок', type: 'toy', price: 35, description: 'Классическая игрушка.', previewImage: '🧶', modelPath: '/models/yarn.glb', attachPoint: 'paw', moodEffect: 6 },
  { id: 'plush', name: 'Плюшевая игрушка', type: 'toy', price: 80, description: 'Лучший друг питомца.', previewImage: '🧸', modelPath: '/models/plush.glb', attachPoint: 'paw', moodEffect: 10 }
];

export const getItem = (itemId: string) => shopItems.find((item) => item.id === itemId);
export const wearableTypes = new Set(['clothes', 'accessory']);
