import { Inventory, SlotWithItem } from '../../typings';
import React, { Fragment, useMemo } from 'react';
import { Items } from '../../store/items';
import { Locale } from '../../store/locale';
import ReactMarkdown from 'react-markdown';
import { useAppSelector } from '../../store';
import ClockIcon from '../utils/icons/ClockIcon';
import { getItemUrl } from '../../helpers';
import Divider from '../utils/Divider';
import { cn } from '@/lib/utils';

interface SlotTooltipProps {
  item: SlotWithItem;
  inventoryType: Inventory['type'];
  className?: string;
}

const SlotTooltip: React.FC<SlotTooltipProps> = ({ item, inventoryType, className }) => {
  const additionalMetadata = useAppSelector((state) => state.inventory.additionalMetadata);
  const itemData = useMemo(() => Items[item.name], [item]);
  const ingredients = useMemo(() => {
    if (!item.ingredients) return null;
    return Object.entries(item.ingredients).sort((a, b) => a[1] - b[1]);
  }, [item]);
  const description = item.metadata?.description || itemData?.description;
  const ammoName = itemData?.ammoName && Items[itemData?.ammoName]?.label;

  if (!itemData) {
    return (
      <div
        className={cn(
          'pointer-events-none flex bg-game-primary w-50 p-2 flex-col min-w-50 text-game-text font-sans rounded border border-black/20 border-inset',
          className
        )}
      >
        <div className="flex flex-row justify-between items-center">
          <p className="text-sm font-normal">{item.name}</p>
        </div>
        <Divider />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'pointer-events-none flex bg-game-primary w-50 p-2 flex-col min-w-50 text-game-text font-sans rounded',
        className
      )}
    >
      <div className="flex flex-row justify-between items-center">
        <p className="text-sm font-normal">{item.metadata?.label || itemData.label || item.name}</p>
        {inventoryType === 'crafting' ? (
          <div className="flex flex-row items-center justify-center">
            <ClockIcon />
            <p className="text-sm ml-1">{(item.duration !== undefined ? item.duration : 3000) / 1000}s</p>
          </div>
        ) : (
          <p className="text-sm">{item.metadata?.type}</p>
        )}
      </div>
      <Divider />
      {description && (
        <div className="pt-1.5">
          <ReactMarkdown className="prose prose-sm">{description}</ReactMarkdown>
        </div>
      )}
      {inventoryType !== 'crafting' ? (
        <>
          {item.durability !== undefined && (
            <p className="text-xs">
              {Locale.ui_durability}: {Math.trunc(item.durability)}
            </p>
          )}
          {item.metadata?.ammo !== undefined && (
            <p className="text-xs">
              {Locale.ui_ammo}: {item.metadata.ammo}
            </p>
          )}
          {ammoName && (
            <p className="text-xs">
              {Locale.ammo_type}: {ammoName}
            </p>
          )}
          {item.metadata?.serial && (
            <p className="text-xs">
              {Locale.ui_serial}: {item.metadata.serial}
            </p>
          )}
          {item.metadata?.components && item.metadata?.components[0] && (
            <p className="text-xs">
              {Locale.ui_components}:{' '}
              {(item.metadata?.components).map((component: string, index: number, array: []) =>
                index + 1 === array.length ? Items[component]?.label : Items[component]?.label + ', '
              )}
            </p>
          )}
          {item.metadata?.weapontint && (
            <p className="text-xs">
              {Locale.ui_tint}: {item.metadata.weapontint}
            </p>
          )}
          {additionalMetadata.map((data: { metadata: string; value: string }, index: number) => (
            <Fragment key={`metadata-${index}`}>
              {item.metadata && item.metadata[data.metadata] && (
                <p className="text-xs">
                  {data.value}: {item.metadata[data.metadata]}
                </p>
              )}
            </Fragment>
          ))}
        </>
      ) : (
        <div className="pt-1.5">
          {ingredients &&
            ingredients.map((ingredient) => {
              const [item, count] = [ingredient[0], ingredient[1]];
              return (
                <div className="flex flex-row items-center" key={`ingredient-${item}`}>
                  <img src={item ? getItemUrl(item) : 'none'} alt="item-image" className="w-7 h-7 pr-1.5" />
                  <p className="text-xs">
                    {count >= 1
                      ? `${count}x ${Items[item]?.label || item}`
                      : count === 0
                      ? `${Items[item]?.label || item}`
                      : count < 1 && `${count * 100}% ${Items[item]?.label || item}`}
                  </p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default SlotTooltip;
