import React from 'react';
import { Area } from '@/types';

interface AreaDotProps {
  area: Area;
  size?: number;
}

const areaColors: Record<Area, string> = {
  tennis: '#86A873',
  rose: '#D4A5A5',
  professional: '#7BA3C9',
  personal: '#A89BC9',
};

export const AreaDot: React.FC<AreaDotProps> = ({ area, size = 8 }) => {
  return (
    <div
      className="rounded-full"
      style={{
        backgroundColor: areaColors[area],
        width: `${size}px`,
        height: `${size}px`,
      }}
      aria-label={`${area} area`}
    />
  );
};
