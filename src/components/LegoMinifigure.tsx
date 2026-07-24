import React from 'react';

interface LegoMinifigureProps {
  color?: string;
  size?: number;
  expression?: 'happy' | 'excited' | 'wink' | 'cool';
  className?: string;
}

export const LegoMinifigure: React.FC<LegoMinifigureProps> = ({
  color = '#FFD500',
  size = 36,
  expression = 'happy',
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Stud (Head Knob) */}
        <rect x="38" y="10" width="24" height="12" rx="3" fill="#D9A010" />
        <rect x="40" y="12" width="20" height="4" rx="1" fill="#FFE57F" opacity="0.6" />

        {/* Minifigure Head */}
        <rect x="22" y="20" width="56" height="50" rx="14" fill={color} />
        {/* Head Plastic Specular Highlight */}
        <path
          d="M26 28 C32 24, 42 22, 50 22 C42 25, 30 28, 26 34 Z"
          fill="#FFFFFF"
          opacity="0.4"
        />

        {/* Neck */}
        <rect x="36" y="68" width="28" height="8" fill="#D9A010" />

        {/* Torso Shoulder */}
        <path d="M18 76 L82 76 L88 100 L12 100 Z" fill="#D01012" />
        <path d="M30 76 L70 76 L66 84 L34 84 Z" fill="#0055BF" />

        {/* Facial Expression Eyes */}
        {expression === 'wink' ? (
          <>
            <circle cx="38" cy="42" r="5" fill="#111111" />
            <path d="M56 42 L68 38" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="38" cy="42" r="5" fill="#111111" />
            <circle cx="62" cy="42" r="5" fill="#111111" />
            {/* Pupil Glint */}
            <circle cx="40" cy="40" r="1.8" fill="#FFFFFF" />
            <circle cx="64" cy="40" r="1.8" fill="#FFFFFF" />
          </>
        )}

        {/* Smile */}
        {expression === 'excited' ? (
          <path
            d="M36 50 Q50 66 64 50 Z"
            fill="#111111"
          />
        ) : (
          <path
            d="M36 52 Q50 62 64 52"
            stroke="#111111"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Cheeks */}
        <circle cx="30" cy="48" r="4" fill="#FF8888" opacity="0.4" />
        <circle cx="70" cy="48" r="4" fill="#FF8888" opacity="0.4" />
      </svg>
    </div>
  );
};
