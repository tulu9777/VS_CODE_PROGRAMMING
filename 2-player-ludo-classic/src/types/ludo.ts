export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  isAi: boolean;
}

export interface Token {
  id: number; // 0..3
  color: PlayerColor;
  /**
   * step:
   * -1: in Yard (base)
   * 0: on Start tile
   * 1..50: along the 52-tile perimeter track
   * 51..55: on colored home stretch
   * 56: inside Home (finished)
   */
  step: number;
}

export type GameMode = 'passAndPlay' | 'vsComputer';
export type TargetTokens = 2 | 4; // 2 for Quick match, 4 for Classic

export interface GameState {
  players: Player[];
  tokens: Record<PlayerColor, Token[]>;
  currentTurnColor: PlayerColor;
  diceValue: number | null;
  isRolling: boolean;
  consecutiveSixes: number;
  hasRolledThisTurn: boolean;
  validTokenMoves: number[]; // token IDs that can legally move
  winner: PlayerColor | null;
  statusMessage: string;
  history: GameLogEntry[];
  mode: GameMode;
  targetTokens: TargetTokens;
}

export interface GameLogEntry {
  id: string;
  color: PlayerColor;
  message: string;
  timestamp: number;
  highlight?: 'roll' | 'capture' | 'home' | 'bonus' | 'win';
}

export interface CellCoord {
  r: number; // 0..14
  c: number; // 0..14
}
