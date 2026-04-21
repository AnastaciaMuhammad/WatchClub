import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuccessScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Auto-redirect to Home after 3.5 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.emoji}>🍿</Text>
        <Text style={styles.title}>You're All Set!</Text>
        <Text style={styles.message}>
          Great stories are better when shared.{"\n"}
          Your club is waiting—grab your snacks,{"\n"}
          find your friends, and let the show begin.
        </Text>
        <View style={styles.loadingBar}>
          <Animated.View style={styles.progress} />
        </View>
        <Text style={styles.redirectText}>Entering Watch Club...</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', padding: 40 },
  emoji: { fontSize: 64, marginBottom: 20 },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  message: { color: '#aaa', fontSize: 18, textAlign: 'center', lineHeight: 28, marginBottom: 40 },
  loadingBar: { width: 200, height: 4, backgroundColor: '#333', borderRadius: 2, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: '#1655E8', width: '60%' }, // Purely visual
  redirectText: { color: '#666', marginTop: 12, fontSize: 12 }
});