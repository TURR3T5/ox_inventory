import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return (
    <div className="inventory-grid-wrapper">
      <InventoryGrid inventory={leftInventory} skipHotbar={true} />
    </div>
  );
};

export default LeftInventory;