//
//  profile.tsx
//
//  Full profile page using signed-in user info
//

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useUser } from '@/context/usercontent';
import { Spacing, Radius } from '@/constants/theme';

const STATS = [
  { label: 'Movies\nWatched', value: '24' },
  { label: 'Watch\nParties', value: '8' },
  { label: 'Friends', value: '12' },
];

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { name, email, username, genres } = useUser();

  const displayName = name || 'Guest User';
  const displayUsername =
    username || (email ? '@' + email.split('@')[0] : '@user');
  const displayEmail = email || 'No email set';
  const displayGenres =
    genres.length > 0 ? genres : ['Action', 'Sci-Fi', 'Drama'];

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const activities = [
    {
      icon: 'glass-cheers',
      text: 'Hosted a Watch Party for Inception',
      time: '2 days ago',
    },
    {
      icon: 'heart',
      text: 'Favorited Interstellar',
      time: '4 days ago',
    },
    {
      icon: 'user-plus',
      text: 'Added Marcus Hill as a friend',
      time: '1 week ago',
    },
  ];

  const actions = [
    { label: 'Notifications', icon: 'bell', onPress: () => {} },
    { label: 'Privacy Settings', icon: 'lock', onPress: () => {} },
    { label: 'Appearance', icon: 'paint-brush', onPress: () => {} },
    {
      label: 'Sign Out',
      icon: 'sign-out-alt',
      danger: true,
      onPress: () => router.replace('/auth/signin'),
    },
  ];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ─── Header Card ─── */}
        <ThemedView style={[styles.headerCard, { backgroundColor: theme.surface }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <ThemedText style={[styles.avatarText, { color: theme.textInverse }]}>
              {initials}
            </ThemedText>
          </View>

          <ThemedText type="title" style={styles.nameText}>
            {displayName}
          </ThemedText>

          <ThemedText type="small" style={{ color: theme.muted }}>
            {displayUsername}
          </ThemedText>

          {/* Email */}
          <View style={[styles.emailRow, { backgroundColor: theme.background }]}>
            <FontAwesome5 name="envelope" size={14} color={theme.muted} />
            <ThemedText
              type="small"
              style={{ color: theme.textPrimary, marginLeft: 6 }}
            >
              {displayEmail}
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[styles.editBtn, { borderColor: theme.primary }]}
          >
            <ThemedText
              type="small"
              style={{ color: theme.primary, fontWeight: '600' }}
            >
              Edit Profile
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* ─── Stats ─── */}
        <View style={[styles.statsRow, { backgroundColor: theme.surface }]}>
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: theme.primary }]}>
                  {stat.value}
                </ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: theme.muted, textAlign: 'center' }}
                >
                  {stat.label}
                </ThemedText>
              </View>
              {i < STATS.length - 1 && (
                <View
                  style={[styles.statDivider, { backgroundColor: theme.border }]}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ─── Favorite Genres ─── */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            <FontAwesome5 name="film" size={14} color={theme.primary} /> Favorite Genres
          </ThemedText>

          <View style={styles.chipRow}>
            {displayGenres.map((genre) => (
              <View
                key={genre}
                style={[styles.chip, { backgroundColor: theme.primary }]}
              >
                <ThemedText type="small" style={{ color: theme.textInverse }}>
                  {genre}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* ─── Recent Activity ─── */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            <FontAwesome5 name="clock" size={14} color={theme.primary} /> Recent Activity
          </ThemedText>

          {activities.map((item, i) => (
            <View
              key={i}
              style={[
                styles.activityRow,
                { borderBottomColor: theme.background },
              ]}
            >
              <FontAwesome5
                name={item.icon}
                size={16}
                color={theme.primary}
                style={{ marginTop: 2 }}
              />

              <View style={{ flex: 1 }}>
                <ThemedText type="small">{item.text}</ThemedText>
                <ThemedText type="small" style={{ color: theme.muted }}>
                  {item.time}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* ─── Actions ─── */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          {actions.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              style={[styles.menuRow, { borderBottomColor: theme.background }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <FontAwesome5
                  name={item.icon}
                  size={14}
                  color={item.danger ? '#ff4d4d' : theme.textPrimary}
                />

                <ThemedText
                  type="small"
                  style={{
                    color: item.danger ? '#ff4d4d' : theme.textPrimary,
                    fontWeight: '500',
                  }}
                >
                  {item.label}
                </ThemedText>
              </View>

              <ThemedText style={{ color: theme.muted }}>›</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Styles ─── */

const styles = StyleSheet.create({
  screen: { flex: 1 },

  scroll: {
    padding: Spacing.three,
    gap: Spacing.two,
    paddingBottom: 100,
  },

  headerCard: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: '700',
  },

  nameText: {
    textAlign: 'center',
  },

  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    marginTop: Spacing.one,
  },

  editBtn: {
    marginTop: Spacing.two,
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },

  statsRow: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: Spacing.three,
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },

  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },

  statDivider: {
    width: 1,
    height: 40,
  },

  section: {
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
  },

  sectionTitle: {
    fontSize: 15,
    marginBottom: Spacing.one,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },

  chip: {
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
  },

  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
});