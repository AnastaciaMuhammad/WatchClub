import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { SuccessModal } from '@/components/ui/Modal';
import { AppStyles } from '@/constants/appstyles';
import { useUser } from '@/context/usercontent';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const D = Colors.dark;
const SERVICES = ["Netflix","Hulu","Disney+","Prime Video","HBO Max","Apple TV+","Paramount+","Peacock","Crunchyroll","YouTube TV"];

export default function StepThree() {
  const router = useRouter();
  const { setServices } = useUser();
  const [selected, setSelected] = useState<string[]>(["Hulu"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastConnected, setLastConnected] = useState('');

  const toggle = (s: string) => {
    if (!selected.includes(s)) {
      setLastConnected(s);
      setModalVisible(true);
      setSelected(p => [...p, s]);
    } else {
      setSelected(p => p.filter(x => x !== s));
    }
  };

  return (
    <SafeAreaView style={AppStyles.screen}>
      <View style={AppStyles.contentBlock}>
        <Text style={AppStyles.title}>Streaming Services</Text>
        <Text style={AppStyles.subtitle}>Connect your primary streaming services.</Text>
        <View style={styles.scrollWrapper}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {SERVICES.map(s => (
              <TouchableOpacity key={s} style={[styles.row, selected.includes(s) && styles.activeRow]} onPress={() => toggle(s)}>
                <Text style={styles.rowText}>{s}</Text>
                <View style={styles.icon}>
                  <Text style={{ color: D.textPrimary, fontWeight: 'bold' }}>{selected.includes(s) ? '✓' : '+'}</Text>
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
      <View style={AppStyles.footer}>
        <Text style={AppStyles.stepText}>3 of 3</Text>
      </View>
      <SuccessModal visible={modalVisible} onClose={() => setModalVisible(false)}
        title="Connected!" message={`${lastConnected} has been linked to your Watch Club account.`} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollWrapper: { height: 350, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 12, borderWidth: 1, borderColor: '#333', marginBottom: 12, backgroundColor: D.surface },
  activeRow: { backgroundColor: D.primary, borderColor: D.primary },
  rowText: { color: D.textPrimary, fontSize: 18, fontWeight: '600' },
  icon: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
});