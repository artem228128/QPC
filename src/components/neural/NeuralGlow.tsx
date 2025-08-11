import React from 'react';

interface NeuralGlowProps {
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  intensity?: 'low' | 'medium' | 'high';
  pulsing?: boolean;
  children: React.ReactNode;
  className?: string;
}

const NeuralGlow: React.FC<NeuralGlowProps> = ({
  color = 'cyan',
  intensity = 'medium',
  pulsing = false,
  children,
  className = '',
}) => {
  const colorMap = {
    cyan: '0, 255, 255',
    purple: '139, 92, 246',
    pink: '236, 72, 153',
    green: '16, 185, 129',
  };

  const intensityMap = {
    low: 0.3,
    medium: 0.6,
    high: 1.0,
  };

  const glowStyle = {
    boxShadow: `0 0 20px rgba(${colorMap[color]}, ${intensityMap[intensity]})`,
    border: `1px solid rgba(${colorMap[color]}, ${intensityMap[intensity] * 0.5})`,
  };

  const glowClasses = `
    ${pulsing ? 'animate-pulse-glow' : ''}
    ${className}
  `.trim();

  return (
    <div className={glowClasses} style={glowStyle}>
      {children}
    </div>
  );
};

export default NeuralGlow;
