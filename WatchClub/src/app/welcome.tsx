import React from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/themed-text';

import { Layout } from '@/constants/layout';
import { useTheme } from '@/hooks/use-theme';

export default function Welcome() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        Layout.screenCentered,
        { backgroundColor: theme.background },
      ]}
    >

      {/* Header */}
      <View style={{ alignItems: 'center' }}>
        <ThemedText type="title">
          Welcome to
        </ThemedText>

        <Image
          source={require('@/assets/images/logo_transparent.png')}
          style={{ width: 400, height: 300 }}
          resizeMode="contain"
        />
      </View>

      {/* Actions */}
      <View style={{ width: '100%', marginTop: 'auto' }}>

        {/* Sign Up */}
        <View style={{ marginBottom: 24 }}>
          <ThemedText>
            New Here?
          </ThemedText>

          <Button
            label="Sign Up"
            size="XL"
            onPress={() => router.push('/auth/signup')}
          />
        </View>

        {/* Sign In */}
        <View>
          <ThemedText>
            Returning?
          </ThemedText>

          <Button
            label="Sign In"
            variant="outline"
            onPress={() => router.push('/auth/signin')}
          />
        </View>

      </View>

    </SafeAreaView>
  );
}