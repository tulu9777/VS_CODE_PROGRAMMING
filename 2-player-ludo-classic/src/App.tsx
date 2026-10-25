/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  HelpCircle,
  RotateCcw,
  Users,
  Bot,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { GameMode, Player, PlayerColor, TargetTokens, Token, GameLogEntry } from './types/ludo';
import { LudoBoard } from './components/LudoBoard';
import { Dice } from './components/Dice';
import { PlayerCard } from './components/PlayerCard';
import { GameLog } from './components/GameLog';
import { RulesModal } from './components/RulesModal';
import { VictoryModal } from './components/VictoryModal';
import {
  COLOR_CONFIG,
  PERIMETER_PATH,
  SAFE_PERIMETER_INDICES,
  START_INDEX_MAP,
} from './utils/boardCoordinates';
import {
  isSoundEnabled,
  playCaptureSound,
  playClickSound,
  playDiceRollSound,
  playHomeSound,
  playTokenMoveSound,
  playTokenSpawnSound,
  playVictoryFanfare,
  toggleSound,
} from './utils/audio';

const INITIAL_TOKENS = (colors: PlayerColor[]): Record<PlayerColor, Token[]> => {
  const allColors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
  const res = {} as Record<PlayerColor, Token[]>;
  allColors.forEach((c) => {
    res[c] = [
      { id: 0, color: c, step: -1 },
      { id: 1, color: c, step: -1 },
      { id: 2, color: c, step: -1 },
      { id: 3, color: c, step: -1 },
    ];
  });
  return res;
};

export default function App() {
  // Game Setup State
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [showRules, setShowRules] = useState<boolean>(false);

  const [mode, setMode] = useState<GameMode>('passAndPlay');
  const [targetTokens, setTargetTokens] = useState<TargetTokens>(4);
  const [p2Color, setP2Color] = useState<PlayerColor>('yellow'); // Red vs Yellow is classic diagonal

  // Active Players: Player 1 (Red) and Player 2 (Yellow / Green / Blue)
  const players: Player[] = useMemo(() => {
    return [
      {
        id: 'p1',
        name: language === 'hi' ? 'खिलाड़ी 1' : 'Player 1',
        color: 'red',
        isAi: false,
      },
      {
        id: 'p2',
        name:
          mode === 'vsComputer'
            ? language === 'hi'
              ? 'कंप्यूटर'
              : 'Computer'
            : language === 'hi'
            ? 'खिलाड़ी 2'
            : 'Player 2',
        color: p2Color,
        isAi: mode === 'vsComputer',
      },
    ];
  }, [language, mode, p2Color]);

  const activeColors = useMemo(() => players.map((p) => p.color), [players]);

  // Core Play State
  const [tokens, setTokens] = useState<Record<PlayerColor, Token[]>>(() =>
    INITIAL_TOKENS(activeColors)
  );
  const [currentTurnColor, setCurrentTurnColor] = useState<PlayerColor>('red');
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolledThisTurn, setHasRolledThisTurn] = useState<boolean>(false);
  const [consecutiveSixes, setConsecutiveSixes] = useState<number>(0);
  const [validTokenMoves, setValidTokenMoves] = useState<number[]>([]);
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    'खेल शुरू हुआ! खिलाड़ी 1 (लाल) पासा फेंकें।'
  );
  const [history, setHistory] = useState<GameLogEntry[]>([]);

  // Current Player info
  const currentPlayer = useMemo(
    () => players.find((p) => p.color === currentTurnColor) || players[0],
    [players, currentTurnColor]
  );
  const isAiTurn = currentPlayer.isAi;

  // Add Log Entry
  const addLog = useCallback(
    (color: PlayerColor, message: string, highlight?: GameLogEntry['highlight']) => {
      setHistory((prev) => [
        ...prev.slice(-30),
        {
          id: `${Date.now()}-${Math.random()}`,
          color,
          message,
          timestamp: Date.now(),
          highlight,
        },
      ]);
    },
    []
  );

  // Reset Game
  const resetGame = useCallback(() => {
    setTokens(INITIAL_TOKENS(activeColors));
    setCurrentTurnColor('red');
    setDiceValue(null);
    setIsRolling(false);
    setHasRolledThisTurn(false);
    setConsecutiveSixes(0);
    setValidTokenMoves([]);
    setWinner(null);
    setStatusMessage(
      language === 'hi'
        ? 'नया खेल शुरू हुआ! खिलाड़ी 1 (लाल) पासा फेंकें।'
        : 'New match started! Player 1 (Red) roll dice.'
    );
    setHistory([]);
  }, [activeColors, language]);

  // Calculate valid moves for current player
  const calculateValidMoves = useCallback(
    (color: PlayerColor, roll: number, currentTokens: Record<PlayerColor, Token[]>): number[] => {
      const playerToks = currentTokens[color];
      const valids: number[] = [];

      playerToks.forEach((tok) => {
        // In base
        if (tok.step === -1) {
          if (roll === 6) {
            valids.push(tok.id);
          }
        } else if (tok.step < 56) {
          // On track or stretch: must not overshoot 56
          if (tok.step + roll <= 56) {
            valids.push(tok.id);
          }
        }
      });

      return valids;
    },
    []
  );

  // Move a token handler
  const executeTokenMove = useCallback(
    (color: PlayerColor, tokenId: number) => {
      if (winner || !diceValue || !hasRolledThisTurn || color !== currentTurnColor) return;

      const roll = diceValue;
      let targetStep = -1;
      let isSpawned = false;
      let isCapture = false;
      let isHome = false;

      setTokens((prev) => {
        const nextTokens = { ...prev };
        const playerToks = [...nextTokens[color]];
        const currentTok = playerToks.find((t) => t.id === tokenId);
        if (!currentTok) return prev;

        if (currentTok.step === -1 && roll === 6) {
          targetStep = 0;
          isSpawned = true;
        } else {
          targetStep = currentTok.step + roll;
        }

        playerToks[tokenId] = {
          ...currentTok,
          step: targetStep,
        };
        nextTokens[color] = playerToks;

        // Check capture on perimeter track
        if (targetStep >= 0 && targetStep <= 50) {
          const myStart = START_INDEX_MAP[color];
          const trackIdx = (myStart + targetStep) % 52;

          // Only non-safe cells allow capture
          if (!SAFE_PERIMETER_INDICES.has(trackIdx)) {
            // Check opponent
            const otherPlayer = players.find((p) => p.color !== color);
            if (otherPlayer) {
              const oppColor = otherPlayer.color;
              const oppToks = [...nextTokens[oppColor]];
              const oppStart = START_INDEX_MAP[oppColor];

              let capturedAny = false;
              oppToks.forEach((ot, idx) => {
                if (ot.step >= 0 && ot.step <= 50) {
                  const oppTrackIdx = (oppStart + ot.step) % 52;
                  if (oppTrackIdx === trackIdx) {
                    // Send back to yard!
                    oppToks[idx] = { ...ot, step: -1 };
                    capturedAny = true;
                  }
                }
              });

              if (capturedAny) {
                isCapture = true;
                nextTokens[oppColor] = oppToks;
              }
            }
          }
        }

        if (targetStep === 56) {
          isHome = true;
        }

        return nextTokens;
      });

      // Audio & Logging
      const playerName = currentPlayer.name;
      if (isSpawned) {
        playTokenSpawnSound();
        addLog(
          color,
          language === 'hi'
            ? `${playerName} ने टोकन #${tokenId + 1} बाहर निकाला`
            : `${playerName} released token #${tokenId + 1}`,
          'bonus'
        );
      } else if (isCapture) {
        playCaptureSound();
        addLog(
          color,
          language === 'hi'
            ? `💥 ${playerName} ने विरोधी का टोकन काटा! अतिरिक्त चाल मिली!`
            : `💥 ${playerName} captured opponent's token! Bonus roll awarded!`,
          'capture'
        );
      } else if (isHome) {
        playHomeSound();
        addLog(
          color,
          language === 'hi'
            ? `🎯 ${playerName} का टोकन #${tokenId + 1} घर पहुंचा! अतिरिक्त चाल मिली!`
            : `🎯 ${playerName}'s token #${tokenId + 1} reached Home! Bonus roll awarded!`,
          'home'
        );
      } else {
        playTokenMoveSound();
        addLog(
          color,
          language === 'hi'
            ? `${playerName} ने टोकन #${tokenId + 1} को ${roll} कदम आगे बढ़ाया`
            : `${playerName} moved token #${tokenId + 1} forward by ${roll}`
        );
      }

      // Check Victory Condition
      // Re-read tokens for victory check
      setTimeout(() => {
        setTokens((currTokens) => {
          const homeCount = currTokens[color].filter((t) => t.step === 56).length;
          if (homeCount >= targetTokens) {
            setWinner(color);
            playVictoryFanfare();
            addLog(
              color,
              language === 'hi'
                ? `🏆 ${playerName} ने खेल जीत लिया!`
                : `🏆 ${playerName} won the match!`,
              'win'
            );
            return currTokens;
          }

          // Bonus roll check:
          // Rolling a 6 (when consecutive < 3), OR capturing opponent, OR reaching home grants bonus roll!
          const earnsBonus = (roll === 6 && consecutiveSixes < 3) || isCapture || isHome;

          if (earnsBonus) {
            setDiceValue(null);
            setHasRolledThisTurn(false);
            setValidTokenMoves([]);
            setStatusMessage(
              language === 'hi'
                ? `अतिरिक्त चाल! ${playerName} फिर से पासा फेंकें।`
                : `Bonus Roll! ${playerName} roll again.`
            );
          } else {
            // Pass turn to next player
            const nextPlayer = players.find((p) => p.color !== color) || players[0];
            setCurrentTurnColor(nextPlayer.color);
            setDiceValue(null);
            setHasRolledThisTurn(false);
            setConsecutiveSixes(0);
            setValidTokenMoves([]);
            setStatusMessage(
              language === 'hi'
                ? `${nextPlayer.name} की बारी! पासा फेंकें।`
                : `${nextPlayer.name}'s turn! Roll dice.`
            );
          }

          return currTokens;
        });
      }, 50);
    },
    [
      winner,
      diceValue,
      hasRolledThisTurn,
      currentTurnColor,
      currentPlayer.name,
      addLog,
      language,
      targetTokens,
      players,
      consecutiveSixes,
    ]
  );

  // Roll Dice Trigger
  const handleRollDice = useCallback(() => {
    if (isRolling || hasRolledThisTurn || winner) return;

    setIsRolling(true);
    playDiceRollSound();

    const rollDuration = 550;
    setTimeout(() => {
      const rolledNum = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolledNum);
      setIsRolling(false);
      setHasRolledThisTurn(true);

      const playerName = currentPlayer.name;
      addLog(
        currentTurnColor,
        language === 'hi'
          ? `${playerName} ने ${rolledNum} फेंका`
          : `${playerName} rolled ${rolledNum}`,
        'roll'
      );

      // Check consecutive sixes
      let newConsecutive = 0;
      if (rolledNum === 6) {
        newConsecutive = consecutiveSixes + 1;
        setConsecutiveSixes(newConsecutive);

        if (newConsecutive === 3) {
          // Three sixes rule: cancels turn
          addLog(
            currentTurnColor,
            language === 'hi'
              ? `लगातार तीन बार 6 आने पर चाल रद्द हो गई!`
              : `Three consecutive 6s! Turn passed!`,
            'bonus'
          );
          setStatusMessage(
            language === 'hi'
              ? `लगातार तीन 6! चाल रद्द हो गई।`
              : `Three 6s! Turn passed.`
          );
          setTimeout(() => {
            const nextPlayer = players.find((p) => p.color !== currentTurnColor) || players[0];
            setCurrentTurnColor(nextPlayer.color);
            setDiceValue(null);
            setHasRolledThisTurn(false);
            setConsecutiveSixes(0);
            setValidTokenMoves([]);
            setStatusMessage(
              language === 'hi'
                ? `${nextPlayer.name} की बारी! पासा फेंकें।`
                : `${nextPlayer.name}'s turn! Roll dice.`
            );
          }, 1100);
          return;
        }
      } else {
        setConsecutiveSixes(0);
      }

      // Compute legal moves
      const legalTokens = calculateValidMoves(currentTurnColor, rolledNum, tokens);
      setValidTokenMoves(legalTokens);

      if (legalTokens.length === 0) {
        // No valid moves
        setStatusMessage(
          language === 'hi'
            ? `${rolledNum} आया, पर कोई चाल संभव नहीं। बारी आगे बढ़ रही है...`
            : `Rolled ${rolledNum}, but no legal moves. Passing turn...`
        );
        setTimeout(() => {
          const nextPlayer = players.find((p) => p.color !== currentTurnColor) || players[0];
          setCurrentTurnColor(nextPlayer.color);
          setDiceValue(null);
          setHasRolledThisTurn(false);
          setConsecutiveSixes(0);
          setValidTokenMoves([]);
          setStatusMessage(
            language === 'hi'
              ? `${nextPlayer.name} की बारी! पासा फेंकें।`
              : `${nextPlayer.name}'s turn! Roll dice.`
          );
        }, 1100);
      } else if (legalTokens.length === 1 && !currentPlayer.isAi) {
        // Single legal move: highlight and allow quick auto-move after gentle delay or manual tap
        setStatusMessage(
          language === 'hi'
            ? `टोकन #${legalTokens[0] + 1} को आगे बढ़ाएं (टैप करें)`
            : `Move token #${legalTokens[0] + 1} (tap to move)`
        );
      } else {
        setStatusMessage(
          language === 'hi'
            ? `चुनें कौन सा टोकन आगे बढ़ाना है (${legalTokens.length} विकल्प)`
            : `Select a token to move (${legalTokens.length} options)`
        );
      }
    }, rollDuration);
  }, [
    isRolling,
    hasRolledThisTurn,
    winner,
    currentPlayer.name,
    currentPlayer.isAi,
    currentTurnColor,
    addLog,
    language,
    consecutiveSixes,
    calculateValidMoves,
    tokens,
    players,
  ]);

  // AI Turn Bot Engine
  useEffect(() => {
    if (!isAiTurn || winner || isRolling) return;

    if (!hasRolledThisTurn) {
      // AI rolls dice after a deliberate human-like pause
      const timer = setTimeout(() => {
        handleRollDice();
      }, 700);
      return () => clearTimeout(timer);
    }

    if (hasRolledThisTurn && validTokenMoves.length > 0 && diceValue) {
      // AI chooses best tactical move
      const timer = setTimeout(() => {
        const roll = diceValue;
        const myToks = tokens[currentTurnColor];
        const myStart = START_INDEX_MAP[currentTurnColor];

        // Opponent info
        const opp = players.find((p) => p.color !== currentTurnColor)!;
        const oppToks = tokens[opp.color];
        const oppStart = START_INDEX_MAP[opp.color];

        let bestTokenId = validTokenMoves[0];
        let bestScore = -999;

        validTokenMoves.forEach((id) => {
          const tok = myToks[id];
          let score = 0;

          // Target step
          const nextStep = tok.step === -1 ? 0 : tok.step + roll;

          // 1. Can capture opponent token? Highest priority (+100)
          if (nextStep >= 0 && nextStep <= 50) {
            const trackIdx = (myStart + nextStep) % 52;
            if (!SAFE_PERIMETER_INDICES.has(trackIdx)) {
              const canCapture = oppToks.some((ot) => {
                if (ot.step >= 0 && ot.step <= 50) {
                  return (oppStart + ot.step) % 52 === trackIdx;
                }
                return false;
              });
              if (canCapture) score += 100;
            }
          }

          // 2. Can enter home? High priority (+80)
          if (nextStep === 56) score += 80;

          // 3. Release from base? (+60)
          if (tok.step === -1 && roll === 6) score += 60;

          // 4. Land on safe spot? (+40)
          if (nextStep >= 0 && nextStep <= 50) {
            const trackIdx = (myStart + nextStep) % 52;
            if (SAFE_PERIMETER_INDICES.has(trackIdx)) score += 40;
          }

          // 5. Escaping danger (opponent is right behind)? (+30)
          if (tok.step >= 0 && tok.step <= 50) {
            const curTrackIdx = (myStart + tok.step) % 52;
            if (!SAFE_PERIMETER_INDICES.has(curTrackIdx)) {
              score += 25;
            }
          }

          // 6. Forward advancement preference
          score += nextStep * 0.5;

          if (score > bestScore) {
            bestScore = score;
            bestTokenId = id;
          }
        });

        executeTokenMove(currentTurnColor, bestTokenId);
      }, 750);

      return () => clearTimeout(timer);
    }
  }, [
    isAiTurn,
    winner,
    isRolling,
    hasRolledThisTurn,
    validTokenMoves,
    diceValue,
    handleRollDice,
    executeTokenMove,
    tokens,
    currentTurnColor,
    players,
  ]);

  // Keyboard shortcut listener (Space to roll dice)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (!isRolling && !hasRolledThisTurn && !winner && !isAiTurn) {
          handleRollDice();
        }
      }
      if (e.key === 'm' || e.key === 'M') {
        const updated = toggleSound();
        setSoundOn(updated);
      }
      if (e.key === 'r' || e.key === 'R') {
        setShowRules((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRolling, hasRolledThisTurn, winner, isAiTurn, handleRollDice]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* ========================================================
          1. HEADER (Top Bar Contract: 3 Zones)
      ======================================================== */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Brand title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-500 via-amber-400 to-emerald-500 flex items-center justify-center shadow-md">
              <span className="font-extrabold text-sm text-slate-950">L</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-none whitespace-nowrap">
                2-Player Ludo Classic
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                {language === 'hi' ? 'दो खिलाड़ियों का लूडो' : 'Pass & Play Board'}
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation & Quick Actions */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-slate-300">
            {/* Mode selection buttons */}
            <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('passAndPlay');
                  resetGame();
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  mode === 'passAndPlay'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? '2 खिलाड़ी' : 'Pass & Play'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('vsComputer');
                  resetGame();
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  mode === 'vsComputer'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'बनाम कंप्यूटर' : 'vs Computer'}</span>
              </button>
            </div>

            {/* Target tokens: Quick (2) vs Classic (4) */}
            <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setTargetTokens(4);
                  resetGame();
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  targetTokens === 4
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{language === 'hi' ? 'क्लासिक (4)' : 'Classic (4)'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setTargetTokens(2);
                  resetGame();
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  targetTokens === 2
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>{language === 'hi' ? 'त्वरित (2)' : 'Quick (2)'}</span>
              </button>
            </div>
          </div>

          {/* Zone 3: Primary Utilities (Audio, Language, Rules, Restart) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                const updated = toggleSound();
                setSoundOn(updated);
              }}
              title={soundOn ? 'Mute Sound (M)' : 'Unmute Sound (M)'}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Sound Toggle"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setLanguage((l) => (l === 'hi' ? 'en' : 'hi'));
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer tabular-nums"
              title="Change Language"
            >
              {language === 'hi' ? 'EN' : 'हिन्दी'}
            </button>

            {/* Rules Modal Button */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowRules(true);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="View Rules (R)"
              aria-label="Rules"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Restart Button */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                if (window.confirm(language === 'hi' ? 'क्या आप नया खेल शुरू करना चाहते हैं?' : 'Start a fresh match?')) {
                  resetGame();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-700 text-xs font-semibold text-slate-300 hover:text-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'hi' ? 'नया खेल' : 'Reset'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Mode Switcher Bar */}
      <div className="sm:hidden flex items-center justify-between gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1 p-0.5 bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setMode('passAndPlay');
              resetGame();
            }}
            className={`px-2 py-1 rounded text-[11px] font-medium ${
              mode === 'passAndPlay' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            2P Pass
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('vsComputer');
              resetGame();
            }}
            className={`px-2 py-1 rounded text-[11px] font-medium ${
              mode === 'vsComputer' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            vs Bot
          </button>
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-slate-800 rounded-lg text-[11px]">
          <button
            type="button"
            onClick={() => {
              setTargetTokens(4);
              resetGame();
            }}
            className={`px-2 py-1 rounded ${
              targetTokens === 4 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
            }`}
          >
            4 Tokens
          </button>
          <button
            type="button"
            onClick={() => {
              setTargetTokens(2);
              resetGame();
            }}
            className={`px-2 py-1 rounded ${
              targetTokens === 2 ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Quick 2
          </button>
        </div>
      </div>

      {/* ========================================================
          2. MAIN GAME ARENA
      ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center">
        {/* Active Status Banner */}
        <div className="mb-3 p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
            <span
              className="w-3 h-3 rounded-full animate-ping shrink-0"
              style={{ backgroundColor: COLOR_CONFIG[currentTurnColor].primaryHex }}
            />
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              {statusMessage}
            </p>
          </div>
          {consecutiveSixes > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-400 px-2 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {consecutiveSixes}x {language === 'hi' ? 'छक्का' : 'Six'}
              </span>
            </div>
          )}
        </div>

        {/* Responsive Grid: Left Player Card | Center Board | Right Controls & Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Player 1 Card (Red) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <PlayerCard
              player={players[0]}
              tokens={tokens.red}
              isActive={currentTurnColor === 'red'}
              targetTokens={targetTokens}
              language={language}
            />

            {/* In mobile, compact Dice control if red turn */}
            {currentTurnColor === 'red' && (
              <div className="lg:hidden p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Dice
                  value={diceValue}
                  isRolling={isRolling}
                  canRoll={!hasRolledThisTurn && !winner}
                  onRoll={handleRollDice}
                  currentColor="red"
                  isAiTurn={false}
                  language={language}
                />
              </div>
            )}
          </div>

          {/* Center 15x15 Ludo Board */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <LudoBoard
              tokens={tokens}
              activeTurnColor={currentTurnColor}
              validTokenMoves={validTokenMoves}
              onTokenClick={executeTokenMove}
              activePlayers={activeColors}
            />

            {/* Quick helper tip below board */}
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              {validTokenMoves.length > 0
                ? language === 'hi'
                  ? 'चमकते हुए टोकन पर क्लिक करें चाल चलने के लिए'
                  : 'Click on the glowing token to move'
                : language === 'hi'
                ? 'पासा फेंकने के लिए बटन दबाएं या Spacebar दबाएं'
                : 'Press Roll Dice or Spacebar to roll'}
            </p>
          </div>

          {/* Right Column: Player 2 Card + Dice Controls + Match Feed */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <PlayerCard
              player={players[1]}
              tokens={tokens[p2Color]}
              isActive={currentTurnColor === p2Color}
              targetTokens={targetTokens}
              language={language}
            />

            {/* Desktop Unified Dice Panel */}
            <div className="hidden lg:flex p-4 rounded-2xl bg-slate-900 border border-slate-800 flex-col items-center shadow-md">
              <Dice
                value={diceValue}
                isRolling={isRolling}
                canRoll={!hasRolledThisTurn && !winner}
                onRoll={handleRollDice}
                currentColor={currentTurnColor}
                isAiTurn={isAiTurn}
                language={language}
              />
            </div>

            {/* In mobile, compact Dice control if P2 turn */}
            {currentTurnColor === p2Color && (
              <div className="lg:hidden p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Dice
                  value={diceValue}
                  isRolling={isRolling}
                  canRoll={!hasRolledThisTurn && !winner}
                  onRoll={handleRollDice}
                  currentColor={p2Color}
                  isAiTurn={isAiTurn}
                  language={language}
                />
              </div>
            )}

            {/* Match Feed Log */}
            <GameLog entries={history} language={language} />
          </div>
        </div>
      </main>

      {/* Rules Modal */}
      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        language={language}
      />

      {/* Victory Celebration Modal */}
      {winner && (
        <VictoryModal
          winner={winner}
          players={players}
          onPlayAgain={resetGame}
          language={language}
        />
      )}
    </div>
  );
}
