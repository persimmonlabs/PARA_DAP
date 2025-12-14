import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-20 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 min-w-[44px] min-h-[44px]"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label="Add task"
    >
      <Plus size={28} strokeWidth={2.5} />
    </motion.button>
  );
};
