import React from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { Spacing, Radius } from '@/constants/theme';

type ButtonSize =
  | 'XL'
  | 'L'
  | 'M'
  | 'S'
  | 'XS';

type ButtonVariant =
  | 'filled'
  | 'outline'
  | 'ghost';

type ButtonProps = {
  label: string;

  size?: ButtonSize;
  variant?: ButtonVariant;

  width?: number;

  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;

  disabled?: boolean;

  style?: ViewStyle;

  onPress?: (
    event: GestureResponderEvent
  ) => void;
};

/** Size Config */

const sizeStyles = {

  XL: {
    height: 50,
    paddingHorizontal: Spacing.four,
    minWidth: 250,
    textType: 'default' as const,
  },

  L: {
    height: 32,
    paddingHorizontal: Spacing.three,
    minWidth: 0,
    textType: 'smallBold' as const,
  },

  M: {
    height: 28,
    paddingHorizontal: Spacing.two,
    minWidth: 0,
    textType: 'small' as const,
  },

  S: {
    height: 20,
    paddingHorizontal: Spacing.two,
    minWidth: 0,
    textType: 'small' as const,
  },

  XS: {
    height: 21,
    paddingHorizontal: Spacing.one,
    minWidth: 0,
    textType: 'small' as const,
  },

};

export function Button({
  label,

  size = 'M',
  variant = 'filled',

  width,

  backgroundColor,
  textColor,
  borderColor,

  disabled = false,

  style,
  onPress,

}: ButtonProps) {

  const theme = useTheme();

  const sizeConfig =
    sizeStyles[size];

  /** Background */

  const bgColor =
    variant === 'filled'
      ? backgroundColor ??
        theme.primary
      : 'transparent';

  /** Text */

  const txtColor =
    textColor ??
    (variant === 'filled'
      ? theme.textInverse
      : theme.primary);

  /** Border */

  const brColor =
    borderColor ??
    theme.border;

  return (

    <Pressable
      onPress={onPress}
      disabled={disabled}

      style={({ pressed }) => [

        styles.base,

        {
          height:
            sizeConfig.height,

          paddingHorizontal:
            sizeConfig.paddingHorizontal,

          minWidth:
            sizeConfig.minWidth,

          width:

            width,

          backgroundColor:

            bgColor,

          borderWidth:

            variant === 'outline'
              ? 2
              : 0,

          borderColor:

            variant === 'outline'
              ? brColor
              : 'transparent',

          opacity:

            disabled
              ? 0.5
              : pressed
              ? 0.85
              : 1,

          transform:

            pressed
              ? [{ scale: 0.98 }]
              : [{ scale: 1 }],
        },

        style,

      ]}
    >

      <ThemedText
        type={
          sizeConfig.textType
        }

        style={{
          color: txtColor,
        }}
      >
        {label}
      </ThemedText>

    </Pressable>
  );
}

const styles = StyleSheet.create({

  base: {
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

});