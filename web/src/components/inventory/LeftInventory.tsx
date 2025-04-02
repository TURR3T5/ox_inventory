import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import SectionHeader from './SectionHeader';
import { InventoryIcon, PlayerIcon } from './InventoryIcons';
import { Locale } from '../../store/locale';

const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  const icon = leftInventory.type === 'player' ? <PlayerIcon /> : <InventoryIcon />;
  const title = leftInventory.label || 'INVENTORY';
  const description = Locale.ui_playerinventory || 'The items on your character can be found here.';

  return (
    <div className="inventory-grid-wrapper">
      <SectionHeader title={title} description={description} icon={icon} />
      <InventoryGrid inventory={leftInventory} />
    </div>
  );
};

export default LeftInventory;
