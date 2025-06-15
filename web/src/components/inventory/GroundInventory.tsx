import React, { useMemo } from 'react';
import { useAppSelector } from '../../store';
import { selectRightInventory } from '../../store/inventory';
import { getTotalWeight } from '../../helpers';
import WeightBar from '../ui/weight-bar';
import InventorySlot from './InventorySlot';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const GroundInventory: React.FC = () => {
  const rightInventory = useAppSelector(selectRightInventory);
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  const groundItems = rightInventory.items.slice(0, 15); // Only 5x3 = 15 slots to match player inventory

  const groundWeight = useMemo(
    () => (rightInventory.maxWeight !== undefined ? Math.floor(getTotalWeight(groundItems) * 1000) / 1000 : 0),
    [rightInventory.maxWeight, groundItems]
  );

  return (
    <div className={cn('', { 'pointer-events-none': isBusy })}>
      <motion.div
        className="transform skew-y-2" // Consistent skewing
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-cyber-card to-cyber-card-dark p-6 rounded-lg border border-cyber-border shadow-lg transform -skew-y-2">
          <div className="transform skew-y-2">
            <div className="flex flex-row justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-cyber-text-bright uppercase tracking-wider">Ground</h3>
              {rightInventory.maxWeight && (
                <div className="text-right">
                  <p className="text-lg font-bold text-cyber-accent">
                    {groundWeight / 1000}/{rightInventory.maxWeight / 1000}kg
                  </p>
                  <p className="text-xs text-cyber-text uppercase tracking-wider">Weight</p>
                </div>
              )}
            </div>

            {rightInventory.maxWeight && (
              <div className="mb-4">
                <WeightBar
                  percent={rightInventory.maxWeight ? (groundWeight / rightInventory.maxWeight) * 100 : 0}
                  className="h-2 rounded-full shadow-inner"
                />
              </div>
            )}

            <div className="grid grid-cols-5 gap-3">
              {groundItems.map((item, index) => (
                <motion.div
                  key={`ground-${item.slot}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <InventorySlot
                    item={item}
                    inventoryType={rightInventory.type}
                    inventoryGroups={rightInventory.groups}
                    inventoryId={rightInventory.id}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GroundInventory;
