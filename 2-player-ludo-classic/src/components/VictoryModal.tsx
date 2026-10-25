import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw } from 'lucide-react';
import { Player, PlayerColor } from '../types/ludo';
import { COLOR_CONFIG } from '../utils/boardCoordinates';

interface VictoryModalProps {
  winner: PlayerColor;
  players: Player[];
  onPlayAgain: () => void;
  language: 'hi' | 'en';
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  players,
  onPlayAgain,
  language,
}) => {
  const winnerPlayer = players.find((p) => p.color === winner);
  const colorInfo = COLOR_CONFIG[winner];

  useEffect(() => {
    // Launch celebratory confetti bursts
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#EF4444', '#10B981', '#F59E0B', '#3B82F6'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#EF4444', '#10B981', '#F59E0B', '#3B82F6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 text-center text-slate-100 shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: colorInfo.primaryHex }}
        />

        {/* Trophy icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl mb-4 border-2 border-white/60">
          <Trophy className="w-10 h-10" />
        </div>

        <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">
          {language === 'hi' ? 'विजेता घोषित!' : 'CHAMPION!'}
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
          {winnerPlayer?.name || (language === 'hi' ? colorInfo.nameHi : colorInfo.nameEn)}
        </h2>

        <p className="text-sm text-slate-300 mt-2">
          {language === 'hi'
            ? 'बधाई हो! आपने सभी टोकनों को सफलतापूर्वक घर पहुंचा दिया है।'
            : 'Congratulations! All target tokens have safely reached Home.'}
        </p>

        {/* Play Again Action Button */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया खेल शुरू करें (Play Again)' : 'Play Again'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
