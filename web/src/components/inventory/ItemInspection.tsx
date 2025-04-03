import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SlotWithItem } from '../../typings/slot';
import { getItemUrl } from '../../helpers';
import { Items } from '../../store/items';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeTooltip } from '../../store/tooltip';
import { Locale } from '../../store/locale';

interface InspectionProps {
  item: SlotWithItem;
  onClose: () => void;
}

const ItemInspection: React.FC<InspectionProps> = ({ item, onClose }) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const isDarkItem = useRef(false);
  const itemData = Items[item.name];
  
  useEffect(() => {
    // Check if we should use white or black shadow based on item brightness
    const img = new Image();
    img.src = getItemUrl(item) || '';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          // Sample the center of the image to determine if it's dark
          const data = ctx.getImageData(img.width/2, img.height/2, 1, 1).data;
          const brightness = (data[0] * 0.299 + data[1] * 0.587 + data[2] * 0.114) / 255;
          isDarkItem.current = brightness > 0.6;
        } catch (e) {
          // Ignore cross-origin errors
        }
      }
    };
    
    // Add escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && imageRef.current) {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      
      setRotation({
        x: rotation.x + deltaY * 0.5,
        y: rotation.y + deltaX * 0.5
      });
      
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setDragging(false);
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = scale - e.deltaY * 0.001;
    setScale(Math.min(Math.max(newScale, 0.5), 3));
  };
  
  // Generate stats based on item type and metadata
  const generateItemStats = () => {
    const stats = [];
    
    if (item.metadata?.durability !== undefined) {
      stats.push({
        label: Locale.ui_durability || 'Durability',
        value: `${Math.trunc(item.metadata.durability)}%`,
        color: 
          item.metadata.durability > 75 ? '#2ECC71' : 
          item.metadata.durability > 40 ? '#F39C12' : 
          '#E74C3C'
      });
    }
    
    if (item.metadata?.ammo !== undefined) {
      stats.push({
        label: Locale.ui_ammo || 'Ammunition',
        value: item.metadata.ammo,
        color: item.metadata.ammo > 0 ? '#3498DB' : '#E74C3C'
      });
    }
    
    if (item.weight) {
      stats.push({
        label: Locale.ui_weight || 'Weight',
        value: item.weight >= 1000 
          ? `${(item.weight / 1000).toFixed(2)}kg` 
          : `${item.weight}g`,
        color: '#95A5A6'
      });
    }
    
    // Custom stats based on item types
    if (item.name.includes('weapon') || item.metadata?.weapon) {
      stats.push({
        label: Locale.ui_condition || 'Condition',
        value: getConditionLabel(item.metadata?.condition || item.metadata?.durability || 100),
        color: getConditionColor(item.metadata?.condition || item.metadata?.durability || 100)
      });
    }
    
    return stats;
  };
  
  const getConditionLabel = (value: number): string => {
    if (value > 80) return Locale.condition_pristine || 'Pristine';
    if (value > 60) return Locale.condition_good || 'Good';
    if (value > 40) return Locale.condition_used || 'Used';
    if (value > 20) return Locale.condition_worn || 'Worn';
    return Locale.condition_damaged || 'Damaged';
  };
  
  const getConditionColor = (value: number): string => {
    if (value > 80) return '#2ECC71';
    if (value > 60) return '#27AE60';
    if (value > 40) return '#F39C12';
    if (value > 20) return '#E67E22';
    return '#E74C3C';
  };
  
  const stats = generateItemStats();
  
  return (
    <div className="item-inspection-overlay" onClick={onClose}>
      <div 
        className="item-inspection-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="item-inspection-header">
          <h2>{item.metadata?.label || itemData?.label || item.name}</h2>
          <button className="item-inspection-close" onClick={onClose}>×</button>
        </div>
        
        <div 
          className="item-inspection-image-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div 
            ref={imageRef}
            className="item-inspection-image"
            style={{
              backgroundImage: `url(${getItemUrl(item) || 'none'})`,
              transform: `scale(${scale}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              boxShadow: isDarkItem.current 
                ? 'inset 0 0 100px rgba(0,0,0,0.3)' 
                : 'inset 0 0 100px rgba(255,255,255,0.2)'
            }}
          />
          <div className="item-inspection-help-text">
            <p>{Locale.ui_drag_to_rotate || 'Drag to rotate • Scroll to zoom'}</p>
          </div>
        </div>
        
        <div className="item-inspection-details">
          {item.metadata?.description || itemData?.description ? (
            <div className="item-inspection-description">
              <p>{item.metadata?.description || itemData?.description}</p>
            </div>
          ) : null}
          
          {stats.length > 0 && (
            <div className="item-inspection-stats">
              {stats.map((stat, index) => (
                <div key={`stat-${index}`} className="item-inspection-stat">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          )}
          
          {item.metadata?.components && item.metadata?.components.length > 0 && (
            <div className="item-inspection-components">
              <h3>{Locale.ui_components || 'Components'}</h3>
              <div className="components-grid">
                {item.metadata.components.map((component: string, index: number) => (
                  <div key={`component-${index}`} className="component-item">
                    <div 
                      className="component-icon" 
                      style={{ backgroundImage: `url(${getItemUrl(component) || 'none'})` }}
                    />
                    <span>{Items[component]?.label || component}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main component that manages the inspection state
export const ItemInspectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inspectedItem, setInspectedItem] = useState<SlotWithItem | null>(null);
  const dispatch = useAppDispatch();
  
  // Listen for the custom event to open item inspection
  useEffect(() => {
    const handleInspect = (e: CustomEvent) => {
      dispatch(closeTooltip());
      setInspectedItem(e.detail);
    };
    
    window.addEventListener('inspect-item' as any, handleInspect as EventListener);
    
    return () => {
      window.removeEventListener('inspect-item' as any, handleInspect as EventListener);
    };
  }, [dispatch]);
  
  return (
    <>
      {children}
      {inspectedItem && createPortal(
        <ItemInspection 
          item={inspectedItem} 
          onClose={() => setInspectedItem(null)} 
        />,
        document.body
      )}
    </>
  );
};

export const inspectItem = (item: SlotWithItem) => {
  const event = new CustomEvent('inspect-item', { detail: item });
  window.dispatchEvent(event);
};