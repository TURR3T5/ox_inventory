import React, { useMemo } from 'react';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { getTotalWeight } from '../../helpers';
import WeightBar from '../ui/weight-bar';
import InventorySlot from './InventorySlot';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const PlayerInventorySection: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  const playerItems = leftInventory.items.slice(0, 15); // 5x3 = 15 slots
  const backpackItems = leftInventory.items.slice(15, 30); // Next 5x3 = 15 slots

  const playerWeight = useMemo(
    () => (leftInventory.maxWeight !== undefined ? Math.floor(getTotalWeight(playerItems) * 1000) / 1000 : 0),
    [leftInventory.maxWeight, playerItems]
  );

  const backpackWeight = useMemo(
    () => (leftInventory.maxWeight !== undefined ? Math.floor(getTotalWeight(backpackItems) * 1000) / 1000 : 0),
    [leftInventory.maxWeight, backpackItems]
  );

  const maxPlayerWeight = leftInventory.maxWeight ? leftInventory.maxWeight * 0.6 : 0; // 60% for player
  const maxBackpackWeight = leftInventory.maxWeight ? leftInventory.maxWeight * 0.4 : 0; // 40% for backpack

  return (
    <div className={cn('space-y-6', { 'pointer-events-none': isBusy })}>
      {/* Player Inventory */}
      <motion.div
        className="transform skew-y-2" // Consistent skewing
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-cyber-card to-cyber-card-dark p-6 rounded-lg border border-cyber-border shadow-lg transform -skew-y-2">
          <div className="transform skew-y-2">
            <div className="flex flex-row justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-cyber-text-bright uppercase tracking-wider">Player</h3>
              <div className="text-right">
                <p className="text-lg font-bold text-cyber-accent">
                  {playerWeight / 1000}/{maxPlayerWeight / 1000}kg
                </p>
                <p className="text-xs text-cyber-text uppercase tracking-wider">Weight</p>
              </div>
            </div>

            <div className="mb-4">
              <WeightBar
                percent={maxPlayerWeight ? (playerWeight / maxPlayerWeight) * 100 : 0}
                className="h-2 rounded-full shadow-inner"
              />
            </div>

            <div className="grid grid-cols-5 gap-3">
              {playerItems.map((item, index) => (
                <motion.div
                  key={`player-${item.slot}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <InventorySlot
                    item={item}
                    inventoryType={leftInventory.type}
                    inventoryGroups={leftInventory.groups}
                    inventoryId={leftInventory.id}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Backpack */}
      <motion.div
        className="transform skew-y-2" // Consistent skewing
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-cyber-card to-cyber-card-dark p-6 rounded-lg border border-cyber-border shadow-lg transform -skew-y-2">
          <div className="transform skew-y-2">
            <div className="flex flex-row justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-cyber-text-bright uppercase tracking-wider">Backpack</h3>
              <div className="text-right">
                <p className="text-lg font-bold text-cyber-accent">
                  {backpackWeight / 1000}/{maxBackpackWeight / 1000}kg
                </p>
                <p className="text-xs text-cyber-text uppercase tracking-wider">Weight</p>
              </div>
            </div>

            <div className="mb-4">
              <WeightBar
                percent={maxBackpackWeight ? (backpackWeight / maxBackpackWeight) * 100 : 0}
                className="h-2 rounded-full shadow-inner"
              />
            </div>

            <div className="grid grid-cols-5 gap-3">
              {backpackItems.map((item, index) => (
                <motion.div
                  key={`backpack-${item.slot}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <InventorySlot
                    item={item}
                    inventoryType={leftInventory.type}
                    inventoryGroups={leftInventory.groups}
                    inventoryId={leftInventory.id}
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

export default PlayerInventorySection;
