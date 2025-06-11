import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../ui/weight-bar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  return (
    <motion.div
      className={cn('flex flex-col gap-6 max-w-screen-2xl mx-auto px-5', { 'pointer-events-none': isBusy })}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with cyberpunk styling */}
      <div className="transform -skew-y-1">
        <div className="bg-gradient-to-r from-cyber-card to-cyber-card-dark p-6 rounded-lg border border-cyber-border shadow-lg">
          <div className="flex flex-row justify-between items-center transform skew-y-1">
            <h2 className="text-2xl font-bold text-cyber-text-bright uppercase tracking-wider">{inventory.label}</h2>
            {inventory.maxWeight && (
              <div className="text-right">
                <p className="text-lg font-bold text-cyber-accent">
                  {weight / 1000}/{inventory.maxWeight / 1000}kg
                </p>
                <p className="text-xs text-cyber-text uppercase tracking-wider">Weight Capacity</p>
              </div>
            )}
          </div>

          {inventory.maxWeight && (
            <div className="mt-4 transform skew-y-1">
              <WeightBar
                percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0}
                className="h-2 rounded-full shadow-inner"
              />
            </div>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div
        className="grid grid-cols-5 gap-3 overflow-y-auto pr-2 max-h-[60vh] custom-scrollbar"
        ref={containerRef}
        style={{
          gridAutoRows: 'minmax(10.2vh, auto)',
        }}
      >
        {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
          <motion.div
            key={`${inventory.type}-${inventory.id}-${item.slot}`}
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.02,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <InventorySlot
              item={item}
              ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InventoryGrid;
