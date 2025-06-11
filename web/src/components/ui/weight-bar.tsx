import React, { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const colorChannelMixer = (colorChannelA: number, colorChannelB: number, amountToMix: number) => {
  let channelA = colorChannelA * amountToMix;
  let channelB = colorChannelB * (1 - amountToMix);
  return channelA + channelB;
};

const colorMixer = (rgbA: number[], rgbB: number[], amountToMix: number) => {
  let r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
  let g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
  let b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
  return `rgb(${r}, ${g}, ${b})`;
};

const COLORS = {
  primaryColor: [231, 76, 60],
  secondColor: [39, 174, 96],
  accentColor: [211, 84, 0],
};

interface WeightBarProps {
  percent: number;
  durability?: boolean;
  className?: string;
}

const WeightBar: React.FC<WeightBarProps> = ({ percent, durability, className }) => {
  const color = useMemo(
    () =>
      durability
        ? percent < 50
          ? colorMixer(COLORS.accentColor, COLORS.primaryColor, percent / 100)
          : colorMixer(COLORS.secondColor, COLORS.accentColor, percent / 100)
        : percent > 50
        ? colorMixer(COLORS.primaryColor, COLORS.accentColor, percent / 100)
        : colorMixer(COLORS.accentColor, COLORS.secondColor, percent / 50),
    [durability, percent]
  );

  return (
    <div
      className={cn(
        durability ? 'h-0.5 bg-black/50' : 'h-3 bg-black/40 border border-black/10 rounded-sm',
        'overflow-hidden',
        className
      )}
    >
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${percent}%`,
          backgroundColor: color,
          opacity: percent > 0 ? 1 : 0,
        }}
      />
    </div>
  );
};

export default WeightBar;
