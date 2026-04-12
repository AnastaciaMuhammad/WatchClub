import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';

// TMDB API key
const API_KEY = "63b1af1c793166c15a7ecda62a6c61ac";

// ─── Hardcoded user ───────────────────────────────────────────────────────────

const CURRENT_USER = {
  firstName: 'Jennifer Marie',
  lastName: 'Saldana',
  streak: 10,
};

// ─── AI Picks ─────────────────────────────────────────────────────────────────

const AI_PICKS = [
  {
    id: '1',
    title: 'The Protector Returns',
    genre: 'Action',
    date: 'March 2026',
    duration: '1h 58m',
    rating: 4.7,
    thumbBg: '#1a1a2e',
  },
  {
    id: '2',
    title: 'Echoes of Tomorrow',
    genre: 'Drama',
    date: 'January 2026',
    duration: '2h 05m',
    rating: 4.4,
    thumbBg: '#0d2a1a',
  },
];

// ─── Movie Card ───────────────────────────────────────────────────────────────

function MovieCard({ item }) {
  const theme = useTheme();

  return (
    <View style={[styles.movieCard, { backgroundColor: theme.surface }]}>
      <View style={styles.movieInner}>
        <View style={[styles.thumbnail, { backgroundColor: item.thumbBg }]} />

        <View style={styles.movieInfo}>
          <View style={[styles.genreBadge, { backgroundColor: theme.primary }]}>
            <ThemedText type="small" themeColor="textInverse">
              {item.genre}
            </ThemedText>
          </View>

          <ThemedText type="smallBold">{item.title}</ThemedText>

          <ThemedText type="small" themeColor="disabled">
            {item.date} · {item.duration}
          </ThemedText>

          <View style={styles.ratingRow}>
            <ThemedText style={styles.star}>★</ThemedText>
            <ThemedText type="smallBold">{item.rating.toFixed(1)}</ThemedText>
          </View>
        </View>
      </View>

      <TouchableOpacity style={[styles.watchBtn, { backgroundColor: theme.primary }]}>
        <ThemedText type="smallBold" themeColor="textInverse">
          Start Watch Party
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

// ─── Trending Card ────────────────────────────────────────────────────────────

function TrendingCard({ item, index }) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={() => {
      console.log("CLICKED", item.id);
      router.push(`movie?id=${item.id}`);
    }}>
      <View style={styles.trendingCard}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          }}
          style={styles.trendingThumb}
        />

        <View style={[styles.rankBadge, { backgroundColor: theme.primary }]}>
          <ThemedText style={{ color: theme.textInverse }}>
            #{index + 1}
          </ThemedText>
        </View>

        <View style={styles.trendingLabelWrap}>
          <ThemedText numberOfLines={1} style={styles.trendingLabel}>
            {item.title}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const theme = useTheme();

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setTrendingMovies(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* ── Header ── */}
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <View style={styles.headerRow}>

            {/* Name */}
            <View>
              <ThemedText type="subtitle">
                Hi, {CURRENT_USER.firstName}{'\n'}{CURRENT_USER.lastName}!
              </ThemedText>
              <ThemedText type="small" themeColor="disabled">
                Ready to watch together?
              </ThemedText>
            </View>

            {/* Streak */}
            <View style={[styles.streakBadge, { borderColor: theme.border }]}>
              <ThemedText>🔥</ThemedText>
              <View>
                <ThemedText type="smallBold" style={{ color: theme.primary }}>
                  {CURRENT_USER.streak}
                </ThemedText>
                <ThemedText type="small" themeColor="disabled">
                  streak
                </ThemedText>
              </View>
            </View>

          </View>
        </View>

        {/* ── AI Picks ── */}
        <View style={styles.section}>
          <ThemedText type="subtitle">AI Picks for You</ThemedText>
          {AI_PICKS.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </View>

        {/* ── Trending ── */}
        <View style={styles.section}>
          <ThemedText type="smallBold">Trending Now</ThemedText>

          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={trendingMovies}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <TrendingCard item={item} index={index} />
              )}
              contentContainerStyle={styles.trendingRow}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>

      </ScrollView>
    </ThemedView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  header: { padding: 20 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  movieCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  movieInner: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  thumbnail: {
    width: 70,
    height: 90,
    borderRadius: 10,
  },
  movieInfo: { flex: 1 },
  genreBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
  },
  ratingRow: { flexDirection: 'row', gap: 4 },
  star: { color: '#f5a623' },

  watchBtn: {
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },

  trendingRow: { paddingTop: 12 },
  trendingCard: {
    width: 110,
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  trendingThumb: {
    width: 110,
    height: 150,
    borderRadius: 12,
  },
  rankBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  rankText: { color: '#fff', fontWeight: '700' },
  trendingLabelWrap: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 6,
  },
  trendingLabel: {
    color: '#fff',
    fontSize: 12,
  },
});