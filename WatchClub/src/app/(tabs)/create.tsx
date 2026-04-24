//  create.tsx — Create Watch Party with platform-filtered movie search + invite friends

import React, { useState, useEffect, useRef } from 'react';
import {
  View, ScrollView, StyleSheet, TouchableOpacity, Image,
  TextInput, Switch, ActivityIndicator, Platform, KeyboardAvoidingView, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useUser, MovieResult, WatchParty } from '@/context/usercontent';
import { Spacing, Radius } from '@/constants/theme';

// ─── Constants ────────────────────────────────────────────────────────────────

const TMDB_KEY = '63b1af1c793166c15a7ecda62a6c61ac';

const PROVIDER_MAP: Record<string, number> = {
  'Netflix': 8, 'Hulu': 15, 'Disney+': 337, 'HBO Max': 1899,
  'Prime Video': 9, 'Apple TV+': 350, 'Peacock': 386, 'Paramount+': 531,
};

const ALL_PLATFORMS = Object.keys(PROVIDER_MAP);
const DATE_OPTIONS = ['Tonight', 'Tomorrow', 'This Weekend', 'Pick a Date'];
const MAX_SIZE_OPTIONS = ['2', '4', '6', '8', '10+'];

const MOCK_FRIENDS = [
  { id: 'f1', name: 'Alex Kim', username: '@alexkim' },
  { id: 'f2', name: 'Amy Roberts', username: '@amyr' },
  { id: 'f3', name: 'Jordan Bell', username: '@jordanb' },
  { id: 'f4', name: 'Katy Bell', username: '@katyb' },
  { id: 'f5', name: 'Mike Jones', username: '@mikej' },
  { id: 'f6', name: 'Sofia Lee', username: '@sofial' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CreateScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { platforms: savedPlatforms, addParty, addFavorite } = useUser();

  const params = useLocalSearchParams<{ movieId?: string; movieTitle?: string; moviePoster?: string }>();

  // ── Platform selection (pre-filled from profile) ──
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(savedPlatforms.length > 0 ? savedPlatforms : []);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    setPickedMovie(null);
    setMovieQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  // ── Movie search ──
  const [movieQuery, setMovieQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pickedMovie, setPickedMovie] = useState<MovieResult | null>(null);

  useEffect(() => {
    if (params.movieId && params.movieTitle) {
      setPickedMovie({
        id: Number(params.movieId),
        title: decodeURIComponent(params.movieTitle),
        poster_path: params.moviePoster ? decodeURIComponent(params.moviePoster) : null,
        release_date: '', vote_average: 0,
      });
      setPartyName(`${decodeURIComponent(params.movieTitle)} Night`);
    }
  }, [params.movieId]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!movieQuery.trim() || pickedMovie || selectedPlatforms.length === 0) {
      setSearchResults([]); setShowDropdown(false); return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(movieQuery)}&page=1`);
        const data = await res.json();
        const candidates: MovieResult[] = (data.results ?? []).slice(0, 12);
        if (candidates.length === 0) { setSearchResults([]); setShowDropdown(true); return; }

        const providerIds = selectedPlatforms.map(p => PROVIDER_MAP[p]);
        const filtered: MovieResult[] = [];
        await Promise.all(candidates.map(async (movie) => {
          try {
            const pr = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${TMDB_KEY}`);
            const pd = await pr.json();
            const us = pd.results?.US;
            if (!us) return;
            const avail: number[] = [...(us.flatrate ?? []), ...(us.free ?? []), ...(us.ads ?? [])].map((p: any) => p.provider_id);
            if (providerIds.some(id => avail.includes(id))) filtered.push(movie);
          } catch { }
        }));
        setSearchResults(filtered.slice(0, 6));
        setShowDropdown(true);
      } catch { setSearchResults([]); }
      finally { setSearching(false); }
    }, 500);
  }, [movieQuery, selectedPlatforms]);

  const handleSelectMovie = (movie: MovieResult) => {
    setPickedMovie(movie); setMovieQuery(''); setSearchResults([]); setShowDropdown(false);
    if (!partyName) setPartyName(`${movie.title} Night`);
  };

  // ── Form state ──
  const [partyName, setPartyName] = useState(params.movieTitle ? `${decodeURIComponent(params.movieTitle)} Night` : '');
  const [selectedDate, setSelectedDate] = useState('Tonight');
  const [selectedTime, setSelectedTime] = useState('8:00 PM');
  const [selectedSize, setSelectedSize] = useState('4');
  const [isPrivate, setIsPrivate] = useState(true);
  const [description, setDescription] = useState('');
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [created, setCreated] = useState(false);
  const [createdPartyId, setCreatedPartyId] = useState('');

  const toggleFriend = (id: string) =>
    setInvitedFriends(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const posterUri = pickedMovie?.poster_path ? `https://image.tmdb.org/t/p/w200${pickedMovie.poster_path}` : null;
  const canCreate = !!partyName.trim() && !!pickedMovie && selectedPlatforms.length > 0;

  const handleCreate = () => {
    if (!canCreate || !pickedMovie) return;
    const id = `party_${Date.now()}`;
    const party: WatchParty = {
      id, partyName, movie: pickedMovie,
      platform: selectedPlatforms[0],
      date: selectedDate, time: selectedTime,
      maxGuests: selectedSize === '10+' ? 10 : Number(selectedSize),
      isPrivate, description,
      invitedFriends: invitedFriends.map(fid => MOCK_FRIENDS.find(f => f.id === fid)?.username ?? fid),
      status: 'upcoming', createdAt: Date.now(),
    };
    addParty(party);
    setCreatedPartyId(id);
    setCreated(true);
  };

  // ── Success screen ──
  if (created && pickedMovie) {
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: theme.background }]}>
        <View style={s.successWrapper}>
          <View style={[s.successIcon, { backgroundColor: theme.surface }]}>
            <Ionicons name="checkmark-circle" size={64} color={theme.primary} />
          </View>
          <ThemedText type="title" style={{ textAlign: 'center', fontSize: 28, marginTop: 16 }}>Party Created!</ThemedText>
          <ThemedText type="small" style={{ color: theme.muted, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
            Your watch party for "{pickedMovie.title}" is all set.{invitedFriends.length > 0 ? ` ${invitedFriends.length} friend${invitedFriends.length > 1 ? 's' : ''} invited.` : ''}
          </ThemedText>
          <TouchableOpacity
            style={[s.bigBtn, { backgroundColor: theme.primary, marginTop: 28 }]}
            onPress={() => router.push('/(tabs)/parties')}
          >
            <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 15 }}>View in My Parties →</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.bigBtn, { backgroundColor: theme.surface, marginTop: 10 }]}
            onPress={() => { setCreated(false); setPartyName(''); setPickedMovie(null); setDescription(''); setInvitedFriends([]); }}
          >
            <ThemedText style={{ color: theme.primary, fontWeight: '600', fontSize: 15 }}>Create Another</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.screen, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={s.titleRow}>
            <ThemedText type="title" style={s.pageTitle}>Create Watch Party</ThemedText>
            <ThemedText type="small" style={{ color: theme.muted }}>Invite your friends right now!</ThemedText>
          </View>

          {/* Party Name */}
          <View style={[s.card, { backgroundColor: theme.surface }]}>
            <View style={s.labelRow}>
              <Ionicons name="create-outline" size={15} color={theme.primary} />
              <ThemedText style={[s.label, { color: theme.muted }]}>PARTY NAME</ThemedText>
            </View>
            <TextInput
              value={partyName} onChangeText={setPartyName}
              placeholder="e.g. Friday Night Flicks" placeholderTextColor={theme.muted}
              style={[s.input, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.background }]}
            />
          </View>

          {/* Streaming Services */}
          <View style={[s.card, { backgroundColor: theme.surface }]}>
            <View style={s.labelRow}>
              <Ionicons name="tv-outline" size={15} color={theme.primary} />
              <ThemedText style={[s.label, { color: theme.muted }]}>STREAMING SERVICES</ThemedText>
            </View>
            {savedPlatforms.length > 0 && (
              <ThemedText type="small" style={{ color: theme.muted, fontSize: 11, marginBottom: 8 }}>
                Pre-filled from your profile · tap to change
              </ThemedText>
            )}
            <View style={s.chipWrap}>
              {ALL_PLATFORMS.map(p => {
                const sel = selectedPlatforms.includes(p);
                return (
                  <TouchableOpacity key={p} onPress={() => togglePlatform(p)}
                    style={[s.chip, { backgroundColor: sel ? theme.primary : theme.background, borderColor: theme.primary }]}>
                    <ThemedText style={{ color: sel ? theme.textInverse : theme.primary, fontWeight: '600', fontSize: 12 }}>{p}</ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Movie Search */}
          <View style={[s.card, { backgroundColor: theme.surface }]}>
            <View style={s.labelRow}>
              <Ionicons name="film-outline" size={15} color={theme.primary} />
              <ThemedText style={[s.label, { color: theme.muted }]}>SELECT MOVIE</ThemedText>
            </View>

            {selectedPlatforms.length === 0 ? (
              <View style={[s.gateBanner, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Ionicons name="lock-closed-outline" size={16} color={theme.muted} />
                <ThemedText type="small" style={{ color: theme.muted, flex: 1 }}>Select a streaming service above first</ThemedText>
              </View>
            ) : pickedMovie ? (
              <View style={[s.selectedMovie, { backgroundColor: theme.background }]}>
                {posterUri
                  ? <Image source={{ uri: posterUri }} style={s.selectedPoster} />
                  : <View style={[s.selectedPoster, { backgroundColor: theme.muted }]} />}
                <View style={{ flex: 1 }}>
                  <ThemedText type="smallBold" numberOfLines={2}>{pickedMovie.title}</ThemedText>
                  {pickedMovie.release_date ? <ThemedText type="small" style={{ color: theme.muted }}>{pickedMovie.release_date.slice(0, 4)}</ThemedText> : null}
                  <View style={[s.availBadge, { backgroundColor: theme.secondary, marginTop: 4, alignSelf: 'flex-start' }]}>
                    <ThemedText style={{ color: theme.primary, fontSize: 10, fontWeight: '700' }}>✓ On your services</ThemedText>
                  </View>
                </View>
                <TouchableOpacity onPress={() => { setPickedMovie(null); setMovieQuery(''); }} style={{ padding: 6 }}>
                  <Ionicons name="close-circle" size={22} color={theme.muted} />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View style={[s.searchRow, { borderColor: theme.border, backgroundColor: theme.background }]}>
                  <Ionicons name="search" size={16} color={theme.muted} style={{ marginRight: 8 }} />
                  <TextInput
                    value={movieQuery} onChangeText={setMovieQuery}
                    placeholder={`Search on ${selectedPlatforms.slice(0, 2).join(', ')}${selectedPlatforms.length > 2 ? '…' : ''}…`}
                    placeholderTextColor={theme.muted}
                    style={[s.searchInput, { color: theme.textPrimary }]}
                    autoCorrect={false}
                  />
                  {searching && <ActivityIndicator size="small" color={theme.primary} />}
                </View>
                <View style={s.filterHint}>
                  <Ionicons name="filter" size={11} color={theme.muted} />
                  <ThemedText type="small" style={{ color: theme.muted, fontSize: 11 }}>Only titles on: {selectedPlatforms.join(' · ')}</ThemedText>
                </View>
                {showDropdown && searchResults.length > 0 && (
                  <View style={[s.dropdown, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    {searchResults.map((movie, i) => (
                      <TouchableOpacity key={movie.id} onPress={() => handleSelectMovie(movie)}
                        style={[s.dropItem, { borderBottomColor: theme.background, borderBottomWidth: i < searchResults.length - 1 ? 1 : 0 }]}>
                        {movie.poster_path
                          ? <Image source={{ uri: `https://image.tmdb.org/t/p/w92${movie.poster_path}` }} style={s.dropPoster} />
                          : <View style={[s.dropPoster, { backgroundColor: theme.muted }]} />}
                        <View style={{ flex: 1 }}>
                          <ThemedText type="small" style={{ fontWeight: '600' }} numberOfLines={1}>{movie.title}</ThemedText>
                          <ThemedText type="small" style={{ color: theme.muted }}>
                            {movie.release_date?.slice(0, 4) ?? '—'}{movie.vote_average > 0 ? `  ★ ${movie.vote_average.toFixed(1)}` : ''}
                          </ThemedText>
                        </View>
                        <View style={[s.availBadge, { backgroundColor: theme.secondary }]}>
                          <ThemedText style={{ color: theme.primary, fontSize: 9, fontWeight: '700' }}>Available</ThemedText>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {showDropdown && !searching && searchResults.length === 0 && movieQuery.length > 1 && (
                  <View style={[s.dropdown, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={s.dropItem}>
                      <Ionicons name="sad-outline" size={18} color={theme.muted} />
                      <ThemedText type="small" style={{ color: theme.muted, flex: 1 }}>"{movieQuery}" isn't on {selectedPlatforms.join(' or ')}</ThemedText>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Invite Friends */}
          <View style={[s.card, { backgroundColor: theme.surface }]}>
            <View style={[s.labelRow, { justifyContent: 'space-between' }]}>
              <View style={s.labelRow}>
                <Ionicons name="people-outline" size={15} color={theme.primary} />
                <ThemedText style={[s.label, { color: theme.muted }]}>INVITE FRIENDS</ThemedText>
              </View>
              <TouchableOpacity onPress={() => setShowFriendModal(true)}
                style={[s.inviteBtn, { borderColor: theme.primary }]}>
                <ThemedText type="small" style={{ color: theme.primary, fontWeight: '600' }}>
                  {invitedFriends.length > 0 ? `${invitedFriends.length} selected` : 'Select'}
                </ThemedText>
              </TouchableOpacity>
            </View>
            {invitedFriends.length > 0 ? (
              <View style={s.chipWrap}>
                {invitedFriends.map(fid => {
                  const friend = MOCK_FRIENDS.find(f => f.id === fid);
                  if (!friend) return null;
                  return (
                    <TouchableOpacity key={fid} onPress={() => toggleFriend(fid)}
                      style={[s.friendChip, { backgroundColor: theme.primary }]}>
                      <ThemedText style={{ color: theme.textInverse, fontSize: 12, fontWeight: '600' }}>{friend.name}</ThemedText>
                      <Ionicons name="close" size={12} color={theme.textInverse} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <ThemedText type="small" style={{ color: theme.muted }}>No friends invited yet</ThemedText>
            )}
          </View>

          {/* When */}
          <View style={[s.card, { backgroundColor: theme.surface }]}>
            <View style={s.labelRow}>
              <Ionicons name="calendar-outline" size={15} color={theme.primary} />
              <ThemedText style={[s.label, { color: theme.muted }]}>WHEN</ThemedText>
            </View>
            <View style={s.chipWrap}>
              {DATE_OPTIONS.map(opt => (
                <TouchableOpacity key={opt} onPress={() => setSelectedDate(opt)}
                  style={[s.chip, { backgroundColor: selectedDate === opt ? theme.primary : theme.background, borderColor: theme.primary }]}>
                  <ThemedText type="small" style={{ color: selectedDate === opt ? theme.textInverse : theme.primary, fontWeight: '600' }}>{opt}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Max Guests */}
          <View style={[s.card, { backgroundColor: theme.surface }]}>
            <View style={s.labelRow}>
              <Ionicons name="person-add-outline" size={15} color={theme.primary} />
              <ThemedText style={[s.label, { color: theme.muted }]}>MAX GUESTS</ThemedText>
            </View>
            <View style={s.chipWrap}>
              {MAX_SIZE_OPTIONS.map(opt => (
                <TouchableOpacity key={opt} onPress={() => setSelectedSize(opt)}
                  style={[s.sizeChip, { backgroundColor: selectedSize === opt ? theme.primary : theme.background, borderColor: theme.primary }]}>
                  <ThemedText type="small" style={{ color: selectedSize === opt ? theme.textInverse : theme.primary, fontWeight: '600' }}>{opt}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={[s.card, { backgroundColor: theme.surface }]}>
            <View style={s.labelRow}>
              <Ionicons name="chatbubble-outline" size={15} color={theme.primary} />
              <ThemedText style={[s.label, { color: theme.muted }]}>DESCRIPTION (OPTIONAL)</ThemedText>
            </View>
            <TextInput
              value={description} onChangeText={setDescription}
              placeholder="Add a note for your guests..." placeholderTextColor={theme.muted}
              multiline numberOfLines={3}
              style={[s.textarea, { color: theme.textPrimary }]}
            />
          </View>

          {/* Private Toggle */}
          <View style={[s.card, { backgroundColor: theme.surface }]}>
            <View style={s.toggleRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="lock-closed-outline" size={16} color={theme.primary} />
                <View>
                  <ThemedText type="smallBold">Private Party</ThemedText>
                  <ThemedText type="small" style={{ color: theme.muted }}>Only invited friends can join</ThemedText>
                </View>
              </View>
              <Switch value={isPrivate} onValueChange={setIsPrivate} trackColor={{ false: theme.muted, true: theme.primary }} thumbColor="#fff" />
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity onPress={handleCreate} disabled={!canCreate}
            style={[s.bigBtn, { backgroundColor: canCreate ? theme.primary : theme.muted, marginTop: 8 }]}>
            <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 16 }}>Continue</ThemedText>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Friend invite modal */}
      <Modal visible={showFriendModal} transparent animationType="slide" onRequestClose={() => setShowFriendModal(false)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { backgroundColor: theme.surface }]}>
            <View style={[s.modalHeader, { borderBottomColor: theme.background }]}>
              <ThemedText type="smallBold" style={{ fontSize: 16 }}>Invite Friends</ThemedText>
              <TouchableOpacity onPress={() => setShowFriendModal(false)}>
                <Ionicons name="close" size={22} color={theme.muted} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={MOCK_FRIENDS}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const selected = invitedFriends.includes(item.id);
                return (
                  <TouchableOpacity onPress={() => toggleFriend(item.id)}
                    style={[s.friendRow, { borderBottomColor: theme.background }]}>
                    <View style={[s.friendAvatar, { backgroundColor: theme.primary }]}>
                      <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 13 }}>
                        {item.name.split(' ').map(w => w[0]).join('')}
                      </ThemedText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText type="smallBold">{item.name}</ThemedText>
                      <ThemedText type="small" style={{ color: theme.muted }}>{item.username}</ThemedText>
                    </View>
                    <View style={[s.checkCircle, { backgroundColor: selected ? theme.primary : theme.background, borderColor: selected ? theme.primary : theme.border }]}>
                      {selected && <Ionicons name="checkmark" size={14} color={theme.textInverse} />}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity onPress={() => setShowFriendModal(false)}
              style={[s.bigBtn, { backgroundColor: theme.primary, margin: 16 }]}>
              <ThemedText style={{ color: theme.textInverse, fontWeight: '700' }}>
                Done {invitedFriends.length > 0 ? `(${invitedFriends.length})` : ''}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: Spacing.three, gap: Spacing.two, paddingBottom: 100 },
  titleRow: { marginBottom: Spacing.one, gap: 4 },
  pageTitle: { fontSize: 28, fontWeight: '700' },
  card: { borderRadius: Radius.lg, padding: Spacing.three, gap: 10 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  input: { fontSize: 15, paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderRadius: Radius.md },
  textarea: { fontSize: 14, paddingVertical: 4, minHeight: 60, textAlignVertical: 'top' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5 },
  sizeChip: { borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5, minWidth: 42, alignItems: 'center' },
  gateBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderStyle: 'dashed', borderRadius: Radius.md, padding: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  filterHint: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, paddingHorizontal: 2 },
  dropdown: { marginTop: 6, borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },
  dropItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12 },
  dropPoster: { width: 36, height: 48, borderRadius: 4 },
  availBadge: { borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  selectedMovie: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: Radius.md, padding: 10 },
  selectedPoster: { width: 52, height: 72, borderRadius: Radius.sm },
  inviteBtn: { borderWidth: 1.5, borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 5 },
  friendChip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bigBtn: { borderRadius: Radius.lg, paddingVertical: 15, alignItems: 'center' },
  successWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.five },
  successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBox: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '75%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  friendRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1 },
  friendAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  checkCircle: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});