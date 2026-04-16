import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { Spacing } from '@/constants/theme';

type ScreenHeaderProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
};

export function ScreenHeader({
  title,
  showBack = true,
  onBackPress,
  rightElement,
}: ScreenHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  const handleBack = () => {
    if (onBackPress) return onBackPress();
    router.back();
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: Spacing.four,
      }}
    >
      {/* Left side */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showBack ? (
          <TouchableOpacity onPress={handleBack}>
            <ThemedText
              type="small"
              style={{
                color: theme.primary,
                marginRight: Spacing.three,
              }}
            >
              ← Back
            </ThemedText>
          </TouchableOpacity>
        ) : null}

        <ThemedText type="defaultBold">
          {title}
        </ThemedText>
      </View>

      {/* Right side (optional actions) */}
      {rightElement ? <View>{rightElement}</View> : null}
    </View>
  );
}