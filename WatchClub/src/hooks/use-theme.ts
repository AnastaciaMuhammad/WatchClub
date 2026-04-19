
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export function useTheme() {
  const scheme = useColorScheme(); // 'light' | 'dark'
  console.log('Theme:', scheme);

  const theme = scheme === 'dark'
    ? Colors.light
    : Colors.dark;

  return {
    ...theme,
    isDark: scheme === 'dark',
  };
}