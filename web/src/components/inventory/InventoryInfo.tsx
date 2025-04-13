import React from 'react';
import { useAppSelector } from '../../store';
import { selectRightInventory } from '../../store/inventory';

const InventoryInfo: React.FC = () => {
  const rightInventory = useAppSelector(selectRightInventory);

  // Different display based on inventory type
  const renderContent = () => {
    switch (rightInventory.type) {
      case 'shop':
        return (
          <>
            <div className="section-label">SHOP INFO</div>
            <div className="info-content">
              <div className="info-card">
                <i className="info-icon">💰</i>
                <div className="info-text">Purchase items with available funds</div>
              </div>
            </div>
          </>
        );
      case 'crafting':
        return (
          <>
            <div className="section-label">CRAFTING GUIDE</div>
            <div className="info-content">
              <div className="info-card">
                <i className="info-icon">⚒️</i>
                <div className="info-text">Drag materials to craft items</div>
              </div>
            </div>
          </>
        );
      case 'container':
        return (
          <>
            <div className="section-label">STORAGE INFO</div>
            <div className="info-content">
              <div className="info-card">
                <i className="info-icon">📦</i>
                <div className="info-text">Items stored in this container</div>
              </div>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="section-label">INVENTORY TIPS</div>
            <div className="info-content">
              <div className="info-card">
                <i className="info-icon">💡</i>
                <div className="info-text">Drag and drop to move items</div>
              </div>
            </div>
          </>
        );
    }
  };

  return <div className="inventory-info-container">{renderContent()}</div>;
};

export default InventoryInfo;
