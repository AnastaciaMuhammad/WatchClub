import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  TextInputProps,
  StyleSheet,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
}
 
export function Input({ label, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.textPrimary },
          ]}
        >
          {label}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            color: theme.textPrimary,
            borderColor: isFocused
              ? theme.primary
              : theme.border,
          },
        ]}
        placeholderTextColor={theme.muted ?? theme.border}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.four,
    width: '100%',
  },

  label: {
    marginBottom: Spacing.two,
    fontSize: 14,
  },

  input: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
});