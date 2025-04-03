import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import SegmentedWeightBar from './SegmentedWeightBar';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
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

  const hotbarItems = isLeftInventory ? inventory.items.slice(0, 5) : [];
  const regularItems = isLeftInventory ? inventory.items.slice(5) : inventory.items;

  return (
    <>

      {isLeftInventory && hotbarItems.length > 0 && (
        <div className="hotbar-slots-row">
          {hotbarItems.map((item) => (
            <InventorySlot
              key={`hotbar-${inventory.type}-${inventory.id}-${item.slot}`}
              item={item}
              ref={null}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
              isHotbarSlot={true}
            />
          ))}
        </div>
      )}

      <div className="inventory-grid-container" ref={containerRef} style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        {(isLeftInventory ? regularItems : inventory.items).slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
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

      {inventory.maxWeight && <SegmentedWeightBar weight={weight / 1000} maxWeight={inventory.maxWeight / 1000} />}
    </>
  );
};

export default InventoryGrid;
