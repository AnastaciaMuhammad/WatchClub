import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from '@/components/themed-text';

type InputVariant =
  | 'nameWatchClub'
  | 'signIn'
  | 'chat'
  | 'search';

type InputProps = {
  variant: InputVariant;

  value: string;
  onChangeText: (text: string) => void;

  placeholder?: string;

  secureTextEntry?: boolean;

  /** Optional password toggle (eye icon) */
  enableVisibilityToggle?: boolean;

  style?: ViewStyle;
};

export function Input({
  variant,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  enableVisibilityToggle = false,
  style,
}: InputProps) {
  const theme = useTheme();
  const [hidden, setHidden] = useState(secureTextEntry);

  const toggleVisibility = () =>
    setHidden((prev) => !prev);

  /** Variant config system */

  const config = getConfig(variant, theme);

  return (
    <View
      style={[
        styles.container,
        config.container,
        style,
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={
          config.placeholderColor
        }
        secureTextEntry={
          secureTextEntry && hidden
        }
        style={[
          styles.input,
          {
            color: config.textColor,
            fontSize: config.fontSize,
          },
        ]}
      />

      {enableVisibilityToggle && (
        <Pressable
          onPress={toggleVisibility}
          style={styles.eyeButton}
        >
          <ThemedText
            type="smallBold"
            style={{
              color: theme.primary,
            }}
          >
            {hidden ? 'Show' : 'Hide'}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

/**
 * Central design system mapping
 */
function getConfig(
  variant: InputVariant,
  theme: any
): {
  container: ViewStyle;
  textColor: string;
  placeholderColor: string;
  fontSize: number;
} {
  switch (variant) {
    case 'nameWatchClub':
      return {
        container: {
          width: 328,
          height: 45,
          backgroundColor: '#D9D9D9',
          borderRadius: 10,
          paddingHorizontal: 12,
          justifyContent: 'center',
        },
        textColor: '#454D6D',
        placeholderColor: '#454D6D',
        fontSize: 15,
      };

    case 'signIn':
      return {
        container: {
          width: 278,
          height: 50,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: theme.primary,
          paddingHorizontal: 12,
          justifyContent: 'center',
        },
        textColor: theme.primary,
        placeholderColor: theme.primary,
        fontSize: 15,
      };

    case 'chat':
      return {
        container: {
          width: 222,
          height: 27,
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          paddingHorizontal: 10,
          justifyContent: 'center',
        },
        textColor: theme.textPrimary,
        placeholderColor: '#999',
        fontSize: 13,
      };

    case 'search':
      return {
        container: {
          width: 325,
          height: 30,
          backgroundColor: '#D9D9D9',
          borderRadius: 10,
          paddingHorizontal: 12,
          justifyContent: 'center',
        },
        textColor: '#454D6D',
        placeholderColor: '#454D6D',
        fontSize: 15,
      };

    default:
      return {
        container: {},
        textColor: theme.textPrimary,
        placeholderColor: '#999',
        fontSize: 15,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    paddingVertical: 0,
  },

  eyeButton: {
    marginLeft: 8,
  },
});