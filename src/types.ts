export type GameMode = 'classic' | 'time';

export interface BlockData {
  id: string;
  value: number;
  row: number;
  col: number;
}

export interface GameState {
  grid: (BlockData | null)[][];
  target: number;
  score: number;
  selectedIds: string[];
  isGameOver: boolean;
  mode: GameMode;
  timeLeft: number;
  level: number;
}

export const GRID_COLS = 6;
export const GRID_ROWS = 10;
export const INITIAL_ROWS = 4;
export const TIME_LIMIT = 15; // seconds per round in time mode
