import React from 'react';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import InventorySlot from './InventorySlot';

const QuickAccess: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);
  const hotbarItems = leftInventory.items.slice(0, 5);

  return (
    <div className="quick-access-container">
      <div className="section-label">HOTBAR</div>
      <div className="hotbar-slots-row">
        {hotbarItems.map((item) => (
          <InventorySlot
            key={`hotbar-${leftInventory.type}-${leftInventory.id}-${item.slot}`}
            item={item}
            inventoryType={leftInventory.type}
            inventoryGroups={leftInventory.groups}
            inventoryId={leftInventory.id}
            isHotbarSlot={true}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;
