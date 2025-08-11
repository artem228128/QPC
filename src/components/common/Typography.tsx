import React from 'react';
import { motion, Variants } from 'framer-motion';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface BaseTypographyProps {
  /** Content to display */
  children: React.ReactNode;

  /** Color variant or custom color */
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error'
    | 'neural'
    | string;

  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

  /** Font weight */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';

  /** Text alignment */
  align?: 'left' | 'center' | 'right';

  /** Additional CSS classes */
  className?: string;

  /** Enable responsive text scaling */
  responsive?: boolean;

  /** Enable entrance animation */
  animate?: boolean;

  /** Animation delay in ms */
  animationDelay?: number;
}

interface NeuralTextProps extends BaseTypographyProps {
  /** Glow intensity for neural text */
  glowIntensity?: number;

  /** Enable pulsing animation */
  pulse?: boolean;
}

interface GlowTextProps extends BaseTypographyProps {
  /** Glow color */
  glowColor?: string;

  /** Glow intensity */
  glowIntensity?: number;

  /** Enable glow animation */
  animateGlow?: boolean;
}

interface TitleProps extends BaseTypographyProps {
  /** Title level (h1-h6) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

interface TextProps extends BaseTypographyProps {}
interface MonoTextProps extends BaseTypographyProps {}

// ===========================================
// 🎨 COLOR & SIZE CONFIGURATIONS
// ===========================================

const colorConfig = {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  tertiary: 'var(--text-tertiary)',
  accent: 'var(--text-accent)',
  success: 'var(--neural-mint)',
  warning: 'var(--neural-gold)',
  error: 'var(--neural-coral)',
  neural: 'var(--neural-cyan)',
};

const sizeConfig = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
};

const weightConfig = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

const alignConfig = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// ===========================================
// 🎭 ANIMATION VARIANTS
// ===========================================

const textAnimationVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

const glowAnimationVariants: Variants = {
  static: {},
  animate: {
    textShadow: ['0 0 10px currentColor', '0 0 20px currentColor', '0 0 10px currentColor'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ===========================================
// 🧠 NEURAL TEXT COMPONENT
// ===========================================

export const NeuralText: React.FC<NeuralTextProps> = ({
  children,
  color = 'neural',
  size = 'md',
  weight = 'medium',
  align = 'left',
  className = '',
  responsive = true,
  animate = false,
  animationDelay = 0,
  glowIntensity = 1,
  pulse = false,
  ...props
}) => {
  const getColor = () => {
    return colorConfig[color as keyof typeof colorConfig] || color;
  };

  const baseClasses = `
    ${sizeConfig[size]}
    ${weightConfig[weight]}
    ${alignConfig[align]}
    font-primary
    ${responsive ? 'transition-all duration-300' : ''}
    ${pulse ? 'animate-neural-pulse-subtle' : ''}
    ${className}
  `.trim();

  const neuralStyles: React.CSSProperties = {
    color: getColor(),
    textShadow: `0 0 ${10 * glowIntensity}px currentColor, 0 0 ${20 * glowIntensity}px currentColor`,
    fontFamily: 'var(--font-primary)',
    letterSpacing: '0.02em',
  };

  return (
    <motion.span
      className={baseClasses}
      style={neuralStyles}
      variants={animate ? textAnimationVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      transition={animate ? { delay: animationDelay / 1000 } : undefined}
      {...props}
    >
      {children}
    </motion.span>
  );
};

// ===========================================
// ✨ GLOW TEXT COMPONENT
// ===========================================

export const GlowText: React.FC<GlowTextProps> = ({
  children,
  color = 'accent',
  size = 'md',
  weight = 'medium',
  align = 'left',
  className = '',
  responsive = true,
  animate = false,
  animationDelay = 0,
  glowColor,
  glowIntensity = 1,
  animateGlow = false,
  ...props
}) => {
  const getColor = () => {
    return colorConfig[color as keyof typeof colorConfig] || color;
  };

  const baseClasses = `
    ${sizeConfig[size]}
    ${weightConfig[weight]}
    ${alignConfig[align]}
    font-primary
    ${responsive ? 'transition-all duration-300' : ''}
    ${className}
  `.trim();

  const glowStyles: React.CSSProperties = {
    color: getColor(),
    textShadow: `0 0 ${8 * glowIntensity}px ${glowColor || 'currentColor'}, 0 0 ${16 * glowIntensity}px ${glowColor || 'currentColor'}40`,
    fontFamily: 'var(--font-primary)',
  };

  return (
    <motion.span
      className={baseClasses}
      style={glowStyles}
      variants={{
        ...textAnimationVariants,
        ...(animateGlow ? glowAnimationVariants : {}),
      }}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : animateGlow ? 'animate' : undefined}
      transition={animate ? { delay: animationDelay / 1000 } : undefined}
      {...props}
    >
      {children}
    </motion.span>
  );
};

// ===========================================
// 📝 TITLE COMPONENTS
// ===========================================

export const Title: React.FC<TitleProps> = ({
  level = 1,
  children,
  color = 'primary',
  size,
  weight = 'bold',
  align = 'left',
  className = '',
  responsive = true,
  animate = false,
  animationDelay = 0,
  ...props
}) => {
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements;

  // Auto-size based on level if not specified
  const sizeMap = ['6xl', '4xl', '3xl', '2xl', 'xl', 'lg'] as const;
  const autoSize = size || (sizeMap[level - 1] as keyof typeof sizeConfig);

  const getColor = () => {
    return colorConfig[color as keyof typeof colorConfig] || color;
  };

  const baseClasses = `
    ${sizeConfig[autoSize]}
    ${weightConfig[weight]}
    ${alignConfig[align]}
    font-heading
    ${responsive ? 'transition-all duration-300' : ''}
    ${className}
  `.trim();

  const titleStyles: React.CSSProperties = {
    color: getColor(),
    fontFamily: 'var(--font-heading)',
    lineHeight: 1.2,
  };

  const MotionComponent = motion[Component as keyof typeof motion] as any;

  return (
    <MotionComponent
      className={baseClasses}
      style={titleStyles}
      variants={animate ? textAnimationVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      transition={animate ? { delay: animationDelay / 1000 } : undefined}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

// ===========================================
// 📄 TEXT COMPONENTS
// ===========================================

export const Subtitle: React.FC<TextProps> = ({
  children,
  color = 'secondary',
  size = 'lg',
  weight = 'medium',
  ...props
}) => (
  <Title level={2} color={color} size={size} weight={weight} {...props}>
    {children}
  </Title>
);

export const Body: React.FC<TextProps> = ({
  children,
  color = 'secondary',
  size = 'md',
  weight = 'normal',
  align = 'left',
  className = '',
  responsive = true,
  animate = false,
  animationDelay = 0,
  ...props
}) => {
  const getColor = () => {
    return colorConfig[color as keyof typeof colorConfig] || color;
  };

  const baseClasses = `
    ${sizeConfig[size]}
    ${weightConfig[weight]}
    ${alignConfig[align]}
    font-primary
    leading-relaxed
    ${responsive ? 'transition-all duration-300' : ''}
    ${className}
  `.trim();

  const bodyStyles: React.CSSProperties = {
    color: getColor(),
    fontFamily: 'var(--font-primary)',
  };

  return (
    <motion.p
      className={baseClasses}
      style={bodyStyles}
      variants={animate ? textAnimationVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      transition={animate ? { delay: animationDelay / 1000 } : undefined}
      {...props}
    >
      {children}
    </motion.p>
  );
};

export const Caption: React.FC<TextProps> = ({
  children,
  color = 'tertiary',
  size = 'sm',
  weight = 'normal',
  ...props
}) => (
  <Body color={color} size={size} weight={weight} {...props}>
    {children}
  </Body>
);

// ===========================================
// 🔢 MONO TEXT COMPONENT
// ===========================================

export const MonoText: React.FC<MonoTextProps> = ({
  children,
  color = 'accent',
  size = 'sm',
  weight = 'medium',
  align = 'left',
  className = '',
  responsive = true,
  animate = false,
  animationDelay = 0,
  ...props
}) => {
  const getColor = () => {
    return colorConfig[color as keyof typeof colorConfig] || color;
  };

  const baseClasses = `
    ${sizeConfig[size]}
    ${weightConfig[weight]}
    ${alignConfig[align]}
    font-mono
    tracking-wide
    ${responsive ? 'transition-all duration-300' : ''}
    ${className}
  `.trim();

  const monoStyles: React.CSSProperties = {
    color: getColor(),
    fontFamily: 'var(--font-mono)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '0.125rem 0.375rem',
    borderRadius: '0.25rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <motion.span
      className={baseClasses}
      style={monoStyles}
      variants={animate ? textAnimationVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      transition={animate ? { delay: animationDelay / 1000 } : undefined}
      {...props}
    >
      {children}
    </motion.span>
  );
};

// ===========================================
// 🎪 CONVENIENCE COMPONENTS
// ===========================================

/** Large neural text with pulsing effect */
export const NeuralTitle: React.FC<Omit<NeuralTextProps, 'pulse' | 'size'>> = (props) => (
  <NeuralText size="4xl" pulse {...props} />
);

/** Glowing accent text */
export const AccentGlow: React.FC<Omit<GlowTextProps, 'color' | 'animateGlow'>> = (props) => (
  <GlowText color="accent" animateGlow {...props} />
);

/** Wallet address display */
export const WalletAddress: React.FC<Omit<MonoTextProps, 'color'>> = (props) => (
  <MonoText color="neural" {...props} />
);

/** Error message text */
export const ErrorText: React.FC<Omit<TextProps, 'color'>> = (props) => (
  <Body color="error" {...props} />
);

/** Success message text */
export const SuccessText: React.FC<Omit<TextProps, 'color'>> = (props) => (
  <Body color="success" {...props} />
);

// ===========================================
// 🎯 USAGE EXAMPLES
// ===========================================

/*
// Basic usage
<Title level={1} color="neural" animate>
  Quantum Profit Chain
</Title>

<Body color="secondary" size="lg">
  Enter the future of decentralized gaming
</Body>

// Neural text with custom glow
<NeuralText 
  size="2xl" 
  pulse 
  glowIntensity={1.5}
  animate
  animationDelay={300}
>
  Active Matrices
</NeuralText>

// Wallet address display
<MonoText color="neural">
  0x742d35Cc6576C55EA5123456789abCdeF123456
</MonoText>

// Animated glow text
<GlowText 
  size="xl"
  glowColor="#00D4FF"
  animateGlow
  animate
>
  Level Unlocked!
</GlowText>

// Convenience components
<NeuralTitle>Neural Network</NeuralTitle>
<WalletAddress>0x123...456</WalletAddress>
<ErrorText>Connection failed</ErrorText>
<SuccessText>Transaction confirmed</SuccessText>
*/
