import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FadeProps {
  in?: boolean;
  children: React.ReactNode;
}

const Fade: React.FC<FadeProps> = ({ in: isVisible = true, children }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Fade;
