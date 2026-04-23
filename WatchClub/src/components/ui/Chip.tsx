import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';

type ChipType =
  | 'active'
  | 'scheduled'
  | 'completed';

type ChipVariant =
  | 'status'
  | 'filter'
  | 'tag';

type ChipProps = {
  label: string;
  type?: ChipType;
  variant?: ChipVariant;
  width?: number;
  style?: ViewStyle;
};

const chipStyles = {
  active: {
    backgroundColor: '#34A853',
  },
  scheduled: {
    backgroundColor: '#FBBC05',
  },
  completed: {
    backgroundColor: '#1655E8',
  },
};

export function Chip({
  label,
  type = 'active',
  width = 100,
  style,
}: ChipProps) {
  const backgroundColor =
    chipStyles[type].backgroundColor;

  return (
    <View
      style={[
        styles.base,
        {
          width,
          backgroundColor,
        },
        style,
      ]}
    >
      <ThemedText
        style={styles.text}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 40,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});