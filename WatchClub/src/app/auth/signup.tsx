import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AppStyles } from '@/constants/appstyles';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (!agreed) { setError('You must accept the terms and conditions'); return; }
    setError('');
    router.push('/onboarding/step1');
  };

  return (
    <SafeAreaView style={AppStyles.screenCentered}>
      <Text style={AppStyles.title}>Sign Up</Text>
      <Input label="Email" placeholder="jenni.sald04@gmail.com" />
      <Input label="New Password" placeholder="••••••••" secureTextEntry />
      <Input label="Confirm Password" placeholder="••••••••" secureTextEntry />
      <View style={AppStyles.checkboxRow}>
        <TouchableOpacity style={AppStyles.checkboxRow} onPress={() => { setAgreed(!agreed); if (error) setError(''); }}>
          <View style={[AppStyles.checkbox, agreed && AppStyles.checkboxChecked]} />
          <Text style={AppStyles.checkboxLabel}>I agree with <Text style={{ color: '#ff4d4d' }}>*</Text></Text>
        </TouchableOpacity>
        <Link href="/auth/terms" asChild>
          <TouchableOpacity>
            <Text style={[AppStyles.linkText, { textDecorationLine: 'underline', marginLeft: 4 }]}>terms and conditions</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {error ? <Text style={AppStyles.errorText}>{error}</Text> : null}
      <Button title="Sign Up" onPress={handleSignUp} />
      <View style={AppStyles.dividerRow}>
        <View style={AppStyles.dividerLine} />
        <Text style={AppStyles.dividerText}>or with</Text>
        <View style={AppStyles.dividerLine} />
      </View>
      <Button title="Sign up with Google" variant="outline" onPress={() => {}} />
      <Button title="Sign up with Apple" variant="outline" onPress={() => {}} />
      <Link href="/auth/signin" asChild>
        <TouchableOpacity>
          <Text style={AppStyles.footerText}>
            Already have an account? <Text style={AppStyles.linkText}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}