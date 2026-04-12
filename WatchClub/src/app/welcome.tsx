import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to</Text>
        <View style={styles.imageWrapper}>
          <Image
            source={require('@/assets/images/logo_transparent.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>New Here?</Text>
          <Button title="Sign Up" onPress={() => router.push('/auth/signup')} />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Returning?</Text>
          <Button title="Sign In" variant="outline" onPress={() => router.push('/auth/signin')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', padding: 24 },
  header: { paddingTop: 60, alignItems: 'center' },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', textAlign: 'center', zIndex: 1 },
  imageWrapper: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  logo: { width: 400, height: 300 },
  buttonContainer: { marginTop: 'auto', marginBottom: 60 },
  section: { marginBottom: 24 },
  label: { color: '#fff', fontSize: 18, marginBottom: 12, textAlign: 'left' },
});