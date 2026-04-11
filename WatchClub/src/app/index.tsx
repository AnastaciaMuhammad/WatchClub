import { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Timer to automatically navigate to Welcome after 2 seconds
    const timer = setTimeout(() => {
      router.replace('home');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/logo_transparent.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logo: { 
    width: 500, 
    height: 500 
  },
});