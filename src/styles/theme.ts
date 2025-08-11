// GameFi Neon Theme 2025 - Complete Design System

// ===========================================
// 🎮 TYPE DEFINITIONS
// ===========================================

export interface NeonColors {
  cyan: string;
  magenta: string;
  green: string;
  orange: string;
  purple: string;
  yellow: string;
  red: string;
  blue: string;
  pink: string;
  lime: string;
}

export interface HUDColors {
  health: string;
  mana: string;
  xp: string;
  energy: string;
  shield: string;
  warning: string;
  critical: string;
  success: string;
}

export interface GamingEffects {
  blur: {
    subtle: string;
    medium: string;
    heavy: string;
    extreme: string;
  };
  glow: {
    soft: string;
    medium: string;
    intense: string;
    neon: string;
    gaming: string;
  };
  glitch: {
    subtle: string;
    medium: string;
    intense: string;
  };
  scanline: string;
  chromatic: string;
}

export interface GameFiTheme {
  neon: NeonColors;
  hud: HUDColors;
  effects: GamingEffects;
  typography: {
    fontFamily: {
      primary: string;
      gaming: string;
      mono: string;
      cyberpunk: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
      hud: string;
      terminal: string;
    };
  };
  spacing: {
    px: string;
    1: string;
    2: string;
    3: string;
    4: string;
    6: string;
    8: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    hud: string;
    gaming: string;
    full: string;
  };
  animation: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      gaming: string;
      cyberpunk: string;
      glitch: string;
    };
  };
  gradients: {
    neon: string;
    gaming: string;
    hud: string;
    cyberpunk: string;
    matrix: string;
    energy: string;
  };
}

// ===========================================
// 🎮 GAMEFI NEON THEME 2025
// ===========================================

export const gameFiTheme: GameFiTheme = {
  // Bright Neon Gaming Colors
  neon: {
    cyan: '#00FFFF', // Electric cyan - primary UI
    magenta: '#FF00FF', // Hot magenta - secondary UI
    green: '#00FF41', // Matrix green - health/success
    orange: '#FF9500', // Neon orange - energy/warning
    purple: '#8A2BE2', // Electric purple - premium/mana
    yellow: '#FFFF00', // Bright yellow - highlights/gold
    red: '#FF0040', // Neon red - danger/critical
    blue: '#0080FF', // Electric blue - info/shield
    pink: '#FF1493', // Hot pink - special effects
    lime: '#32FF32', // Bright lime - XP/progress
  },

  // HUD Gaming Colors
  hud: {
    health: '#00FF41', // Matrix green
    mana: '#8A2BE2', // Electric purple
    xp: '#32FF32', // Bright lime
    energy: '#FF9500', // Neon orange
    shield: '#0080FF', // Electric blue
    warning: '#FFFF00', // Bright yellow
    critical: '#FF0040', // Neon red
    success: '#00FFFF', // Electric cyan
  },

  // Gaming Visual Effects
  effects: {
    blur: {
      subtle: 'blur(2px)',
      medium: 'blur(4px)',
      heavy: 'blur(8px)',
      extreme: 'blur(16px)',
    },
    glow: {
      soft: '0 0 10px currentColor',
      medium: '0 0 20px currentColor, 0 0 30px currentColor',
      intense: '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor',
      neon: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor, 0 0 20px currentColor',
      gaming:
        '0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor, inset 0 0 10px currentColor',
    },
    glitch: {
      subtle: 'drop-shadow(2px 0 0 #ff00ff) drop-shadow(-2px 0 0 #00ffff)',
      medium:
        'drop-shadow(3px 0 0 #ff00ff) drop-shadow(-3px 0 0 #00ffff) drop-shadow(0 3px 0 #ffff00)',
      intense:
        'drop-shadow(5px 0 0 #ff00ff) drop-shadow(-5px 0 0 #00ffff) drop-shadow(0 5px 0 #ffff00) drop-shadow(0 -5px 0 #ff9500)',
    },
    scanline:
      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)',
    chromatic: 'drop-shadow(2px 0 0 #ff0040) drop-shadow(-2px 0 0 #00ffff)',
  },

  // Gaming Typography
  typography: {
    fontFamily: {
      primary: '"Orbitron", "Space Grotesk", monospace',
      gaming: '"Exo 2", "Orbitron", sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
      cyberpunk: '"Audiowide", "Orbitron", monospace',
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '3.75rem', // 60px
      hud: '0.8rem', // 12.8px - HUD elements
      terminal: '0.9rem', // 14.4px - Terminal text
    },
  },

  // Gaming Spacing
  spacing: {
    px: '1px',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    32: '8rem', // 128px
  },

  // Gaming Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    hud: '0.125rem', // 2px - Sharp HUD elements
    gaming: '0.75rem', // 12px - Gaming panels
    full: '9999px',
  },

  // Gaming Animations
  animation: {
    duration: {
      fast: '0.1s',
      normal: '0.2s',
      slow: '0.4s',
    },
    easing: {
      gaming: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cyberpunk: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      glitch: 'steps(10, end)',
    },
  },

  // Gaming Gradients
  gradients: {
    neon: 'linear-gradient(135deg, #00FFFF 0%, #FF00FF 50%, #FFFF00 100%)',
    gaming:
      'linear-gradient(135deg, #00FF41 0%, #00FFFF 25%, #8A2BE2 50%, #FF00FF 75%, #FF9500 100%)',
    hud: 'linear-gradient(90deg, #00FFFF 0%, #0080FF 100%)',
    cyberpunk:
      'linear-gradient(135deg, #FF0040 0%, #FF00FF 25%, #8A2BE2 50%, #00FFFF 75%, #00FF41 100%)',
    matrix: 'linear-gradient(180deg, #00FF41 0%, #32FF32 50%, #00FFFF 100%)',
    energy: 'linear-gradient(135deg, #FFFF00 0%, #FF9500 50%, #FF0040 100%)',
  },
};

// ===========================================
// 🎮 UTILITY FUNCTIONS
// ===========================================

export const getNeonGlow = (color: keyof NeonColors = 'cyan') => ({
  color: gameFiTheme.neon[color],
  textShadow: gameFiTheme.effects.glow.neon,
  filter: `drop-shadow(0 0 10px ${gameFiTheme.neon[color]})`,
});

export const getHUDStyle = (type: keyof HUDColors = 'health') => ({
  background: `linear-gradient(90deg, transparent 0%, ${gameFiTheme.hud[type]}20 50%, transparent 100%)`,
  border: `1px solid ${gameFiTheme.hud[type]}`,
  boxShadow: `0 0 10px ${gameFiTheme.hud[type]}40, inset 0 0 10px ${gameFiTheme.hud[type]}20`,
});

export const getGlitchEffect = (intensity: 'subtle' | 'medium' | 'intense' = 'medium') => ({
  filter: gameFiTheme.effects.glitch[intensity],
  animation: 'glitch 0.3s infinite linear alternate-reverse',
});

// Default export for styled-components ThemeProvider
export default gameFiTheme;

// Legacy neural theme exports for compatibility
export const neuralGlassTheme = gameFiTheme;
export type Theme = typeof gameFiTheme;
