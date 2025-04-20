import React, { useMemo } from 'react';
import SectionHeader from './SectionHeader';
import { selectLeftInventory, selectRightInventory } from '../../store/inventory';
import { useAppSelector } from '../../store';

interface SegmentedWeightBarProps {
  weight: number;
  maxWeight: number;
  inventorySide: 'left' | 'right';
}

const SegmentedWeightBar: React.FC<SegmentedWeightBarProps> = ({ weight, maxWeight, inventorySide }) => {
  const leftInventory = useAppSelector(selectLeftInventory);
  const rightInventory = useAppSelector(selectRightInventory);

  const title = inventorySide === 'left' ? leftInventory.label || 'INVENTORY' : rightInventory.label || 'INVENTORY';

  const segments = 44;
  const activeSegments = useMemo(() => {
    const percentage = (weight / maxWeight) * 100;
    return Math.min(Math.ceil((percentage / 100) * segments), segments);
  }, [weight, maxWeight]);

  return (
    <div className="weight-bar-container">
      <div className="weight-text">
        <SectionHeader title={title} />
        <span>{weight.toFixed(2)}KG</span>
      </div>
      <div className="weight-bar">
        {Array.from({ length: segments }).map((_, index) => (
          <div key={`segment-${index}`} className={`segment ${index < activeSegments ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  );
};

export default SegmentedWeightBar;
