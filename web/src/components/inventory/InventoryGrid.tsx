import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import SegmentedWeightBar from './SegmentedWeightBar';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory; skipHotbar?: boolean }> = ({ inventory, skipHotbar = false }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  const isLeftInventory = inventory.type === 'player';
  const isShopInventory = inventory.type === 'shop';
  const regularItems = isLeftInventory && skipHotbar ? inventory.items.slice(5) : inventory.items;
  const inventorySide = isLeftInventory ? 'left' : 'right';

  return (
    <>
      <div className="weight-bar-placeholder" style={{ height: '50px' }}>
        {inventory.maxWeight && !isShopInventory ? (
          <SegmentedWeightBar
            weight={weight / 1000}
            maxWeight={inventory.maxWeight / 1000}
            inventorySide={inventorySide}
          />
        ) : null}
      </div>

      <div className="inventory-grid-container" ref={containerRef} style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        {regularItems.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
          <InventorySlot
            key={`${inventory.type}-${inventory.id}-${item.slot}`}
            item={item}
            ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
            inventoryType={inventory.type}
            inventoryGroups={inventory.groups}
            inventoryId={inventory.id}
          />
        ))}
      </div>
    </>
  );
};

export default InventoryGrid;
