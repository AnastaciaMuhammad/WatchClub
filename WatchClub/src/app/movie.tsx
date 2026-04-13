import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Linking from "expo-linking";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";

const API_KEY = "63b1af1c793166c15a7ecda62a6c61ac";

export default function MovieScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();

  const movieId = Array.isArray(id) ? id[0] : id;

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // 🎬 Fetch movie details
  useEffect(() => {
    if (!movieId) return;

    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [movieId]);

  // ▶️ Fetch trailer
  useEffect(() => {
    if (!movieId) return;

    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        setTrailerKey(trailer ? trailer.key : null);
      })
      .catch(() => setTrailerKey(null));
  }, [movieId]);

  if (loading || !movie) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedView style={styles.container}>

        {/* 🔙 Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.surface }]}
        >
          <ThemedText>←</ThemedText>
        </TouchableOpacity>

        {/* ❤️ Favorite Button */}
        <TouchableOpacity
          onPress={() => setIsFavorite(!isFavorite)}
          style={[styles.favBtn, { backgroundColor: theme.surface }]}
        >
          <ThemedText>{isFavorite ? "❤️" : "🤍"}</ThemedText>
        </TouchableOpacity>

        <ScrollView>

          {/* 🎬 Poster */}
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.image}
          />

          {/* 📄 Content */}
          <View style={styles.content}>
            <ThemedText type="title">{movie.title}</ThemedText>

            <ThemedText type="small" themeColor="disabled">
              ⭐ {movie.vote_average} / 10
            </ThemedText>

            <ThemedText style={styles.overview}>
              {movie.overview}
            </ThemedText>

            <ThemedText type="small" style={{ marginTop: 10 }}>
              Release: {movie.release_date}
            </ThemedText>

            {/* ▶️ Trailer Button */}
            {trailerKey && (
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://www.youtube.com/watch?v=${trailerKey}`
                  )
                }
                style={[
                  styles.trailerBtn,
                  { backgroundColor: theme.primary },
                ]}
              >
                <ThemedText style={{ color: theme.textInverse }}>
                  ▶ Watch Trailer
                </ThemedText>
              </TouchableOpacity>
            )}

          </View>

        </ScrollView>

      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    width: "100%",
    height: 400,
  },

  content: {
    padding: 20,
  },

  overview: {
    marginTop: 10,
    lineHeight: 20,
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
  },

  favBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
  },

  trailerBtn: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});