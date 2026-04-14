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

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

const API_KEY = "63b1af1c793166c15a7ecda62a6c61ac";

/* ---------------- GENRE MAP ---------------- */
const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  878: "Sci-Fi",
  53: "Thriller",
  10751: "Family",
  9648: "Mystery",
  10749: "Romance",
  36: "History",
};

/* ---------------- MOVIE CARD ---------------- */
function MovieCard({ item }: any) {
  const router = useRouter();
  const theme = useTheme();

  const genre = GENRE_MAP[item.genre_ids?.[0]] ?? "Movie";

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      
      {/* TOP ROW */}
      <View style={styles.row}>
        {item.poster_path ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
            }}
            style={styles.thumbnail}
          />
        ) : (
          <View style={[styles.thumbnail, { backgroundColor: theme.surface }]} />
        )}

        <View style={{ flex: 1 }}>
          
          {/* Genre */}
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <ThemedText type="small" themeColor="textInverse">
              {genre}
            </ThemedText>
          </View>

          {/* Title */}
          <ThemedText type="smallBold">{item.title}</ThemedText>

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
      </View>

      {/* BUTTON ROW */}
      <View style={styles.buttonRow}>
        
        {/* ▶ START WATCH PARTY */}
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
        >
          <ThemedText type="smallBold" themeColor="textInverse">
            Start Watch Party
          </ThemedText>
        </TouchableOpacity>

        {/* ➕ MORE BUTTON */}
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

/* ---------------- SCREEN ---------------- */
export default function AIPicksScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>

      {/* 🔙 BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backBtn, { backgroundColor: theme.surface }]}
      >
        <ThemedText>←</ThemedText>
      </TouchableOpacity>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          padding: 16,
          paddingTop: 80,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => <MovieCard item={item} />}
      />
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
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

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
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