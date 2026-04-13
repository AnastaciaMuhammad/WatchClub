import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', style }: ButtonProps) {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.button, 
        isOutline && styles.outline, 
        isGhost && styles.ghost,
        style
      ]}
    >
      <Text style={[styles.text, isOutline && styles.outlineText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#007AFF' },
  ghost: { backgroundColor: 'transparent' },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
  outlineText: { color: '#007AFF' },
});