import React from 'react';
import { Play, Timer, RotateCcw } from 'lucide-react';
import { GameMode } from '../types';
import { motion } from 'motion/react';

interface MenuProps {
  onStart: (mode: GameMode) => void;
  isGameOver?: boolean;
  score?: number;
}

export const Menu: React.FC<MenuProps> = ({ onStart, isGameOver, score }) => {
  return (
    <div className="absolute inset-0 z-50 bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center"
      >
        {isGameOver ? (
          <>
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">游戏结束</h1>
            <p className="text-zinc-500 mb-6 italic font-serif">数字触顶了！</p>
            <div className="bg-zinc-50 rounded-2xl p-4 mb-8">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">最终得分</span>
              <div className="text-5xl font-mono font-bold text-indigo-600 mt-1">{score}</div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-200 mb-4 rotate-3">
                <span className="text-white text-4xl font-bold">Σ</span>
              </div>
              <h1 className="text-3xl font-bold text-zinc-900">数字消除</h1>
              <p className="text-zinc-500 text-sm mt-2">终极数学求和挑战</p>
            </div>
          </>
        )}

        <div className="space-y-3">
          <button
            onClick={() => onStart('classic')}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-200"
          >
            <Play size={20} fill="currentColor" />
            {isGameOver ? '再来一局 (经典)' : '经典模式'}
          </button>
          
          <button
            onClick={() => onStart('time')}
            className="w-full py-4 bg-white border-2 border-zinc-100 hover:border-orange-200 hover:bg-orange-50 text-zinc-700 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Timer size={20} className="text-orange-500" />
            {isGameOver ? '再来一局 (计时)' : '计时模式'}
          </button>
        </div>

        {!isGameOver && (
          <div className="mt-8 pt-6 border-t border-zinc-100">
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-3">玩法说明</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              选择数字，使它们的总和等于 <span className="text-indigo-600 font-bold">目标数字</span>。
              在方块堆到顶部之前消除它们！
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
