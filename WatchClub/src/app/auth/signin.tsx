import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/checkbox';
import { Divider } from '@/components/ui/Divider';

import { ThemedText } from '@/components/themed-text';

import { Layout } from '@/constants/layout';
import { useTheme } from '@/hooks/use-theme';

export default function SignIn() {
  const router = useRouter();
  const theme = useTheme();

  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView
      style={[
        Layout.formScreen,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Title */}
      <ThemedText type="title">
        Sign In
      </ThemedText>

      {/* Form */}
      <View style={Layout.formBlock}>

        {/* Inputs */}
        <Input label="Email" placeholder="Enter email" />
        <Input label="Password" placeholder="Enter password" secureTextEntry />

        {/* Row */}
        <View style={Layout.rowBetween}>
          {/* Checkbox */}
          <Checkbox
            checked={rememberMe}
            onChange={setRememberMe}
            label="Remember Me"
          />

          {/* Forgot Password */}
          <Link href="/auth/forgot-password" asChild>
            <TouchableOpacity>
              <ThemedText type="small" style={{ color: theme.primary }}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>
          </Link>

        </View>

        {/* Main Button */}
        <Button
          label="Sign In"
          onPress={() => router.push('/(tabs)/home')}
        />

        {/* Divider */}
        <Divider />

        {/* OAuth */}
        <Button
          label="Sign in with Google"
          variant="outline"
        />

        <Button
          label="Sign in with Apple"
          variant="outline"
        />

      </View>

      {/* Footer */}
      <Link href="/auth/signup" asChild>
        <TouchableOpacity style={{ marginTop: 24 }}>
          <ThemedText type="small">
            Don’t have an account?{' '}
            <ThemedText style={{ color: theme.primary }}>
              Sign up
            </ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </Link>

    </SafeAreaView>
  );
}