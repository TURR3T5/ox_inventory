// components/inventory/CraftingInterface.tsx
import React, { useState } from 'react';
import { useAppDispatch } from '../../store';
import { DragSource, SlotWithItem } from '../../typings';
import { getItemUrl } from '../../helpers';
import { useDrop } from 'react-dnd';

const CraftingInterface: React.FC = () => {
  const [ingredientSlots, setIngredientSlots] = useState<(SlotWithItem | null)[]>(Array(8).fill(null));
  const [resultSlot, setResultSlot] = useState<SlotWithItem | null>(null);

  const renderMiniSlot = (item: SlotWithItem | null, index: number) => {
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

          // In a real implementation, this would trigger a backend call to check if recipe is valid
          // and then update the result slot accordingly
        },
      }),
      [index, ingredientSlots]
    );

    return (
      <div
        ref={drop}
        className={`crafting-mini-slot ${isOver ? 'crafting-slot-hover' : ''}`}
        style={{
          backgroundImage: item ? `url(${getItemUrl(item)})` : 'none',
        }}
      >
        {!item && <span className="crafting-slot-plus">+</span>}
      </div>
    );
  };

  const renderResultSlot = () => {
    return (
      <div
        className="crafting-result-slot"
        style={{
          backgroundImage: resultSlot ? `url(${getItemUrl(resultSlot)})` : 'none',
        }}
      >
        {!resultSlot && <div className="crafting-result-indicator"></div>}
      </div>
    );
  };

  return (
    <div className="crafting-interface">
      <div className="crafting-grid-container">
        <div className="crafting-ingredients-grid">
          {ingredientSlots.map((slot, index) => renderMiniSlot(slot, index))}
        </div>

        <div className="crafting-arrow">→</div>

        {renderResultSlot()}
      </div>
    </div>
  );
};

export default CraftingInterface;
