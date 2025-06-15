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
import { getRarityFromMetadata, getRarityConfig } from '../utils/rarity';
import { motion } from 'framer-motion';

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
  const rarity = getRarityFromMetadata(item.metadata);
  const rarityConfig = getRarityConfig(rarity);

  if (!itemData) {
    return (
      <motion.div
        className={cn(
          'pointer-events-none flex bg-cyber-card border-2 border-cyber-border rounded-lg shadow-xl',
          'w-60 p-3 flex-col min-w-60 text-cyber-text font-sans backdrop-blur-sm',
          className
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-row justify-between items-center">
          <p className="text-sm font-bold text-cyber-text-bright">{item.name}</p>
        </div>
        <Divider />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        'pointer-events-none flex bg-gradient-to-br from-cyber-card to-cyber-card-dark',
        'border-2 rounded-lg shadow-xl backdrop-blur-sm',
        'w-60 p-3 flex-col min-w-60 text-cyber-text font-sans',
        className
      )}
      style={{
        borderColor: rarityConfig.borderColor,
        boxShadow: `0 0 20px ${rarityConfig.glowColor}, 0 8px 30px rgba(0,0,0,0.5)`,
      }}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-row justify-between items-center">
        <div>
          <p className="text-sm font-bold text-cyber-text-bright">
            {item.metadata?.label || itemData.label || item.name}
          </p>
          {rarity !== 'common' && (
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: rarityConfig.textColor }}>
              {rarityConfig.label}
            </p>
          )}
        </div>
        {inventoryType === 'crafting' ? (
          <div className="flex flex-row items-center justify-center">
            <ClockIcon />
            <p className="text-sm ml-1 text-cyber-accent">
              {(item.duration !== undefined ? item.duration : 3000) / 1000}s
            </p>
          </div>
        ) : (
          <p className="text-sm text-cyber-accent">{item.metadata?.type}</p>
        )}
      </div>

      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-border to-transparent my-2" />

      {description && (
        <div className="pt-1.5">
          <ReactMarkdown className="prose prose-sm text-cyber-text">{description}</ReactMarkdown>
        </div>
      )}

      {inventoryType !== 'crafting' ? (
        <div className="space-y-1 mt-2">
          {item.durability !== undefined && (
            <p className="text-xs text-cyber-text">
              <span className="text-cyber-accent font-semibold">{Locale.ui_durability}:</span>{' '}
              {Math.trunc(item.durability)}%
            </p>
          )}
          {item.metadata?.ammo !== undefined && (
            <p className="text-xs text-cyber-text">
              <span className="text-cyber-accent font-semibold">{Locale.ui_ammo}:</span> {item.metadata.ammo}
            </p>
          )}
          {ammoName && (
            <p className="text-xs text-cyber-text">
              <span className="text-cyber-accent font-semibold">{Locale.ammo_type}:</span> {ammoName}
            </p>
          )}
          {item.metadata?.serial && (
            <p className="text-xs text-cyber-text">
              <span className="text-cyber-accent font-semibold">{Locale.ui_serial}:</span> {item.metadata.serial}
            </p>
          )}
          {item.metadata?.components && item.metadata?.components[0] && (
            <p className="text-xs text-cyber-text">
              <span className="text-cyber-accent font-semibold">{Locale.ui_components}:</span>{' '}
              {(item.metadata?.components).map((component: string, index: number, array: []) =>
                index + 1 === array.length ? Items[component]?.label : Items[component]?.label + ', '
              )}
            </p>
          )}
          {item.metadata?.weapontint && (
            <p className="text-xs text-cyber-text">
              <span className="text-cyber-accent font-semibold">{Locale.ui_tint}:</span> {item.metadata.weapontint}
            </p>
          )}
          {additionalMetadata.map((data: { metadata: string; value: string }, index: number) => (
            <Fragment key={`metadata-${index}`}>
              {item.metadata && item.metadata[data.metadata] && (
                <p className="text-xs text-cyber-text">
                  <span className="text-cyber-accent font-semibold">{data.value}:</span> {item.metadata[data.metadata]}
                </p>
              )}
            </Fragment>
          ))}
        </div>
      ) : (
        <div className="pt-1.5 space-y-2">
          {ingredients &&
            ingredients.map((ingredient) => {
              const [item, count] = [ingredient[0], ingredient[1]];
              return (
                <div className="flex flex-row items-center" key={`ingredient-${item}`}>
                  <img src={item ? getItemUrl(item) : 'none'} alt="item-image" className="w-7 h-7 pr-1.5" />
                  <p className="text-xs text-cyber-text">
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
    </motion.div>
  );
};

export default SlotTooltip;
