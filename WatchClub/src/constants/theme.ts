/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

/**
 * Official WatchClub Color Palette
 */

/* Color Palette */
export const Colors = {
  light: {
    primary: "#1655E8",         // Buttons, icons, borders
    secondary: "#CDDCFF",       // Nav backgrounds, containers
    surface: "#FFFFFF",         // Cards, modals
    background: "#E8E9EF",      // App background
        
    textPrimary: "#1655E8",
    textInverse: "#FFFFFF",     // Highlighed Card Text
    
    border: "#1655E8",          // Card Background
     
    muted: "#888888",
    disabled: "#A0A0A0",
    errorText: "#ff4d4d",
    link: "#1655E8",
  },
  dark: {
    primary: "#1655E8",
    secondary: "#2A3A6B",
      
    background: "#000000",
    surface: "#1C1C1E",

    textPrimary: "#FFFFFF",
    textInverse: "#1655E8",
      
    border: "#1655E8",

    muted: "#888888",
    disabled: "#A0A0A0",
    errorText: "#ff4d4d",
    link: "#1655E8",
  },
} as const;


/** Type-safe color keys */
export type ThemeColor =
  keyof typeof Colors.light &
  keyof typeof Colors.dark;

/** Fonts (Keep Expo Defaults — Good Practice) */
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },

  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },

  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

/** Spacing Scale */
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Radius Tokens */
export const Radius = {
  sm: 6,
  md: 10,
  lg: 20,
  pill: 999,
} as const;

/** Tab Layout Helpers */
export const BottomTabInset =
  Platform.select({
    ios: 50,
    android: 80,
  }) ?? 0;

/** Layout Constraint */
export const MaxContentWidth = 800;
