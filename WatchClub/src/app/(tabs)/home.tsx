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
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/usercontent';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';



const API_KEY = "63b1af1c793166c15a7ecda62a6c61ac";
const STREAK = 10;

const GENRE_NAME_TO_ID = {
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

/* ---------------- MOVIE CARD ---------------- */
function MovieCard({ item }) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.movieCard, { backgroundColor: theme.surface }]}>
      
      {/* TOP */}
      <View style={styles.movieInner}>
        {item.poster_path ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
            }}
            style={styles.thumbnail}
          />
        ) : (
          <View style={[styles.thumbnail, { backgroundColor: '#1a1a2e' }]} />
        )}

        <View style={styles.movieInfo}>
          <View style={[styles.genreBadge, { backgroundColor: theme.primary }]}>
            <ThemedText type="small" themeColor="textInverse">
              {item.genre ?? 'Movie'}
            </ThemedText>
          </View>

          <ThemedText type="smallBold">{item.title}</ThemedText>

          <ThemedText type="small" themeColor="disabled">
            {item.release_date?.slice(0, 4) ?? '—'}
          </ThemedText>

          <View style={styles.ratingRow}>
<Ionicons name="star" size={15} color="#ffffff" />            
<ThemedText type="smallBold">
              {item.vote_average ? item.vote_average.toFixed(1) : '—'}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* BUTTONS */}
      <View style={styles.buttonRow}>

        <TouchableOpacity
          onPress={() =>
            router.push(
              `/create?movieId=${item.id}&movieTitle=${encodeURIComponent(item.title)}&moviePoster=${encodeURIComponent(item.poster_path ?? '')}`
            )
          }
          style={[styles.watchBtn, { backgroundColor: theme.primary }]}
        >
          <ThemedText type="smallBold" themeColor="textInverse">
            Start Watch Party
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/movie?id=${item.id}`)}
          style={[styles.moreBtn, { backgroundColor: theme.surface }]}
        >
          <ThemedText type="smallBold">More →</ThemedText>
        </TouchableOpacity>

      </View>
    </View>
  );
}

/* ---------------- TRENDING CARD ---------------- */
function TrendingCard({ item, index }) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={() => router.push(`movie?id=${item.id}`)}>
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

/* ---------------- HOME SCREEN ---------------- */
export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { name, genres } = useUser();

  const displayName = name.length >= 3 ? name : 'there';

  const [aiPicks, setAiPicks] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loadingAi, setLoadingAi] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    if (genres.length === 0) {
      setLoadingAi(false);
      return;
    }

    const tmdbIds = [...new Set(genres.map(g => GENRE_NAME_TO_ID[g]).filter(Boolean))];
    const genreParam = tmdbIds.slice(0, 3).join('|');

    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreParam}&sort_by=popularity.desc&vote_count.gte=100`
    )
      .then(res => res.json())
      .then(data => {
        const uniqueMovies = [];
        const seenIds = new Set();

        for (let movie of data.results ?? []) {
          if (!seenIds.has(movie.id)) {
            seenIds.add(movie.id);
            uniqueMovies.push(movie);
          }
          if (uniqueMovies.length === 2) break;
        }

        const tagged = uniqueMovies.map(movie => {
          const matchedGenre = genres.find(
            g =>
              GENRE_NAME_TO_ID[g] &&
              movie.genre_ids?.includes(GENRE_NAME_TO_ID[g])
          );
          return { ...movie, genre: matchedGenre ?? genres[0] };
        });

        setAiPicks(tagged);
        setLoadingAi(false);
      })
      .catch(() => setLoadingAi(false));
  }, [genres]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        setTrendingMovies(data.results || []);
        setLoadingTrending(false);
      })
      .catch(() => setLoadingTrending(false));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* HEADER + STREAK (RESTORED) */}
          <View style={[styles.header, { backgroundColor: theme.surface }]}>
            <View style={styles.headerRow}>
              
              <View>
                <ThemedText type="subtitle">
                  Hi, {displayName}!
                </ThemedText>
                <ThemedText type="small" themeColor="disabled">
                  Ready to watch together?
                </ThemedText>
              </View>

              {/* STREAK */}
              <View style={[styles.streakBadge, { borderColor: theme.border }]}>
                <FontAwesome5 name="fire" size={24} color="red" />                
                  <View>
                  <ThemedText type="smallBold" style={{ color: theme.primary }}>
                    {STREAK}
                  </ThemedText>
                  <ThemedText type="small" themeColor="disabled">
                    streak
                  </ThemedText>
                </View>
              </View>

            </View>
          </View>

          {/* AI PICKS */}
          <View style={styles.section}>
            <View style={styles.aiHeader}>
              <ThemedText type="smallBold">AI Picks for You</ThemedText>
              <TouchableOpacity onPress={() => router.push('/aipicks')}>
                <ThemedText style={{ color: theme.primary }}>
                  See More →
                </ThemedText>
              </TouchableOpacity>
            </View>

            {loadingAi ? (
              <ActivityIndicator style={{ marginTop: 16 }} />
            ) : (
              aiPicks.map(item => (
                <MovieCard key={item.id} item={item} />
              ))
            )}
          </View>

          {/* TRENDING */}
          <View style={styles.section}>
            <ThemedText type="smallBold">Trending Now</ThemedText>

            {loadingTrending ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                data={trendingMovies}
                horizontal
                keyExtractor={item => item.id.toString()}
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
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

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

  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  movieInfo: {
    flex: 1,
  },

  genreBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
  },

  ratingRow: {
    flexDirection: 'row',
    gap: 4,
  },

  star: { color: '#f5a623' },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  watchBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },

  moreBtn: {
    paddingHorizontal: 14,
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