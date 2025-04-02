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
      description = Locale.ui_shopdescription || 'Items available for purchase.';
      break;
    case 'crafting':
      icon = <CraftingIcon />;
      description = Locale.ui_craftingdescription || 'Craft items using materials.';
      break;
    case 'container':
      icon = <ContainerIcon />;
      description = Locale.ui_containerdescription || 'Items stored in this container.';
      break;
    default:
      icon = <InventoryIcon />;
      description = Locale.ui_secondarydescription || 'Secondary storage.';
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
