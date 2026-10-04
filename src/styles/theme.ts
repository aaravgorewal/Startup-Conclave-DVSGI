/**
 * Central Theme & Token Configuration for Startup Conclave 1.0
 * 
 * Changing brand colours, typography or geometry site-wide is a one-file edit.
 */

export type ThemeDirection = 'capital' | 'electric' | 'editorial';

export interface ThemeConfig {
  id: ThemeDirection;
  name: string;
  description: string;
  colors: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: string;
    muted: string;
    subtle: string;
    primary: string;
    primaryHover: string;
    primaryFg: string;
    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  radius: {
    base: string;
    card: string;
    button: string;
  };
}

export const THEMES: Record<ThemeDirection, ThemeConfig> = {
  capital: {
    id: 'capital',
    name: 'Direction C: Capital Navy (Default)',
    description: 'Venture & institutional grade, deep navy with imperial gold and refined curved geometry.',
    colors: {
      bg: '#0B132B',
      surface: '#121C3B',
      surfaceElevated: '#18254D',
      border: '#1E2D56',
      text: '#F8FAFC',
      muted: '#94A3B8',
      subtle: '#64748B',
      primary: '#E5A93C',
      primaryHover: '#F3BA54',
      primaryFg: '#0B132B',
      accent: '#3B82F6',
    },
    typography: {
      headingFont: "'Outfit', 'Plus Jakarta Sans', sans-serif",
      bodyFont: "'DM Sans', sans-serif",
    },
    radius: {
      base: '12px',
      card: '16px',
      button: '12px',
    },
  },
  electric: {
    id: 'electric',
    name: 'Direction A: Electric Dark',
    description: 'High-contrast, builder-first, tech-forward with electric lime and sharp 0px geometry.',
    colors: {
      bg: '#080A0E',
      surface: '#11151F',
      surfaceElevated: '#181E2C',
      border: '#1E2638',
      text: '#FFFFFF',
      muted: '#8E9BAE',
      subtle: '#5B6678',
      primary: '#D4FF00',
      primaryHover: '#E4FF4D',
      primaryFg: '#000000',
      accent: '#00F0FF',
    },
    typography: {
      headingFont: "'Space Grotesk', sans-serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
    },
    radius: {
      base: '0px',
      card: '0px',
      button: '0px',
    },
  },
  editorial: {
    id: 'editorial',
    name: 'Direction B: Editorial Light',
    description: 'Prestigious, publication-grade, alabaster off-white with Fraunces serif and warm terracotta.',
    colors: {
      bg: '#FBF9F5',
      surface: '#FFFFFF',
      surfaceElevated: '#F4EFEB',
      border: '#E4E0D7',
      text: '#18181B',
      muted: '#6B7280',
      subtle: '#9CA3AF',
      primary: '#18181B',
      primaryHover: '#2E2E33',
      primaryFg: '#FBF9F5',
      accent: '#E8590C',
    },
    typography: {
      headingFont: "'Fraunces', Georgia, serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
    },
    radius: {
      base: '4px',
      card: '6px',
      button: '4px',
    },
  },
};

/**
 * Switch active theme by setting data-theme attribute on document root
 */
export function applyTheme(themeId: ThemeDirection): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', themeId);
    try {
      localStorage.setItem('conclave_theme', themeId);
    } catch {
      // ignore in environments without localStorage
    }
  }
}

/**
 * Get current active theme
 */
export function getActiveTheme(): ThemeDirection {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme') as ThemeDirection;
    if (attr && THEMES[attr]) return attr;
    try {
      const stored = localStorage.getItem('conclave_theme') as ThemeDirection;
      if (stored && THEMES[stored]) return stored;
    } catch {
      // ignore
    }
  }
  return 'capital';
}
