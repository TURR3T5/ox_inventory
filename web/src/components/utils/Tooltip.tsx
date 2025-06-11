import React from 'react';
import { useAppSelector } from '@/store';
import { Tooltip as ShadTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SlotTooltip from '../inventory/SlotTooltip';
import { motion } from 'framer-motion';

const Tooltip: React.FC = () => {
  const hoverData = useAppSelector((state) => state.tooltip);

  if (!hoverData.open || !hoverData.item || !hoverData.inventoryType) {
    return null;
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed pointer-events-none z-50"
        style={{
          left: 'var(--mouse-x, 0)',
          top: 'var(--mouse-y, 0)',
        }}
      >
        <SlotTooltip item={hoverData.item} inventoryType={hoverData.inventoryType} />
      </motion.div>
    </TooltipProvider>
  );
};

export default Tooltip;
