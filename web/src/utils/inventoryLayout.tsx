import React, { useState, useEffect } from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../store';
import type { RootState } from '../store';
import { fetchNui } from './fetchNui';
import { isEnvBrowser } from './misc';

// Define available layout types
export enum InventoryLayoutType {
  GRID = 'grid',
  LIST = 'list',
  COMPACT = 'compact',
  CATEGORIES = 'categories',
}

// Define state for layout preferences
interface LayoutState {
  currentLayout: InventoryLayoutType;
  gridColumns: number;
  compactMode: boolean;
  showCategories: boolean;
  showWeight: boolean;
  showHotbar: boolean;
  animations: boolean;
  itemSize: number; // Size in vh units
}

const initialState: LayoutState = {
  currentLayout: InventoryLayoutType.GRID,
  gridColumns: 5,
  compactMode: false,
  showCategories: false,
  showWeight: true,
  showHotbar: true,
  animations: true,
  itemSize: 11, // Default size from the CSS
};

// Create Redux slice for layout management
export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setLayout: (state, action: PayloadAction<InventoryLayoutType>) => {
      state.currentLayout = action.payload;

      // Update related settings based on layout
      switch (action.payload) {
        case InventoryLayoutType.COMPACT:
          state.compactMode = true;
          state.gridColumns = 6;
          state.itemSize = 9;
          break;
        case InventoryLayoutType.LIST:
          state.compactMode = true;
          state.gridColumns = 1;
          break;
        case InventoryLayoutType.CATEGORIES:
          state.showCategories = true;
          state.gridColumns = 5;
          state.itemSize = 11;
          break;
        default:
          state.compactMode = false;
          state.gridColumns = 5;
          state.showCategories = false;
          state.itemSize = 11;
      }

      // Save preferences to localStorage in browser mode
      if (isEnvBrowser()) {
        localStorage.setItem(
          'inventory-layout',
          JSON.stringify({
            currentLayout: state.currentLayout,
            gridColumns: state.gridColumns,
            compactMode: state.compactMode,
            showCategories: state.showCategories,
            itemSize: state.itemSize,
          })
        );
      } else {
        // Save to game settings via NUI
        fetchNui('saveLayoutPreferences', {
          layout: state.currentLayout,
          columns: state.gridColumns,
          compact: state.compactMode,
          categories: state.showCategories,
          itemSize: state.itemSize,
        });
      }
    },
    setGridColumns: (state, action: PayloadAction<number>) => {
      state.gridColumns = action.payload;
    },
    setItemSize: (state, action: PayloadAction<number>) => {
      state.itemSize = action.payload;
    },
    toggleCompactMode: (state) => {
      state.compactMode = !state.compactMode;
    },
    toggleCategories: (state) => {
      state.showCategories = !state.showCategories;
    },
    toggleWeightDisplay: (state) => {
      state.showWeight = !state.showWeight;
    },
    toggleHotbar: (state) => {
      state.showHotbar = !state.showHotbar;
    },
    toggleAnimations: (state) => {
      state.animations = !state.animations;
    },
    loadSavedLayout: (state, action: PayloadAction<Partial<LayoutState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setLayout,
  setGridColumns,
  setItemSize,
  toggleCompactMode,
  toggleCategories,
  toggleWeightDisplay,
  toggleHotbar,
  toggleAnimations,
  loadSavedLayout,
} = layoutSlice.actions;

export const selectLayout = (state: RootState) => state.layout;

// Layout toggle component
export const LayoutToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const layout = useAppSelector(selectLayout);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved layout preferences on mount
    const loadLayout = async () => {
      try {
        if (isEnvBrowser()) {
          const savedLayout = localStorage.getItem('inventory-layout');
          if (savedLayout) {
            dispatch(loadSavedLayout(JSON.parse(savedLayout)));
          }
        } else {
          const response = await fetchNui<Partial<LayoutState>>('getLayoutPreferences');
          if (response) {
            dispatch(loadSavedLayout(response));
          }
        }
      } catch (error) {
        console.error('Failed to load layout preferences:', error);
      }
    };

    loadLayout();
  }, [dispatch]);

  return (
    <div className="layout-toggle-container">
      <button className="layout-toggle-button" onClick={() => setIsOpen(!isOpen)}>
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
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="layout-options-panel">
          <div className="layout-options-header">
            <h3>Layout Options</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="layout-options-content">
            <div className="layout-option-group">
              <p>View Type</p>
              <div className="layout-buttons">
                <button
                  className={layout.currentLayout === InventoryLayoutType.GRID ? 'active' : ''}
                  onClick={() => dispatch(setLayout(InventoryLayoutType.GRID))}
                >
                  Grid
                </button>
                <button
                  className={layout.currentLayout === InventoryLayoutType.LIST ? 'active' : ''}
                  onClick={() => dispatch(setLayout(InventoryLayoutType.LIST))}
                >
                  List
                </button>
                <button
                  className={layout.currentLayout === InventoryLayoutType.COMPACT ? 'active' : ''}
                  onClick={() => dispatch(setLayout(InventoryLayoutType.COMPACT))}
                >
                  Compact
                </button>
                <button
                  className={layout.currentLayout === InventoryLayoutType.CATEGORIES ? 'active' : ''}
                  onClick={() => dispatch(setLayout(InventoryLayoutType.CATEGORIES))}
                >
                  Categories
                </button>
              </div>
            </div>

            {layout.currentLayout === InventoryLayoutType.GRID && (
              <div className="layout-option-group">
                <p>Grid Size</p>
                <div className="layout-slider">
                  <input
                    type="range"
                    min="3"
                    max="8"
                    value={layout.gridColumns}
                    onChange={(e) => dispatch(setGridColumns(parseInt(e.target.value)))}
                  />
                  <span>{layout.gridColumns} columns</span>
                </div>
              </div>
            )}

            <div className="layout-option-group">
              <p>Item Size</p>
              <div className="layout-slider">
                <input
                  type="range"
                  min="8"
                  max="14"
                  step="0.5"
                  value={layout.itemSize}
                  onChange={(e) => dispatch(setItemSize(parseFloat(e.target.value)))}
                />
                <span>{layout.itemSize}vh</span>
              </div>
            </div>

            <div className="layout-option-toggles">
              <label>
                <input type="checkbox" checked={layout.showWeight} onChange={() => dispatch(toggleWeightDisplay())} />
                Show Weight Bar
              </label>

              <label>
                <input type="checkbox" checked={layout.showHotbar} onChange={() => dispatch(toggleHotbar())} />
                Show Hotbar
              </label>

              <label>
                <input type="checkbox" checked={layout.animations} onChange={() => dispatch(toggleAnimations())} />
                Enable Animations
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook to apply layout styles to inventory grid
export const useInventoryLayout = () => {
  const layout = useAppSelector(selectLayout);

  const gridStyle = {
    gridTemplateColumns:
      layout.currentLayout === InventoryLayoutType.LIST ? '1fr' : `repeat(${layout.gridColumns}, ${layout.itemSize}vh)`,
    gridAutoRows: layout.currentLayout === InventoryLayoutType.LIST ? 'auto' : `${layout.itemSize}vh`,
    transition: layout.animations ? 'all 0.3s ease-in-out' : 'none',
  };

  const slotStyle = (isCompact: boolean = false) => ({
    height: layout.currentLayout === InventoryLayoutType.LIST ? '4.5vh' : `${layout.itemSize}vh`,
    transition: layout.animations ? 'all 0.3s ease-in-out' : 'none',
    display: layout.currentLayout === InventoryLayoutType.LIST ? 'flex' : undefined,
    flexDirection: layout.currentLayout === InventoryLayoutType.LIST ? 'row' : undefined,
    alignItems: layout.currentLayout === InventoryLayoutType.LIST ? 'center' : undefined,
    padding: layout.currentLayout === InventoryLayoutType.LIST ? '0 10px' : undefined,
    backgroundSize: isCompact || layout.compactMode ? '40%' : '60%',
  });

  return {
    gridStyle,
    slotStyle,
    layout,
  };
};

// Export the logic for categorizing items
export const categorizeItems = (items: any[]) => {
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
