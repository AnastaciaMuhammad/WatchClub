import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AppStyles } from '@/constants/appstyles';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  return (
    <SafeAreaView style={AppStyles.screenCentered}>
      <Text style={AppStyles.title}>Sign In</Text>
      <Input label="Email" placeholder="jenni.sald04@gmail.com" />
      <Input label="Password" placeholder="••••••••" secureTextEntry />
      <View style={AppStyles.checkboxRow}>
        <TouchableOpacity style={AppStyles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
          <View style={[AppStyles.checkbox, rememberMe && AppStyles.checkboxChecked]} />
          <Text style={AppStyles.checkboxLabel}>Remember Me</Text>
        </TouchableOpacity>
        <Link href="/auth/forgot-password" style={[AppStyles.mutedText, { textDecorationLine: 'underline', marginLeft: 'auto' }]}>
          Forgot Password?
        </Link>
      </View>
      <Button title="Sign In" onPress={() => router.push('/(tabs)/home')} />
      <View style={AppStyles.dividerRow}>
        <View style={AppStyles.dividerLine} />
        <Text style={AppStyles.dividerText}>or with</Text>
        <View style={AppStyles.dividerLine} />
      </View>
      <Button title="Sign in with Google" variant="outline" onPress={() => {}} />
      <Button title="Sign in with Apple" variant="outline" onPress={() => {}} />
      <Link href="/auth/signup" asChild>
        <TouchableOpacity>
          <Text style={AppStyles.footerText}>
            Don't have an account? <Text style={AppStyles.linkText}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}