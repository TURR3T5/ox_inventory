import React from 'react';
import CraftingInterface from './CraftingInterface';

const InventoryInfo: React.FC = () => {
  const renderContent = () => {
    return (
      <>
        <div className="coming-soon-container">
          <div className="blurred-content">
            <div className="section-label">CRAFTING</div>
            <CraftingInterface />
          </div>
          <div className="coming-soon-text">Kommer Snart</div>
        </div>
      </>
    );
  };

  return <div className="inventory-info-container">{renderContent()}</div>;
};

export default InventoryInfo;
