import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../context/usercontent';

export default function StepOne() {
  const router = useRouter();
  const { setUser } = useUser();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleContinue() {
    if (name.trim().length < 3) {
      setError('Name must be at least 3 characters.');
      return;
    }
    setError('');
    setUser(name.trim(), []); // genres filled in step2
    router.push('/onboarding/step2');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentBlock}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Create your profile to start watching together.
        </Text>

        <Input
          label="Your Name"
          placeholder="Enter name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error && text.trim().length >= 3) setError('');
          }}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttonSpacer} />
        <Button title="Continue" onPress={handleContinue} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.stepText}>1 of 3</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    padding: 24 
  },
  contentBlock: {
    flex: 1,
    justifyContent: 'flex-start', // Aligns content to the top instead of center
    paddingTop: 80, // Adjust this number to move the entire block higher or lower
  },
  title: { 
    fontSize: 32, 
    color: '#fff', 
    fontWeight: 'bold', 
    textAlign: 'left',
    marginBottom: 12 
  },
  subtitle: { 
    color: '#aaa', 
    fontSize: 16, 
    textAlign: 'left',
    marginBottom: 40, // Spacing between subtitle and Input box
    lineHeight: 24
  },
  buttonSpacer: {
    height: 20, // The gap between the Input box and the Continue button
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  stepText: { 
    color: '#666', 
    fontSize: 14, 
    fontWeight: '500'
  },
  error: {
    color: "#ff4d4d",              // bright red (visible on black)
    fontSize: 14,
  },
});