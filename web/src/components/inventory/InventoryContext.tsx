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
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
      <AnimatePresence>
        {contextMenu.coords && item && (
          <motion.div
            className="fixed z-50 min-w-48 bg-gradient-to-br from-cyber-card to-cyber-card-dark border-2 border-cyber-border rounded-lg shadow-2xl backdrop-blur-sm p-2"
            style={{
              left: contextMenu.coords.x,
              top: contextMenu.coords.y,
            }}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-1">
              <button
                className={cn(
                  'px-3 py-2 text-sm text-left text-cyber-text-bright font-medium',
                  'hover:bg-cyber-accent hover:text-cyber-bg rounded transition-all duration-200',
                  'flex items-center gap-2'
                )}
                onClick={() => handleClick({ action: 'use' })}
              >
                <span className="w-4 h-4 bg-cyber-accent/20 rounded flex items-center justify-center text-xs">⚡</span>
                {Locale.ui_use || 'Use'}
              </button>

              <button
                className={cn(
                  'px-3 py-2 text-sm text-left text-cyber-text-bright font-medium',
                  'hover:bg-cyber-accent hover:text-cyber-bg rounded transition-all duration-200',
                  'flex items-center gap-2'
                )}
                onClick={() => handleClick({ action: 'give' })}
              >
                <span className="w-4 h-4 bg-cyber-accent/20 rounded flex items-center justify-center text-xs">🎁</span>
                {Locale.ui_give || 'Give'}
              </button>

              <button
                className={cn(
                  'px-3 py-2 text-sm text-left text-cyber-text-bright font-medium',
                  'hover:bg-red-500 hover:text-white rounded transition-all duration-200',
                  'flex items-center gap-2'
                )}
                onClick={() => handleClick({ action: 'drop' })}
              >
                <span className="w-4 h-4 bg-red-500/20 rounded flex items-center justify-center text-xs">📤</span>
                {Locale.ui_drop || 'Drop'}
              </button>

              {item.metadata?.ammo && item.metadata.ammo > 0 && (
                <>
                  <div className="w-full h-px bg-cyber-border my-1" />
                  <button
                    className={cn(
                      'px-3 py-2 text-sm text-left text-cyber-text-bright font-medium',
                      'hover:bg-cyber-accent hover:text-cyber-bg rounded transition-all duration-200',
                      'flex items-center gap-2'
                    )}
                    onClick={() => handleClick({ action: 'removeAmmo' })}
                  >
                    <span className="w-4 h-4 bg-cyber-accent/20 rounded flex items-center justify-center text-xs">
                      🔫
                    </span>
                    {Locale.ui_remove_ammo}
                  </button>
                </>
              )}

              {item.metadata?.serial && (
                <>
                  <div className="w-full h-px bg-cyber-border my-1" />
                  <button
                    className={cn(
                      'px-3 py-2 text-sm text-left text-cyber-text-bright font-medium',
                      'hover:bg-cyber-accent hover:text-cyber-bg rounded transition-all duration-200',
                      'flex items-center gap-2'
                    )}
                    onClick={() => handleClick({ action: 'copy', serial: item.metadata?.serial })}
                  >
                    <span className="w-4 h-4 bg-cyber-accent/20 rounded flex items-center justify-center text-xs">
                      📋
                    </span>
                    {Locale.ui_copy}
                  </button>
                </>
              )}

              {item.metadata?.components && item.metadata.components.length > 0 && (
                <>
                  <div className="w-full h-px bg-cyber-border my-1" />
                  <div className="px-3 py-1 text-xs font-bold text-cyber-accent uppercase tracking-wider">
                    {Locale.ui_removeattachments}
                  </div>
                  {item.metadata.components.map((component: string, index: number) => (
                    <button
                      key={index}
                      className={cn(
                        'px-6 py-2 text-sm text-left text-cyber-text-bright font-medium',
                        'hover:bg-cyber-accent hover:text-cyber-bg rounded transition-all duration-200'
                      )}
                      onClick={() => handleClick({ action: 'remove', component, slot: item.slot })}
                    >
                      {Items[component]?.label || component}
                    </button>
                  ))}
                </>
              )}

              {hasButtons && (
                <>
                  <div className="w-full h-px bg-cyber-border my-1" />
                  {groupButtons(itemData.buttons).map((group: Group, index: number) => (
                    <div key={index}>
                      {group.groupName ? (
                        <div>
                          <div className="px-3 py-1 text-xs font-bold text-cyber-accent uppercase tracking-wider">
                            {group.groupName}
                          </div>
                          {group.buttons.map((button: Button) => (
                            <button
                              key={button.index}
                              className={cn(
                                'px-6 py-2 text-sm text-left text-cyber-text-bright font-medium w-full',
                                'hover:bg-cyber-accent hover:text-cyber-bg rounded transition-all duration-200'
                              )}
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
                            className={cn(
                              'px-3 py-2 text-sm text-left text-cyber-text-bright font-medium w-full',
                              'hover:bg-cyber-accent hover:text-cyber-bg rounded transition-all duration-200'
                            )}
                            onClick={() => handleClick({ action: 'custom', id: button.index })}
                          >
                            {button.label}
                          </button>
                        ))
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InventoryContext;
