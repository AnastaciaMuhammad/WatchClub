import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { Spacing } from '@/constants/theme';

type DividerProps = {
  label?: string;
};

export function Divider({ label = 'or with' }: DividerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.line,
          { backgroundColor: theme.border },
        ]}
      />

      <ThemedText type="small" style={{ marginHorizontal: Spacing.two }}>
        {label}
      </ThemedText>

      <View
        style={[
          styles.line,
          { backgroundColor: theme.border },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.four,
  },

  line: {
    flex: 1,
    height: 1,
  },
});