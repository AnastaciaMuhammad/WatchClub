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
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "@/context/usercontent";


const API_KEY = "63b1af1c793166c15a7ecda62a6c61ac";

export default function MovieScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const { addFavorite, removeFavorite, isFavorite } = useUser();

  const movieId = Array.isArray(id) ? id[0] : id;

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  // Derive favorite state from context so it stays in sync with home/profile
  const favorite = movie ? isFavorite(movie.id) : false;

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

  useEffect(() => {
    if (!movieId) return;
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results?.find(
          (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : null);
      })
      .catch(() => setTrailerKey(null));
  }, [movieId]);

  const handleToggleFavorite = () => {
    if (!movie) return;
    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path ?? null,
        release_date: movie.release_date ?? '',
        vote_average: movie.vote_average ?? 0,
      });
    }
  };

  if (loading || !movie) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background, justifyContent: "center" }]}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedView style={styles.container}>

        {/* ← Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.surface }]}
        >
          <ThemedText>←</ThemedText>
        </TouchableOpacity>

        {/* Favorite Button — now synced with context */}
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={[styles.favBtn, { backgroundColor: theme.surface }]}
        >
          <Ionicons
            name="heart"
            color={favorite ? "red" : "white"}
            size={20}
          />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

          {/* Poster */}
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
            style={styles.image}
          />

          {/* Content */}
          <View style={styles.content}>
            <ThemedText type="title">{movie.title}</ThemedText>

            <ThemedText type="small" themeColor="disabled">
              <Ionicons name="star" size={15} color="#ffffff" />
              {movie.vote_average} / 10
            </ThemedText>

            <ThemedText style={styles.overview}>
              {movie.overview}
            </ThemedText>

            <ThemedText type="small" style={{ marginTop: 10 }}>
              Release: {movie.release_date}
            </ThemedText>

            {/* Watch Party Button */}
            <TouchableOpacity
              onPress={() =>
                router.push(
                  `/create?movieId=${movie.id}&movieTitle=${encodeURIComponent(movie.title)}&moviePoster=${encodeURIComponent(movie.poster_path ?? '')}`
                )
              }
              style={[styles.watchPartyBtn, { backgroundColor: theme.primary }]}
            >
              <ThemedText style={{ color: theme.textInverse, fontWeight: "700" }}>
                Start Watch Party
              </ThemedText>
            </TouchableOpacity>

            {/* Trailer Button */}
            {trailerKey && (
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(`https://www.youtube.com/watch?v=${trailerKey}`)
                }
                style={[styles.trailerBtn, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}
              >
                <ThemedText style={{ color: theme.primary, fontWeight: "600" }}>
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
    gap: 8,
  },

  overview: {
    marginTop: 6,
    lineHeight: 22,
  },

  backBtn: {
    position: "absolute",
    top: 10,
    left: 16,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
  },

  favBtn: {
    position: "absolute",
    top: 10,
    right: 16,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
  },

  watchPartyBtn: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  trailerBtn: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
});