import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import React, { useState } from 'react';

export default function SignIn() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <Input label="Email" placeholder="Enter email" />
      <Input label="Password" placeholder="Enter password" secureTextEntry />

      {/* Row with Remember Me and Forgot Password */}
      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </TouchableOpacity>

        <Link href="/auth/forgot-password" style={styles.forgot}>
          Forgot Password?
        </Link>
      </View>
      
      <Button title="Sign In" onPress={() => router.push('/(tabs)/home')} />
      
      {/* Divider with lines */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or with</Text>
        <View style={styles.line} />
      </View>

      <Button title="Sign in with Google" variant="outline" onPress={() => {}} />
      <Button title="Sign in with Apple" variant="outline" onPress={() => {}} />
      
      <Link href="/auth/signup" asChild>
        <TouchableOpacity>
          <Text style={styles.footer}>
            Don't have an account? <Text style={styles.linkText}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', marginBottom: 32 },
  
  // Layout Row for Remember Me & Forgot Password
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  
  // Checkbox Styles
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { 
    width: 18, 
    height: 18, 
    borderRadius: 4, 
    borderWidth: 1, 
    borderColor: '#1655E8', 
    marginRight: 8 
  },
  checkboxChecked: { backgroundColor: '#1655E8' },
  checkboxLabel: { color: '#fff', fontSize: 14 },
  
  // Underlined Link
  forgot: { 
    color: '#666', 
    fontSize: 14, 
    textDecorationLine: 'underline' 
  },

  // Divider lines for "or with"
  dividerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 20 
  },
  line: { flex: 1, height: 1, backgroundColor: '#333' },
  orText: { color: '#666', paddingHorizontal: 10, fontSize: 14 },

  footer: { color: '#fff', textAlign: 'center', marginTop: 24 },
  linkText: { color: '#1655E8', fontWeight: '600' }
});