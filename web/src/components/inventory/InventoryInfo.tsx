import React from 'react';
import CraftingInterface from './CraftingInterface';
import { useAppSelector } from '../../store';
import { selectRightInventory } from '../../store/inventory';

const InventoryInfo: React.FC = () => {
  const rightInventory = useAppSelector(selectRightInventory);
  const isGroundInventory = !['shop', 'container', 'crafting'].includes(rightInventory.type);

  if (!isGroundInventory) return null;

  return (
    <div className="inventory-info-container">
      <div className="info-header">
        <div className="section-label">CRAFTING</div>
        <button className="crafting-button">Craft</button>
      </div>
      <div className="coming-soon-container">
        <div className="blurred-content">
          <CraftingInterface />
        </div>
        <div className="coming-soon-text">Kommer Snart</div>
      </div>
    </div>
  );
};

export default InventoryInfo;
