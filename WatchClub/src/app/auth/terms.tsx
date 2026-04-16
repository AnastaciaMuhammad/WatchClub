import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { Layout } from '@/constants/layout';
import { Spacing } from '@/constants/theme';

export default function TermsScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        Layout.screen,
        { backgroundColor: theme.background },
      ]}
    >

      {/* Header */}
      <ScreenHeader title="Terms & Conditions" />


      {/* Content */}
      <ScrollView>

        <ThemedText type="title" style={{ marginBottom: Spacing.four }}>
          Watch Club Agreement
        </ThemedText>

        <ThemedText type="smallBold" style={{ marginBottom: Spacing.three }}>
          Please read these terms and conditions carefully before using Watch Club.
        </ThemedText>

        <ThemedText type="small" style={{ lineHeight: 22 }}>
          1. Use of Service: You agree to use Watch Club only for legal purposes and in a way that does not infringe the rights of others.
          {'\n\n'}

          2. Privacy: Your data is protected under our privacy policy. We do not sell your watch history to third parties.
          {'\n\n'}

          3. Account Responsibility: You are responsible for maintaining the confidentiality of your password and account details.
          {'\n\n'}

        </ThemedText>

      </ScrollView>

    </SafeAreaView>
  );
}