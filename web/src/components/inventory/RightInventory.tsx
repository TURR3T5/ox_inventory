import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector } from '../../store';
import { selectRightInventory } from '../../store/inventory';
import SectionHeader from './SectionHeader';
import { ShopIcon, ContainerIcon, CraftingIcon, InventoryIcon } from './InventoryIcons';
import { Locale } from '../../store/locale';

const RightInventory: React.FC = () => {
  const rightInventory = useAppSelector(selectRightInventory);

  let icon;
  let description;

  switch (rightInventory.type) {
    case 'shop':
      icon = <ShopIcon />;
      description = Locale.ui_shopdescription || 'Items som du kan købe.';
      break;
    case 'crafting':
      icon = <CraftingIcon />;
      description = Locale.ui_craftingdescription || 'Craft items ved at bruge materialer.';
      break;
    case 'container':
      icon = <ContainerIcon />;
      description = Locale.ui_containerdescription || 'Items opbevaret i denne container.';
      break;
    default:
      icon = <InventoryIcon />;
      description = Locale.ui_secondarydescription || 'Sekundær Opbevaring.';
  }

  const title = rightInventory.label || 'SECONDARY';

  return (
    <div className="inventory-grid-wrapper">
      <SectionHeader title={title} description={description} icon={icon} />
      <InventoryGrid inventory={rightInventory} />
    </div>
  );
};

export default RightInventory;
