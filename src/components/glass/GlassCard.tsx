import React from 'react';
import { GlassComponentProps } from '../../types';

interface GlassCardProps extends GlassComponentProps {
  title?: string;
  subtitle?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  title,
  subtitle,
  blur = 20,
  opacity = 0.1,
  border = true,
  glow = false,
  hover = true,
  children,
  className = '',
}) => {
  const cardClasses = `
    glass-card
    ${hover ? 'hover-lift hover-glow' : ''}
    ${glow ? 'neural-glow' : ''}
    ${className}
  `.trim();

  const cardStyle = {
    backdropFilter: `blur(${blur}px)`,
    background: `rgba(255, 255, 255, ${opacity})`,
    border: border ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
  };

  return (
    <div className={cardClasses} style={cardStyle}>
      {(title || subtitle) && (
        <div className="glass-panel-header">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-300 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="glass-panel-content">{children}</div>
    </div>
  );
};

export default GlassCard;
