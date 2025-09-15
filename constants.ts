import type { Tetrominos } from './types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOS: Tetrominos = {
  '0': { shape: [[0]], color: 'bg-transparent' }, // Represents an empty cell
  'I': {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: 'bg-cyan-400',
  },
  'O': {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 'bg-yellow-400',
  },
  'T': {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-purple-600',
  },
  'L': {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: 'bg-orange-500',
  },
  'J': {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: 'bg-blue-500',
  },
  'S': {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: 'bg-green-500',
  },
  'Z': {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-red-500',
  },
};
