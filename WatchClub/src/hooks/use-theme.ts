/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  console.log("Theme:", scheme);
  const theme = scheme === 'dark'
  ? Colors.light
  : Colors.dark;

  return {
    ...theme,
    isDark: scheme === 'dark',
  };
}
