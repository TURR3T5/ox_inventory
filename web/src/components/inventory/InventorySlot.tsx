import React, { useCallback, useRef } from 'react';
import { DragSource, Inventory, InventoryType, Slot, SlotWithItem } from '../../typings';
import { useDrag, useDragDropManager, useDrop } from 'react-dnd';
import { useAppDispatch } from '../../store';
import WeightBar from '../ui/weight-bar';
import { onDrop } from '../../dnd/onDrop';
import { onBuy } from '../../dnd/onBuy';
import { Items } from '../../store/items';
import { canCraftItem, canPurchaseItem, getItemUrl, isSlotWithItem } from '../../helpers';
import { onUse } from '../../dnd/onUse';
import { Locale } from '../../store/locale';
import { onCraft } from '../../dnd/onCraft';
import useNuiEvent from '../../hooks/useNuiEvent';
import { ItemsPayload } from '../../reducers/refreshSlots';
import { closeTooltip, openTooltip } from '../../store/tooltip';
import { closeContextMenu, openContextMenu } from '../../store/contextMenu';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { getRarityFromMetadata, getRarityConfig } from '../utils/rarity';

interface SlotProps {
  inventoryId: Inventory['id'];
  inventoryType: Inventory['type'];
  inventoryGroups: Inventory['groups'];
  item: Slot;
}

const InventorySlot: React.ForwardRefRenderFunction<HTMLDivElement, SlotProps> = (
  { item, inventoryId, inventoryType, inventoryGroups },
  ref
) => {
  const manager = useDragDropManager();
  const dispatch = useAppDispatch();
  const timerRef = useRef<number | null>(null);

  const rarity = getRarityFromMetadata(item.metadata);
  const rarityConfig = getRarityConfig(rarity);

  const canDrag = useCallback(() => {
    return canPurchaseItem(item, { type: inventoryType, groups: inventoryGroups }) && canCraftItem(item, inventoryType);
  }, [item, inventoryType, inventoryGroups]);

  const [{ isDragging }, drag] = useDrag<DragSource, void, { isDragging: boolean }>(
    () => ({
      type: 'SLOT',
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: () =>
        isSlotWithItem(item, inventoryType !== InventoryType.SHOP)
          ? {
              inventory: inventoryType,
              item: {
                name: item.name,
                slot: item.slot,
              },
              image: item?.name && `url(${getItemUrl(item as SlotWithItem) || 'none'}`,
            }
          : null,
      canDrag,
    }),
    [inventoryType, item]
  );

  const [{ isOver }, drop] = useDrop<DragSource, void, { isOver: boolean }>(
    () => ({
      accept: 'SLOT',
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
      drop: (source) => {
        dispatch(closeTooltip());
        switch (source.inventory) {
          case InventoryType.SHOP:
            onBuy(source, { inventory: inventoryType, item: { slot: item.slot } });
            break;
          case InventoryType.CRAFTING:
            onCraft(source, { inventory: inventoryType, item: { slot: item.slot } });
            break;
          default:
            onDrop(source, { inventory: inventoryType, item: { slot: item.slot } });
            break;
        }
      },
      canDrop: (source) =>
        (source.item.slot !== item.slot || source.inventory !== inventoryType) &&
        inventoryType !== InventoryType.SHOP &&
        inventoryType !== InventoryType.CRAFTING,
    }),
    [inventoryType, item]
  );

  useNuiEvent('refreshSlots', (data: { items?: ItemsPayload | ItemsPayload[] }) => {
    if (!isDragging && !data.items) return;
    if (!Array.isArray(data.items)) return;

    const itemSlot = data.items.find(
      (dataItem) => dataItem.item.slot === item.slot && dataItem.inventory === inventoryId
    );

    if (!itemSlot) return;

    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  const connectRef = useCallback(
    (element: HTMLDivElement) => {
      drag(drop(element));
      if (ref && typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    },
    [drag, drop, ref]
  );

  const handleContext = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (inventoryType !== 'player' || !isSlotWithItem(item)) return;

    dispatch(openContextMenu({ item, coords: { x: event.clientX, y: event.clientY } }));
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
    if (timerRef.current) clearTimeout(timerRef.current);
    if (event.ctrlKey && isSlotWithItem(item) && inventoryType !== 'shop' && inventoryType !== 'crafting') {
      onDrop({ item: item, inventory: inventoryType });
    } else if (event.altKey && isSlotWithItem(item) && inventoryType === 'player') {
      onUse(item);
    }
  };

  return (
    <motion.div
      ref={connectRef}
      onContextMenu={handleContext}
      onClick={handleClick}
      className={cn(
        'relative rounded-lg border-2 transition-all duration-500 transform-gpu cursor-pointer',
        'min-h-[80px] min-w-[80px] overflow-hidden',
        {
          'bg-gradient-to-br from-cyber-card to-cyber-card-dark': !isSlotWithItem(item),
          'bg-gradient-to-br from-cyber-card/90 to-cyber-card-dark/90': isSlotWithItem(item),
          'brightness-75 grayscale':
            !canPurchaseItem(item, { type: inventoryType, groups: inventoryGroups }) ||
            !canCraftItem(item, inventoryType),
          'border-cyber-accent shadow-lg shadow-cyber-accent/25 scale-105': isOver,
          'border-cyber-border': !isOver && isSlotWithItem(item),
          'border-cyber-border/50': !isOver && !isSlotWithItem(item),
          'hover:scale-105 hover:shadow-xl': true,
        }
      )}
      style={{
        opacity: isDragging ? 0.4 : 1.0,
        backgroundImage: item?.name ? `url(${getItemUrl(item as SlotWithItem)})` : 'none',
        backgroundSize: '60%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        borderColor: isSlotWithItem(item) ? rarityConfig.borderColor : undefined,
        boxShadow: isSlotWithItem(item)
          ? `0 0 20px ${rarityConfig.glowColor}, 0 4px 20px rgba(0,0,0,0.3)`
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: isSlotWithItem(item)
          ? `0 0 30px ${rarityConfig.glowColor}, 0 8px 30px rgba(0,0,0,0.4)`
          : '0 8px 30px rgba(0,0,0,0.4)',
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rarity Border Glow */}
      {isSlotWithItem(item) && rarity !== 'common' && (
        <div
          className="absolute inset-0 rounded-lg opacity-30 pointer-events-none rarity-glow"
          style={{
            background: `linear-gradient(45deg, ${rarityConfig.glowColor}, transparent 70%)`,
          }}
        />
      )}

      {isSlotWithItem(item) && (
        <div
          className="absolute inset-0 flex flex-col justify-between h-full p-1 rounded-lg"
          onMouseEnter={() => {
            timerRef.current = window.setTimeout(() => {
              dispatch(openTooltip({ item, inventoryType }));
            }, 500) as unknown as number;
          }}
          onMouseLeave={() => {
            dispatch(closeTooltip());
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
          }}
        >
          <div
            className={cn(
              'flex flex-row',
              inventoryType === 'player' && item.slot <= 5 ? 'justify-between' : 'justify-end'
            )}
          >
            {inventoryType === 'player' && item.slot <= 5 && (
              <div className="bg-cyber-accent text-cyber-bg min-h-[16px] min-w-[16px] rounded-sm px-1 text-xs font-bold flex items-center justify-center shadow-lg">
                {item.slot}
              </div>
            )}

            <div className="flex flex-row gap-1 text-xs font-semibold text-cyber-text-bright drop-shadow-lg">
              <p>
                {item.weight > 0
                  ? item.weight >= 1000
                    ? `${(item.weight / 1000).toLocaleString('en-us', {
                        minimumFractionDigits: 2,
                      })}kg`
                    : `${item.weight.toLocaleString('en-us', {
                        minimumFractionDigits: 0,
                      })}g`
                  : ''}
              </p>
              <p>{item.count ? item.count.toLocaleString('en-us') + `x` : ''}</p>
            </div>
          </div>

          <div className="space-y-1">
            {inventoryType !== 'shop' && item?.durability !== undefined && (
              <WeightBar percent={item.durability} durability />
            )}

            {inventoryType === 'shop' && item?.price !== undefined && (
              <>
                {item?.currency !== 'money' && item.currency !== 'black_money' && item.price > 0 && item.currency ? (
                  <div className="flex flex-row justify-end items-center gap-1">
                    <img src={item.currency ? getItemUrl(item.currency) : 'none'} alt="currency" className="h-4 w-4" />
                    <p className="text-xs font-bold text-cyber-accent drop-shadow">
                      {item.price.toLocaleString('en-us')}
                    </p>
                  </div>
                ) : (
                  <>
                    {item.price > 0 && (
                      <div
                        className="flex flex-row justify-end"
                        style={{ color: item.currency === 'money' || !item.currency ? '#10B981' : '#EF4444' }}
                      >
                        <p className="text-xs font-bold drop-shadow">
                          {Locale.$ || '$'}
                          {item.price.toLocaleString('en-us')}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            <div className="bg-gradient-to-r from-cyber-bg/90 to-cyber-card-dark/90 backdrop-blur-sm rounded border-t border-cyber-border/30">
              <div className="px-2 py-1 text-center">
                <div className="text-xs font-bold text-cyber-text-bright uppercase truncate">
                  {item.metadata?.label ? item.metadata.label : Items[item.name]?.label || item.name}
                </div>
                {rarity !== 'common' && (
                  <div
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: rarityConfig.textColor }}
                  >
                    {rarityConfig.label}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isSlotWithItem(item) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyber-border/30 rounded border-dashed" />
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(React.forwardRef(InventorySlot));
