import React from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <ThemeProvider value={{ colors: theme }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </SafeAreaView>
    </ThemeProvider>
  );
}
