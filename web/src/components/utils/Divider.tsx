import React from 'react';
import { cn } from '@/lib/utils';

interface DividerProps {
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ className }) => {
  return <div className={cn('w-full h-px bg-white/12', className)} />;
};

export default Divider;
