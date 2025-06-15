import InventoryComponent from './components/inventory';
import useNuiEvent from './hooks/useNuiEvent';
import { Items } from './store/items';
import { Locale } from './store/locale';
import { setImagePath } from './store/imagepath';
import { setupInventory } from './store/inventory';
import { Inventory } from './typings';
import { useAppDispatch } from './store';
import { debugData } from './utils/debugData';
import DragPreview from './components/utils/DragPreview';
import { fetchNui } from './utils/fetchNui';
import { useDragDropManager } from 'react-dnd';
import KeyPress from './components/utils/KeyPress';
import { useEffect } from 'react';

debugData([
  {
    action: 'setupInventory',
    data: {
      leftInventory: {
        id: 'test',
        type: 'player',
        slots: 50,
        label: 'Bob Smith',
        weight: 3000,
        maxWeight: 5000,
        items: [
          {
            slot: 1,
            name: 'common_item',
            weight: 100,
            metadata: { rarity: 'common', description: 'A common item' },
            count: 5,
          },
          {
            slot: 2,
            name: 'uncommon_weapon',
            weight: 200,
            metadata: { rarity: 'uncommon', description: 'An uncommon weapon', durability: 85 },
            count: 1,
          },
          {
            slot: 3,
            name: 'rare_armor',
            weight: 300,
            metadata: { rarity: 'rare', description: 'Rare protective armor' },
            count: 1,
          },
          {
            slot: 4,
            name: 'epic_sword',
            weight: 400,
            metadata: { rarity: 'epic', description: 'An epic blade forged by masters' },
            count: 1,
          },
          {
            slot: 5,
            name: 'legendary_shield',
            weight: 500,
            metadata: { rarity: 'legendary', description: 'A legendary shield of ancient power' },
            count: 1,
          },
          {
            slot: 16,
            name: 'mythic_gem',
            weight: 50,
            metadata: { rarity: 'mythic', description: 'A mythic gem pulsing with energy' },
            count: 3,
          },
          {
            slot: 17,
            name: 'divine_artifact',
            weight: 1000,
            metadata: { rarity: 'divine', description: 'A divine artifact blessed by gods' },
            count: 1,
          },
        ],
      },
      rightInventory: {
        id: 'ground',
        type: 'container',
        slots: 30,
        label: 'Ground',
        weight: 0,
        maxWeight: 10000,
        items: [],
      },
    },
  },
]);

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const manager = useDragDropManager();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX + 10}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY + 10}px`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useNuiEvent<{
    locale: { [key: string]: string };
    items: typeof Items;
    leftInventory: Inventory;
    imagepath: string;
  }>('init', ({ locale, items, leftInventory, imagepath }) => {
    for (const name in locale) Locale[name] = locale[name];
    for (const name in items) Items[name] = items[name];

    setImagePath(imagepath);
    dispatch(setupInventory({ leftInventory }));
  });

  fetchNui('uiLoaded', {});

  useNuiEvent('closeInventory', () => {
    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  return (
    <div className="h-full w-full text-white">
      <InventoryComponent />
      <DragPreview />
      <KeyPress />
    </div>
  );
};

addEventListener('dragstart', function (event) {
  event.preventDefault();
});

export default App;
