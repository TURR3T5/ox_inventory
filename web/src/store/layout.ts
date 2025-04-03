import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';
import { InventoryLayoutType } from '../utils/inventoryLayout';

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
  itemSize: 11 // Default size from the CSS
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
    }
  }
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
  loadSavedLayout
} = layoutSlice.actions;

export const selectLayout = (state: RootState) => state.layout;

export default layoutSlice.reducer;