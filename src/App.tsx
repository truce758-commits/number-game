/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useGameLogic } from './hooks/useGameLogic';
import { Block } from './components/Block';
import { GameStats } from './components/GameStats';
import { Menu } from './components/Menu';
import { GRID_COLS, GRID_ROWS } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronUp } from 'lucide-react';

export default function App() {
  const { state, initGame, selectBlock, addRow } = useGameLogic();

  return (
    <div className="game-container bg-zinc-100">
      {!state || state.isGameOver ? (
        <Menu 
          onStart={initGame} 
          isGameOver={state?.isGameOver} 
          score={state?.score} 
        />
      ) : null}

      {state && (
        <>
          <GameStats 
            target={state.target} 
            score={state.score} 
            mode={state.mode} 
            timeLeft={state.timeLeft} 
          />

          <div className="flex-1 p-3 relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-3 grid grid-cols-6 grid-rows-10 gap-2 pointer-events-none">
              {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => (
                <div key={i} className="border border-zinc-200/50 rounded-lg" />
              ))}
            </div>

            {/* Blocks Grid */}
            <div className="relative h-full">
              <AnimatePresence mode="popLayout">
                {state.grid.flat().map((block) => (
                  block ? (
                    <div
                      key={block.id}
                      style={{
                        position: 'absolute',
                        top: `${(block.row / GRID_ROWS) * 100}%`,
                        left: `${(block.col / GRID_COLS) * 100}%`,
                        width: `${(1 / GRID_COLS) * 100}%`,
                        height: `${(1 / GRID_ROWS) * 100}%`,
                        padding: '4px',
                      }}
                    >
                      <Block
                        block={block}
                        isSelected={state.selectedIds.includes(block.id)}
                        onClick={selectBlock}
                      />
                    </div>
                  ) : null
                ))}
              </AnimatePresence>
            </div>

            {/* Danger Zone Indicator */}
            <div className="absolute top-3 left-3 right-3 h-1 bg-red-500/20 rounded-full overflow-hidden">
              <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-full bg-red-500 w-full"
              />
            </div>

            {/* Manual Add Row Button Overlay */}
            <div className="absolute bottom-6 right-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={addRow}
                className="w-14 h-14 bg-white border-2 border-zinc-200 rounded-full flex items-center justify-center shadow-xl text-zinc-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                title="新增一行"
              >
                <ChevronUp size={32} />
              </motion.button>
            </div>
          </div>

          {/* Current Selection Sum Indicator */}
          <div className="p-4 bg-white border-t border-zinc-200 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              {state.selectedIds.length > 0 ? (
                <>
                  <div className="flex gap-1">
                    {state.selectedIds.map((id, idx) => {
                      const block = state.grid.flat().find(b => b?.id === id);
                      return (
                        <div key={id} className="flex items-center">
                          <span className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center font-bold text-zinc-600">
                            {block?.value}
                          </span>
                          {idx < state.selectedIds.length - 1 && <span className="mx-1 text-zinc-300">+</span>}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-zinc-400">=</span>
                  <span className={`text-2xl font-bold ${
                    state.grid.flat()
                      .filter(b => b && state.selectedIds.includes(b.id))
                      .reduce((acc, b) => acc + (b?.value || 0), 0) === state.target 
                        ? 'text-green-500' 
                        : 'text-indigo-600'
                  }`}>
                    {state.grid.flat()
                      .filter(b => b && state.selectedIds.includes(b.id))
                      .reduce((acc, b) => acc + (b?.value || 0), 0)}
                  </span>
                </>
              ) : (
                <span className="text-zinc-400 text-sm italic">选择数字以达到目标值 {state.target}</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
