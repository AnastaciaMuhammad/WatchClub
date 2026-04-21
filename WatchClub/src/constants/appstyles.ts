/**
 * AppStyles.ts
 * Shared dark-mode styles for all auth and onboarding screens.
 * Import what you need instead of redefining colors everywhere.
 */
 import { StyleSheet } from 'react-native';
 import { Colors, Spacing } from './theme';
import { useTheme } from '@/hooks/use-theme';
 
 export const AppStyles = StyleSheet.create({
   // ── Full-screen containers ──────────────────────────────────────────────── Padding
   screen: {
     flex: 1,
     padding: Spacing.four,
   },

   // ── Full-screen containers ──────────────────────────────────────────────── Padding
   screenCentered: {
     flex: 1,
     padding: Spacing.four,
     justifyContent: 'center',
   },
 
   // ── Content block (top-aligned with breathing room) ─────────────────────── Padding
   contentBlock: {
     flex: 1,
     justifyContent: 'flex-start',
     paddingTop: 80,
   },
 
   // ── Typography ──────────────────────────────────────────────────────────── component/themed-text
   title: {
     fontSize: 32,
     fontWeight: 'bold',
     textAlign: 'left',
     marginBottom: Spacing.three,
   },
   titleCenter: {
     fontSize: 32,
     fontWeight: 'bold',
     textAlign: 'center',
     marginBottom: Spacing.three,
   },
   subtitle: {
     fontSize: 16,
     textAlign: 'left',
     marginBottom: Spacing.five,
     lineHeight: 24,
   },
   label: {
     fontSize: 18,
     marginBottom: Spacing.two,
   },
   mutedText: {
     fontSize: 14,
   },
   errorText: {
     color: '#ff4d4d',
     fontSize: 13,
     marginBottom: Spacing.two,
   },
 
   // ── Step footer ─────────────────────────────────────────────────────────── component/themed-padding
   footer: {
     position: 'absolute',
     bottom: 40,
     left: 0,
     right: 0,
     alignItems: 'center',
   },
   stepText: {
     fontSize: 14,
     fontWeight: '500',
   },
 
   // ── Divider ("or with") ─────────────────────────────────────────────────── component/themed-padding
   dividerRow: {
     flexDirection: 'row',
     alignItems: 'center',
     marginVertical: Spacing.four,
   },
   dividerLine: {
     flex: 1,
     height: 1,
     backgroundColor: '#333',
   },
   dividerText: {
     paddingHorizontal: 10,
     fontSize: 14,
   },
 
   // ── Checkbox row ────────────────────────────────────────────────────────── /component/ui
   checkboxRow: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: Spacing.two,
   },
   checkbox: {
     width: 20,
     height: 20,
     borderRadius: 4,
     borderWidth: 1,
     marginRight: 10,
   },
   checkboxChecked: {
   },
   checkboxLabel: {
     fontSize: 14,
   },
 
   // ── Links ───────────────────────────────────────────────────────────────── component/themed-text
   linkText: {
     fontWeight: '600',
   },
   footerText: {
     textAlign: 'center',
     marginTop: Spacing.four,
     fontSize: 14,
   },
 
   // ── Spacers ─────────────────────────────────────────────────────────────── component/themed-padding
   spacerSm: { height: Spacing.two },
   spacerMd: { height: Spacing.three },
   spacerLg: { height: Spacing.five },
 });