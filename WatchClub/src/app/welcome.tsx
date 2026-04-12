import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header Section shifted down slightly from the top */}
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

      {/* 2. Buttons Section */}
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
  container: { 
    flex: 1, 
    backgroundColor: '#000000',
    padding: 24,
  },
  header: {
    paddingTop: 60, // Adjust this to move "Welcome to" higher or lower
    alignItems: 'center',
  },
  title: { 
    fontSize: 32, 
    color: '#fff', 
    fontWeight: 'bold', 
    textAlign: 'center',
    marginBottom: 0, // Negative margin pulls the logo UP toward the text -20
    zIndex: 1, // Ensures text stays on top if they overlap
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: { 
    width: 400, // Slightly reduced to fit better on standard phone screens
    height: 300, // Reduced height to eliminate the "invisible" empty space
  },
  buttonContainer: {
    marginTop: 'auto', // Pushes the buttons to the bottom of the screen
    marginBottom: 60,
  },
  section: { 
    marginBottom: 24 
  },
  label: { 
    color: '#fff', 
    fontSize: 18, 
    marginBottom: 12, 
    textAlign: 'left' 
  }
});