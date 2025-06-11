import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useNuiEvent from '../../hooks/useNuiEvent';
import useQueue from '../../hooks/useQueue';
import { Locale } from '../../store/locale';
import { getItemUrl } from '../../helpers';
import { SlotWithItem } from '../../typings';
import { Items } from '../../store/items';

interface ItemNotificationProps {
  item: SlotWithItem;
  text: string;
}

export const ItemNotificationsContext = React.createContext<{
  add: (item: ItemNotificationProps) => void;
} | null>(null);

export const useItemNotifications = () => {
  const itemNotificationsContext = useContext(ItemNotificationsContext);
  if (!itemNotificationsContext) throw new Error(`ItemNotificationsContext undefined`);
  return itemNotificationsContext;
};

const ItemNotification = React.forwardRef<HTMLDivElement, { item: ItemNotificationProps; style?: React.CSSProperties }>(
  (props, ref) => {
    const slotItem = props.item.item;

    return (
      <motion.div
        ref={ref}
        className="inventory-slot"
        style={{
          backgroundImage: `url(${getItemUrl(slotItem) || 'none'}`,
          ...props.style,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="w-full text-game-text bg-game-secondary uppercase text-center rounded-tl-sm rounded-tr-sm font-sans">
            <p className="text-xs px-0.5 py-0.5 font-semibold">{props.item.text}</p>
          </div>
          <div className="bg-game-primary text-game-text text-center rounded-bl-sm rounded-br-sm border-t border-black/20 border-inset">
            <div className="uppercase whitespace-nowrap overflow-hidden text-ellipsis px-1 py-0.5 font-normal font-sans text-xs">
              {slotItem.metadata?.label || Items[slotItem.name]?.label}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

export const ItemNotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const queue = useQueue<{
    id: number;
    item: ItemNotificationProps;
    ref: React.RefObject<HTMLDivElement>;
  }>();

  const add = (item: ItemNotificationProps) => {
    const ref = React.createRef<HTMLDivElement>();
    const notification = { id: Date.now(), item, ref: ref };

    queue.add(notification);

    const timeout = setTimeout(() => {
      queue.remove();
      clearTimeout(timeout);
    }, 2500);
  };

  useNuiEvent<[item: SlotWithItem, text: string, count?: number]>('itemNotify', ([item, text, count]) => {
    add({ item: item, text: count ? `${Locale[text]} ${count}x` : `${Locale[text]}` });
  });

  return (
    <ItemNotificationsContext.Provider value={{ add }}>
      {children}
      {createPortal(
        <div
          className="flex overflow-x-scroll flex-nowrap gap-0.5 absolute bottom-80 left-1/2 w-full transform -translate-x-1/2"
          style={{ marginLeft: 'calc(50% - 5.1vh)' }}
        >
          <AnimatePresence>
            {queue.values.map((notification, index) => (
              <ItemNotification key={`item-notification-${index}`} item={notification.item} ref={notification.ref} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ItemNotificationsContext.Provider>
  );
};
