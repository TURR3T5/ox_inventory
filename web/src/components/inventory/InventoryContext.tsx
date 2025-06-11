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

  const itemData = item?.name ? Items[item.name] : undefined;
  const hasButtons = itemData?.buttons && itemData.buttons.length > 0;

  return (
    <>
      {children}
      {contextMenu.coords && item && (
        <div
          className="fixed z-50 min-w-48 bg-game-primary text-game-text p-1 border border-black/20 rounded shadow-lg"
          style={{
            left: contextMenu.coords.x,
            top: contextMenu.coords.y,
          }}
        >
          <div className="flex flex-col">
            <button
              className="px-2 py-1.5 text-sm text-left hover:bg-game-secondary-highlight rounded cursor-pointer"
              onClick={() => handleClick({ action: 'use' })}
            >
              {Locale.ui_use || 'Use'}
            </button>
            <button
              className="px-2 py-1.5 text-sm text-left hover:bg-game-secondary-highlight rounded cursor-pointer"
              onClick={() => handleClick({ action: 'give' })}
            >
              {Locale.ui_give || 'Give'}
            </button>
            <button
              className="px-2 py-1.5 text-sm text-left hover:bg-game-secondary-highlight rounded cursor-pointer"
              onClick={() => handleClick({ action: 'drop' })}
            >
              {Locale.ui_drop || 'Drop'}
            </button>

            {item.metadata?.ammo && item.metadata.ammo > 0 && (
              <button
                className="px-2 py-1.5 text-sm text-left hover:bg-game-secondary-highlight rounded cursor-pointer"
                onClick={() => handleClick({ action: 'removeAmmo' })}
              >
                {Locale.ui_remove_ammo}
              </button>
            )}

            {item.metadata?.serial && (
              <button
                className="px-2 py-1.5 text-sm text-left hover:bg-game-secondary-highlight rounded cursor-pointer"
                onClick={() => handleClick({ action: 'copy', serial: item.metadata?.serial })}
              >
                {Locale.ui_copy}
              </button>
            )}

            {item.metadata?.components && item.metadata.components.length > 0 && (
              <div className="border-t border-white/12 my-1 pt-1">
                <div className="px-2 py-1.5 text-sm font-semibold">{Locale.ui_removeattachments}</div>
                {item.metadata.components.map((component: string, index: number) => (
                  <button
                    key={index}
                    className="px-4 py-1.5 text-sm text-left hover:bg-game-secondary-highlight rounded cursor-pointer w-full"
                    onClick={() => handleClick({ action: 'remove', component, slot: item.slot })}
                  >
                    {Items[component]?.label || ''}
                  </button>
                ))}
              </div>
            )}

            {hasButtons && (
              <div className="border-t border-white/12 my-1 pt-1">
                {groupButtons(itemData.buttons).map((group: Group, index: number) => (
                  <div key={index}>
                    {group.groupName ? (
                      <div>
                        <div className="px-2 py-1.5 text-sm font-semibold">{group.groupName}</div>
                        {group.buttons.map((button: Button) => (
                          <button
                            key={button.index}
                            className="px-4 py-1.5 text-sm text-left hover:bg-game-secondary-highlight rounded cursor-pointer w-full"
                            onClick={() => handleClick({ action: 'custom', id: button.index })}
                          >
                            {button.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      group.buttons.map((button: Button) => (
                        <button
                          key={button.index}
                          className="px-2 py-1.5 text-sm text-left hover:bg-game-secondary-highlight rounded cursor-pointer w-full"
                          onClick={() => handleClick({ action: 'custom', id: button.index })}
                        >
                          {button.label}
                        </button>
                      ))
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryContext;
