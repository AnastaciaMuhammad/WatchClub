import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Image, ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/usercontent';

const API_KEY = "63b1af1c793166c15a7ecda62a6c61ac";
const STREAK = 10;

const GENRE_NAME_TO_ID: Record<string, number> = {
  Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80,
  Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36,
  Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749, 'Sci-Fi': 878,
  Thriller: 53, War: 10752, Western: 37,
  Anime: 16, 'Romance Comedy': 35, 'Dark Comedy': 35, 'Crime Drama': 18,
  'Legal Drama': 18, 'Medical Drama': 18, 'Historical Drama': 18,
  'Psychological Drama': 18, 'Family Drama': 10751, 'Coming-of-Age': 18,
  'Romantic Comedy': 35, 'Romantic Drama': 18, 'Dark Fantasy': 14,
  'Urban Fantasy': 14, 'High Fantasy': 14, 'Space Opera': 878,
  Cyberpunk: 878, 'Post-Apocalyptic': 878, Dystopian: 878, 'Time Travel': 878,
  'Psychological Thriller': 53, 'Crime Thriller': 53, 'Action Thriller': 53,
  Whodunit: 9648, Detective: 9648, Noir: 53, 'Neo-Noir': 53,
  'Supernatural Horror': 27, 'Psychological Horror': 27, Slasher: 27,
  'Found Footage': 27, 'Monster Horror': 27, Paranormal: 27, Zombie: 27,
  Vampire: 27, Werewolf: 27, 'Gothic Horror': 27, Docuseries: 99,
  'True Crime': 99, Biography: 99, Historical: 36, Military: 10752,
  Political: 36, Spy: 28, Espionage: 28, 'Spaghetti Western': 37,
  'Martial Arts': 28, 'Kung Fu': 28, Sports: 28, 'Sports Drama': 18,
  Sitcom: 35, Superhero: 28,
};

function MovieCard({ item }) {
  const theme = useTheme();
  return (
    <View style={[styles.movieCard, { backgroundColor: theme.surface }]}>
      <View style={styles.movieInner}>
        {item.poster_path ? (
          <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, { backgroundColor: '#1a1a2e' }]} />
        )}
        <View style={styles.movieInfo}>
          <View style={[styles.genreBadge, { backgroundColor: theme.primary }]}>
            <ThemedText type="small" themeColor="textInverse">{item.genre ?? 'Movie'}</ThemedText>
          </View>
          <ThemedText type="smallBold">{item.title}</ThemedText>
          <ThemedText type="small" themeColor="disabled">{item.release_date?.slice(0, 4) ?? '—'}</ThemedText>
          <View style={styles.ratingRow}>
            <ThemedText style={styles.star}>★</ThemedText>
            <ThemedText type="smallBold">{item.vote_average ? item.vote_average.toFixed(1) : '—'}</ThemedText>
          </View>
        </View>
      </View>
      <TouchableOpacity style={[styles.watchBtn, { backgroundColor: theme.primary }]}>
        <ThemedText type="smallBold" themeColor="textInverse">Start Watch Party</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function TrendingCard({ item, index }) {
  const router = useRouter();
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={() => router.push(`movie?id=${item.id}`)}>
      <View style={styles.trendingCard}>
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.trendingThumb} />
        <View style={[styles.rankBadge, { backgroundColor: theme.primary }]}>
          <ThemedText style={{ color: theme.textInverse }}>#{index + 1}</ThemedText>
        </View>
        <View style={styles.trendingLabelWrap}>
          <ThemedText numberOfLines={1} style={styles.trendingLabel}>{item.title}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const { name, genres } = useUser();
  const displayName = name.length >= 3 ? name : 'there';

  const [aiPicks, setAiPicks] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loadingAi, setLoadingAi] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    if (genres.length === 0) { setLoadingAi(false); return; }

    const tmdbIds = [...new Set(genres.map(g => GENRE_NAME_TO_ID[g]).filter(Boolean))];
    const genreParam = tmdbIds.slice(0, 3).join('|');

    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreParam}&sort_by=popularity.desc&vote_count.gte=100`)
      .then(res => res.json())
      .then(data => {
        const tagged = (data.results ?? []).slice(0, 3).map(movie => {
          const matchedGenre = genres.find(g => GENRE_NAME_TO_ID[g] && movie.genre_ids?.includes(GENRE_NAME_TO_ID[g]));
          return { ...movie, genre: matchedGenre ?? genres[0] };
        });
        setAiPicks(tagged);
        setLoadingAi(false);
      })
      .catch(() => setLoadingAi(false));
  }, [genres]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => { setTrendingMovies(data.results || []); setLoadingTrending(false); })
      .catch(() => setLoadingTrending(false));
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <View style={styles.headerRow}>
            <View>
              <ThemedText type="subtitle">Hi, {displayName}!</ThemedText>
              <ThemedText type="small" themeColor="disabled">Ready to watch together?</ThemedText>
            </View>
            <View style={[styles.streakBadge, { borderColor: theme.border }]}>
              <ThemedText>🔥</ThemedText>
              <View>
                <ThemedText type="smallBold" style={{ color: theme.primary }}>{STREAK}</ThemedText>
                <ThemedText type="small" themeColor="disabled">streak</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">AI Picks for You</ThemedText>
          {genres.length > 0 && (
            <ThemedText type="small" themeColor="disabled" style={styles.genreHint}>
              Based on: {genres.slice(0, 3).join(', ')}{genres.length > 3 ? ` +${genres.length - 3} more` : ''}
            </ThemedText>
          )}
          {loadingAi ? (
            <ActivityIndicator style={{ marginTop: 16 }} />
          ) : aiPicks.length > 0 ? (
            aiPicks.map(item => <MovieCard key={item.id} item={item} />)
          ) : (
            <ThemedText type="small" themeColor="disabled" style={{ marginTop: 12 }}>
              No picks found — try selecting more genres.
            </ThemedText>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold">Trending Now</ThemedText>
          {loadingTrending ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={trendingMovies}
              horizontal
              keyExtractor={item => item.id.toString()}
              renderItem={({ item, index }) => <TrendingCard item={item} index={index} />}
              contentContainerStyle={styles.trendingRow}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // 100 gives plenty of room above the tab bar
  scrollContent: { paddingBottom: 100 },
  header: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, gap: 6 },
  section: { paddingHorizontal: 20, paddingTop: 20 },
  genreHint: { marginBottom: 12, marginTop: 4 },
  movieCard: { borderRadius: 16, padding: 14, marginBottom: 12 },
  movieInner: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  thumbnail: { width: 70, height: 90, borderRadius: 10 },
  movieInfo: { flex: 1 },
  genreBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 6 },
  ratingRow: { flexDirection: 'row', gap: 4 },
  star: { color: '#f5a623' },
  watchBtn: { borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  trendingRow: { paddingTop: 12 },
  trendingCard: { width: 110, marginRight: 10, borderRadius: 12, overflow: 'hidden' },
  trendingThumb: { width: 110, height: 150, borderRadius: 12 },
  rankBadge: { position: 'absolute', top: 6, left: 6, borderRadius: 6, paddingHorizontal: 6 },
  rankText: { color: '#fff', fontWeight: '700' },
  trendingLabelWrap: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.55)', padding: 6 },
  trendingLabel: { color: '#fff', fontSize: 12 },
});