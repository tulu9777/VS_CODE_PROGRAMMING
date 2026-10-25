import React from 'react';
import { PlayerColor } from '../types/ludo';
import { COLOR_CONFIG } from '../utils/boardCoordinates';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
  currentColor: PlayerColor;
  isAiTurn: boolean;
  language: 'hi' | 'en';
}

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  canRoll,
  onRoll,
  currentColor,
  isAiTurn,
  language,
}) => {
  const colorInfo = COLOR_CONFIG[currentColor];

  // Render dice pips based on number (1 to 6)
  const renderPips = (num: number) => {
    switch (num) {
      case 1:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 place-items-center">
            <span className="col-start-2 row-start-2 w-3.5 h-3.5 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 place-items-center">
            <span className="col-start-1 row-start-1 w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
            <span className="col-start-3 row-start-3 w-3 h-3 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 place-items-center">
            <span className="col-start-1 row-start-1 w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="col-start-2 row-start-2 w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="col-start-3 row-start-3 w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full p-2.5 place-items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 place-items-center">
            <span className="col-start-1 row-start-1 w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="col-start-3 row-start-1 w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="col-start-2 row-start-2 w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="col-start-1 row-start-3 w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="col-start-3 row-start-3 w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      case 6:
        return (
          <div className="grid grid-cols-2 grid-rows-3 w-full h-full px-3 py-1.5 place-items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-sm font-semibold text-slate-400">?</span>
          </div>
        );
    }
  };

  const getButtonText = () => {
    if (isRolling) {
      return language === 'hi' ? 'घूम रहा है...' : 'Rolling...';
    }
    if (isAiTurn) {
      return language === 'hi' ? 'कंप्यूटर की बारी...' : 'Computer thinking...';
    }
    if (!canRoll && value) {
      return language === 'hi' ? 'टोकन चुनें 👆' : 'Select Token 👆';
    }
    return language === 'hi' ? 'पासा फेंकें (Roll)' : 'Roll Dice';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 3D Dice Box */}
      <button
        type="button"
        onClick={canRoll && !isAiTurn ? onRoll : undefined}
        disabled={!canRoll || isAiTurn || isRolling}
        aria-label="Roll Dice"
        className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-slate-200 border-2 border-slate-300 shadow-lg flex items-center justify-center transition-all duration-200 ${
          isRolling
            ? 'animate-spin scale-105 shadow-2xl'
            : canRoll && !isAiTurn
            ? 'cursor-pointer hover:scale-105 active:scale-95 hover:border-slate-400 ring-4 ring-amber-400/30'
            : 'opacity-90 cursor-default'
        }`}
        style={{
          boxShadow: isRolling
            ? `0 12px 24px -4px ${colorInfo.primaryHex}44`
            : undefined,
        }}
      >
        {/* Subtle glossy highlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-transparent to-white/60 pointer-events-none" />

        {/* Dice Face Content */}
        <div className="w-full h-full relative z-10">
          {renderPips(value || 6)}
        </div>

        {/* Number badge when stopped */}
        {value && !isRolling && (
          <div
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md tabular-nums border-2 border-white"
            style={{ backgroundColor: colorInfo.primaryHex }}
          >
            {value}
          </div>
        )}
      </button>

      {/* Action Button */}
      <button
        type="button"
        onClick={canRoll && !isAiTurn ? onRoll : undefined}
        disabled={!canRoll || isAiTurn || isRolling}
        className={`w-full py-2.5 px-5 rounded-xl font-semibold text-sm tracking-wide text-white shadow-md transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2 ${
          canRoll && !isAiTurn
            ? 'cursor-pointer active:scale-98 hover:shadow-lg ring-2 ring-white/50'
            : 'opacity-60 cursor-not-allowed shadow-none'
        }`}
        style={{
          backgroundColor: canRoll && !isAiTurn ? colorInfo.primaryHex : '#64748B',
        }}
      >
        <span>{getButtonText()}</span>
        {canRoll && !isAiTurn && (
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-mono bg-black/20 rounded text-white/90">
            Space
          </kbd>
        )}
      </button>
    </div>
  );
};
