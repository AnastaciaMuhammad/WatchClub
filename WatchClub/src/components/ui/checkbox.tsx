import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { Radius, Spacing } from '@/constants/theme';
import { UI } from '@/constants/ui';

type CheckboxProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
};

export function Checkbox({
  checked,
  onChange,
  label,
}: CheckboxProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onChange(!checked)}
      style={styles.container}
      activeOpacity={0.8}
    >
      {/* Box */}
      <View
        style={[
          styles.box,
          {
            borderColor: theme.primary,
            backgroundColor: checked
              ? theme.primary
              : 'transparent',
          },
        ]}
      />

      {/* Label */}
      {label && (
        <ThemedText type="small">
          {label}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },

  box: {
    width: 20,
    height: 20,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
});