import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, BlockData, GRID_COLS, GRID_ROWS, INITIAL_ROWS, GameMode, TIME_LIMIT } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomValue = () => Math.floor(Math.random() * 9) + 1;

export function useGameLogic() {
  const [state, setState] = useState<GameState | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateTarget = useCallback(() => {
    return Math.floor(Math.random() * 15) + 10; // Target between 10 and 25
  }, []);

  const initGame = useCallback((mode: GameMode) => {
    const grid: (BlockData | null)[][] = Array.from({ length: GRID_ROWS }, () =>
      Array.from({ length: GRID_COLS }, () => null)
    );

    // Fill initial rows from the bottom
    for (let r = GRID_ROWS - 1; r >= GRID_ROWS - INITIAL_ROWS; r--) {
      for (let c = 0; c < GRID_COLS; c++) {
        grid[r][c] = {
          id: generateId(),
          value: getRandomValue(),
          row: r,
          col: c,
        };
      }
    }

    setState({
      grid,
      target: generateTarget(),
      score: 0,
      selectedIds: [],
      isGameOver: false,
      mode,
      timeLeft: TIME_LIMIT,
      level: 1,
    });
  }, [generateTarget]);

  const addRow = useCallback(() => {
    setState(prev => {
      if (!prev || prev.isGameOver) return prev;

      const newGrid = [...prev.grid.map(row => [...row])];
      
      // Check if top row has any blocks
      if (newGrid[0].some(cell => cell !== null)) {
        return { ...prev, isGameOver: true };
      }

      // Shift everything up
      for (let r = 0; r < GRID_ROWS - 1; r++) {
        newGrid[r] = newGrid[r + 1].map(block => {
          if (block) return { ...block, row: r };
          return null;
        });
      }

      // Add new row at bottom
      newGrid[GRID_ROWS - 1] = Array.from({ length: GRID_COLS }, (_, c) => ({
        id: generateId(),
        value: getRandomValue(),
        row: GRID_ROWS - 1,
        col: c,
      }));

      return { 
        ...prev, 
        grid: newGrid,
        timeLeft: TIME_LIMIT // Reset timer when row is added
      };
    });
  }, []);

  const selectBlock = useCallback((id: string) => {
    setState(prev => {
      if (!prev || prev.isGameOver) return prev;

      const newSelected = prev.selectedIds.includes(id)
        ? prev.selectedIds.filter(sid => sid !== id)
        : [...prev.selectedIds, id];

      // Calculate current sum
      let currentSum = 0;
      const selectedBlocks: BlockData[] = [];
      
      prev.grid.forEach(row => {
        row.forEach(block => {
          if (block && newSelected.includes(block.id)) {
            currentSum += block.value;
            selectedBlocks.push(block);
          }
        });
      });

      if (currentSum === prev.target) {
        // Success! Remove blocks
        const newGrid = prev.grid.map(row => 
          row.map(block => (block && newSelected.includes(block.id) ? null : block))
        );

        // Apply gravity (blocks fall down)
        for (let c = 0; c < GRID_COLS; c++) {
          let emptyRow = GRID_ROWS - 1;
          for (let r = GRID_ROWS - 1; r >= 0; r--) {
            if (newGrid[r][c]) {
              const block = newGrid[r][c]!;
              newGrid[r][c] = null;
              newGrid[emptyRow][c] = { ...block, row: emptyRow };
              emptyRow--;
            }
          }
        }

        const nextScore = prev.score + (selectedBlocks.length * 10);
        
        // Prepare state for success
        const successState = {
          ...prev,
          grid: newGrid,
          score: nextScore,
          target: generateTarget(),
          selectedIds: [],
        };

        // In classic mode, add a row after success
        if (prev.mode === 'classic') {
           // We need to shift up and add a row
           const shiftedGrid = [...successState.grid.map(row => [...row])];
           
           // Check game over
           if (shiftedGrid[0].some(cell => cell !== null)) {
             return { ...successState, isGameOver: true };
           }

           for (let r = 0; r < GRID_ROWS - 1; r++) {
             shiftedGrid[r] = shiftedGrid[r + 1].map(block => {
               if (block) return { ...block, row: r };
               return null;
             });
           }

           shiftedGrid[GRID_ROWS - 1] = Array.from({ length: GRID_COLS }, (_, c) => ({
             id: generateId(),
             value: getRandomValue(),
             row: GRID_ROWS - 1,
             col: c,
           }));

           return { ...successState, grid: shiftedGrid };
        }
        
        return successState;
      } else if (currentSum > prev.target) {
        // Over target, reset selection
        return { ...prev, selectedIds: [] };
      }

      return { ...prev, selectedIds: newSelected };
    });
  }, [generateTarget]);

  // Handle row addition for classic mode (after success)
  useEffect(() => {
    if (state?.mode === 'classic' && state.selectedIds.length === 0 && state.score > 0) {
        // This is a bit tricky to detect "just succeeded" without extra state.
        // Let's simplify: addRow is called manually or by timer.
    }
  }, [state?.score]);

  // Timer for Time Mode and periodic row addition in Classic
  useEffect(() => {
    if (!state || state.isGameOver) return;

    if (state.mode === 'time') {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (!prev || prev.isGameOver) return prev;
          return { ...prev, timeLeft: Math.max(0, prev.timeLeft - 1) };
        });
      }, 1000);
    } else {
        // Classic mode: maybe add row every N seconds regardless?
        // Actually, the prompt says "每次成功凑出目标数字，底部新增一行方块"
        // So I should add row in the selectBlock logic for classic.
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state?.mode, state?.isGameOver]);

  // Handle time out in Time Mode
  useEffect(() => {
    if (state?.mode === 'time' && state.timeLeft <= 0) {
      addRow();
    }
  }, [state?.timeLeft, state?.mode, addRow]);

  return {
    state,
    initGame,
    selectBlock,
    addRow,
  };
}
