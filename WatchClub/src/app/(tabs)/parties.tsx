//  parties.tsx
//
//  Created by Omarion Aubert on 4/2/26.
//
//  app/create/index.tsx
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PartiesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Parties Tab</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
