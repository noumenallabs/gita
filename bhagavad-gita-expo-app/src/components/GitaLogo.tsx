import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Line, G } from 'react-native-svg';

export interface GitaLogoProps {
  size?: number;
  color?: string;
  animated?: boolean;
}

export function GitaLogo({ size = 48, color = 'currentColor', animated = false }: GitaLogoProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Outer Circle - Dharma Chakra Inspired */}
        <Circle cx="50" cy="50" r="45" stroke={color} strokeWidth="2" fill="none" opacity="0.2" />

        {/* Inner decorative circle */}
        <Circle cx="50" cy="50" r="38" stroke={color} strokeWidth="1" fill="none" opacity="0.15" />

        {/* Lotus petals - 8 petals around the center */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
          const radian = (angle * Math.PI) / 180;
          const x1 = 50 + Math.cos(radian) * 20;
          const y1 = 50 + Math.sin(radian) * 20;
          const x2 = 50 + Math.cos(radian) * 35;
          const y2 = 50 + Math.sin(radian) * 35;

          return (
            <Path
              key={angle}
              d={`M ${x1} ${y1} Q ${50 + Math.cos(radian) * 32} ${50 + Math.sin(radian) * 32} ${x2} ${y2}`}
              stroke={color}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.4"
            />
          );
        })}

        {/* Center Om Symbol stylized */}
        <G transform="translate(50, 50)">
          {/* Main curve of Om */}
          <Path d="M -8 -5 Q -8 -12 0 -12 Q 8 -12 8 -5 Q 8 2 0 2 Q -5 2 -8 -2" fill={color} />

          {/* Dot above */}
          <Circle cx="0" cy="-18" r="2" fill={color} />

          {/* Bottom curve */}
          <Path
            d="M -6 4 Q -6 10 2 10 Q 8 10 8 6"
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tail */}
          <Path
            d="M 10 -2 Q 15 -2 15 3 Q 15 8 10 10"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </G>

        {/* Outer decorative spokes - minimal */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(angle => {
          const radian = (angle * Math.PI) / 180;
          const x1 = 50 + Math.cos(radian) * 38;
          const y1 = 50 + Math.sin(radian) * 38;
          const x2 = 50 + Math.cos(radian) * 42;
          const y2 = 50 + Math.sin(radian) * 42;

          return (
            <Line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth="1.5"
              opacity="0.3"
              strokeLinecap="round"
            />
          );
        })}
      </Svg>
    </View>
  );
}
