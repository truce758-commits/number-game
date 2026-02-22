import React from 'react';
import { Target, Trophy, Clock } from 'lucide-react';
import { GameMode } from '../types';

interface GameStatsProps {
  target: number;
  score: number;
  mode: GameMode;
  timeLeft: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ target, score, mode, timeLeft }) => {
  return (
    <div className="p-4 bg-white border-b border-zinc-200 shadow-sm flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1">
          <Trophy size={10} /> 分数
        </span>
        <span className="text-xl font-mono font-bold text-zinc-800">{score.toString().padStart(5, '0')}</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1">
          <Target size={10} /> 目标
        </span>
        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-200">
          {target}
        </div>
      </div>

      <div className="flex flex-col items-end">
        {mode === 'time' ? (
          <>
            <span className="text-[10px] uppercase tracking-wider text-orange-400 font-bold flex items-center gap-1">
              <Clock size={10} /> 倒计时
            </span>
            <span className={`text-xl font-mono font-bold ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-zinc-800'}`}>
              {timeLeft}s
            </span>
          </>
        ) : (
          <>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">模式</span>
            <span className="text-sm font-bold text-zinc-600 capitalize">{mode === 'classic' ? '经典模式' : '计时模式'}</span>
          </>
        )}
      </div>
    </div>
  );
};
