import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryControl from './InventoryControl';
import InventoryHotbar from './InventoryHotbar';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import PlayerInventorySection from './PlayerInventorySection';
import GroundInventory from './GroundInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';
import { motion } from 'framer-motion';

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const dispatch = useAppDispatch();

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  const handleClick = () => {
    dispatch(closeContextMenu());
  };

  return (
    <>
      <Fade in={inventoryVisible}>
        <div
          className="fixed inset-0 bg-cyber-bg/40 backdrop-blur-md flex items-center justify-center"
          onClick={handleClick}
        >
          <motion.div
            className="w-full h-full flex items-center justify-between px-8 py-6 max-w-[1800px]"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -50 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
            onClick={(e) => e.stopPropagation()}
          >
            <InventoryContext>
              {/* Left - Player + Backpack */}
              <div className="flex flex-col gap-6 flex-shrink-0">
                <PlayerInventorySection />
              </div>

              {/* Center - Control Panel */}
              <div className="flex justify-center items-center px-8">
                <InventoryControl />
              </div>

              {/* Right - Ground (same size as player inventory only) */}
              <div className="flex justify-center items-center flex-shrink-0">
                <GroundInventory />
              </div>

              <Tooltip />
            </InventoryContext>
          </motion.div>
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
