import { StyleSheet } from 'react-native';
import { Spacing, Radius } from './theme';

export const UI = StyleSheet.create({

  /** Layout helpers */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    
  /** Divider row */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.four,
  },

  /** Divider line */
  dividerLine: {
    flex: 1,
    height: 1,
  },

  /** Checkbox */
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginRight: Spacing.two,
  },

  /** Form spacing */
  formBlock: {
    width: '100%',
    gap: Spacing.three,
  },
});