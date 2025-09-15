export type TetrominoKey = '0' | 'I' | 'O' | 'T' | 'L' | 'J' | 'S' | 'Z';

export type Board = TetrominoKey[][];

export type Player = {
  pos: { x: number; y: number };
  tetromino: number[][];
  shape: TetrominoKey;
  collided: boolean;
};

export type Tetromino = {
  shape: number[][];
  color: string; // Tailwind bg color class
};

export type Tetrominos = {
  [key in TetrominoKey]: Tetromino;
};
