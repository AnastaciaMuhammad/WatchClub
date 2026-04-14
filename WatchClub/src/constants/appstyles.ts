/**
 * AppStyles.ts
 * Shared dark-mode styles for all auth and onboarding screens.
 * Import what you need instead of redefining colors everywhere.
 */
 import { StyleSheet } from 'react-native';
 import { Colors, Spacing } from './theme';
 
 const D = Colors.dark;
 
 export const AppStyles = StyleSheet.create({
   // ── Full-screen containers ────────────────────────────────────────────────
   screen: {
     flex: 1,
     backgroundColor: D.background,
     padding: Spacing.four,
   },
   screenCentered: {
     flex: 1,
     backgroundColor: D.background,
     padding: Spacing.four,
     justifyContent: 'center',
   },
 
   // ── Content block (top-aligned with breathing room) ───────────────────────
   contentBlock: {
     flex: 1,
     justifyContent: 'flex-start',
     paddingTop: 80,
   },
 
   // ── Typography ────────────────────────────────────────────────────────────
   title: {
     fontSize: 32,
     color: D.textPrimary,
     fontWeight: 'bold',
     textAlign: 'left',
     marginBottom: Spacing.three,
   },
   titleCenter: {
     fontSize: 32,
     color: D.textPrimary,
     fontWeight: 'bold',
     textAlign: 'center',
     marginBottom: Spacing.three,
   },
   subtitle: {
     color: D.muted,
     fontSize: 16,
     textAlign: 'left',
     marginBottom: Spacing.five,
     lineHeight: 24,
   },
   label: {
     color: D.textPrimary,
     fontSize: 18,
     marginBottom: Spacing.two,
   },
   mutedText: {
     color: D.muted,
     fontSize: 14,
   },
   errorText: {
     color: '#ff4d4d',
     fontSize: 13,
     marginBottom: Spacing.two,
   },
 
   // ── Step footer ───────────────────────────────────────────────────────────
   footer: {
     position: 'absolute',
     bottom: 40,
     left: 0,
     right: 0,
     alignItems: 'center',
   },
   stepText: {
     color: D.muted,
     fontSize: 14,
     fontWeight: '500',
   },
 
   // ── Divider ("or with") ───────────────────────────────────────────────────
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
     color: D.muted,
     paddingHorizontal: 10,
     fontSize: 14,
   },
 
   // ── Checkbox row ──────────────────────────────────────────────────────────
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
     borderColor: D.primary,
     marginRight: 10,
   },
   checkboxChecked: {
     backgroundColor: D.primary,
   },
   checkboxLabel: {
     color: D.textPrimary,
     fontSize: 14,
   },
 
   // ── Links ─────────────────────────────────────────────────────────────────
   linkText: {
     color: D.primary,
     fontWeight: '600',
   },
   footerText: {
     color: D.textPrimary,
     textAlign: 'center',
     marginTop: Spacing.four,
     fontSize: 14,
   },
 
   // ── Spacers ───────────────────────────────────────────────────────────────
   spacerSm: { height: Spacing.two },
   spacerMd: { height: Spacing.three },
   spacerLg: { height: Spacing.five },
 });