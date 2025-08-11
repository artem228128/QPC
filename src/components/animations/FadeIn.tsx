import React, { useEffect, useState } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 500,
  direction = 'none',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getDirectionClass = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'transform translate-y-8 opacity-0';
        case 'down':
          return 'transform -translate-y-8 opacity-0';
        case 'left':
          return 'transform translate-x-8 opacity-0';
        case 'right':
          return 'transform -translate-x-8 opacity-0';
        default:
          return 'opacity-0';
      }
    }
    return 'transform translate-x-0 translate-y-0 opacity-100';
  };

  const transitionStyle = {
    transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  };

  return (
    <div className={`${getDirectionClass()} ${className}`} style={transitionStyle}>
      {children}
    </div>
  );
};

export default FadeIn;
