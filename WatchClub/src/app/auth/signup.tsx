import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import React, { useState } from 'react';

export default function SignUp() {
  const router = useRouter();
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
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
      <Input label="Email" placeholder="jenni.sald04@gmail.com" />
      <Input label="New Password" placeholder="••••••••" secureTextEntry />
      <Input label="Confirm Password" placeholder="••••••••" secureTextEntry />
      
      <View style={styles.checkboxRow}>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => {
            setAgreed(!agreed);
            if (error) setError('');
          }}
        >
          <View style={[styles.checkbox, agreed && styles.checked]} />
          <Text style={styles.checkboxLabel}>
            I agree with <Text style={styles.required}>*</Text>
          </Text>
        </TouchableOpacity>
        
        <Link href="/auth/terms" asChild>
          <TouchableOpacity>
            <Text style={styles.termsLink}>terms and conditions</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button title="Sign Up" onPress={handleSignUp} />
      
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or with</Text>
        <View style={styles.line} />
      </View>

      <Button title="Sign up with Google" variant="outline" onPress={() => {}} />
      <Button title="Sign up with Apple" variant="outline" onPress={() => {}} />
      
      <Link href="/auth/signin" asChild>
        <TouchableOpacity>
          <Text style={styles.footer}>
            Already have an account? <Text style={styles.signInLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', marginBottom: 32 },
  
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#1655E8', marginRight: 10 },
  checked: { backgroundColor: '#1655E8' },
  checkboxLabel: { color: '#fff', fontSize: 14 },
  termsLink: { color: '#1655E8', fontSize: 14, textDecorationLine: 'underline' },

  required: {
    color: 'red',
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
  },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#333' },
  orText: { color: '#666', paddingHorizontal: 10, fontSize: 14 },

  footer: { color: '#fff', textAlign: 'center', marginTop: 24 },
  signInLink: { color: '#1655E8', textDecorationLine: 'underline', fontWeight: 'bold' }
});