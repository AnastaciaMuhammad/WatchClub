import { StyleSheet } from 'react-native';
import { Spacing } from './theme';

export const Layout = StyleSheet.create({

  /** Standard screen container */
  screen: {
    flex: 1,
    padding: Spacing.four,
  },

  /** Centered screen (ONLY for splash / welcome) */
  screenCentered: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Auth / Form screen */
  formScreen: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'flex-start',
  },

  /** Form container spacing */
  formBlock: {
    width: '100%',
    marginTop: Spacing.five,
    gap: Spacing.three,
  },

  /** Top-aligned content */
  contentBlock: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 80,
  },

  /** Footer positioning */
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  /** Row helper */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /** Row Between */
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  /** Spacers */
  spacerSm: { height: Spacing.two },
  spacerMd: { height: Spacing.three },
  spacerLg: { height: Spacing.five },
});