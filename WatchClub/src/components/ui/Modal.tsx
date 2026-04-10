import React from 'react';
import { Modal as RNModal, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Button } from './Button';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function SuccessModal({ visible, onClose, title, message }: CustomModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              <Button title="Back to Sign In" onPress={onClose} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  title: { color: '#1655E8', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  message: { color: '#aaa', textAlign: 'center', fontSize: 16, lineHeight: 22, marginBottom: 24 }
});