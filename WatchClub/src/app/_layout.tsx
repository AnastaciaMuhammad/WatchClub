import React from 'react';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useTheme } from '@/hooks/use-theme';
import { Colors } from '@/constants/theme'; // Import your Colors

export default function RootLayout() {
  const theme = useTheme();

  // 1. Define the fonts object React Navigation requires to prevent the crash
  const navFonts = {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '900' as const },
  };

  // 2. Map your WatchClub colors to the Navigation Theme
  const navigationTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.dark.primary,       // Use your #1655E8
      background: Colors.dark.background, // Use your #000000
      card: Colors.dark.surface,          // Use your #1C1C1E
      text: Colors.dark.textPrimary,      // Use your #FFFFFF
      border: Colors.dark.border,         // Use your #1655E8
      notification: Colors.dark.primary,
    },
    fonts: navFonts, 
  };

  // 3. Safety guard
  if (!theme) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <AnimatedSplashOverlay />
        
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="auth/signup" />
          <Stack.Screen name="auth/signin" />
          <Stack.Screen name="auth/forgot-password" />
          <Stack.Screen name="onboarding/step1" />
          <Stack.Screen name="onboarding/step2" />
          <Stack.Screen name="onboarding/step3" />
          {/* Ensure this name matches your folder/file exactly */}
          <Stack.Screen name="(tabs)" /> 
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}