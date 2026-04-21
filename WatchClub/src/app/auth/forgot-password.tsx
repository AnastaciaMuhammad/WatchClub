import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SuccessModal } from '../../components/ui/Modal';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPassword() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSendLink = () => {
    // Logic to send email would go here
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    router.push('/auth/signin');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* contentBlock shifts everything up and aligns left like Step 1-3 */}
      <View style={styles.contentBlock}>
        <Text style={styles.title}>Forgot{"\n"}Password?</Text>
        
        <Text style={styles.description}>
          You cannot reset your password if you haven't logged into the new app. Fear not, all you need is your email address and the steps on the log-in page and start watching!.
        </Text>

        <Input label="Email" placeholder="Enter your email" />
        
        {/* Consistent spacing between input and button */}
        <View style={styles.buttonSpacer} />

        <Button label="Send Link" onPress={handleSendLink} />
      </View>

      {/* Pop-up Component */}
      <SuccessModal 
        visible={modalVisible} 
        onClose={handleCloseModal}
        title="Confirmed"
        message="Thank you. You'll receive an email shortly to reset your password. If you do not see the email please be sure to check your junk mail folder."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    padding: 24, 
  },
  contentBlock: {
    flex: 1,
    justifyContent: 'flex-start', // Shifted to top
    paddingTop: 80, // Same vertical start as Step 1
  },
  title: { 
    fontSize: 32, 
    color: '#fff', 
    fontWeight: 'bold', 
    textAlign: 'left', // Left aligned
    marginBottom: 20 
  },
  description: { 
    color: '#aaa', 
    fontSize: 14, // Slightly larger for better left-aligned readability
    lineHeight: 22, 
    textAlign: 'left', // Left aligned
    marginBottom: 32,
  },
  buttonSpacer: {
    height: 20, // Space between input and button
  }
});