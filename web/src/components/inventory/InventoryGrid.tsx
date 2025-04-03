import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory, Slot } from '../../typings';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import SegmentedWeightBar from './SegmentedWeightBar';

const PAGE_SIZE = 30;

// Enum for layout types
enum InventoryLayoutType {
  GRID = 'grid',
  LIST = 'list',
  COMPACT = 'compact',
  CATEGORIES = 'categories',
}

interface CategorySectionProps {
  name: string;
  items: Slot[];
  inventory: Inventory;
  indexOffset: number;
  onRef: (index: number, element: HTMLDivElement | null) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ name, items, inventory, indexOffset, onRef }) => {
  const [collapsed, setCollapsed] = useState(false);
  const layout = useAppSelector((state) => state.layout);

  // Format the category name to be user-friendly
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  // Select appropriate icon for the category
  const getCategoryIcon = () => {
    switch (name) {
      case 'weapons':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 8l4 2l4-5l3 3l6-6l1 1l-6 6l3 3l-5 4l2 4"></path>
          </svg>
        );
      case 'clothing':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
          </svg>
        );
      case 'food':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        );
      case 'medical':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        );
      case 'crafting':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
        );
      case 'valuables':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case 'documents':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        );
    }
  };

  // Generate grid style based on layout settings
  const gridStyle = {
    gridTemplateColumns:
      layout.currentLayout === InventoryLayoutType.LIST ? '1fr' : `repeat(${layout.gridColumns}, ${layout.itemSize}vh)`,
    gridAutoRows: layout.currentLayout === InventoryLayoutType.LIST ? 'auto' : `${layout.itemSize}vh`,
    transition: layout.animations ? 'all 0.3s ease-in-out' : 'none',
  };

  return (
    <div className={`category-section ${collapsed ? 'category-collapsed' : ''}`}>
      <div className="category-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="category-icon">{getCategoryIcon()}</div>
        <div className="category-name">{formattedName}</div>
        <div className="category-collapse-icon">▼</div>
      </div>

      <div
        className="category-content"
        style={{
          maxHeight: collapsed ? 0 : `${Math.ceil(items.length / layout.gridColumns) * (layout.itemSize + 10)}vh`,
        }}
      >
        <div className="inventory-grid-container" style={gridStyle}>
          {items.map((item, index) => (
            <InventorySlot
              key={`${inventory.type}-${inventory.id}-${item.slot}-${name}`}
              item={item}
              ref={(element) => onRef(indexOffset + index, element)}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Function to categorize items
const categorizeItems = (items: any[]) => {
  const categories: Record<string, any[]> = {
    weapons: [],
    clothing: [],
    food: [],
    medical: [],
    crafting: [],
    valuables: [],
    documents: [],
    misc: [],
  };

  items.forEach((item) => {
    if (!item.name) return;

    const name = item.name.toLowerCase();

    // Categorize based on item name patterns
    if (
      name.includes('weapon') ||
      name.includes('gun') ||
      name.includes('rifle') ||
      name.includes('pistol') ||
      name.includes('ammo')
    ) {
      categories.weapons.push(item);
    } else if (
      name.includes('clothing') ||
      name.includes('shirt') ||
      name.includes('pants') ||
      name.includes('hat') ||
      name.includes('helmet') ||
      name.includes('vest')
    ) {
      categories.clothing.push(item);
    } else if (name.includes('food') || name.includes('drink') || name.includes('burger') || name.includes('water')) {
      categories.food.push(item);
    } else if (
      name.includes('medical') ||
      name.includes('bandage') ||
      name.includes('pill') ||
      name.includes('health')
    ) {
      categories.medical.push(item);
    } else if (name.includes('material') || name.includes('craft') || name.includes('tool') || name.includes('part')) {
      categories.crafting.push(item);
    } else if (
      name.includes('gold') ||
      name.includes('jewel') ||
      name.includes('diamond') ||
      name.includes('cash') ||
      name.includes('money')
    ) {
      categories.valuables.push(item);
    } else if (name.includes('document') || name.includes('id') || name.includes('license') || name.includes('paper')) {
      categories.documents.push(item);
    } else {
      categories.misc.push(item);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach((key) => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
};

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);
  const layout = useAppSelector((state) => state.layout);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, [entry]);

  const isLeftInventory = inventory.type === 'player';

  const hotbarItems = isLeftInventory ? inventory.items.slice(0, 5) : [];
  const regularItems = isLeftInventory ? inventory.items.slice(5) : inventory.items;

  // For category view, we'll categorize the items
  const categorizedItems = useMemo(() => {
    if (layout.currentLayout === InventoryLayoutType.CATEGORIES) {
      return categorizeItems(regularItems.filter((item) => item.name));
    }
    return null;
  }, [regularItems, layout.currentLayout]);

  // Generate grid style based on layout settings
  const gridStyle = {
    gridTemplateColumns:
      layout.currentLayout === InventoryLayoutType.LIST ? '1fr' : `repeat(${layout.gridColumns}, ${layout.itemSize}vh)`,
    gridAutoRows: layout.currentLayout === InventoryLayoutType.LIST ? 'auto' : `${layout.itemSize}vh`,
    transition: layout.animations ? 'all 0.3s ease-in-out' : 'none',
  };

  // Function to handle setting references
  const handleRef = (index: number, element: HTMLDivElement | null) => {
    // If this is the last visible item, use the intersection observer ref
    if (index === (page + 1) * PAGE_SIZE - 1) {
      (ref as any)(element);
    }
  };

  return (
    <>
      {isLeftInventory && layout.showHotbar && hotbarItems.length > 0 && (
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

      {layout.currentLayout === InventoryLayoutType.CATEGORIES && categorizedItems ? (
        // Categorical view
        <div ref={containerRef} style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
          {Object.entries(categorizedItems).map(([category, items], categoryIndex) => {
            const indexOffset = Object.entries(categorizedItems)
              .slice(0, categoryIndex)
              .reduce((acc, [_, items]) => acc + items.length, 0);

            return (
              <CategorySection
                key={`category-${category}`}
                name={category}
                items={items}
                inventory={inventory}
                indexOffset={indexOffset}
                onRef={handleRef}
              />
            );
          })}
        </div>
      ) : (
        // Regular grid view
        <div
          className="inventory-grid-container"
          ref={containerRef}
          style={{
            ...gridStyle,
            pointerEvents: isBusy ? 'none' : 'auto',
          }}
        >
          {(isLeftInventory ? regularItems : inventory.items).slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
            <InventorySlot
              key={`${inventory.type}-${inventory.id}-${item.slot}`}
              item={item}
              ref={(element) => handleRef(index, element)}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
            />
          ))}
        </div>
      )}

      {inventory.maxWeight && layout.showWeight && (
        <SegmentedWeightBar weight={weight / 1000} maxWeight={inventory.maxWeight / 1000} />
      )}
    </>
  );
};

export default InventoryGrid;
