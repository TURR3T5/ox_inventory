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
  const description = Locale.ui_playerinventory || 'Itemsne på din karakter kan findes her.';

  return (
    <div className="inventory-grid-wrapper">
      <SectionHeader title={title} description={description} icon={icon} />
      <InventoryGrid inventory={leftInventory} skipHotbar={true} />
    </div>
  );
};

export default LeftInventory;