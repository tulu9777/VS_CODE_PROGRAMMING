import { CellCoord, PlayerColor, Token } from '../types/ludo';

/**
 * 52 Perimeter track tiles in clockwise sequence starting from Red start.
 */
export const PERIMETER_PATH: CellCoord[] = [
  /*  0 */ { r: 6, c: 1 },  // Red Start [SAFE]
  /*  1 */ { r: 6, c: 2 },
  /*  2 */ { r: 6, c: 3 },
  /*  3 */ { r: 6, c: 4 },
  /*  4 */ { r: 6, c: 5 },
  /*  5 */ { r: 5, c: 6 },
  /*  6 */ { r: 4, c: 6 },
  /*  7 */ { r: 3, c: 6 },
  /*  8 */ { r: 2, c: 6 },  // Safe Star [SAFE]
  /*  9 */ { r: 1, c: 6 },
  /* 10 */ { r: 0, c: 6 },
  /* 11 */ { r: 0, c: 7 },
  /* 12 */ { r: 0, c: 8 },
  /* 13 */ { r: 1, c: 8 },  // Green Start [SAFE]
  /* 14 */ { r: 2, c: 8 },
  /* 15 */ { r: 3, c: 8 },
  /* 16 */ { r: 4, c: 8 },
  /* 17 */ { r: 5, c: 8 },
  /* 18 */ { r: 6, c: 9 },
  /* 19 */ { r: 6, c: 10 },
  /* 20 */ { r: 6, c: 11 },
  /* 21 */ { r: 6, c: 12 }, // Safe Star [SAFE]
  /* 22 */ { r: 6, c: 13 },
  /* 23 */ { r: 6, c: 14 },
  /* 24 */ { r: 7, c: 14 },
  /* 25 */ { r: 8, c: 14 },
  /* 26 */ { r: 8, c: 13 }, // Yellow Start [SAFE]
  /* 27 */ { r: 8, c: 12 },
  /* 28 */ { r: 8, c: 11 },
  /* 29 */ { r: 8, c: 10 },
  /* 30 */ { r: 8, c: 9 },
  /* 31 */ { r: 9, c: 8 },
  /* 32 */ { r: 10, c: 8 },
  /* 33 */ { r: 11, c: 8 },
  /* 34 */ { r: 12, c: 8 }, // Safe Star [SAFE]
  /* 35 */ { r: 13, c: 8 },
  /* 36 */ { r: 14, c: 8 },
  /* 37 */ { r: 14, c: 7 },
  /* 38 */ { r: 14, c: 6 },
  /* 39 */ { r: 13, c: 6 }, // Blue Start [SAFE]
  /* 40 */ { r: 12, c: 6 },
  /* 41 */ { r: 11, c: 6 },
  /* 42 */ { r: 10, c: 6 },
  /* 43 */ { r: 9, c: 6 },
  /* 44 */ { r: 8, c: 5 },
  /* 45 */ { r: 8, c: 4 },
  /* 46 */ { r: 8, c: 3 },
  /* 47 */ { r: 8, c: 2 },  // Safe Star [SAFE]
  /* 48 */ { r: 8, c: 1 },
  /* 49 */ { r: 8, c: 0 },
  /* 50 */ { r: 7, c: 0 },
  /* 51 */ { r: 6, c: 0 },
];

export const START_INDEX_MAP: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

export const SAFE_PERIMETER_INDICES = new Set<number>([0, 8, 13, 21, 26, 34, 39, 47]);

export const HOME_STRETCH_PATHS: Record<PlayerColor, CellCoord[]> = {
  red: [
    { r: 7, c: 1 },
    { r: 7, c: 2 },
    { r: 7, c: 3 },
    { r: 7, c: 4 },
    { r: 7, c: 5 },
  ],
  green: [
    { r: 1, c: 7 },
    { r: 2, c: 7 },
    { r: 3, c: 7 },
    { r: 4, c: 7 },
    { r: 5, c: 7 },
  ],
  yellow: [
    { r: 7, c: 13 },
    { r: 7, c: 12 },
    { r: 7, c: 11 },
    { r: 7, c: 10 },
    { r: 7, c: 9 },
  ],
  blue: [
    { r: 13, c: 7 },
    { r: 12, c: 7 },
    { r: 11, c: 7 },
    { r: 10, c: 7 },
    { r: 9, c: 7 },
  ],
};

/**
 * Yard pod centers in SVG 1500x1500 space (each yard is 600x600)
 */
export const YARD_POSITIONS: Record<PlayerColor, { x: number; y: number }[]> = {
  red: [
    { x: 200, y: 200 },
    { x: 400, y: 200 },
    { x: 200, y: 400 },
    { x: 400, y: 400 },
  ],
  green: [
    { x: 1100, y: 200 },
    { x: 1300, y: 200 },
    { x: 1100, y: 400 },
    { x: 1300, y: 400 },
  ],
  yellow: [
    { x: 1100, y: 1100 },
    { x: 1300, y: 1100 },
    { x: 1100, y: 1300 },
    { x: 1300, y: 1300 },
  ],
  blue: [
    { x: 200, y: 1100 },
    { x: 400, y: 1100 },
    { x: 200, y: 1300 },
    { x: 400, y: 1300 },
  ],
};

/**
 * Positions inside Home center for finished tokens (step = 56)
 */
export const HOME_SLOT_POSITIONS: Record<PlayerColor, { x: number; y: number }[]> = {
  red: [
    { x: 670, y: 720 },
    { x: 670, y: 780 },
    { x: 630, y: 750 },
    { x: 710, y: 750 },
  ],
  green: [
    { x: 720, y: 670 },
    { x: 780, y: 670 },
    { x: 750, y: 630 },
    { x: 750, y: 710 },
  ],
  yellow: [
    { x: 830, y: 720 },
    { x: 830, y: 780 },
    { x: 870, y: 750 },
    { x: 790, y: 750 },
  ],
  blue: [
    { x: 720, y: 830 },
    { x: 780, y: 830 },
    { x: 750, y: 870 },
    { x: 750, y: 790 },
  ],
};

/**
 * Returns absolute SVG pixel coordinates (x, y in 0..1500) for a given token state.
 */
export function getTokenSvgCoords(token: Token): { x: number; y: number } {
  if (token.step === -1) {
    return YARD_POSITIONS[token.color][token.id];
  }

  if (token.step === 56) {
    return HOME_SLOT_POSITIONS[token.color][token.id];
  }

  if (token.step <= 50) {
    const startIdx = START_INDEX_MAP[token.color];
    const pathIdx = (startIdx + token.step) % 52;
    const cell = PERIMETER_PATH[pathIdx];
    return {
      x: cell.c * 100 + 50,
      y: cell.r * 100 + 50,
    };
  }

  // Home stretch steps 51..55
  const stretchIdx = token.step - 51;
  const cell = HOME_STRETCH_PATHS[token.color][stretchIdx];
  return {
    x: cell.c * 100 + 50,
    y: cell.r * 100 + 50,
  };
}

/**
 * Returns unique string key for a board location (e.g., 'track-12', 'stretch-red-2', 'home-red', 'yard-red-0')
 */
export function getTokenLocationKey(token: Token): string {
  if (token.step === -1) return `yard-${token.color}-${token.id}`;
  if (token.step === 56) return `home-${token.color}-${token.id}`;
  if (token.step <= 50) {
    const startIdx = START_INDEX_MAP[token.color];
    const pathIdx = (startIdx + token.step) % 52;
    return `track-${pathIdx}`;
  }
  return `stretch-${token.color}-${token.step - 51}`;
}

export const COLOR_CONFIG: Record<
  PlayerColor,
  {
    nameEn: string;
    nameHi: string;
    bgHex: string;
    borderHex: string;
    primaryHex: string;
    lightHex: string;
    hoverHex: string;
    tokenGradientStart: string;
    tokenGradientEnd: string;
    label: string;
  }
> = {
  red: {
    nameEn: 'Red',
    nameHi: 'लाल',
    bgHex: '#EF4444',
    borderHex: '#B91C1C',
    primaryHex: '#DC2626',
    lightHex: '#FEE2E2',
    hoverHex: '#B91C1C',
    tokenGradientStart: '#F87171',
    tokenGradientEnd: '#991B1B',
    label: 'खिलाड़ी 1 (लाल)',
  },
  green: {
    nameEn: 'Green',
    nameHi: 'हरा',
    bgHex: '#10B981',
    borderHex: '#047857',
    primaryHex: '#059669',
    lightHex: '#D1FAE5',
    hoverHex: '#047857',
    tokenGradientStart: '#34D399',
    tokenGradientEnd: '#065F46',
    label: 'खिलाड़ी 2 (हरा)',
  },
  yellow: {
    nameEn: 'Yellow',
    nameHi: 'पीला',
    bgHex: '#F59E0B',
    borderHex: '#B45309',
    primaryHex: '#D97706',
    lightHex: '#FEF3C7',
    hoverHex: '#B45309',
    tokenGradientStart: '#FBBF24',
    tokenGradientEnd: '#92400E',
    label: 'खिलाड़ी 2 (पीला)',
  },
  blue: {
    nameEn: 'Blue',
    nameHi: 'नीला',
    bgHex: '#3B82F6',
    borderHex: '#1D4ED8',
    primaryHex: '#2563EB',
    lightHex: '#DBEAFE',
    hoverHex: '#1D4ED8',
    tokenGradientStart: '#60A5FA',
    tokenGradientEnd: '#1E40AF',
    label: 'खिलाड़ी 2 (नीला)',
  },
};
