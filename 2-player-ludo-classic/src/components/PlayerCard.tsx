import React from 'react';
import { Player, PlayerColor, Token } from '../types/ludo';
import { COLOR_CONFIG } from '../utils/boardCoordinates';

interface PlayerCardProps {
  player: Player;
  tokens: Token[];
  isActive: boolean;
  targetTokens: number;
  language: 'hi' | 'en';
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  tokens,
  isActive,
  targetTokens,
  language,
}) => {
  const colorInfo = COLOR_CONFIG[player.color];

  const inYard = tokens.filter((t) => t.step === -1).length;
  const onTrack = tokens.filter((t) => t.step >= 0 && t.step < 56).length;
  const inHome = tokens.filter((t) => t.step === 56).length;

  const progressPercent = Math.min(100, Math.round((inHome / targetTokens) * 100));

  return (
    <div
      className={`relative p-4 rounded-2xl transition-all duration-300 border ${
        isActive
          ? 'bg-slate-900 border-amber-400/80 shadow-lg ring-2 ring-amber-400/20'
          : 'bg-slate-900/60 border-slate-800 shadow-sm opacity-85'
      }`}
    >
      {/* Active turn indicator bar */}
      <div
        className="absolute top-0 left-4 right-4 h-1 rounded-b-full transition-opacity"
        style={{
          backgroundColor: colorInfo.primaryHex,
          opacity: isActive ? 1 : 0.25,
        }}
      />

      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {/* Color circular token insignia */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white/60"
            style={{ backgroundColor: colorInfo.primaryHex }}
          >
            {player.color.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5 leading-tight">
              <span>{player.name}</span>
              {player.isAi && (
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  AI
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi' ? colorInfo.nameHi : colorInfo.nameEn}
            </p>
          </div>
        </div>

        {/* Turn indicator */}
        {isActive ? (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/30 whitespace-nowrap animate-pulse">
            {language === 'hi' ? 'आपकी बारी' : 'Active Turn'}
          </span>
        ) : (
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {language === 'hi' ? 'प्रतीक्षा...' : 'Waiting'}
          </span>
        )}
      </div>

      {/* Token Distribution Metrics */}
      <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">
            {language === 'hi' ? 'बेस' : 'Base'}
          </span>
          <span className="font-bold font-mono text-slate-200 tabular-nums">
            {inYard}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">
            {language === 'hi' ? 'मैदान' : 'Track'}
          </span>
          <span className="font-bold font-mono text-amber-400 tabular-nums">
            {onTrack}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">
            {language === 'hi' ? 'घर' : 'Home'}
          </span>
          <span className="font-bold font-mono text-emerald-400 tabular-nums">
            {inHome}/{targetTokens}
          </span>
        </div>
      </div>

      {/* Progress to victory */}
      <div className="mt-3">
        <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
          <span>{language === 'hi' ? 'जीत की प्रगति' : 'Progress'}</span>
          <span className="font-mono tabular-nums text-slate-300 font-medium">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: colorInfo.primaryHex,
            }}
          />
        </div>
      </div>
    </div>
  );
};
