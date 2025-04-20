import React, { useState, useEffect } from 'react';
import { DragSource, SlotWithItem } from '../../typings';
import { getItemUrl } from '../../helpers';
import { useDrop } from 'react-dnd';
import { Locale } from '../../store/locale';

const CraftingInterface: React.FC = () => {
  const [ingredientSlots, setIngredientSlots] = useState<(SlotWithItem | null)[]>(Array(5).fill(null));
  const [canCraft, setCanCraft] = useState(false);

  useEffect(() => {
    const hasIngredients = ingredientSlots.some((slot) => slot !== null);
    setCanCraft(hasIngredients);

    // In a real implementation, you would check against recipes here
    // and only set canCraft to true if there's a valid recipe
  }, [ingredientSlots]);

  const renderSlot = (item: SlotWithItem | null, index: number) => {
    const [{ isOver }, drop] = useDrop<DragSource, void, { isOver: boolean }>(
      () => ({
        accept: 'SLOT',
        collect: (monitor) => ({
          isOver: monitor.isOver(),
        }),
        drop: (source) => {
          const newSlots = [...ingredientSlots];
          newSlots[index] = {
            slot: source.item.slot,
            name: source.item.name,
            count: 1,
            weight: 0,
          } as SlotWithItem;
          setIngredientSlots(newSlots);
        },
      }),
      [index, ingredientSlots]
    );

    return (
      <div
        ref={drop}
        className={`inventory-slot ${isOver ? 'crafting-slot-hover' : ''}`}
        style={{
          backgroundImage: item ? `url(${getItemUrl(item)})` : 'none',
        }}
      >
        {!item && <div className="crafting-slot-placeholder"></div>}
        {item && (
          <div className="item-slot-wrapper">
            <div className="item-slot-header-wrapper">
              <div className="item-slot-info-wrapper">
                <p>{item.count > 1 ? `${item.count}x` : ''}</p>
              </div>
            </div>
            <div className="inventory-slot-label-box">
              <div className="inventory-slot-label-text">{item.name}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleCraft = () => {
    // Handle crafting logic here
    console.log('Crafting with ingredients:', ingredientSlots);

    // Reset slots after crafting
    setIngredientSlots(Array(5).fill(null));
  };

  return (
    <div className="crafting-interface">
      <div className="crafting-slots-row">{ingredientSlots.map((slot, index) => renderSlot(slot, index))}</div>
    </div>
  );
};

export default CraftingInterface;
