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
import { Info } from 'lucide-react';

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

  return (
    <>
      <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
      <div className="flex">
        <div className="flex flex-col gap-5 justify-center items-center">
          <Input
            className="p-4 border-none text-center text-white bg-game-secondary focus:bg-game-secondary-dark transition-colors duration-200 font-sans text-base"
            type="number"
            defaultValue={itemAmount}
            onChange={inputHandler}
            min={0}
          />
          <Button
            ref={use}
            className="text-sm text-white bg-game-secondary hover:bg-game-secondary-dark transition-colors duration-200 p-3 border-none uppercase font-sans w-full font-medium"
          >
            {Locale.ui_use || 'Use'}
          </Button>
          <Button
            ref={give}
            className="text-sm text-white bg-game-secondary hover:bg-game-secondary-dark transition-colors duration-200 p-3 border-none uppercase font-sans w-full font-medium"
          >
            {Locale.ui_give || 'Give'}
          </Button>
          <Button
            onClick={() => fetchNui('exit')}
            className="text-sm text-white bg-game-secondary hover:bg-game-secondary-dark transition-colors duration-200 p-3 border-none uppercase font-sans w-full font-medium"
          >
            {Locale.ui_close || 'Close'}
          </Button>
        </div>
      </div>

      <Button
        onClick={() => setInfoVisible(true)}
        className="fixed bottom-6 right-6 w-13 h-13 flex justify-center items-center fill-white border-none bg-game-secondary hover:bg-game-secondary-dark transition-colors duration-200"
        size="icon"
      >
        <Info className="w-8 h-8" />
      </Button>
    </>
  );
};

export default InventoryControl;
