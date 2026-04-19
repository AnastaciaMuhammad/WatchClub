import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { AppStyles } from '@/constants/appstyles';
import { useUser } from '@/context/usercontent';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const D = Colors.dark;

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
  const [selected, setSelected] = useState<string[]>(["Drama", "Comedy", "Animation"]);
  const [error, setError] = useState('');

  const toggle = (g: string) => {
    setSelected(p => p.includes(g) ? p.filter(x => x !== g) : [...p, g]);
    if (error) setError('');
  };

  function handleContinue() {
    if (selected.length < 3) { setError('Please select at least 3 genres.'); return; }
    setUser(name, selected);
    router.push('/onboarding/step3');
  }

  return (
    <SafeAreaView style={AppStyles.screen}>
      <View style={AppStyles.contentBlock}>
        <Text style={AppStyles.title}>Pick Your Genres</Text>
        <Text style={AppStyles.subtitle}>Select at least 3 genres you enjoy.</Text>
        <View style={styles.scrollWrapper}>
          <ScrollView contentContainerStyle={styles.chipContainer} showsVerticalScrollIndicator={false}>
            {GENRES.map(g => (
              <TouchableOpacity key={g} style={[styles.chip, selected.includes(g) && styles.selectedChip]} onPress={() => toggle(g)}>
                <Text style={styles.chipText}>{g}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.buttonSpacer} />
        <Button label="Continue" onPress={handleContinue} />
      </View>
      <View style={AppStyles.footer}>
        <Text style={AppStyles.stepText}>2 of 3</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollWrapper: { height: 380, marginBottom: 8 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 20 },
  chip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, borderWidth: 1, borderColor: '#333', backgroundColor: D.surface },
  selectedChip: { backgroundColor: D.primary, borderColor: D.primary },
  chipText: { color: D.textPrimary, fontSize: 14, fontWeight: '500' },
});