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
import { useUser } from '@/context/usercontent';

export default function SignIn() {
  const router = useRouter();
  const theme = useTheme();
  const { setEmail } = useUser();

  const [emailValue, setEmailValue] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = () => {
    if (emailValue) setEmail(emailValue);
    router.push('/(tabs)/home');
  };

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
        <Input
          label="Email"
          placeholder="Enter email"
          value={emailValue}
          onChangeText={setEmailValue}
        />
        <Input label="Password" placeholder="Enter password" secureTextEntry />

        {/* Row */}
        <View style={Layout.rowBetween}>
          <Checkbox
            checked={rememberMe}
            onChange={setRememberMe}
            label="Remember Me"
          />

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
          onPress={handleSignIn}
        />

        {/* Divider */}
        <Divider />

        {/* OAuth */}
        <Button label="Sign in with Google" variant="outline" />
        <Button label="Sign in with Apple" variant="outline" />

      </View>

      {/* Footer */}
      <Link href="/auth/signup" asChild>
        <TouchableOpacity style={{ marginTop: 24 }}>
          <ThemedText type="small">
            Don't have an account?{' '}
            <ThemedText style={{ color: theme.primary }}>
              Sign up
            </ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </Link>

    </SafeAreaView>
  );
}
