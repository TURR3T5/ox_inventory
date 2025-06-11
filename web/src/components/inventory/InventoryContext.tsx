import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { onDrop } from '../../dnd/onDrop';
import { Items } from '../../store/items';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import { isSlotWithItem } from '../../helpers';
import { setClipboard } from '../../utils/setClipboard';
import { useAppSelector } from '../../store';
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface DataProps {
  action: string;
  component?: string;
  slot?: number;
  serial?: string;
  id?: number;
}

interface Button {
  label: string;
  index: number;
  group?: string;
}

interface Group {
  groupName: string | null;
  buttons: ButtonWithIndex[];
}

interface ButtonWithIndex extends Button {
  index: number;
}

interface GroupedButtons extends Array<Group> {}

const InventoryContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contextMenu = useAppSelector((state) => state.contextMenu);
  const item = contextMenu.item;

  const handleClick = (data: DataProps) => {
    if (!item) return;

    switch (data && data.action) {
      case 'use':
        onUse({ name: item.name, slot: item.slot });
        break;
      case 'give':
        onGive({ name: item.name, slot: item.slot });
        break;
      case 'drop':
        isSlotWithItem(item) && onDrop({ item: item, inventory: 'player' });
        break;
      case 'remove':
        fetchNui('removeComponent', { component: data?.component, slot: data?.slot });
        break;
      case 'removeAmmo':
        fetchNui('removeAmmo', item.slot);
        break;
      case 'copy':
        setClipboard(data.serial || '');
        break;
      case 'custom':
        fetchNui('useButton', { id: (data?.id || 0) + 1, slot: item.slot });
        break;
    }
  };

  const groupButtons = (buttons: any): GroupedButtons => {
    return buttons.reduce((groups: Group[], button: Button, index: number) => {
      if (button.group) {
        const groupIndex = groups.findIndex((group) => group.groupName === button.group);
        if (groupIndex !== -1) {
          groups[groupIndex].buttons.push({ ...button, index });
        } else {
          groups.push({
            groupName: button.group,
            buttons: [{ ...button, index }],
          });
        }
      } else {
        groups.push({
          groupName: null,
          buttons: [{ ...button, index }],
        });
      }
      return groups;
    }, []);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48 bg-game-primary border-black/20">
        <ContextMenuItem onClick={() => handleClick({ action: 'use' })}>{Locale.ui_use || 'Use'}</ContextMenuItem>
        <ContextMenuItem onClick={() => handleClick({ action: 'give' })}>{Locale.ui_give || 'Give'}</ContextMenuItem>
        <ContextMenuItem onClick={() => handleClick({ action: 'drop' })}>{Locale.ui_drop || 'Drop'}</ContextMenuItem>
        {item && item.metadata?.ammo > 0 && (
          <ContextMenuItem onClick={() => handleClick({ action: 'removeAmmo' })}>
            {Locale.ui_remove_ammo}
          </ContextMenuItem>
        )}
        {item && item.metadata?.serial && (
          <ContextMenuItem onClick={() => handleClick({ action: 'copy', serial: item.metadata?.serial })}>
            {Locale.ui_copy}
          </ContextMenuItem>
        )}
        {item && item.metadata?.components && item.metadata?.components.length > 0 && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>{Locale.ui_removeattachments}</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {item &&
                item.metadata?.components.map((component: string, index: number) => (
                  <ContextMenuItem
                    key={index}
                    onClick={() => handleClick({ action: 'remove', component, slot: item.slot })}
                  >
                    {Items[component]?.label || ''}
                  </ContextMenuItem>
                ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}
        {((item && item.name && Items[item.name]?.buttons?.length) || 0) > 0 && (
          <>
            <ContextMenuSeparator />
            {item &&
              item.name &&
              groupButtons(Items[item.name]?.buttons).map((group: Group, index: number) => (
                <React.Fragment key={index}>
                  {group.groupName ? (
                    <ContextMenuSub>
                      <ContextMenuSubTrigger>{group.groupName}</ContextMenuSubTrigger>
                      <ContextMenuSubContent>
                        {group.buttons.map((button: Button) => (
                          <ContextMenuItem
                            key={button.index}
                            onClick={() => handleClick({ action: 'custom', id: button.index })}
                          >
                            {button.label}
                          </ContextMenuItem>
                        ))}
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                  ) : (
                    group.buttons.map((button: Button) => (
                      <ContextMenuItem
                        key={button.index}
                        onClick={() => handleClick({ action: 'custom', id: button.index })}
                      >
                        {button.label}
                      </ContextMenuItem>
                    ))
                  )}
                </React.Fragment>
              ))}
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default InventoryContext;
