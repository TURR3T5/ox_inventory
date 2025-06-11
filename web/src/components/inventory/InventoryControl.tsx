import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { DragSource } from '../../typings';
import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import UsefulControls from './UsefulControls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Info, Package, Gift, X, MousePointer } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const InventoryControl: React.FC = () => {
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();

  const [infoVisible, setInfoVisible] = useState(false);

  const [, use] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onUse(source.item);
    },
  }));

  const [, give] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onGive(source.item);
    },
  }));

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.valueAsNumber =
      isNaN(event.target.valueAsNumber) || event.target.valueAsNumber < 0 ? 0 : Math.floor(event.target.valueAsNumber);
    dispatch(setItemAmount(event.target.valueAsNumber));
  };

  const controlButtons = [
    {
      ref: use,
      icon: <Package className="w-4 h-4" />,
      label: Locale.ui_use || 'Use',
      description: 'Use dragged item',
    },
    {
      ref: give,
      icon: <Gift className="w-4 h-4" />,
      label: Locale.ui_give || 'Give',
      description: 'Give item to player',
    },
    {
      onClick: () => fetchNui('exit'),
      icon: <X className="w-4 h-4" />,
      label: Locale.ui_close || 'Close',
      description: 'Close inventory',
    },
  ];

  return (
    <>
      <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />

      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-cyber-card to-cyber-card-dark p-8 rounded-lg border border-cyber-border shadow-2xl transform -skew-y-2">
          <div className="flex flex-col gap-6 items-center transform skew-y-2">
            {/* Header */}
            <div className="text-center mb-2">
              <h3 className="text-xl font-bold text-cyber-text-bright uppercase tracking-wider">Control Panel</h3>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyber-accent to-transparent mt-2" />
            </div>

            {/* Amount Input */}
            <div className="w-full">
              <label className="block text-xs font-semibold text-cyber-text uppercase tracking-wider mb-2">
                Item Amount
              </label>
              <Input
                className={cn(
                  'w-full bg-cyber-input border-2 border-cyber-input-border',
                  'text-center text-cyber-text-bright font-bold text-lg',
                  'focus:border-cyber-accent focus:ring-2 focus:ring-cyber-accent/30',
                  'transition-all duration-300 transform hover:scale-105',
                  'shadow-inner'
                )}
                type="number"
                defaultValue={itemAmount}
                onChange={inputHandler}
                min={0}
                placeholder="0"
              />
            </div>

            {/* Control Buttons */}
            <div className="w-full space-y-3">
              {controlButtons.map((button, index) => (
                <motion.div
                  key={button.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Button
                    ref={button.ref}
                    onClick={button.onClick}
                    className={cn(
                      'w-full bg-gradient-to-r from-cyber-card-dark to-cyber-card',
                      'border-2 border-cyber-border hover:border-cyber-accent',
                      'text-cyber-text-bright font-bold uppercase tracking-wider',
                      'hover:shadow-lg hover:shadow-cyber-accent/25',
                      'transition-all duration-500 transform hover:scale-105',
                      'group relative overflow-hidden'
                    )}
                    size="lg"
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-center gap-3 relative z-10">
                      {button.icon}
                      <span>{button.label}</span>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Drag Instructions */}
            <div className="text-center text-xs text-cyber-text space-y-1 mt-4 p-3 bg-cyber-bg/50 rounded border border-cyber-border/30">
              <div className="flex items-center gap-2 justify-center text-cyber-accent">
                <MousePointer className="w-3 h-3" />
                <span className="font-semibold uppercase tracking-wider">Quick Actions</span>
              </div>
              <p>Drag items here to use them quickly</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button
          onClick={() => setInfoVisible(true)}
          className={cn(
            'fixed bottom-6 right-6 w-14 h-14',
            'bg-gradient-to-br from-cyber-accent to-cyber-accent/80',
            'border-2 border-cyber-accent hover:border-cyber-text-bright',
            'text-cyber-bg font-bold shadow-lg shadow-cyber-accent/50',
            'hover:shadow-xl hover:shadow-cyber-accent/75',
            'transition-all duration-500 transform hover:scale-110 hover:rotate-12',
            'group'
          )}
          size="icon"
        >
          <Info className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </Button>
      </motion.div>
    </>
  );
};

export default InventoryControl;
