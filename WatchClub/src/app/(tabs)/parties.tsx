//  parties.tsx
//  Full Watch Parties page — Upcoming hosted, joined, and past parties

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useUser } from '@/context/usercontent';
import { Spacing, Radius } from '@/constants/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

type PartyStatus = 'upcoming' | 'live' | 'past';

type Party = {
  id: string;
  movieTitle: string;
  moviePoster: string;
  date: string;
  time: string;
  host: string;
  hostAvatar: string;
  guests: string[];
  maxGuests: number;
  isPrivate: boolean;
  status: PartyStatus;
  role: 'host' | 'guest';
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PARTIES: Party[] = [
  {
    id: '1',
    movieTitle: 'Dune: Part Two',
    moviePoster: '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    date: 'Tonight',
    time: '8:00 PM',
    host: 'You',
    hostAvatar: '',
    guests: ['@jennifer', '@marcus', '@tiana'],
    maxGuests: 6,
    isPrivate: true,
    status: 'upcoming',
    role: 'host',
  },
  {
    id: '2',
    movieTitle: 'Interstellar',
    moviePoster: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    date: 'Tomorrow',
    time: '9:00 PM',
    host: 'You',
    hostAvatar: '',
    guests: ['@chris', '@ryan'],
    maxGuests: 4,
    isPrivate: false,
    status: 'upcoming',
    role: 'host',
  },
  {
    id: '3',
    movieTitle: 'Oppenheimer',
    moviePoster: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    date: 'This Saturday',
    time: '7:30 PM',
    host: '@marcus',
    hostAvatar: 'https://i.pravatar.cc/150?img=12',
    guests: ['@jennifer', '@you', '@kayla', '@ryan'],
    maxGuests: 8,
    isPrivate: true,
    status: 'upcoming',
    role: 'guest',
  },
  {
    id: '4',
    movieTitle: 'The Batman',
    moviePoster: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    date: 'Today',
    time: '3:00 PM',
    host: '@jennifer',
    hostAvatar: 'https://i.pravatar.cc/150?img=32',
    guests: ['@you', '@marcus'],
    maxGuests: 4,
    isPrivate: false,
    status: 'live',
    role: 'guest',
  },
  {
    id: '5',
    movieTitle: 'Inception',
    moviePoster: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    date: 'Apr 12',
    time: '8:00 PM',
    host: 'You',
    hostAvatar: '',
    guests: ['@jennifer', '@marcus', '@tiana', '@chris'],
    maxGuests: 6,
    isPrivate: true,
    status: 'past',
    role: 'host',
  },
  {
    id: '6',
    movieTitle: 'Everything Everywhere All at Once',
    moviePoster: '/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    date: 'Apr 6',
    time: '7:00 PM',
    host: '@tiana',
    hostAvatar: 'https://i.pravatar.cc/150?img=47',
    guests: ['@you', '@jennifer', '@sofia'],
    maxGuests: 6,
    isPrivate: false,
    status: 'past',
    role: 'guest',
  },
  {
    id: '7',
    movieTitle: 'The Dark Knight',
    moviePoster: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    date: 'Mar 28',
    time: '9:00 PM',
    host: 'You',
    hostAvatar: '',
    guests: ['@marcus', '@ryan', '@chris'],
    maxGuests: 4,
    isPrivate: true,
    status: 'past',
    role: 'host',
  },
];

// ─── Tab types ────────────────────────────────────────────────────────────────

type Tab = 'upcoming' | 'past';

// ─── Party Card ───────────────────────────────────────────────────────────────

function PartyCard({ party }: { party: Party }) {
  const theme = useTheme();
  const router = useRouter();

  const posterUri = `https://image.tmdb.org/t/p/w200${party.moviePoster}`;
  const spotsLeft = party.maxGuests - party.guests.length;
  const isLive = party.status === 'live';
  const isPast = party.status === 'past';
  const isHost = party.role === 'host';

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>

      {/* Live badge */}
      {isLive && (
        <View style={[styles.liveBadge, { backgroundColor: '#ef4444' }]}>
          <ThemedText style={styles.liveDot}>●</ThemedText>
          <ThemedText style={styles.liveText}>LIVE NOW</ThemedText>
        </View>
      )}

      <View style={styles.cardTop}>

        {/* Poster */}
        <Image source={{ uri: posterUri }} style={styles.poster} />

        {/* Info */}
        <View style={{ flex: 1, gap: 4 }}>

          {/* Role badge */}
          <View style={styles.badgeRow}>
            <View style={[
              styles.roleBadge,
              { backgroundColor: isHost ? theme.primary : theme.secondary },
            ]}>
              <ThemedText style={[
                styles.roleBadgeText,
                { color: isHost ? theme.textInverse : theme.primary },
              ]}>
                {isHost ? 'Host' : 'Guest'}
              </ThemedText>
            </View>
            {party.isPrivate && (
              <View style={[styles.privacyBadge, { backgroundColor: theme.background }]}>
                <ThemedText style={[styles.roleBadgeText, { color: theme.muted }]}>
                  <FontAwesome5 name="user-lock" size={10} color="white" /> Private
                </ThemedText>
              </View>
            )}
          </View>

          <ThemedText type="smallBold" numberOfLines={2}>
            {party.movieTitle}
          </ThemedText>

          {/* Date & time */}
          <ThemedText type="small" style={{ color: theme.muted }}>
          <FontAwesome5 name="calendar-alt" size={12} color="white" />  
 {party.date} · {party.time}
          </ThemedText>

          {/* Host (if guest) */}
          {!isHost && (
            <ThemedText type="small" style={{ color: theme.muted }}>
              Hosted by {party.host}
            </ThemedText>
          )}

          {/* Guests */}
          <View style={styles.guestRow}>
            <ThemedText type="small" style={{ color: theme.muted }}>
            <FontAwesome5 name="users" size={10} color="white" /> Private
 {party.guests.length}/{party.maxGuests}
            </ThemedText>
            {!isPast && spotsLeft > 0 && (
              <ThemedText type="small" style={{ color: theme.primary }}>
                {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
              </ThemedText>
            )}
            {!isPast && spotsLeft === 0 && (
              <ThemedText type="small" style={{ color: '#ef4444' }}>
                Full
              </ThemedText>
            )}
          </View>

          {/* Guest avatars */}
          <View style={styles.avatarRow}>
            {party.guests.slice(0, 4).map((g, i) => (
              <View
                key={g}
                style={[
                  styles.avatarChip,
                  {
                    backgroundColor: theme.background,
                    marginLeft: i === 0 ? 0 : -6,
                    zIndex: 10 - i,
                  },
                ]}
              >
                <ThemedText style={{ fontSize: 9, color: theme.muted }}>{g.slice(0, 2)}</ThemedText>
              </View>
            ))}
            {party.guests.length > 4 && (
              <View style={[styles.avatarChip, { backgroundColor: theme.primary, marginLeft: -6 }]}>
                <ThemedText style={{ fontSize: 9, color: theme.textInverse }}>
                  +{party.guests.length - 4}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Action buttons */}
      {!isPast && (
        <View style={styles.cardActions}>
          {isLive ? (
            <TouchableOpacity style={[styles.actionBtnFull, { backgroundColor: '#ef4444' }]}>
              <ThemedText style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                ▶ Join Now
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: theme.primary }]}
              >
                <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 13 }}>
                  {isHost ? 'Manage' : 'Going'}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtnOutline, { borderColor: theme.border }]}
              >
                <ThemedText style={{ color: theme.primary, fontWeight: '600', fontSize: 13 }}>
                  {isHost ? 'Invite' : 'Chat'}
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {isPast && (
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.background }]}
          >
            <ThemedText style={{ color: theme.primary, fontWeight: '600', fontSize: 13 }}>
              Watch Again
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtnOutline, { borderColor: theme.border }]}
          >
            <ThemedText style={{ color: theme.muted, fontWeight: '600', fontSize: 13 }}>
              Rate
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PartiesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { name } = useUser();

  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const liveParties = MOCK_PARTIES.filter((p) => p.status === 'live');
  const upcomingParties = MOCK_PARTIES.filter((p) => p.status === 'upcoming');
  const pastParties = MOCK_PARTIES.filter((p) => p.status === 'past');

  const hostedCount = MOCK_PARTIES.filter((p) => p.role === 'host').length;
  const joinedCount = MOCK_PARTIES.filter((p) => p.role === 'guest').length;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* ─── Header ─── */}
        <View style={styles.header}>
          <ThemedText type="title">Parties</ThemedText>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/create')}
            style={[styles.newBtn, { backgroundColor: theme.primary }]}
          >
            <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 13 }}>
              + New
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* ─── Stats Row ─── */}
        <View style={[styles.statsRow, { backgroundColor: theme.surface }]}>
          {[
            { label: 'Hosted', value: hostedCount },
            { label: 'Joined', value: joinedCount },
            { label: 'This Month', value: 3 },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <View style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: theme.primary }]}>
                  {s.value}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.muted }}>
                  {s.label}
                </ThemedText>
              </View>
              {i < arr.length - 1 && (
                <View style={[styles.statDivider, { backgroundColor: theme.background }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ─── Live Now Banner ─── */}
        {liveParties.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <View style={styles.livePulse}>
                <ThemedText style={{ color: '#ef4444', fontSize: 10, fontWeight: '700' }}>● LIVE</ThemedText>
              </View>
              <ThemedText type="smallBold" style={{ color: '#ef4444' }}>
                Happening Now
              </ThemedText>
            </View>
            {liveParties.map((p) => <PartyCard key={p.id} party={p} />)}
          </View>
        )}

        {/* ─── Tab Switcher ─── */}
        <View style={[styles.tabRow, { backgroundColor: theme.surface }]}>
          {(['upcoming', 'past'] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                {
                  backgroundColor: activeTab === tab ? theme.primary : 'transparent',
                },
              ]}
            >
              <ThemedText
                type="small"
                style={{
                  color: activeTab === tab ? theme.textInverse : theme.muted,
                  fontWeight: '700',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'upcoming'
                  ? `Upcoming (${upcomingParties.length})`
                  : `Past (${pastParties.length})`}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Upcoming Parties ─── */}
        {activeTab === 'upcoming' && (
          <View style={{ gap: Spacing.two }}>
            {upcomingParties.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
                <ThemedText style={{ fontSize: 40 }}>🍿</ThemedText>
                <ThemedText type="smallBold" style={{ marginTop: 8 }}>No upcoming parties</ThemedText>
                <ThemedText type="small" style={{ color: theme.muted, textAlign: 'center', marginTop: 4 }}>
                  Create one or get invited by a friend
                </ThemedText>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/create')}
                  style={[styles.emptyBtn, { backgroundColor: theme.primary }]}
                >
                  <ThemedText style={{ color: theme.textInverse, fontWeight: '700' }}>
                    Create a Party
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Hosted */}
                {upcomingParties.filter((p) => p.role === 'host').length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <ThemedText type="smallBold" style={{ color: theme.muted, fontSize: 12, letterSpacing: 0.8 }}>
                        HOSTING
                      </ThemedText>
                    </View>
                    {upcomingParties
                      .filter((p) => p.role === 'host')
                      .map((p) => <PartyCard key={p.id} party={p} />)}
                  </>
                )}

                {/* Joined */}
                {upcomingParties.filter((p) => p.role === 'guest').length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <ThemedText type="smallBold" style={{ color: theme.muted, fontSize: 12, letterSpacing: 0.8 }}>
                        JOINED
                      </ThemedText>
                    </View>
                    {upcomingParties
                      .filter((p) => p.role === 'guest')
                      .map((p) => <PartyCard key={p.id} party={p} />)}
                  </>
                )}
              </>
            )}
          </View>
        )}

        {/* ─── Past Parties ─── */}
        {activeTab === 'past' && (
          <View style={{ gap: Spacing.two }}>
            {pastParties.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
                <ThemedText style={{ fontSize: 40 }}>📼</ThemedText>
                <ThemedText type="smallBold" style={{ marginTop: 8 }}>No past parties yet</ThemedText>
                <ThemedText type="small" style={{ color: theme.muted, textAlign: 'center', marginTop: 4 }}>
                  Your watch history will show up here
                </ThemedText>
              </View>
            ) : (
              pastParties.map((p) => <PartyCard key={p.id} party={p} />)
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },

  scroll: {
    padding: Spacing.three,
    gap: Spacing.two,
    paddingBottom: 100,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  newBtn: {
    borderRadius: Radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },

  statsRow: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: Spacing.three,
    justifyContent: 'space-around',
    alignItems: 'center',
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
    height: 36,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 2,
    marginBottom: 2,
    marginTop: 4,
  },

  livePulse: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#fef2f2',
  },

  tabRow: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: 4,
    gap: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },

  // Card
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    overflow: 'hidden',
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
    marginBottom: 2,
  },

  liveDot: {
    color: '#fff',
    fontSize: 10,
  },

  liveText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  cardTop: {
    flexDirection: 'row',
    gap: Spacing.two,
  },

  poster: {
    width: 64,
    height: 90,
    borderRadius: Radius.sm,
  },

  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },

  roleBadge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },

  privacyBadge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },

  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  avatarChip: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },

  cardActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: 2,
  },

  actionBtn: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },

  actionBtnFull: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },

  actionBtnOutline: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },

  emptyState: {
    borderRadius: Radius.lg,
    padding: Spacing.five,
    alignItems: 'center',
  },

  emptyBtn: {
    marginTop: 16,
    borderRadius: Radius.pill,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
});
