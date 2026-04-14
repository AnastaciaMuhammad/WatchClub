import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { AppStyles } from '@/constants/appstyles';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
 
export default function Welcome() {
  const router = useRouter();
  return (
    <SafeAreaView style={AppStyles.screen}>
      <View style={styles.header}>
        <Text style={AppStyles.titleCenter}>Welcome to</Text>
        <View style={styles.imageWrapper}>
          <Image source={require('@/assets/images/logo_transparent.png')} style={styles.logo} resizeMode="contain" />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.section}>
          <Text style={AppStyles.label}>New Here?</Text>
          <Button title="Sign Up" onPress={() => router.push('/auth/signup')} />
        </View>
        <View style={styles.section}>
          <Text style={AppStyles.label}>Returning?</Text>
          <Button title="Sign In" variant="outline" onPress={() => router.push('/auth/signin')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: { paddingTop: 60, alignItems: 'center' },
  imageWrapper: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  logo: { width: 400, height: 300 },
  buttonContainer: { marginTop: 'auto', marginBottom: 60 },
  section: { marginBottom: 24 },
});