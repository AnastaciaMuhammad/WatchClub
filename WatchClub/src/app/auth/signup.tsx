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

export default function SignUp() {
  const router = useRouter();
  const theme = useTheme();

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (!agreed) {
      setError('You must accept the terms and conditions');
      return;
    }

    setError('');
    router.push('/onboarding/step1');
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
        Sign Up
      </ThemedText>

      {/* Form */}
      <View style={Layout.formBlock}>

        {/* Inputs */}
        <Input label="Email" placeholder="email@example.com" />
        <Input label="New Password" secureTextEntry />
        <Input label="Confirm Password" secureTextEntry />

        {/* Checkbox + Terms */}
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>

        <Checkbox
          checked={agreed}
          onChange={(val) => {
            setAgreed(val);
            if (error) setError('');
          }}
          label="I agree with"
        />

        <Link href="/auth/terms" asChild>
          <TouchableOpacity>
            <ThemedText
              type="small"
              style={{
                color: theme.primary,
                marginLeft: 4,
              }}
            >
              terms and conditions
            </ThemedText>
          </TouchableOpacity>
        </Link>

      </View>

        {/* Error */}
        {error ? (
          <ThemedText type="small" style={{ color: theme.errorText }}>
            {error}
          </ThemedText>
        ) : null}

        {/* Submit */}
        <Button
          label="Sign Up"
          onPress={handleSignUp}
        />

        {/* Divider */}
        <Divider />

        {/* OAuth */}
        <Button label="Sign up with Google" variant="outline" />
        <Button label="Sign up with Apple" variant="outline" />

      </View>

      {/* Footer */}
      <Link href="/auth/signin" asChild>
        <TouchableOpacity style={{ marginTop: 24 }}>
          <ThemedText type="small">
            Already have an account?{' '}
            <ThemedText style={{ color: theme.primary }}>
              Sign in
            </ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}