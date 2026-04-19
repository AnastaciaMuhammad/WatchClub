import React from 'react';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { Colors } from '@/constants/theme';
import { UserProvider } from '../context/usercontent';

export default function RootLayout() {
  const theme = useTheme();

  const navFonts = {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '900' as const },
  };

  const navigationTheme = {
    ...DefaultTheme,
    fonts: navFonts,
  };

  if (!theme) return null;

  return (
    <UserProvider>
      <SafeAreaProvider>
        <ThemeProvider value={navigationTheme}>
          <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="auth/signup" />
            <Stack.Screen name="auth/signin" />
            <Stack.Screen name="auth/forgot-password" />
            <Stack.Screen name="auth/terms" />
            <Stack.Screen name="onboarding/step1" />
            <Stack.Screen name="onboarding/step2" />
            <Stack.Screen name="onboarding/step3" />
            <Stack.Screen name="onboarding/success" />
            <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </UserProvider>
  );
}