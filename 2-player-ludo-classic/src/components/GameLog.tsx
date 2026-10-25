import React, { useRef, useEffect } from 'react';
import { GameLogEntry } from '../types/ludo';
import { COLOR_CONFIG } from '../utils/boardCoordinates';

interface GameLogProps {
  entries: GameLogEntry[];
  language: 'hi' | 'en';
}

export const GameLog: React.FC<GameLogProps> = ({ entries, language }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col h-40">
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-xs">
        <span className="font-semibold text-slate-300">
          {language === 'hi' ? 'खेल की हलचल (Game Feed)' : 'Match Activity'}
        </span>
        <span className="text-[10px] text-slate-500 font-mono tabular-nums">
          {entries.length} {language === 'hi' ? 'चालें' : 'moves'}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin text-xs"
      >
        {entries.length === 0 ? (
          <p className="text-slate-500 text-center py-6 text-xs italic">
            {language === 'hi'
              ? 'पासा फेंक कर खेल शुरू करें...'
              : 'Roll the dice to start the match...'}
          </p>
        ) : (
          entries.map((entry) => {
            const colorInfo = COLOR_CONFIG[entry.color];
            return (
              <div
                key={entry.id}
                className="flex items-start gap-2 py-0.5 leading-snug text-slate-300"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: colorInfo.primaryHex }}
                />
                <span className="flex-1">{entry.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
