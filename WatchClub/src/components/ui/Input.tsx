import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TextInputProps } from 'react-native';
import { Colors } from '@/constants/theme';
 
const D = Colors.dark;
 
interface InputProps extends TextInputProps {
  label?: string;
}
 
export function Input({ label, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
 
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={D.muted}
        {...props}
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { marginBottom: 16, width: '100%' },
  label: { color: D.textPrimary, marginBottom: 8, fontSize: 14 },
  input: {
    backgroundColor: D.surface,
    color: D.textPrimary,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputFocused: {
    borderColor: D.primary,
  },
});