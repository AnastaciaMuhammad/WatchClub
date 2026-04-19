//  create.tsx
//
//  Create a Watch Party page
//  Accepts optional query params: movieId, movieTitle, moviePoster

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useUser } from '@/context/usercontent';
import { Spacing, Radius } from '@/constants/theme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';


const API_KEY = '63b1af1c793166c15a7ecda62a6c61ac';
const DATE_OPTIONS = ['Tonight', 'Tomorrow', 'This Weekend', 'Pick a Date'];
const MAX_SIZE_OPTIONS = ['2', '4', '6', '8', '10+'];

type MovieResult = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export default function CreateScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { name } = useUser();

  const params = useLocalSearchParams<{
    movieId?: string;
    movieTitle?: string;
    moviePoster?: string;
  }>();

  // ── Movie selection state ──
  const [movieQuery, setMovieQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pickedMovie, setPickedMovie] = useState<MovieResult | null>(null);

  // Pre-fill if navigated from a movie page
  useEffect(() => {
    if (params.movieId && params.movieTitle) {
      setPickedMovie({
        id: Number(params.movieId),
        title: decodeURIComponent(params.movieTitle),
        poster_path: params.moviePoster ? decodeURIComponent(params.moviePoster) : null,
        release_date: '',
        vote_average: 0,
      });
      setPartyName(`${decodeURIComponent(params.movieTitle)} Night`);
    }
  }, [params.movieId]);

  // Debounced TMDB search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!movieQuery.trim() || pickedMovie) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieQuery)}&page=1`
        );
        const data = await res.json();
        setSearchResults((data.results ?? []).slice(0, 6));
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, [movieQuery]);

  const handleSelectMovie = (movie: MovieResult) => {
    setPickedMovie(movie);
    setMovieQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    if (!partyName) setPartyName(`${movie.title} Night`);
  };

  const handleRemoveMovie = () => {
    setPickedMovie(null);
    setMovieQuery('');
  };

  // ── Party form state ──
  const [partyName, setPartyName] = useState(
    params.movieTitle ? `${decodeURIComponent(params.movieTitle)} Night` : ''
  );
  const [selectedDate, setSelectedDate] = useState('Tonight');
  const [selectedSize, setSelectedSize] = useState('4');
  const [isPrivate, setIsPrivate] = useState(true);
  const [description, setDescription] = useState('');
  const [created, setCreated] = useState(false);

  const posterUri = pickedMovie?.poster_path
    ? `https://image.tmdb.org/t/p/w200${pickedMovie.poster_path}`
    : null;

  const canCreate = !!partyName && !!pickedMovie;

  const handleCreate = () => {
    if (!canCreate) return;
    setCreated(true);
  };

  // ── Success screen ──
  if (created) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.successWrapper}>
          <ThemedText style={styles.successEmoji}>🎉</ThemedText>
          <ThemedText type="title" style={{ textAlign: 'center' }}>
            Party Created!
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.muted, textAlign: 'center', marginTop: 6 }}>
            Your watch party for "{pickedMovie?.title}" is live. Invite your friends!
          </ThemedText>

          <TouchableOpacity
            style={[styles.bigBtn, { backgroundColor: theme.primary, marginTop: 24 }]}
            onPress={() => {
              setCreated(false);
              setPartyName('');
              setPickedMovie(null);
              setDescription('');
            }}
          >
            <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 15 }}>
              Create Another
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bigBtn, { backgroundColor: theme.surface, marginTop: 10 }]}
            onPress={() => router.push('/(tabs)/parties')}
          >
            <ThemedText style={{ color: theme.primary, fontWeight: '600', fontSize: 15 }}>
              View My Parties →
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── Title ─── */}
          <View style={styles.titleRow}>
            <ThemedText type="title">Create Party</ThemedText>
            <ThemedText type="small" style={{ color: theme.muted }}>
              Host a watch session with friends
            </ThemedText>
          </View>

          {/* ─── Movie Search ─── */}
          <View style={[styles.field, { backgroundColor: theme.surface }]}>
            <ThemedText type="small" style={[styles.label, { color: theme.muted }]}>
              MOVIE / SHOW
            </ThemedText>

            {/* Selected movie card */}
            {pickedMovie ? (
              <View style={[styles.selectedMovieRow, { backgroundColor: theme.background }]}>
                {posterUri ? (
                  <Image source={{ uri: posterUri }} style={styles.selectedPoster} />
                ) : (
                  <View style={[styles.selectedPoster, { backgroundColor: theme.muted }]} />
                )}
                <View style={{ flex: 1 }}>
                  <ThemedText type="smallBold" numberOfLines={2}>
                    {pickedMovie.title}
                  </ThemedText>
                  {pickedMovie.release_date ? (
                    <ThemedText type="small" style={{ color: theme.muted }}>
                      {pickedMovie.release_date.slice(0, 4)}
                    </ThemedText>
                  ) : null}
                </View>
                <TouchableOpacity onPress={handleRemoveMovie} style={styles.removeBtn}>
                  <ThemedText style={{ color: '#ff4d4d', fontSize: 18, fontWeight: '700' }}>✕</ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              /* Search input */
              <View>
                <View style={[styles.searchInputRow, { borderColor: theme.border, backgroundColor: theme.background }]}>
                  <ThemedText style={{ color: theme.muted, marginRight: 6 }}><FontAwesome5 name="search" size={20} color="white" /></ThemedText>
                  <TextInput
                    value={movieQuery}
                    onChangeText={setMovieQuery}
                    placeholder="Search for a movie or show..."
                    placeholderTextColor={theme.muted}
                    style={[styles.searchInput, { color: theme.textPrimary }]}
                    autoCorrect={false}
                  />
                  {searching && <ActivityIndicator size="small" color={theme.primary} />}
                </View>

                {/* Dropdown results */}
                {showDropdown && searchResults.length > 0 && (
                  <View style={[styles.dropdown, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    {searchResults.map((movie, index) => (
                      <TouchableOpacity
                        key={movie.id}
                        onPress={() => handleSelectMovie(movie)}
                        style={[
                          styles.dropdownItem,
                          {
                            borderBottomColor: theme.background,
                            borderBottomWidth: index < searchResults.length - 1 ? 1 : 0,
                          },
                        ]}
                      >
                        {movie.poster_path ? (
                          <Image
                            source={{ uri: `https://image.tmdb.org/t/p/w92${movie.poster_path}` }}
                            style={styles.dropdownPoster}
                          />
                        ) : (
                          <View style={[styles.dropdownPoster, { backgroundColor: theme.muted }]} />
                        )}
                        <View style={{ flex: 1 }}>
                          <ThemedText type="small" style={{ fontWeight: '600' }} numberOfLines={1}>
                            {movie.title}
                          </ThemedText>
                          <ThemedText type="small" style={{ color: theme.muted }}>
                             {movie.release_date?.slice(0, 4) ?? '—'}    
                            <Ionicons name="star" size={15} color="#ffffff" />            
                            
                            {movie.vote_average > 0 ? ` ${movie.vote_average.toFixed(1)}` : ''}
                          </ThemedText>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* No results */}
                {showDropdown && !searching && searchResults.length === 0 && movieQuery.length > 1 && (
                  <View style={[styles.dropdown, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.dropdownItem}>
                      <ThemedText type="small" style={{ color: theme.muted }}>
                        No results for "{movieQuery}"
                      </ThemedText>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* ─── Party Name ─── */}
          <View style={[styles.field, { backgroundColor: theme.surface }]}>
            <ThemedText type="small" style={[styles.label, { color: theme.muted }]}>
              PARTY NAME
            </ThemedText>
            <TextInput
              value={partyName}
              onChangeText={setPartyName}
              placeholder="e.g. Friday Night Flicks"
              placeholderTextColor={theme.muted}
              style={[styles.input, { color: theme.textPrimary }]}
            />
          </View>

          {/* ─── When ─── */}
          <View style={[styles.field, { backgroundColor: theme.surface }]}>
            <ThemedText type="small" style={[styles.label, { color: theme.muted }]}>
              WHEN
            </ThemedText>
            <View style={styles.chipRow}>
              {DATE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setSelectedDate(opt)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selectedDate === opt ? theme.primary : theme.background,
                      borderColor: theme.primary,
                    },
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={{
                      color: selectedDate === opt ? theme.textInverse : theme.primary,
                      fontWeight: '600',
                    }}
                  >
                    {opt}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ─── Max Size ─── */}
          <View style={[styles.field, { backgroundColor: theme.surface }]}>
            <ThemedText type="small" style={[styles.label, { color: theme.muted }]}>
              MAX GUESTS
            </ThemedText>
            <View style={styles.chipRow}>
              {MAX_SIZE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setSelectedSize(opt)}
                  style={[
                    styles.sizeChip,
                    {
                      backgroundColor: selectedSize === opt ? theme.primary : theme.background,
                      borderColor: theme.primary,
                    },
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={{
                      color: selectedSize === opt ? theme.textInverse : theme.primary,
                      fontWeight: '600',
                    }}
                  >
                    {opt}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ─── Description ─── */}
          <View style={[styles.field, { backgroundColor: theme.surface }]}>
            <ThemedText type="small" style={[styles.label, { color: theme.muted }]}>
              DESCRIPTION (OPTIONAL)
            </ThemedText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add a note for your guests..."
              placeholderTextColor={theme.muted}
              multiline
              numberOfLines={3}
              style={[styles.textarea, { color: theme.textPrimary }]}
            />
          </View>

          {/* ─── Private Toggle ─── */}
          <View style={[styles.field, { backgroundColor: theme.surface }]}>
            <View style={styles.toggleRow}>
              <View>
                <ThemedText type="smallBold">Private Party</ThemedText>
                <ThemedText type="small" style={{ color: theme.muted }}>
                  Only invited friends can join
                </ThemedText>
              </View>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{ false: theme.muted, true: theme.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* ─── Create Button ─── */}
          <TouchableOpacity
            onPress={handleCreate}
            disabled={!canCreate}
            style={[
              styles.bigBtn,
              {
                backgroundColor: canCreate ? theme.primary : theme.muted,
                marginTop: Spacing.two,
              },
            ]}
          >
            <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 16 }}>
              Create Watch Party
            </ThemedText>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  scroll: {
    padding: Spacing.three,
    gap: Spacing.two,
    paddingBottom: 100,
  },

  titleRow: {
    marginBottom: Spacing.one,
    gap: 4,
  },

  field: {
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: Spacing.one,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  input: {
    fontSize: 15,
    paddingVertical: 4,
  },

  textarea: {
    fontSize: 14,
    paddingVertical: 4,
    minHeight: 60,
    textAlignVertical: 'top',
  },

  // Movie search
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
  },

  dropdown: {
    marginTop: 6,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },

  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  dropdownPoster: {
    width: 36,
    height: 48,
    borderRadius: 4,
  },

  // Selected movie card
  selectedMovieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: Radius.md,
    padding: 10,
    marginTop: 4,
  },

  selectedPoster: {
    width: 52,
    height: 72,
    borderRadius: Radius.sm,
  },

  removeBtn: {
    padding: 6,
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: 4,
  },

  chip: {
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
  },

  sizeChip: {
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
    minWidth: 42,
    alignItems: 'center',
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  bigBtn: {
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },

  successWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.five,
  },

  successEmoji: {
    fontSize: 64,
    marginBottom: Spacing.three,
  },
});
