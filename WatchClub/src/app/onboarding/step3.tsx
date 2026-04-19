import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { SuccessModal } from '../../components/ui/Modal';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const SERVICES = ["Netflix","Hulu","Disney+","Prime Video","HBO Max","Apple TV+","Paramount+","Peacock","Crunchyroll","YouTube TV"];

export default function StepThree() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>(["Hulu"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastConnected, setLastConnected] = useState("");

  const toggleService = (service: string) => {
    if (!selectedServices.includes(service)) {
      setLastConnected(service);
      setModalVisible(true);
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter(s => s !== service));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentBlock}>
        <Text style={styles.title}>Streaming Services</Text>
        <Text style={styles.subtitle}>Connect your primary streaming services.</Text>

        <View style={styles.scrollWrapper}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {SERVICES.map((service) => (
              <TouchableOpacity
                key={service}
                style={[
                  styles.serviceRow, 
                  selectedServices.includes(service) && styles.activeRow
                ]}
                onPress={() => toggleService(service)}
              >
                <Text style={styles.serviceText}>{service}</Text>
                <View style={styles.iconCircle}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    {selectedServices.includes(service) ? "✓" : "+"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonSpacer} />

        <Button 
          label="Continue" 
          onPress={() => router.push('/onboarding/success')} 
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.stepText}>3 of 3</Text>
      </View>

      <SuccessModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Connected!"
        message={`${lastConnected} has been successfully linked to your Watch Club account.`}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 24 },
  contentBlock: { flex: 1, justifyContent: 'flex-start', paddingTop: 80 },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', textAlign: 'left', marginBottom: 12 },
  subtitle: { color: '#aaa', fontSize: 16, textAlign: 'left', marginBottom: 32 },
  scrollWrapper: { height: 350, marginBottom: 20 },
  serviceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#333',
    marginBottom: 12,
    backgroundColor: '#1A1A1A'
  },
  activeRow: { backgroundColor: '#1655E8', borderColor: '#1655E8' },
  serviceText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  iconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  buttonSpacer: { height: 20 },
  footer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  stepText: { color: '#666', fontSize: 14 }
});