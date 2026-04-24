//  find.tsx
//
//  Created by Omarion Aubert on 4/2/26.
//  Edited by Anastacia Muhammad on 4/7/26.
//  Updated on 4/10/26.
//

import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ActiveSection = 'friends' | 'search' | 'requests';

type Friend = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  friendsSince: string;
  genres: string[];
};

type SearchUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  matchPercent: number;
  genres: string[];
};

type RequestUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  genres: string[];
};

const friendsData: Friend[] = [
  {
    id: '1', name: 'Jennifer Lee', username: '@jennifer',
    avatar: 'https://i.pravatar.cc/150?img=32',
    friendsSince: 'Jan 2023', genres: ['Drama', 'Thriller', 'Comedy'],
  },
  {
    id: '2', name: 'Marcus Hill', username: '@marcus',
    avatar: 'https://i.pravatar.cc/150?img=12',
    friendsSince: 'Mar 2022', genres: ['Sci-Fi', 'Mystery', 'Action'],
  },
  {
    id: '3', name: 'Tiana Brooks', username: '@tiana',
    avatar: 'https://i.pravatar.cc/150?img=47',
    friendsSince: 'Jul 2023', genres: ['Romance', 'Reality TV', 'Drama'],
  },
  {
    id: '4', name: 'Chris Allen', username: '@chris',
    avatar: 'https://i.pravatar.cc/150?img=15',
    friendsSince: 'Nov 2021', genres: ['Action', 'Crime', 'Adventure'],
  },
];

const discoverUsers: SearchUser[] = [
  {
    id: '1', name: 'Ava Johnson', username: '@ava',
    avatar: 'https://i.pravatar.cc/150?img=44',
    matchPercent: 92, genres: ['Drama', 'Thriller', 'Comedy'],
  },
  {
    id: '2', name: 'Jordan Smith', username: '@jordan',
    avatar: 'https://i.pravatar.cc/150?img=14',
    matchPercent: 87, genres: ['Sci-Fi', 'Mystery', 'Action'],
  },
  {
    id: '3', name: 'Kayla Davis', username: '@kayla',
    avatar: 'https://i.pravatar.cc/150?img=36',
    matchPercent: 81, genres: ['Romance', 'Comedy', 'Reality TV'],
  },
  {
    id: '4', name: 'Ryan Moore', username: '@ryan',
    avatar: 'https://i.pravatar.cc/150?img=18',
    matchPercent: 76, genres: ['Action', 'Crime', 'Adventure'],
  },
  {
    id: '5', name: 'Emily Carter', username: '@emily',
    avatar: 'https://i.pravatar.cc/150?img=41',
    matchPercent: 89, genres: ['Drama', 'Documentary', 'Romance'],
  },
  {
    id: '6', name: 'Sofia Brown', username: '@sofia',
    avatar: 'https://i.pravatar.cc/150?img=48',
    matchPercent: 64, genres: ['Fantasy', 'Animation', 'Adventure'],
  },
];

const receivedRequests: RequestUser[] = [
  {
    id: '1', name: 'Nia Wilson', username: '@nia',
    avatar: 'https://i.pravatar.cc/150?img=5',
    genres: ['Drama', 'Comedy', 'Mystery'],
  },
  {
    id: '2', name: 'Brandon Reed', username: '@brandon',
    avatar: 'https://i.pravatar.cc/150?img=11',
    genres: ['Sci-Fi', 'Action', 'Crime'],
  },
];

const sentRequests: RequestUser[] = [
  {
    id: '3', name: 'Olivia Hall', username: '@olivia',
    avatar: 'https://i.pravatar.cc/150?img=25',
    genres: ['Romance', 'Reality TV', 'Drama'],
  },
  {
    id: '4', name: 'Noah Carter', username: '@noah',
    avatar: 'https://i.pravatar.cc/150?img=21',
    genres: ['Adventure', 'Fantasy', 'Animation'],
  },
];

// ─── Match color helper ───────────────────────────────────────────────────────

function getMatchColors(matchPercent: number) {
  if (matchPercent >= 90) return { bg: '#DCFCE7', text: '#166534' };
  if (matchPercent >= 80) return { bg: '#FEF9C3', text: '#854D0E' };
  if (matchPercent >= 70) return { bg: '#FEF2F2', text: '#B91C1C' };
  return { bg: '#FEE2E2', text: '#991B1B' };
}

// ─── Shared: User card header (avatar + username + right pill) ────────────────

function CardHeader({
  avatar, username, right,
}: {
  avatar: string;
  username: string;
  right?: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={s.cardHeader}>
      <View style={s.userRow}>
        <Image source={{ uri: avatar }} style={s.avatar} />
        <ThemedText style={[s.username, { color: theme.textPrimary }]}>{username}</ThemedText>
      </View>
      {right}
    </View>
  );
}

// ─── Shared: Genre chips ──────────────────────────────────────────────────────

function GenreChips({ genres }: { genres: string[] }) {
  const theme = useTheme();
  return (
    <View style={s.genreWrap}>
      <ThemedText style={[s.genreLabel, { color: theme.muted }]}>Liked genres</ThemedText>
      <View style={s.chipRow}>
        {genres.map(g => (
          <View key={g} style={[s.chip, { backgroundColor: theme.background }]}>
            <ThemedText style={[s.chipText, { color: theme.textPrimary }]}>{g}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Segment control ─────────────────────────────────────────────────────────

function SegmentButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.segBtn,
        { backgroundColor: active ? theme.primary : theme.surface, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <ThemedText style={{ color: active ? theme.textInverse : theme.muted, fontSize: 14, fontWeight: '700' }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function FindScreen() {
  const theme = useTheme();

  const [activeSection, setActiveSection] = useState<ActiveSection>('friends');
  const [searchText, setSearchText] = useState('');
  const [showReceived, setShowReceived] = useState(true);
  const [showSent, setShowSent] = useState(true);

  const filteredUsers = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    const results = !q
      ? [...discoverUsers]
      : discoverUsers.filter(u =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.genres.some(g => g.toLowerCase().includes(q))
        );
    return results.sort((a, b) => b.matchPercent - a.matchPercent);
  }, [searchText]);

  const handleViewProfile    = (u: any)          => Alert.alert('View Profile', `${u.username}'s profile page is not built yet.`);
  const handleInviteToParty  = (u: Friend)        => Alert.alert('Invite to Party', `Invite sent to ${u.username}`);
  const handleAddFriend      = (u: SearchUser)    => Alert.alert('Add Friend', `Friend request sent to ${u.username}`);
  const handleAcceptRequest  = (u: RequestUser)   => Alert.alert('Friend Request', `Accepted ${u.username}'s request`);
  const handleDeclineRequest = (u: RequestUser)   => Alert.alert('Friend Request', `Declined ${u.username}'s request`);
  const handlePendingRequest = (u: RequestUser)   => Alert.alert('Pending Request', `Request to ${u.username} is still pending`);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={s.container}>

          {/* Header */}
          <View style={s.header}>
            <ThemedText type="title" style={{ fontSize: 28, fontWeight: '700' }}>Find</ThemedText>
            <ThemedText style={{ color: theme.muted, fontSize: 14, marginTop: 2 }}>
              Manage friends, search for users, and review requests.
            </ThemedText>
          </View>

          {/* Segment control */}
          <View style={[s.segRow, { backgroundColor: theme.surface }]}>
            {(['friends', 'search', 'requests'] as ActiveSection[]).map(tab => (
              <SegmentButton
                key={tab}
                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                active={activeSection === tab}
                onPress={() => setActiveSection(tab)}
              />
            ))}
          </View>

          {/* ── Friends ── */}
          {activeSection === 'friends' && (
            <View style={s.section}>
              <View style={s.sectionHead}>
                <Ionicons name="people-outline" size={16} color={theme.primary} />
                <ThemedText style={[s.sectionTitle, { color: theme.textPrimary }]}>Your Friends</ThemedText>
              </View>

              {friendsData.map(friend => (
                <View key={friend.id} style={[s.card, { backgroundColor: theme.surface }]}>
                  <CardHeader
                    avatar={friend.avatar}
                    username={friend.username}
                    right={
                      <View style={[s.pill, { backgroundColor: theme.background }]}>
                        <Ionicons name="calendar-outline" size={11} color={theme.muted} />
                        <ThemedText style={{ color: theme.muted, fontSize: 11, fontWeight: '600' }}>
                          Since {friend.friendsSince}
                        </ThemedText>
                      </View>
                    }
                  />
                  <GenreChips genres={friend.genres} />
                  <View style={s.btnRow}>
                    <Pressable onPress={() => handleInviteToParty(friend)}
                      style={[s.btnPrimary, { backgroundColor: theme.primary }]}>
                      <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 13 }}>
                        Invite to Party
                      </ThemedText>
                    </Pressable>
                    <Pressable onPress={() => handleViewProfile(friend)}
                      style={[s.btnSecondary, { backgroundColor: theme.background }]}>
                      <ThemedText style={{ color: theme.primary, fontWeight: '600', fontSize: 13 }}>
                        View Profile
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ── Search ── */}
          {activeSection === 'search' && (
            <View style={s.section}>
              <View style={s.sectionHead}>
                <Ionicons name="search-outline" size={16} color={theme.primary} />
                <ThemedText style={[s.sectionTitle, { color: theme.textPrimary }]}>Search Users</ThemedText>
              </View>

              {/* Search input — matches FavoritesSearch in home.tsx */}
              <View style={[s.searchWrap, { backgroundColor: theme.surface }]}>
                <View style={[s.inputRow, { borderColor: theme.border, backgroundColor: theme.background }]}>
                  <Ionicons name="search" size={15} color={theme.muted} style={{ marginRight: 8 }} />
                  <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search by name, username, or genre…"
                    placeholderTextColor={theme.muted}
                    style={[s.input, { color: theme.textPrimary }]}
                    autoCorrect={false}
                  />
                  {searchText.length > 0 && (
                    <Pressable onPress={() => setSearchText('')}>
                      <Ionicons name="close-circle" size={16} color={theme.muted} />
                    </Pressable>
                  )}
                </View>
              </View>

              <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => {
                  const mc = getMatchColors(item.matchPercent);
                  return (
                    <View style={[s.card, { backgroundColor: theme.surface }]}>
                      <CardHeader
                        avatar={item.avatar}
                        username={item.username}
                        right={
                          <View style={[s.pill, { backgroundColor: mc.bg }]}>
                            <ThemedText style={{ color: mc.text, fontSize: 11, fontWeight: '700' }}>
                              {item.matchPercent}% match
                            </ThemedText>
                          </View>
                        }
                      />
                      <GenreChips genres={item.genres} />
                      <View style={s.btnRow}>
                        <Pressable onPress={() => handleAddFriend(item)}
                          style={[s.btnPrimary, { backgroundColor: theme.primary }]}>
                          <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 13 }}>
                            Add Friend
                          </ThemedText>
                        </Pressable>
                        <Pressable onPress={() => handleViewProfile(item)}
                          style={[s.btnSecondary, { backgroundColor: theme.background }]}>
                          <ThemedText style={{ color: theme.primary, fontWeight: '600', fontSize: 13 }}>
                            View Profile
                          </ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  );
                }}
                ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
              />
            </View>
          )}

          {/* ── Requests ── */}
          {activeSection === 'requests' && (
            <View style={s.section}>
              <View style={s.sectionHead}>
                <Ionicons name="person-add-outline" size={16} color={theme.primary} />
                <ThemedText style={[s.sectionTitle, { color: theme.textPrimary }]}>Friend Requests</ThemedText>
              </View>

              {/* Received */}
              <Pressable
                onPress={() => setShowReceived(!showReceived)}
                style={[s.collapseRow, { backgroundColor: theme.surface }]}
              >
                <Ionicons
                  name={showReceived ? 'chevron-down' : 'chevron-forward'}
                  size={14} color={theme.muted}
                />
                <ThemedText style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 14 }}>
                  Received
                </ThemedText>
                <View style={[s.countPill, { backgroundColor: theme.background }]}>
                  <ThemedText style={{ color: theme.primary, fontSize: 11, fontWeight: '700' }}>
                    {receivedRequests.length}
                  </ThemedText>
                </View>
              </Pressable>

              {showReceived && receivedRequests.map(req => (
                <View key={req.id} style={[s.card, { backgroundColor: theme.surface }]}>
                  <CardHeader
                    avatar={req.avatar}
                    username={req.username}
                    right={
                      <View style={[s.pill, { backgroundColor: theme.background }]}>
                        <ThemedText style={{ color: theme.muted, fontSize: 11, fontWeight: '600' }}>⏳ Pending</ThemedText>
                      </View>
                    }
                  />
                  <GenreChips genres={req.genres} />
                  <View style={s.btnRow}>
                    <Pressable onPress={() => handleAcceptRequest(req)}
                      style={[s.btnPrimary, { backgroundColor: theme.primary }]}>
                      <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 13 }}>Accept</ThemedText>
                    </Pressable>
                    <Pressable onPress={() => handleDeclineRequest(req)}
                      style={[s.btnSecondary, { backgroundColor: theme.background }]}>
                      <ThemedText style={{ color: theme.muted, fontWeight: '600', fontSize: 13 }}>Decline</ThemedText>
                    </Pressable>
                  </View>
                </View>
              ))}

              {/* Sent */}
              <Pressable
                onPress={() => setShowSent(!showSent)}
                style={[s.collapseRow, { backgroundColor: theme.surface }]}
              >
                <Ionicons
                  name={showSent ? 'chevron-down' : 'chevron-forward'}
                  size={14} color={theme.muted}
                />
                <ThemedText style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 14 }}>
                  Sent
                </ThemedText>
                <View style={[s.countPill, { backgroundColor: theme.background }]}>
                  <ThemedText style={{ color: theme.primary, fontSize: 11, fontWeight: '700' }}>
                    {sentRequests.length}
                  </ThemedText>
                </View>
              </Pressable>

              {showSent && sentRequests.map(req => (
                <View key={req.id} style={[s.card, { backgroundColor: theme.surface }]}>
                  <CardHeader
                    avatar={req.avatar}
                    username={req.username}
                    right={
                      <View style={[s.pill, { backgroundColor: theme.background }]}>
                        <ThemedText style={{ color: theme.muted, fontSize: 11, fontWeight: '600' }}>⏳ Pending</ThemedText>
                      </View>
                    }
                  />
                  <GenreChips genres={req.genres} />
                  <View style={s.btnRow}>
                    <Pressable onPress={() => handleViewProfile(req)}
                      style={[s.btnPrimary, { backgroundColor: theme.primary }]}>
                      <ThemedText style={{ color: theme.textInverse, fontWeight: '700', fontSize: 13 }}>View Profile</ThemedText>
                    </Pressable>
                    <Pressable onPress={() => handlePendingRequest(req)}
                      style={[s.btnSecondary, { backgroundColor: theme.background }]}>
                      <ThemedText style={{ color: theme.muted, fontWeight: '600', fontSize: 13 }}>Cancel</ThemedText>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  scroll: { flexGrow: 1, padding: Spacing.three, paddingBottom: 100 },
  container: { flex: 1, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },

  header: { paddingTop: Spacing.two, paddingBottom: Spacing.three },

  // Segment control — matches tab switcher in parties.tsx
  segRow: { flexDirection: 'row', borderRadius: Radius.md, padding: 4, gap: 4, marginBottom: Spacing.three },
  segBtn: { flex: 1, paddingVertical: 10, borderRadius: Radius.sm, alignItems: 'center' },

  // Section header — matches home/profile icon + text pattern
  section: { gap: Spacing.two, paddingBottom: Spacing.three },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },

  // Card — matches Radius.lg + Spacing.three padding from home/parties
  card: { borderRadius: Radius.lg, padding: Spacing.three, gap: 12, marginBottom: 2 },

  // Card header row
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  username: { fontSize: 15, fontWeight: '700' },

  // Pill label (friends-since, match %, pending)
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },

  // Genre chips
  genreWrap: { gap: 6 },
  genreLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  chipText: { fontSize: 11, fontWeight: '600' },

  // Search input — exact match to FavoritesSearch in home.tsx
  searchWrap: { borderRadius: Radius.lg, padding: Spacing.three, marginBottom: 4 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: Radius.md,
    paddingHorizontal: 12, paddingVertical: 9,
  },
  input: { flex: 1, fontSize: 14 },

  // Buttons — identical to home.tsx / parties.tsx
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 2 },
  btnPrimary: { flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  btnSecondary: { paddingHorizontal: 18, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },

  // Collapsible section rows (Received / Sent)
  collapseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: Radius.md,
  },
  countPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 'auto' },
});