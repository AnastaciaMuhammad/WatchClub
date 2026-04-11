import { View, Image, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const API_KEY = "63b1af1c793166c15a7ecda62a6c61ac";

export default function MovieScreen() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setMovie(data));
  }, [id]);

  if (!movie) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}
          style={styles.image}
        />

        <View style={styles.content}>
          <ThemedText type="title">{movie.title}</ThemedText>

          <ThemedText type="small" themeColor="disabled">
            ⭐ {movie.vote_average} / 10
          </ThemedText>

          <ThemedText style={styles.overview}>
            {movie.overview}
          </ThemedText>

          <ThemedText type="small">
            Release: {movie.release_date}
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: "100%",
    height: 400,
  },
  content: {
    padding: 20,
  },
  overview: {
    marginTop: 10,
  },
});