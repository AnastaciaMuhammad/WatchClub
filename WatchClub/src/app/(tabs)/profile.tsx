import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useUser } from '@/context/usercontent';

/* ───────────────────────────── */

export default function ProfileScreen() {
  const router = useRouter();
  const { name, email, username, genres } = useUser();

  const displayName = name || 'Guest User';
  const displayUsername =
    username || (email ? '@' + email.split('@')[0] : '@user');

  const displayGenres =
    genres.length > 0 ? genres : ['Drama', 'Thriller', 'Animation'];

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const stats = [
    {
      label: 'Watch Streak',
      value: 10,
      icon: (p: any) => <Ionicons name="flame" {...p} />,
      color: '#ef4444',
      bg: '#7f1d1d',
    },
    {
      label: 'Movies Watched',
      value: 10,
      icon: (p: any) => <Ionicons name="film-outline" {...p} />,
      color: '#3b82f6',
      bg: '#1e3a8a',
    },
    {
      label: 'Attended Parties',
      value: 10,
      icon: (p: any) => <Ionicons name="calendar" {...p} />,
      color: '#06b6d4',
      bg: '#164e63',
    },
  ];

  const activities = [
    { text: 'Watched Stellar Odyssey', time: '2 days ago', color: '#22c55e' },
    { text: 'Joined "Movie Night Crew"', time: '4 days ago', color: '#ef4444' },
    { text: 'Achieved 10-day streak', time: '5 days ago', color: '#3b82f6' },
    { text: 'Rated Zootopia 2 • 5 stars', time: '6 days ago', color: '#22c55e' },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* ─── HEADER ─── */}
        <View style={styles.header}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {initials}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.name}>{displayName}</ThemedText>
          <ThemedText style={styles.sub}>{displayUsername}</ThemedText>

          <TouchableOpacity style={styles.editBtn}>
            <ThemedText style={styles.editText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </View>

        {/* ─── STATS ─── */}
        <View style={styles.statRow}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statWrapper}>
              <StatCard {...s} />
            </View>
          ))}
        </View>

        {/* ─── GENRES ─── */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Favorite Genres</ThemedText>

          <View style={styles.chipRow}>
            {displayGenres.map((g) => (
              <View key={g} style={styles.chip}>
                <ThemedText style={styles.chipText}>{g}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* ─── ACHIEVEMENTS ─── */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Achievements</ThemedText>

          <View style={styles.achievementRow}>
            <Ionicons name="trophy" size={20} color="#facc15" />
            <View>
              <ThemedText style={styles.achievementTitle}>
                5 day streak hotness
              </ThemedText>
              <ThemedText style={styles.achievementSub}>
                You are on fire.
              </ThemedText>
            </View>
          </View>
        </View>

        {/* ─── ACTIVITY ─── */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>

          {activities.map((a, i) => (
            <View key={i} style={styles.activityRow}>
              <View style={[styles.dot, { backgroundColor: a.color }]} />
              <View>
                <ThemedText style={styles.activityText}>
                  {a.text}
                </ThemedText>
                <ThemedText style={styles.activityTime}>
                  {a.time}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* ─── SIGN OUT ─── */}
        <TouchableOpacity
          onPress={() => router.replace('/auth/signin')}
          style={styles.signOut}
        >
          <ThemedText style={styles.signOutText}>
            Sign Out
          </ThemedText>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ───────────────────────────── */

const StatCard = ({ icon: Icon, value, label, color, bg }: any) => (
  <View style={[styles.statCard, { backgroundColor: bg, borderColor: color }]}>
    <Icon size={26} color={color} />
    <ThemedText style={[styles.statValue, { color }]}>
      {value}
    </ThemedText>
    <ThemedText style={[styles.statLabel, { color }]}>
      {label}
    </ThemedText>
  </View>
);

/* ───────────────────────────── */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 120,
  },

  header: {
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },

  avatarRing: {
    borderWidth: 4,
    borderColor: '#3b82f6',
    borderRadius: 999,
    padding: 4,
    marginBottom: 12,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 999,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 28,
    color: 'white',
    fontWeight: '700',
  },

  name: {
    fontSize: 22,
    color: 'white',
    fontWeight: '700',
  },

  sub: {
    color: '#9ca3af',
    marginBottom: 8,
  },

  editBtn: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },

  editText: {
    color: '#3b82f6',
    fontWeight: '600',
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },

  statCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },

  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },

  card: {
    marginTop: 18,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: '#020617',
  },

  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  chip: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    color: 'white',
  },

  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  achievementTitle: {
    color: 'white',
    fontWeight: '600',
  },

  achievementSub: {
    color: '#9ca3af',
  },

  activityRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  activityText: {
    color: 'white',
  },

  activityTime: {
    color: '#9ca3af',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 10,
  },

  signOut: {
    marginTop: 20,
    alignItems: 'center',
  },

  signOutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});