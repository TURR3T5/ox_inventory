import React, { useMemo } from 'react';

interface SegmentedWeightBarProps {
  weight: number;
  maxWeight: number;
  label?: string;
}

const SegmentedWeightBar: React.FC<SegmentedWeightBarProps> = ({ weight, maxWeight, label = 'WEIGHT' }) => {
  const segments = 33; // Number of segments in the bar
  const activeSegments = useMemo(() => {
    const percentage = (weight / maxWeight) * 100;
    return Math.min(Math.ceil((percentage / 100) * segments), segments);
  }, [weight, maxWeight]);

  return (
    <div className="weight-bar-container">
      <div className="weight-text">
        <span>{label}</span>
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
