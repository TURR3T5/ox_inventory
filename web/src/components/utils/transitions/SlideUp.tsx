import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideUpProps {
  in?: boolean;
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

const SlideUp: React.FC<SlideUpProps> = ({ in: isVisible = true, children }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} transition={{ duration: 0.2 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideUp;
