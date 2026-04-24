//  home.tsx — Home screen with platform-filtered favorites search, AI Picks, and Trending

import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useUser, MovieResult } from '@/context/usercontent';
import { Spacing, Radius } from '@/constants/theme';

const TMDB_KEY = '63b1af1c793166c15a7ecda62a6c61ac';
const STREAK = 10;

const GENRE_NAME_TO_ID: Record<string, number> = {
  Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80,
  Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36,
  Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749, 'Sci-Fi': 878,
  Thriller: 53, War: 10752, Western: 37, Anime: 16,
  'Romantic Comedy': 35, 'Crime Drama': 18, 'Dark Fantasy': 14,
  'Space Opera': 878, Cyberpunk: 878, 'Psychological Thriller': 53, Superhero: 28,
};

const PROVIDER_MAP: Record<string, number> = {
  'Netflix': 8, 'Hulu': 15, 'Disney+': 337, 'HBO Max': 1899,
  'Prime Video': 9, 'Apple TV+': 350, 'Peacock': 386, 'Paramount+': 531,
};

// ─── Helper: check if a movie is available on any of the given provider IDs ──

async function isOnPlatforms(movieId: number, providerIds: number[]): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${TMDB_KEY}`
    );
    const data = await res.json();
    const us = data.results?.US;
    if (!us) return false;
    const available: number[] = [
      ...(us.flatrate ?? []),
      ...(us.free ?? []),
      ...(us.ads ?? []),
    ].map((p: any) => p.provider_id);
    return providerIds.some(id => available.includes(id));
  } catch {
    return false;
  }
}

// Filter a list of movies down to those available on the user's platforms.
// If no platforms are selected, return the list unfiltered.
async function filterByPlatforms(movies: any[], platforms: string[]): Promise<any[]> {
  if (platforms.length === 0) return movies;
  const providerIds = platforms.map(p => PROVIDER_MAP[p]).filter(Boolean);
  if (providerIds.length === 0) return movies;

  const results = await Promise.all(
    movies.map(async movie => {
      const ok = await isOnPlatforms(movie.id, providerIds);
      return ok ? movie : null;
    })
  );
  return results.filter(Boolean);
}

// ─── Favorites Search Bar ─────────────────────────────────────────────────────

function FavoritesSearch() {
  const theme = useTheme();
  const { platforms, addFavorite, isFavorite, removeFavorite } = useUser();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim() || platforms.length === 0) { setResults([]); setShowResults(false); return; }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&page=1`);
        const data = await res.json();
        const candidates: MovieResult[] = (data.results ?? []).slice(0, 10);
        const provIds = platforms.map(p => PROVIDER_MAP[p]).filter(Boolean);
        const filtered: MovieResult[] = [];
        await Promise.all(candidates.map(async movie => {
          try {
            const pr = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${TMDB_KEY}`);
            const pd = await pr.json();
            const us = pd.results?.US;
            if (!us) return;
            const avail: number[] = [...(us.flatrate ?? []), ...(us.free ?? []), ...(us.ads ?? [])].map((p: any) => p.provider_id);
            if (provIds.some(id => avail.includes(id))) filtered.push(movie);
          } catch { }
        }));
        setResults(filtered.slice(0, 5));
        setShowResults(true);
      } catch { }
      finally { setSearching(false); }
    }, 500);
  }, [query, platforms]);

  if (platforms.length === 0) return null;

  return (
    <View style={[fs.wrap, { backgroundColor: theme.surface }]}>
      <View style={fs.labelRow}>
        <Ionicons name="heart-outline" size={15} color={theme.primary} />
        <ThemedText type="smallBold" style={{ color: theme.primary, fontSize: 13 }}>Add to Favorites</ThemedText>
      </View>
      <ThemedText type="small" style={{ color: theme.muted, fontSize: 11, marginBottom: 8 }}>
        Showing movies on: {platforms.join(' · ')}
      </ThemedText>
      <View style={[fs.inputRow, { borderColor: theme.border, backgroundColor: theme.background }]}>
        <Ionicons name="search" size={15} color={theme.muted} style={{ marginRight: 8 }} />
        <TextInput
          value={query} onChangeText={setQuery}
          placeholder="Search a movie to favorite..."
          placeholderTextColor={theme.muted}
          style={[fs.input, { color: theme.textPrimary }]}
          autoCorrect={false}
        />
        {searching && <ActivityIndicator size="small" color={theme.primary} />}
        {query.length > 0 && !searching && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setShowResults(false); }}>
            <Ionicons name="close-circle" size={16} color={theme.muted} />
          </TouchableOpacity>
        )}
      </View>
      {showResults && (
        <View style={[fs.dropdown, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {results.length === 0 ? (
            <View style={fs.dropItem}>
              <ThemedText type="small" style={{ color: theme.muted }}>No matches on your platforms for "{query}"</ThemedText>
            </View>
          ) : results.map((movie, i) => {
            const fav = isFavorite(movie.id);
            return (
              <View key={movie.id} style={[fs.dropItem, { borderBottomColor: theme.background, borderBottomWidth: i < results.length - 1 ? 1 : 0 }]}>
                {movie.poster_path
                  ? <Image source={{ uri: `https://image.tmdb.org/t/p/w92${movie.poster_path}` }} style={fs.poster} />
                  : <View style={[fs.poster, { backgroundColor: theme.muted }]} />}
                <View style={{ flex: 1 }}>
                  <ThemedText type="small" style={{ fontWeight: '600' }} numberOfLines={1}>{movie.title}</ThemedText>
                  <ThemedText type="small" style={{ color: theme.muted, fontSize: 11 }}>
                    {movie.release_date?.slice(0, 4)}{movie.vote_average > 0 ? `  ★ ${movie.vote_average.toFixed(1)}` : ''}
                  </ThemedText>
                </View>
                <TouchableOpacity onPress={() => fav ? removeFavorite(movie.id) : addFavorite(movie)}
                  style={[fs.favBtn, { backgroundColor: fav ? '#ef4444' : theme.primary }]}>
                  <Ionicons name={fav ? 'heart-dislike' : 'heart'} size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const fs = StyleSheet.create({
  wrap: { borderRadius: Radius.lg, padding: Spacing.three, marginHorizontal: 20, marginBottom: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 9 },
  input: { flex: 1, fontSize: 14 },
  dropdown: { marginTop: 6, borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },
  dropItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12 },
  poster: { width: 32, height: 44, borderRadius: 4 },
  favBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});

// ─── Movie Card ───────────────────────────────────────────────────────────────

function MovieCard({ item }: { item: any }) {
  const theme = useTheme();
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useUser();
  const fav = isFavorite(item.id);

  return (
    <View style={[mc.card, { backgroundColor: theme.surface }]}>
      <View style={mc.inner}>
        {item.poster_path
          ? <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} style={mc.thumb} />
          : <View style={[mc.thumb, { backgroundColor: '#1a1a2e' }]} />}
        <View style={{ flex: 1 }}>
          <View style={[mc.genreBadge, { backgroundColor: theme.primary }]}>
            <ThemedText type="small" themeColor="textInverse" style={{ fontSize: 11 }}>{item.genre ?? 'Movie'}</ThemedText>
          </View>
          <ThemedText type="smallBold" numberOfLines={2}>{item.title}</ThemedText>
          <ThemedText type="small" style={{ color: theme.muted, fontSize: 12 }}>{item.release_date?.slice(0, 4) ?? '—'}</ThemedText>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <Ionicons name="star" size={12} color="#f5a623" />
            <ThemedText type="small" style={{ fontWeight: '700', fontSize: 12 }}>{item.vote_average ? item.vote_average.toFixed(1) : '—'}</ThemedText>
          </View>
        </View>
        <TouchableOpacity onPress={() => fav ? removeFavorite(item.id) : addFavorite(item)} style={mc.favBtn}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? '#ef4444' : theme.muted} />
        </TouchableOpacity>
      </View>
      <View style={mc.btnRow}>
        <TouchableOpacity onPress={() => router.push(`/create?movieId=${item.id}&movieTitle=${encodeURIComponent(item.title)}&moviePoster=${encodeURIComponent(item.poster_path ?? '')}`)}
          style={[mc.watchBtn, { backgroundColor: theme.primary }]}>
          <ThemedText type="smallBold" themeColor="textInverse" style={{ fontSize: 13 }}>Start Watch Party</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(`/movie?id=${item.id}`)}
          style={[mc.moreBtn, { backgroundColor: theme.background }]}>
          <ThemedText type="smallBold" style={{ fontSize: 13 }}>More →</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const mc = StyleSheet.create({
  card: { borderRadius: Radius.lg, padding: 14, marginBottom: 12 },
  inner: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  thumb: { width: 70, height: 90, borderRadius: 10 },
  genreBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 6 },
  favBtn: { padding: 4 },
  btnRow: { flexDirection: 'row', gap: 10 },
  watchBtn: { flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  moreBtn: { paddingHorizontal: 14, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
});

// ─── Trending Card ────────────────────────────────────────────────────────────

function TrendingCard({ item, index }: { item: any; index: number }) {
  const router = useRouter();
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={() => router.push(`movie?id=${item.id}`)}>
      <View style={tc.card}>
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={tc.thumb} />
        <View style={[tc.rank, { backgroundColor: theme.primary }]}>
          <ThemedText style={{ color: theme.textInverse, fontSize: 11, fontWeight: '700' }}>#{index + 1}</ThemedText>
        </View>
        <View style={tc.label}>
          <ThemedText numberOfLines={1} style={{ color: '#fff', fontSize: 11 }}>{item.title}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const tc = StyleSheet.create({
  card: { width: 110, marginRight: 10, borderRadius: 12, overflow: 'hidden' },
  thumb: { width: 110, height: 150, borderRadius: 12 },
  rank: { position: 'absolute', top: 6, left: 6, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  label: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.55)', padding: 6 },
});

// ─── Home Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { name, genres, platforms, favorites } = useUser();
  const displayName = name.length >= 2 ? name : 'there';

  const [aiPicks, setAiPicks] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // ── AI Picks: fetch by genre then filter by platform ──────────────────────
  useEffect(() => {
    if (genres.length === 0) { setLoadingAi(false); return; }
    setLoadingAi(true);

    const ids = [...new Set(genres.map(g => GENRE_NAME_TO_ID[g]).filter(Boolean))];

    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${ids.slice(0, 3).join('|')}&sort_by=popularity.desc&vote_count.gte=100`
    )
      .then(r => r.json())
      .then(async d => {
        // Tag each movie with the matching genre label before filtering
        const seen = new Set<number>();
        const candidates: any[] = [];
        for (const m of d.results ?? []) {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            const g = genres.find(g => GENRE_NAME_TO_ID[g] && m.genre_ids?.includes(GENRE_NAME_TO_ID[g]));
            candidates.push({ ...m, genre: g ?? genres[0] });
          }
          if (candidates.length === 10) break; // fetch more candidates so filtering has room
        }

        // Filter by user's platforms (skip filter if no platforms selected)
        const filtered = await filterByPlatforms(candidates, platforms);

        // Take first 2 that passed the filter
        setAiPicks(filtered.slice(0, 2));
      })
      .finally(() => setLoadingAi(false));
  }, [genres, platforms]); // re-run when platforms change

  // ── Trending: fetch then filter by platform ───────────────────────────────
  useEffect(() => {
    setLoadingTrending(true);

    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`)
      .then(r => r.json())
      .then(async d => {
        const all = d.results ?? [];
        // Filter by platform; if no platforms selected show everything
        const filtered = await filterByPlatforms(all, platforms);
        setTrending(filtered);
      })
      .finally(() => setLoadingTrending(false));
  }, [platforms]); // re-run when platforms change

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Header */}
          <View style={[hs.header, { backgroundColor: theme.surface }]}>
            <View style={hs.headerRow}>
              <View>
                <ThemedText type="subtitle">Hi, {displayName}!</ThemedText>
                <ThemedText type="small" style={{ color: theme.muted }}>Ready to watch together?</ThemedText>
              </View>
              <View style={[hs.streak, { borderColor: theme.border }]}>
                <Ionicons name="flame" size={20} color="#ef4444" />
                <View>
                  <ThemedText type="smallBold" style={{ color: theme.primary }}>{STREAK}</ThemedText>
                  <ThemedText type="small" style={{ color: theme.muted }}>streak</ThemedText>
                </View>
              </View>
            </View>
            {platforms.length > 0 && (
              <View style={[hs.platformsRow]}>
                <Ionicons name="tv-outline" size={12} color={theme.muted} />
                <ThemedText type="small" style={{ color: theme.muted, fontSize: 11 }}>
                  Streaming on: {platforms.join(' · ')}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Favorites quick access */}
          {favorites.length > 0 && (
            <View style={hs.section}>
              <View style={hs.sectionHead}>
                <ThemedText type="smallBold"><Ionicons name="heart" color="white" size={16}/> My Favorites</ThemedText>
                <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                  <ThemedText style={{ color: theme.primary, fontSize: 13 }}>See All →</ThemedText>
                </TouchableOpacity>
              </View>
              <FlatList
                data={favorites.slice(0, 10)}
                horizontal keyExtractor={i => i.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingTop: 8 }}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => router.push(`/movie?id=${item.id}`)}>
                    <View style={hs.favCard}>
                      {item.poster_path
                        ? <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} style={hs.favPoster} />
                        : <View style={[hs.favPoster, { backgroundColor: theme.muted }]} />}
                      <ThemedText type="small" numberOfLines={2} style={{ fontSize: 11, textAlign: 'center', marginTop: 4 }}>{item.title}</ThemedText>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Favorites search */}
          <View style={{ paddingTop: 16 }}>
            <View style={[hs.sectionHead, { paddingHorizontal: 20, marginBottom: 8 }]}>
              <ThemedText type="smallBold"> <Ionicons name="search" color="white" size={16}/> Find & Favorite</ThemedText>
            </View>
            <FavoritesSearch />
          </View>

          {/* AI Picks */}
          <View style={hs.section}>
            <View style={hs.sectionHead}>
              <ThemedText type="smallBold">AI Picks for You</ThemedText>
              <TouchableOpacity onPress={() => router.push('/aipicks')}>
                <ThemedText style={{ color: theme.primary, fontSize: 13 }}>See More →</ThemedText>
              </TouchableOpacity>
            </View>
            {loadingAi
              ? <ActivityIndicator style={{ marginTop: 16 }} color={theme.primary} />
              : aiPicks.length === 0
                ? (
                  <View style={[hs.emptyBox, { backgroundColor: theme.surface }]}>
                    <Ionicons name="film-outline" size={28} color={theme.muted} />
                    <ThemedText style={{ color: theme.muted, fontSize: 13, textAlign: 'center', marginTop: 8 }}>
                      {genres.length === 0
                        ? 'Add genres in your profile to get picks.'
                        : 'No picks found on your selected platforms.'}
                    </ThemedText>
                  </View>
                )
                : aiPicks.map(item => <MovieCard key={item.id} item={item} />)}
          </View>

          {/* Trending */}
          <View style={hs.section}>
            <ThemedText type="smallBold">Trending Now</ThemedText>
            {loadingTrending
              ? <ActivityIndicator color={theme.primary} />
              : trending.length === 0
                ? (
                  <View style={[hs.emptyBox, { backgroundColor: theme.surface, marginTop: 12 }]}>
                    <Ionicons name="tv-outline" size={28} color={theme.muted} />
                    <ThemedText style={{ color: theme.muted, fontSize: 13, textAlign: 'center', marginTop: 8 }}>
                      No trending movies found on your selected platforms.
                    </ThemedText>
                  </View>
                )
                : (
                  <FlatList
                    data={trending}
                    horizontal
                    keyExtractor={i => i.id.toString()}
                    renderItem={({ item, index }) => <TrendingCard item={item} index={index} />}
                    contentContainerStyle={{ paddingTop: 12 }}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
          </View>

        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const hs = StyleSheet.create({
  header: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streak: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, gap: 6 },
  platformsRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.06)' },
  section: { paddingHorizontal: 20, paddingTop: 20 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  favCard: { width: 80, alignItems: 'center' },
  favPoster: { width: 80, height: 110, borderRadius: 10 },
  emptyBox: { borderRadius: Radius.lg, padding: 24, alignItems: 'center', marginTop: 8 },
});