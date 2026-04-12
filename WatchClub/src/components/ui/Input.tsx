import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
}

export function Input({ label, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput 
        style={[
          styles.input, 
          isFocused && styles.inputFocused // Apply blue border on focus
        ]} 
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#666"
        {...props} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16, width: '100%' },
  label: { color: '#fff', marginBottom: 8, fontSize: 14 },
  input: {
    backgroundColor: '#1A1A1A',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputFocused: {
    borderColor: '#1655E8', // Your WatchClub Primary Blue
  },
});