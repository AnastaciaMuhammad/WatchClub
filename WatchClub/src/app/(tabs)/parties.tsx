//  parties.tsx — My Watch Parties (shows real created parties + mock data)

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useUser, WatchParty } from '@/context/usercontent';
import { Spacing, Radius } from '@/constants/theme';

// ─── Static mock parties (joined/guest) ──────────────────────────────────────

const MOCK_PARTIES: WatchParty[] = [
  {
    id: 'mock_1', partyName: 'Oppenheimer Night',
    movie: { id: 872585, title: 'Oppenheimer', poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', release_date: '2023-07-21', vote_average: 8.2 },
    platform: 'Prime Video', date: 'This Saturday', time: '7:30 PM',
    maxGuests: 8, isPrivate: true, description: '', invitedFriends: ['@you', '@kayla', '@ryan'],
    status: 'upcoming', createdAt: Date.now() - 10000,
  },
  {
    id: 'mock_2', partyName: 'Batman Watch Party',
    movie: { id: 414906, title: 'The Batman', poster_path: '/74xTEgt7R36Fpooo50r9T25onhq.jpg', release_date: '2022-03-04', vote_average: 7.8 },
    platform: 'HBO Max', date: 'Today', time: '3:00 PM',
    maxGuests: 4, isPrivate: false, description: '', invitedFriends: ['@you', '@marcus'],
    status: 'live', createdAt: Date.now() - 5000,
  },
  {
    id: 'mock_3', partyName: 'Inception Rewatch',
    movie: { id: 27205, title: 'Inception', poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', release_date: '2010-07-16', vote_average: 8.4 },
    platform: 'Netflix', date: 'Apr 12', time: '8:00 PM',
    maxGuests: 6, isPrivate: true, description: '', invitedFriends: ['@jennifer', '@marcus', '@tiana', '@chris'],
    status: 'past', createdAt: Date.now() - 20000,
  },
];

type Tab = 'upcoming' | 'past';

// ─── Party Card ───────────────────────────────────────────────────────────────

function PartyCard({ party, isOwn }: { party: WatchParty; isOwn: boolean }) {
  const theme = useTheme();
  const router = useRouter();
  const isLive = party.status === 'live';
  const isPast = party.status === 'past';
  const posterUri = `https://image.tmdb.org/t/p/w200${party.movie.poster_path}`;

  const goToRoom = () =>
    router.push(
      `/watchparty?partyId=${party.id}` +
      `&partyName=${encodeURIComponent(party.partyName)}` +
      `&movieTitle=${encodeURIComponent(party.movie.title)}` +
      `&moviePoster=${encodeURIComponent(party.movie.poster_path ?? '')}`
    );

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      {isLive && (
        <View style={[styles.liveBadge, { backgroundColor: '#ef4444' }]}>
          <View style={styles.liveDot} />
          <ThemedText style={{ color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 }}>LIVE NOW</ThemedText>
        </View>
      )}

      <View style={styles.cardTop}>
        {party.movie.poster_path
          ? <Image source={{ uri: posterUri }} style={styles.poster} />
          : <View style={[styles.poster, { backgroundColor: theme.muted }]} />}

        <View style={{ flex: 1, gap: 4 }}>
          <View style={styles.badgeRow}>
            <View style={[styles.roleBadge, { backgroundColor: isOwn ? theme.primary : theme.secondary }]}>
              <ThemedText style={{ color: isOwn ? theme.textInverse : theme.primary, fontSize: 11, fontWeight: '700' }}>
                {isOwn ? 'Host' : 'Guest'}
              </ThemedText>
            </View>
            {party.isPrivate && (
              <View style={[styles.privBadge, { backgroundColor: theme.background }]}>
                <Ionicons name="lock-closed" size={9} color={theme.muted} />
                <ThemedText style={{ color: theme.muted, fontSize: 10, fontWeight: '600' }}>Private</ThemedText>
              </View>
            )}
          </View>

          <ThemedText type="smallBold" numberOfLines={1}>{party.partyName}</ThemedText>
          <ThemedText type="small" style={{ color: theme.muted }} numberOfLines={1}>
            {party.movie.title}
          </ThemedText>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="calendar-outline" size={11} color={theme.muted} />
            <ThemedText type="small" style={{ color: theme.muted }}>{party.date} · {party.time}</ThemedText>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="tv-outline" size={11} color={theme.muted} />
            <ThemedText type="small" style={{ color: theme.muted }}>{party.platform}</ThemedText>
          </View>

          {party.invitedFriends.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Ionicons name="people-outline" size={11} color={theme.muted} />
              <ThemedText type="small" style={{ color: theme.muted }} numberOfLines={1}>
                {party.invitedFriends.slice(0, 3).join(', ')}{party.invitedFriends.length > 3 ? ` +${party.invitedFriends.length - 3}` : ''}
              </ThemedText>
            </View>
          )}
        </View>
      </View>

      {/* Action buttons — uniform style matching home/movie screens */}
      {!isPast && (
        <View style={styles.btnRow}>
          {isLive ? (
            <TouchableOpacity onPress={goToRoom} style={[styles.btnPrimary, { backgroundColor: '#ef4444' }]}>
              <ThemedText style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>▶  Join Now</ThemedText>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={goToRoom} style={[styles.btnPrimary, { backgroundColor: theme.primary }]}>
                <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 13 }}>
                  {isOwn ? '▶  Start Party' : '▶  Join Party'}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnSecondary, { backgroundColor: theme.background }]}>
                <ThemedText style={{ color: theme.primary, fontWeight: '600', fontSize: 13 }}>
                  {isOwn ? 'Invite' : 'Chat'}
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {isPast && (
        <View style={styles.btnRow}>
          <TouchableOpacity onPress={goToRoom} style={[styles.btnPrimary, { backgroundColor: theme.primary }]}>
            <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 13 }}>Watch Again</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnSecondary, { backgroundColor: theme.background }]}>
            <ThemedText style={{ color: theme.primary, fontWeight: '600', fontSize: 13 }}>Rate</ThemedText>
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
  const { parties: userParties } = useUser();

  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const allParties = [...userParties, ...MOCK_PARTIES];

  const liveParties    = allParties.filter(p => p.status === 'live');
  const upcomingParties = allParties.filter(p => p.status === 'upcoming');
  const pastParties    = allParties.filter(p => p.status === 'past');

  const ownedIds = new Set(userParties.map(p => p.id));

  const hostedCount = userParties.length;
  const joinedCount = MOCK_PARTIES.filter(p => p.status !== 'past').length;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={{ fontSize: 28, fontWeight: '700' }}>My Parties</ThemedText>
            <ThemedText type="small" style={{ color: theme.muted }}>Connect with users while watching your favourite shows</ThemedText>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/create')}
            style={[styles.newBtn, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="add" size={16} color={theme.textInverse} />
            <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 13 }}>New</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[styles.statsRow, { backgroundColor: theme.surface }]}>
          {[
            { label: 'Hosted', value: hostedCount },
            { label: 'Joined', value: joinedCount },
            { label: 'This Month', value: hostedCount + joinedCount },
          ].map((stat, i, arr) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: theme.primary }]}>{stat.value}</ThemedText>
                <ThemedText type="small" style={{ color: theme.muted }}>{stat.label}</ThemedText>
              </View>
              {i < arr.length - 1 && <View style={[styles.statDiv, { backgroundColor: theme.background }]} />}
            </React.Fragment>
          ))}
        </View>

        {/* Live Now */}
        {liveParties.length > 0 && (
          <>
            <View style={styles.sectionHead}>
              <View style={[styles.livePill, { backgroundColor: '#fef2f2' }]}>
                <ThemedText style={{ color: '#ef4444', fontSize: 10, fontWeight: '700' }}>● LIVE</ThemedText>
              </View>
              <ThemedText type="smallBold" style={{ color: '#ef4444' }}>Happening Now</ThemedText>
            </View>
            {liveParties.map(p => <PartyCard key={p.id} party={p} isOwn={ownedIds.has(p.id)} />)}
          </>
        )}

        {/* Tab Switcher */}
        <View style={[styles.tabRow, { backgroundColor: theme.surface }]}>
          {(['upcoming', 'past'] as Tab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, { backgroundColor: activeTab === tab ? theme.primary : 'transparent' }]}
            >
              <ThemedText type="small" style={{
                color: activeTab === tab ? theme.textInverse : theme.muted,
                fontWeight: '700',
                textTransform: 'capitalize',
              }}>
                {tab === 'upcoming' ? `Upcoming (${upcomingParties.length})` : `Past (${pastParties.length})`}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming */}
        {activeTab === 'upcoming' && (
          <View style={{ gap: Spacing.two }}>
            {upcomingParties.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
                <ThemedText style={{ fontSize: 40 }}>🎬</ThemedText>
                <ThemedText type="smallBold" style={{ marginTop: 8 }}>No Watch Parties Yet</ThemedText>
                <ThemedText type="small" style={{ color: theme.muted, textAlign: 'center', marginTop: 4 }}>
                  Create one or get invited by a friend
                </ThemedText>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/create')}
                  style={[styles.emptyBtn, { backgroundColor: theme.primary }]}
                >
                  <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 13 }}>Create a Party</ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {upcomingParties.filter(p => ownedIds.has(p.id)).length > 0 && (
                  <>
                    <View style={styles.sectionHead}>
                      <ThemedText type="small" style={{ color: theme.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 }}>HOSTING</ThemedText>
                    </View>
                    {upcomingParties.filter(p => ownedIds.has(p.id)).map(p =>
                      <PartyCard key={p.id} party={p} isOwn={true} />
                    )}
                  </>
                )}
                {upcomingParties.filter(p => !ownedIds.has(p.id)).length > 0 && (
                  <>
                    <View style={styles.sectionHead}>
                      <ThemedText type="small" style={{ color: theme.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 }}>JOINED</ThemedText>
                    </View>
                    {upcomingParties.filter(p => !ownedIds.has(p.id)).map(p =>
                      <PartyCard key={p.id} party={p} isOwn={false} />
                    )}
                  </>
                )}
              </>
            )}
          </View>
        )}

        {/* Past */}
        {activeTab === 'past' && (
          <View style={{ gap: Spacing.two }}>
            {pastParties.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
                <ThemedText style={{ fontSize: 40 }}>📼</ThemedText>
                <ThemedText type="smallBold" style={{ marginTop: 8 }}>No past parties yet</ThemedText>
                <ThemedText type="small" style={{ color: theme.muted, textAlign: 'center', marginTop: 4 }}>
                  Your watch history will appear here
                </ThemedText>
              </View>
            ) : (
              pastParties.map(p => <PartyCard key={p.id} party={p} isOwn={ownedIds.has(p.id)} />)
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
  scroll: { padding: Spacing.three, gap: Spacing.two, paddingBottom: 100 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },

  statsRow: { flexDirection: 'row', borderRadius: Radius.lg, padding: Spacing.three, justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center', flex: 1, gap: 2 },
  statValue: { fontSize: 22, fontWeight: '700' },
  statDiv: { width: 1, height: 36 },

  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 2 },
  livePill: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },

  tabRow: { flexDirection: 'row', borderRadius: Radius.md, padding: 4, gap: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: Radius.sm, alignItems: 'center' },

  card: { borderRadius: Radius.lg, padding: Spacing.three, gap: Spacing.two, overflow: 'hidden' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, gap: 6, marginBottom: 2 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  cardTop: { flexDirection: 'row', gap: Spacing.two },
  poster: { width: 64, height: 90, borderRadius: Radius.sm },
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  roleBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  privBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },

  // Uniform button styles matching home.tsx / movie.tsx
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btnPrimary: { flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  btnSecondary: { paddingHorizontal: 18, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },

  emptyState: { borderRadius: Radius.lg, padding: Spacing.five, alignItems: 'center' },
  emptyBtn: { marginTop: 16, borderRadius: 10, paddingHorizontal: 28, paddingVertical: 11, alignItems: 'center' },
});