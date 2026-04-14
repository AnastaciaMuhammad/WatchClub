import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AppStyles } from '@/constants/appstyles';
import { useUser } from '@/context/usercontent';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StepOne() {
  const router = useRouter();
  const { setUser } = useUser();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleContinue() {
    if (name.trim().length < 3) { setError('Name must be at least 3 characters.'); return; }
    setError('');
    setUser(name.trim(), []);
    router.push('/onboarding/step2');
  }

  return (
    <SafeAreaView style={AppStyles.screen}>
      <View style={AppStyles.contentBlock}>
        <Text style={AppStyles.title}>Welcome</Text>
        <Text style={AppStyles.subtitle}>Create your profile to start watching together.</Text>
        <Input label="Your Name" placeholder="Enter name" value={name}
          onChangeText={(t) => { setName(t); if (error && t.trim().length >= 3) setError(''); }} />
        {error ? <Text style={AppStyles.errorText}>{error}</Text> : null}
        <View style={AppStyles.spacerMd} />
        <Button title="Continue" onPress={handleContinue} />
      </View>
      <View style={AppStyles.footer}>
        <Text style={AppStyles.stepText}>1 of 3</Text>
      </View>
    </SafeAreaView>
  );
}