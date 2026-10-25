import React, { useMemo } from 'react';
import { PlayerColor, Token } from '../types/ludo';
import {
  COLOR_CONFIG,
  getTokenLocationKey,
  getTokenSvgCoords,
  PERIMETER_PATH,
  SAFE_PERIMETER_INDICES,
  START_INDEX_MAP,
} from '../utils/boardCoordinates';

interface LudoBoardProps {
  tokens: Record<PlayerColor, Token[]>;
  activeTurnColor: PlayerColor;
  validTokenMoves: number[]; // IDs of tokens belonging to active player that can legally move
  onTokenClick: (color: PlayerColor, tokenId: number) => void;
  activePlayers: PlayerColor[];
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  tokens,
  activeTurnColor,
  validTokenMoves,
  onTokenClick,
  activePlayers,
}) => {
  // Pre-calculate token groupings on each cell for smart stacking
  const tokenClusters = useMemo(() => {
    const map = new Map<string, Token[]>();
    activePlayers.forEach((color) => {
      tokens[color].forEach((tok) => {
        const key = getTokenLocationKey(tok);
        const list = map.get(key) || [];
        list.push(tok);
        map.set(key, list);
      });
    });
    return map;
  }, [tokens, activePlayers]);

  // Star path helper (100x100 grid centered at 50,50)
  const renderStar = (cx: number, cy: number, color = '#475569') => (
    <polygon
      points={`
        ${cx},${cy - 28}
        ${cx + 8},${cy - 9}
        ${cx + 28},${cy - 9}
        ${cx + 12},${cy + 4}
        ${cx + 18},${cy + 25}
        ${cx},${cy + 12}
        ${cx - 18},${cy + 25}
        ${cx - 12},${cy + 4}
        ${cx - 28},${cy - 9}
        ${cx - 8},${cy - 9}
      `}
      fill={color}
      opacity="0.85"
    />
  );

  return (
    <div className="relative w-full max-w-[560px] aspect-square mx-auto select-none rounded-2xl p-2 sm:p-3 bg-gradient-to-br from-slate-800 to-slate-950 shadow-2xl border-4 border-slate-700/80">
      <svg
        viewBox="0 0 1500 1500"
        className="w-full h-full rounded-xl overflow-hidden shadow-inner bg-white"
        style={{ shapeRendering: 'geometricPrecision' }}
      >
        <defs>
          {/* Subtle gradients for tokens and board */}
          <radialGradient id="grad-red" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="60%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </radialGradient>
          <radialGradient id="grad-green" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#065F46" />
          </radialGradient>
          <radialGradient id="grad-yellow" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </radialGradient>
          <radialGradient id="grad-blue" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="60%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </radialGradient>

          {/* Token drop shadow */}
          <filter id="token-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* ========================================================
            1. FOUR CORNER BASES (YARDS) - 600x600 each
        ======================================================== */}
        {/* Top-Left: RED YARD */}
        <g>
          <rect x="0" y="0" width="600" height="600" fill={COLOR_CONFIG.red.bgHex} />
          <rect x="100" y="100" width="400" height="400" rx="36" fill="#FFFFFF" />
          {/* 4 Pods */}
          <circle cx="200" cy="200" r="54" fill={COLOR_CONFIG.red.lightHex} stroke={COLOR_CONFIG.red.borderHex} strokeWidth="6" />
          <circle cx="400" cy="200" r="54" fill={COLOR_CONFIG.red.lightHex} stroke={COLOR_CONFIG.red.borderHex} strokeWidth="6" />
          <circle cx="200" cy="400" r="54" fill={COLOR_CONFIG.red.lightHex} stroke={COLOR_CONFIG.red.borderHex} strokeWidth="6" />
          <circle cx="400" cy="400" r="54" fill={COLOR_CONFIG.red.lightHex} stroke={COLOR_CONFIG.red.borderHex} strokeWidth="6" />
        </g>

        {/* Top-Right: GREEN YARD */}
        <g>
          <rect x="900" y="0" width="600" height="600" fill={COLOR_CONFIG.green.bgHex} />
          <rect x="1000" y="100" width="400" height="400" rx="36" fill="#FFFFFF" />
          {/* 4 Pods */}
          <circle cx="1100" cy="200" r="54" fill={COLOR_CONFIG.green.lightHex} stroke={COLOR_CONFIG.green.borderHex} strokeWidth="6" />
          <circle cx="1300" cy="200" r="54" fill={COLOR_CONFIG.green.lightHex} stroke={COLOR_CONFIG.green.borderHex} strokeWidth="6" />
          <circle cx="1100" cy="400" r="54" fill={COLOR_CONFIG.green.lightHex} stroke={COLOR_CONFIG.green.borderHex} strokeWidth="6" />
          <circle cx="1300" cy="400" r="54" fill={COLOR_CONFIG.green.lightHex} stroke={COLOR_CONFIG.green.borderHex} strokeWidth="6" />
        </g>

        {/* Bottom-Right: YELLOW YARD */}
        <g>
          <rect x="900" y="900" width="600" height="600" fill={COLOR_CONFIG.yellow.bgHex} />
          <rect x="1000" y="1000" width="400" height="400" rx="36" fill="#FFFFFF" />
          {/* 4 Pods */}
          <circle cx="1100" cy="1100" r="54" fill={COLOR_CONFIG.yellow.lightHex} stroke={COLOR_CONFIG.yellow.borderHex} strokeWidth="6" />
          <circle cx="1300" cy="1100" r="54" fill={COLOR_CONFIG.yellow.lightHex} stroke={COLOR_CONFIG.yellow.borderHex} strokeWidth="6" />
          <circle cx="1100" cy="1300" r="54" fill={COLOR_CONFIG.yellow.lightHex} stroke={COLOR_CONFIG.yellow.borderHex} strokeWidth="6" />
          <circle cx="1300" cy="1300" r="54" fill={COLOR_CONFIG.yellow.lightHex} stroke={COLOR_CONFIG.yellow.borderHex} strokeWidth="6" />
        </g>

        {/* Bottom-Left: BLUE YARD */}
        <g>
          <rect x="0" y="900" width="600" height="600" fill={COLOR_CONFIG.blue.bgHex} />
          <rect x="100" y="1000" width="400" height="400" rx="36" fill="#FFFFFF" />
          {/* 4 Pods */}
          <circle cx="200" cy="1100" r="54" fill={COLOR_CONFIG.blue.lightHex} stroke={COLOR_CONFIG.blue.borderHex} strokeWidth="6" />
          <circle cx="400" cy="1100" r="54" fill={COLOR_CONFIG.blue.lightHex} stroke={COLOR_CONFIG.blue.borderHex} strokeWidth="6" />
          <circle cx="200" cy="1300" r="54" fill={COLOR_CONFIG.blue.lightHex} stroke={COLOR_CONFIG.blue.borderHex} strokeWidth="6" />
          <circle cx="400" cy="1300" r="54" fill={COLOR_CONFIG.blue.lightHex} stroke={COLOR_CONFIG.blue.borderHex} strokeWidth="6" />
        </g>

        {/* ========================================================
            2. PERIMETER TRACK PATH TILES
        ======================================================== */}
        {PERIMETER_PATH.map((cell, idx) => {
          const isRedStart = idx === START_INDEX_MAP.red;
          const isGreenStart = idx === START_INDEX_MAP.green;
          const isYellowStart = idx === START_INDEX_MAP.yellow;
          const isBlueStart = idx === START_INDEX_MAP.blue;
          const isSafeStar = SAFE_PERIMETER_INDICES.has(idx) && !isRedStart && !isGreenStart && !isYellowStart && !isBlueStart;

          let fill = '#FFFFFF';
          let stroke = '#CBD5E1';

          if (isRedStart) fill = COLOR_CONFIG.red.bgHex;
          else if (isGreenStart) fill = COLOR_CONFIG.green.bgHex;
          else if (isYellowStart) fill = COLOR_CONFIG.yellow.bgHex;
          else if (isBlueStart) fill = COLOR_CONFIG.blue.bgHex;

          const cx = cell.c * 100 + 50;
          const cy = cell.r * 100 + 50;

          return (
            <g key={`track-${idx}`}>
              <rect
                x={cell.c * 100}
                y={cell.r * 100}
                width="100"
                height="100"
                fill={fill}
                stroke={stroke}
                strokeWidth="2"
              />

              {/* Start square indicator star */}
              {(isRedStart || isGreenStart || isYellowStart || isBlueStart) && (
                renderStar(cx, cy, '#FFFFFF')
              )}

              {/* Safe star square indicator */}
              {isSafeStar && renderStar(cx, cy, '#64748B')}
            </g>
          );
        })}

        {/* ========================================================
            3. HOME RUN STRETCHES (5 TILES EACH)
        ======================================================== */}
        {/* Red Home Stretch (Row 7, Cols 1..5) */}
        {[1, 2, 3, 4, 5].map((col) => (
          <rect
            key={`red-stretch-${col}`}
            x={col * 100}
            y={7 * 100}
            width="100"
            height="100"
            fill={COLOR_CONFIG.red.bgHex}
            stroke="#B91C1C"
            strokeWidth="2"
          />
        ))}

        {/* Green Home Stretch (Col 7, Rows 1..5) */}
        {[1, 2, 3, 4, 5].map((row) => (
          <rect
            key={`green-stretch-${row}`}
            x={7 * 100}
            y={row * 100}
            width="100"
            height="100"
            fill={COLOR_CONFIG.green.bgHex}
            stroke="#047857"
            strokeWidth="2"
          />
        ))}

        {/* Yellow Home Stretch (Row 7, Cols 9..13) */}
        {[9, 10, 11, 12, 13].map((col) => (
          <rect
            key={`yellow-stretch-${col}`}
            x={col * 100}
            y={7 * 100}
            width="100"
            height="100"
            fill={COLOR_CONFIG.yellow.bgHex}
            stroke="#B45309"
            strokeWidth="2"
          />
        ))}

        {/* Blue Home Stretch (Col 7, Rows 9..13) */}
        {[9, 10, 11, 12, 13].map((row) => (
          <rect
            key={`blue-stretch-${row}`}
            x={7 * 100}
            y={row * 100}
            width="100"
            height="100"
            fill={COLOR_CONFIG.blue.bgHex}
            stroke="#1D4ED8"
            strokeWidth="2"
          />
        ))}

        {/* ========================================================
            4. CENTER HOME TRIANGLES (300x300 at 600..900)
        ======================================================== */}
        {/* Center boundary */}
        <rect x="600" y="600" width="300" height="300" fill="#F8FAFC" stroke="#64748B" strokeWidth="4" />

        {/* Red Home Triangle (Left) */}
        <polygon points="600,600 750,750 600,900" fill={COLOR_CONFIG.red.bgHex} stroke="#991B1B" strokeWidth="3" />
        {/* Green Home Triangle (Top) */}
        <polygon points="600,600 750,750 900,600" fill={COLOR_CONFIG.green.bgHex} stroke="#065F46" strokeWidth="3" />
        {/* Yellow Home Triangle (Right) */}
        <polygon points="900,600 750,750 900,900" fill={COLOR_CONFIG.yellow.bgHex} stroke="#92400E" strokeWidth="3" />
        {/* Blue Home Triangle (Bottom) */}
        <polygon points="600,900 750,750 900,900" fill={COLOR_CONFIG.blue.bgHex} stroke="#1E40AF" strokeWidth="3" />

        {/* Center Victory Crown / Star Medallion */}
        <circle cx="750" cy="750" r="32" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="4" />
        {renderStar(750, 750, '#EAB308')}

        {/* ========================================================
            5. TOKENS LAYER (WITH MICRO-OFFSETS & ACTIVE HIGHLIGHTS)
        ======================================================== */}
        {activePlayers.flatMap((color) =>
          tokens[color].map((tok) => {
            const locKey = getTokenLocationKey(tok);
            const cluster = tokenClusters.get(locKey) || [tok];
            const clusterIdx = cluster.findIndex((t) => t.color === tok.color && t.id === tok.id);
            const count = cluster.length;

            const baseCoords = getTokenSvgCoords(tok);
            let offsetX = 0;
            let offsetY = 0;
            let radius = 32;

            // Only offset when tokens share a track cell (yard & home already have designated slots)
            if (tok.step >= 0 && tok.step < 56 && count > 1) {
              radius = count === 2 ? 24 : 20;
              if (count === 2) {
                offsetX = clusterIdx === 0 ? -18 : 18;
              } else if (count === 3) {
                if (clusterIdx === 0) offsetY = -16;
                else if (clusterIdx === 1) {
                  offsetX = -16;
                  offsetY = 14;
                } else {
                  offsetX = 16;
                  offsetY = 14;
                }
              } else {
                // 4 tokens
                offsetX = clusterIdx % 2 === 0 ? -16 : 16;
                offsetY = clusterIdx < 2 ? -16 : 16;
              }
            }

            const x = baseCoords.x + offsetX;
            const y = baseCoords.y + offsetY;

            const isCurrentColor = tok.color === activeTurnColor;
            const isValidMove = isCurrentColor && validTokenMoves.includes(tok.id);

            return (
              <g
                key={`tok-${tok.color}-${tok.id}`}
                onClick={isValidMove ? () => onTokenClick(tok.color, tok.id) : undefined}
                className={`transition-all duration-300 ${
                  isValidMove
                    ? 'cursor-pointer hover:opacity-95'
                    : 'cursor-default'
                }`}
                style={{
                  filter: isValidMove
                    ? 'drop-shadow(0 0 10px rgba(234, 179, 8, 0.9))'
                    : 'url(#token-shadow)',
                }}
              >
                {/* Active Highlight Pulse Ring */}
                {isValidMove && (
                  <>
                    <circle
                      cx={x}
                      cy={y}
                      r={radius + 12}
                      fill="none"
                      stroke="#FACC15"
                      strokeWidth="5"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="r"
                        values={`${radius + 6};${radius + 15};${radius + 6}`}
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.9;0.3;0.9"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx={x}
                      cy={y}
                      r={radius + 6}
                      fill="#FEF08A"
                      opacity="0.25"
                    />
                  </>
                )}

                {/* Token Outer Border & Body */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={`url(#grad-${tok.color})`}
                  stroke="#FFFFFF"
                  strokeWidth={isValidMove ? '4' : '3'}
                />

                {/* Inner Decorative Ridge */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius * 0.62}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.65)"
                  strokeWidth="2.5"
                />

                {/* Center Core Pip */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius * 0.28}
                  fill="#FFFFFF"
                  opacity="0.9"
                />

                {/* Token ID Micro-Label */}
                <text
                  x={x}
                  y={y + 3.5}
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize={radius * 0.4}
                  fontWeight="bold"
                  className="pointer-events-none select-none font-mono"
                >
                  {tok.id + 1}
                </text>
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
};
