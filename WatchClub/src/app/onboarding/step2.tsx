import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../context/usercontent';

const GENRES = [
  "Action","Adventure","Animation","Anime","Comedy","Romance Comedy","Dark Comedy",
  "Drama","Crime Drama","Legal Drama","Medical Drama","Historical Drama","Psychological Drama",
  "Family Drama","Coming-of-Age","Romance","Romantic Comedy","Romantic Drama","Fantasy",
  "Dark Fantasy","Urban Fantasy","High Fantasy","Sci-Fi","Space Opera","Cyberpunk",
  "Post-Apocalyptic","Dystopian","Time Travel","Thriller","Psychological Thriller",
  "Crime Thriller","Action Thriller","Mystery","Whodunit","Detective","Noir","Neo-Noir",
  "Horror","Supernatural Horror","Psychological Horror","Slasher","Found Footage",
  "Monster Horror","Paranormal","Zombie","Vampire","Werewolf","Gothic Horror","Documentary",
  "Docuseries","True Crime","Biography","Historical","War","Military","Political","Spy",
  "Espionage","Western","Spaghetti Western","Martial Arts","Kung Fu","Sports","Sports Drama",
  "Sitcom","Sketch Comedy","Variety Show","Reality TV","Game Show","Talk Show","Musical",
  "Music","Concert","Opera","Dance","Experimental","Art House","Indie","Cult","Satire",
  "Parody","Mockumentary","Teen","Kids","Family","Educational","Cooking","Travel","Nature",
  "Wildlife","Science","Technology","Medical","Legal","Business","Finance","Self-Help",
  "Inspirational","Religious","Mythology","Fairy Tale","Steampunk","Dieselpunk",
  "Magical Realism","Slice of Life","School","College","Workplace","Superhero",
  "Villain Origin","Anti-Hero","Heist","Robbery","Prison","Survival","Disaster",
  "Apocalypse","Alien","UFO","Extraterrestrial","Artificial Intelligence","Robots",
];

export default function StepTwo() {
  const router = useRouter();
  const { name, setUser } = useUser();
  const [selected, setSelected] = useState<string[]>(["Drama", "Thriller", "Animation"]);
  const [error, setError] = useState('');

  const toggleGenre = (genre: string) => {
    setSelected(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
    if (error) setError('');
  };

  function handleContinue() {
    if (selected.length < 3) {
      setError('Please select at least 3 genres.');
      return;
    }
    setUser(name, selected);
    router.push('/onboarding/step3');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentBlock}>
        <Text style={styles.title}>Pick Your Genres</Text>
        <Text style={styles.subtitle}>Select at least 3 genres you enjoy.</Text>

        <View style={styles.scrollWrapper}>
          <ScrollView contentContainerStyle={styles.chipContainer} showsVerticalScrollIndicator={false}>
            {GENRES.map((genre) => (
              <TouchableOpacity
                key={genre}
                style={[styles.chip, selected.includes(genre) && styles.selectedChip]}
                onPress={() => toggleGenre(genre)}
              >
                <Text style={styles.chipText}>{genre}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.buttonSpacer} />
        <Button title="Continue" onPress={handleContinue} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.stepText}>2 of 3</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 24 },
  contentBlock: { flex: 1, justifyContent: 'flex-start', paddingTop: 80 },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', textAlign: 'left', marginBottom: 12 },
  subtitle: { color: '#aaa', fontSize: 16, textAlign: 'left', marginBottom: 32, lineHeight: 24 },
  scrollWrapper: { height: 380, marginBottom: 8 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 10, paddingBottom: 20 },
  chip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, borderWidth: 1, borderColor: '#333', backgroundColor: '#1A1A1A' },
  selectedChip: { backgroundColor: '#1655E8', borderColor: '#1655E8' },
  chipText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  error: { color: '#ff4d4d', fontSize: 13, marginBottom: 8 },
  buttonSpacer: { height: 30 },
  footer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  stepText: { color: '#666', fontSize: 14, fontWeight: '500' },
});