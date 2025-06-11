import React from 'react';
import { useDragLayer } from 'react-dnd';
import { DragSource } from '../../typings';

interface DragLayerProps {
  data: DragSource;
  currentOffset: { x: number; y: number } | null;
  isDragging: boolean;
}

const DragPreview: React.FC = () => {
  const { data, isDragging, currentOffset } = useDragLayer<DragLayerProps>((monitor) => ({
    data: monitor.getItem(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset || !data?.item) {
    return null;
  }

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: currentOffset.x - 40,
        top: currentOffset.y - 40,
        width: '80px',
        height: '80px',
        backgroundImage: data.image,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        imageRendering: '-webkit-optimize-contrast',
      }}
    />
  );
};

export default DragPreview;
