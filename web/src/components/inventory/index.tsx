import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryControl from './InventoryControl';
import InventoryHotbar from './InventoryHotbar';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
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
          className="fixed inset-0 bg-cyber-bg/30 backdrop-blur-sm flex items-center justify-center"
          onClick={handleClick}
        >
          <motion.div
            className="max-w-screen-2xl mx-auto px-5 w-full"
            initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            onClick={(e) => e.stopPropagation()}
          >
            <InventoryContext>
              <div className="grid grid-cols-3 gap-8 items-start">
                {/* Left Inventory */}
                <div className="transform hover:scale-105 transition-transform duration-500">
                  <LeftInventory />
                </div>

                {/* Center Control Panel */}
                <div className="flex justify-center">
                  <InventoryControl />
                </div>

                {/* Right Inventory */}
                <div className="transform hover:scale-105 transition-transform duration-500">
                  <RightInventory />
                </div>
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
