import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlockData } from '../types';

interface BlockProps {
  block: BlockData | null;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export const Block: React.FC<BlockProps> = ({ block, isSelected, onClick }) => {
  if (!block) return null;

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onClick(block.id)}
      className={`grid-cell ${isSelected ? 'block-active' : `block-idle val-${block.value}`}`}
    >
      {block.value}
    </motion.div>
  );
};
