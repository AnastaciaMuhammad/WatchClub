import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { useUser } from "@/context/usercontent";

const API_KEY = "63b1af1c793166c15a7ecda62a6c61ac";

/* ---------------- MAPS ---------------- */

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 18: "Drama", 14: "Fantasy", 27: "Horror",
  878: "Sci-Fi", 53: "Thriller", 10751: "Family", 9648: "Mystery",
  10749: "Romance", 36: "History",
};

const GENRE_NAME_TO_ID: Record<string, number> = {
  Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80,
  Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36,
  Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749, "Sci-Fi": 878,
  Thriller: 53, War: 10752, Western: 37, Anime: 16,
  "Romantic Comedy": 35, "Crime Drama": 18, "Dark Fantasy": 14,
  "Space Opera": 878, Cyberpunk: 878, "Psychological Thriller": 53, Superhero: 28,
};

const PROVIDER_MAP: Record<string, number> = {
  "Netflix": 8, "Hulu": 15, "Disney+": 337, "HBO Max": 1899,
  "Prime Video": 9, "Apple TV+": 350, "Peacock": 386, "Paramount+": 531,
};

/* ---------------- PLATFORM FILTER ---------------- */

async function isOnPlatforms(movieId: number, providerIds: number[]): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`
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

/* ---------------- MOVIE CARD ---------------- */

function MovieCard({ item }: { item: any }) {
  const router = useRouter();
  const theme = useTheme();
  const { addFavorite, removeFavorite, isFavorite } = useUser();
  const fav = isFavorite(item.id);

  const genre = item.genre ?? GENRE_MAP[item.genre_ids?.[0]] ?? "Movie";

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>

      {/* TOP ROW */}
      <View style={styles.row}>
        {item.poster_path ? (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
            style={styles.thumbnail}
          />
        ) : (
          <View style={[styles.thumbnail, { backgroundColor: "#222" }]} />
        )}

        <View style={{ flex: 1 }}>
          {/* Genre badge */}
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <ThemedText type="small" themeColor="textInverse" style={{ fontSize: 11 }}>
              {genre}
            </ThemedText>
          </View>

          {/* Title */}
          <ThemedText type="smallBold" numberOfLines={2}>{item.title}</ThemedText>

          {/* Year */}
          <ThemedText type="small" themeColor="disabled">
            {item.release_date?.slice(0, 4) ?? "—"}
          </ThemedText>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <ThemedText style={{ color: "#f5a623" }}>★</ThemedText>
            <ThemedText type="smallBold">
              {item.vote_average ? item.vote_average.toFixed(1) : "—"}
            </ThemedText>
          </View>
        </View>

        {/* Favorite button */}
        <TouchableOpacity
          onPress={() =>
            fav
              ? removeFavorite(item.id)
              : addFavorite({
                  id: item.id,
                  title: item.title,
                  poster_path: item.poster_path ?? null,
                  release_date: item.release_date ?? "",
                  vote_average: item.vote_average ?? 0,
                })
          }
          style={styles.favBtn}
        >
          <Ionicons name="heart" size={20} color={fav ? "#ef4444" : "#555"} />
        </TouchableOpacity>
      </View>

      {/* BUTTON ROW */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() =>
            router.push(
              `/create?movieId=${item.id}&movieTitle=${encodeURIComponent(item.title)}&moviePoster=${encodeURIComponent(item.poster_path ?? "")}`
            )
          }
          style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
        >
          <ThemedText type="smallBold" themeColor="textInverse">
            Start Watch Party
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/movie?id=${item.id}`)}
          style={[styles.moreBtn, { backgroundColor: theme.background }]}
        >
          <ThemedText type="smallBold">More →</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- SCREEN ---------------- */

type Section = { title: string; reason: string; movies: any[] };

export default function AIPicksScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { genres, platforms, favorites } = useUser();

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      const built: Section[] = [];

      // ── 1. Genre-based picks (one section per selected genre, up to 3) ──
      const genresToUse = genres.slice(0, 3);
      for (const genreName of genresToUse) {
        const genreId = GENRE_NAME_TO_ID[genreName];
        if (!genreId) continue;
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=100`
          );
          const data = await res.json();
          const candidates = (data.results ?? []).map((m: any) => ({ ...m, genre: genreName }));
          const filtered = await filterByPlatforms(candidates, platforms);
          if (filtered.length > 0) {
            built.push({
              title: `Top ${genreName}`,
              reason: platforms.length > 0
                ? `Based on your love of ${genreName} · Available on ${platforms.slice(0, 2).join(" & ")}`
                : `Based on your love of ${genreName}`,
              movies: filtered.slice(0, 10),
            });
          }
        } catch { }
      }

      // ── 2. "Because you favorited" — pick from genres of saved movies ──
      if (favorites.length > 0) {
        try {
          // Grab genre IDs from the first 3 favorites via their detail pages
          const favGenreIds: number[] = [];
          await Promise.all(
            favorites.slice(0, 3).map(async fav => {
              try {
                const res = await fetch(
                  `https://api.themoviedb.org/3/movie/${fav.id}?api_key=${API_KEY}`
                );
                const d = await res.json();
                (d.genres ?? []).forEach((g: any) => {
                  if (!favGenreIds.includes(g.id)) favGenreIds.push(g.id);
                });
              } catch { }
            })
          );

          if (favGenreIds.length > 0) {
            const res = await fetch(
              `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${favGenreIds.slice(0, 2).join("|")}&sort_by=vote_average.desc&vote_count.gte=200`
            );
            const data = await res.json();
            // Exclude movies already in favorites
            const favIds = new Set(favorites.map(f => f.id));
            const candidates = (data.results ?? [])
              .filter((m: any) => !favIds.has(m.id))
              .map((m: any) => ({
                ...m,
                genre: GENRE_MAP[m.genre_ids?.[0]] ?? "Movie",
              }));
            const filtered = await filterByPlatforms(candidates, platforms);
            if (filtered.length > 0) {
              built.push({
                title: "Because You Favorited",
                reason: platforms.length > 0
                  ? `Highly rated picks similar to your saved films · Available on ${platforms.slice(0, 2).join(" & ")}`
                  : "Highly rated picks similar to your saved films",
                movies: filtered.slice(0, 10),
              });
            }
          }
        } catch { }
      }

      // ── 3. Fallback: popular movies on selected platforms ──
      if (built.length === 0) {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&vote_count.gte=100`
          );
          const data = await res.json();
          const candidates = (data.results ?? []).map((m: any) => ({
            ...m,
            genre: GENRE_MAP[m.genre_ids?.[0]] ?? "Movie",
          }));
          const filtered = await filterByPlatforms(candidates, platforms);
          built.push({
            title: "Popular Right Now",
            reason: platforms.length > 0
              ? `Top movies available on ${platforms.join(" · ")}`
              : "Top movies right now — add genres in your profile to personalise",
            movies: filtered.slice(0, 20),
          });
        } catch { }
      }

      if (!cancelled) {
        setSections(built);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [genres, platforms, favorites]);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backBtn, { backgroundColor: theme.surface }]}
      >
        <ThemedText>←</ThemedText>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText style={{ color: theme.muted, marginTop: 12, fontSize: 13 }}>
            Finding picks for you…
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={s => s.title}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.header}>
              <ThemedText type="title" style={{ fontSize: 24 }}>AI Picks for You</ThemedText>
              {platforms.length > 0 && (
                <View style={[styles.platformPill, { backgroundColor: theme.surface }]}>
                  <Ionicons name="tv-outline" size={12} color={theme.primary} />
                  <ThemedText style={{ color: theme.primary, fontSize: 12, fontWeight: "600" }}>
                    {platforms.join(" · ")}
                  </ThemedText>
                </View>
              )}
              {platforms.length === 0 && (
                <ThemedText style={{ color: theme.muted, fontSize: 12, marginTop: 4 }}>
                  Add streaming services in your profile to filter by platform
                </ThemedText>
              )}
            </View>
          }
          renderItem={({ item: section }) => (
            <View style={styles.section}>
              {/* Section header */}
              <ThemedText style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                {section.title}
              </ThemedText>
              <ThemedText style={[styles.sectionReason, { color: theme.muted }]}>
                {section.reason}
              </ThemedText>

              {/* Movie cards */}
              {section.movies.map(movie => (
                <MovieCard key={movie.id} item={movie} />
              ))}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  screen: { flex: 1 },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  list: {
    padding: 16,
    paddingTop: 80,
    paddingBottom: 100,
    gap: 8,
  },

  header: {
    marginBottom: 20,
    gap: 8,
  },

  platformPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },

  sectionReason: {
    fontSize: 12,
    marginBottom: 12,
  },

  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },

  thumbnail: {
    width: 70,
    height: 90,
    borderRadius: 10,
  },

  badge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
  },

  ratingRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
  },

  favBtn: {
    padding: 4,
    alignSelf: "flex-start",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  primaryBtn: {
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },

  moreBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
});