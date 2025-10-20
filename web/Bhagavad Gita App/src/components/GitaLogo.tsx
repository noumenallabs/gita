import { motion } from "motion/react";

interface GitaLogoProps {
  size?: number;
  className?: string;
}

export function GitaLogo({ size = 48, className = "" }: GitaLogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* Outer Circle - Dharma Chakra Inspired */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.2"
      />
      
      {/* Inner decorative circle */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.15"
      />

      {/* Lotus petals - 8 petals around the center */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
        const radian = (angle * Math.PI) / 180;
        const x1 = 50 + Math.cos(radian) * 20;
        const y1 = 50 + Math.sin(radian) * 20;
        const x2 = 50 + Math.cos(radian) * 35;
        const y2 = 50 + Math.sin(radian) * 35;
        
        return (
          <motion.path
            key={angle}
            d={`M ${x1} ${y1} Q ${50 + Math.cos(radian) * 32} ${50 + Math.sin(radian) * 32} ${x2} ${y2}`}
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
          />
        );
      })}

      {/* Center Om Symbol stylized */}
      <g transform="translate(50, 50)">
        {/* Main curve of Om */}
        <motion.path
          d="M -8 -5 Q -8 -12 0 -12 Q 8 -12 8 -5 Q 8 2 0 2 Q -5 2 -8 -2"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        />
        
        {/* Dot above */}
        <motion.circle
          cx="0"
          cy="-18"
          r="2"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        />
        
        {/* Bottom curve */}
        <motion.path
          d="M -6 4 Q -6 10 2 10 Q 8 10 8 6"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        />
        
        {/* Tail */}
        <motion.path
          d="M 10 -2 Q 15 -2 15 3 Q 15 8 10 10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.3 }}
        />
      </g>

      {/* Outer decorative spokes - minimal */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => {
        const radian = (angle * Math.PI) / 180;
        const x1 = 50 + Math.cos(radian) * 38;
        const y1 = 50 + Math.sin(radian) * 38;
        const x2 = 50 + Math.cos(radian) * 42;
        const y2 = 50 + Math.sin(radian) * 42;
        
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.3"
            strokeLinecap="round"
          />
        );
      })}
    </motion.svg>
  );
}
