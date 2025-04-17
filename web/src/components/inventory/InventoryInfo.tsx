import React from 'react';
import CraftingInterface from './CraftingInterface';

const InventoryInfo: React.FC = () => {
  const renderContent = () => {
    return (
      <>
        <div className="section-label">CRAFTING</div>
        <CraftingInterface />
      </>
    );
  };

  return <div className="inventory-info-container">{renderContent()}</div>;
};

export default InventoryInfo;
