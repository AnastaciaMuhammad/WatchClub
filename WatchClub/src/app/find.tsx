//
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

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
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
    id: '1',
    name: 'Jennifer Lee',
    username: '@jennifer',
    avatar: 'https://i.pravatar.cc/150?img=32',
    friendsSince: 'Friends Since: Jan 2023',
    genres: ['Drama', 'Thriller', 'Comedy'],
  },
  {
    id: '2',
    name: 'Marcus Hill',
    username: '@marcus',
    avatar: 'https://i.pravatar.cc/150?img=12',
    friendsSince: 'Friends Since: Mar 2022',
    genres: ['Sci-Fi', 'Mystery', 'Action'],
  },
  {
    id: '3',
    name: 'Tiana Brooks',
    username: '@tiana',
    avatar: 'https://i.pravatar.cc/150?img=47',
    friendsSince: 'Friends Since: Jul 2023',
    genres: ['Romance', 'Reality TV', 'Drama'],
  },
  {
    id: '4',
    name: 'Chris Allen',
    username: '@chris',
    avatar: 'https://i.pravatar.cc/150?img=15',
    friendsSince: 'Friends Since: Nov 2021',
    genres: ['Action', 'Crime', 'Adventure'],
  },
];

const discoverUsers: SearchUser[] = [
  {
    id: '1',
    name: 'Ava Johnson',
    username: '@ava',
    avatar: 'https://i.pravatar.cc/150?img=44',
    matchPercent: 92,
    genres: ['Drama', 'Thriller', 'Comedy'],
  },
  {
    id: '2',
    name: 'Jordan Smith',
    username: '@jordan',
    avatar: 'https://i.pravatar.cc/150?img=14',
    matchPercent: 87,
    genres: ['Sci-Fi', 'Mystery', 'Action'],
  },
  {
    id: '3',
    name: 'Kayla Davis',
    username: '@kayla',
    avatar: 'https://i.pravatar.cc/150?img=36',
    matchPercent: 81,
    genres: ['Romance', 'Comedy', 'Reality TV'],
  },
  {
    id: '4',
    name: 'Ryan Moore',
    username: '@ryan',
    avatar: 'https://i.pravatar.cc/150?img=18',
    matchPercent: 76,
    genres: ['Action', 'Crime', 'Adventure'],
  },
  {
    id: '5',
    name: 'Emily Carter',
    username: '@emily',
    avatar: 'https://i.pravatar.cc/150?img=41',
    matchPercent: 89,
    genres: ['Drama', 'Documentary', 'Romance'],
  },
  {
    id: '6',
    name: 'Sofia Brown',
    username: '@sofia',
    avatar: 'https://i.pravatar.cc/150?img=48',
    matchPercent: 64,
    genres: ['Fantasy', 'Animation', 'Adventure'],
  },
];

const receivedRequests: RequestUser[] = [
  {
    id: '1',
    name: 'Nia Wilson',
    username: '@nia',
    avatar: 'https://i.pravatar.cc/150?img=5',
    genres: ['Drama', 'Comedy', 'Mystery'],
  },
  {
    id: '2',
    name: 'Brandon Reed',
    username: '@brandon',
    avatar: 'https://i.pravatar.cc/150?img=11',
    genres: ['Sci-Fi', 'Action', 'Crime'],
  },
];

const sentRequests: RequestUser[] = [
  {
    id: '3',
    name: 'Olivia Hall',
    username: '@olivia',
    avatar: 'https://i.pravatar.cc/150?img=25',
    genres: ['Romance', 'Reality TV', 'Drama'],
  },
  {
    id: '4',
    name: 'Noah Carter',
    username: '@noah',
    avatar: 'https://i.pravatar.cc/150?img=21',
    genres: ['Adventure', 'Fantasy', 'Animation'],
  },
];

export default function FindScreen() {
  const theme = useTheme();

  const [activeSection, setActiveSection] = useState<ActiveSection>('friends');
  const [searchText, setSearchText] = useState('');
  const [showReceivedRequests, setShowReceivedRequests] = useState(true);
  const [showSentRequests, setShowSentRequests] = useState(true);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    const results = !normalizedSearch
      ? [...discoverUsers]
      : discoverUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(normalizedSearch) ||
            user.username.toLowerCase().includes(normalizedSearch) ||
            user.genres.some((genre) =>
              genre.toLowerCase().includes(normalizedSearch)
            )
        );

    return results.sort((a, b) => b.matchPercent - a.matchPercent);
  }, [searchText]);

  const handleViewProfile = (user: SearchUser | Friend | RequestUser) => {
    Alert.alert('View Profile', `${user.username}'s profile page is not built yet.`);
  };

  const handleInviteToParty = (friend: Friend) => {
    Alert.alert('Invite to Party', `Invite sent to ${friend.username}`);
  };

  const handleAddFriend = (user: SearchUser) => {
    Alert.alert('Add Friend', `Friend request sent to ${user.username}`);
  };

  const handleAcceptRequest = (user: RequestUser) => {
    Alert.alert('Friend Request', `Accepted ${user.username}'s request`);
  };

  const handleDeclineRequest = (user: RequestUser) => {
    Alert.alert('Friend Request', `Declined ${user.username}'s request`);
  };

  const handlePendingRequest = (user: RequestUser) => {
    Alert.alert('Pending Request', `Request to ${user.username} is still pending`);
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">Find</ThemedText>
          <ThemedText
            style={[styles.subtext, { color: theme.textPrimary, opacity: 0.7 }]}
          >
            Manage friends, search for users, and review requests.
          </ThemedText>
        </View>

        <View style={styles.segmentedControl}>
          <SegmentButton
            label="Friends"
            active={activeSection === 'friends'}
            onPress={() => setActiveSection('friends')}
          />
          <SegmentButton
            label="Search"
            active={activeSection === 'search'}
            onPress={() => setActiveSection('search')}
          />
          <SegmentButton
            label="Requests"
            active={activeSection === 'requests'}
            onPress={() => setActiveSection('requests')}
          />
        </View>

        {activeSection === 'friends' && (
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Your Friends
            </ThemedText>

            {friendsData.map((friend) => (
              <View
                key={friend.id}
                style={[styles.friendCard, { backgroundColor: theme.surface }]}
              >
                <View style={styles.friendHeaderRow}>
                  <View style={styles.userRow}>
                    <Image source={{ uri: friend.avatar }} style={styles.profileImage} />
                    <ThemedText
                      style={[styles.friendUsernameOnly, { color: theme.textPrimary }]}
                    >
                      {friend.username}
                    </ThemedText>
                  </View>

                  <View
                    style={[
                      styles.friendsSincePill,
                      { backgroundColor: theme.background },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.friendsSinceText,
                        { color: theme.textPrimary, opacity: 0.8 },
                      ]}
                    >
                      {friend.friendsSince}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.genreSection}>
                  <ThemedText
                    style={[styles.detailLabel, { color: theme.textPrimary, opacity: 0.8 }]}
                  >
                    Liked genres
                  </ThemedText>

                  <View style={styles.genreChipsRow}>
                    {friend.genres.map((genre) => (
                      <View
                        key={genre}
                        style={[
                          styles.genreChip,
                          { backgroundColor: theme.background },
                        ]}
                      >
                        <ThemedText
                          style={[styles.genreChipText, { color: theme.textPrimary }]}
                        >
                          {genre}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => handleInviteToParty(friend)}
                    style={[
                      styles.halfButton,
                      {
                        backgroundColor: theme.primary,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[styles.viewProfileButtonText, { color: theme.textInverse }]}
                    >
                      Invite to Party
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    onPress={() => handleViewProfile(friend)}
                    style={[
                      styles.halfButton,
                      {
                        backgroundColor: theme.secondary,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[styles.secondaryActionText, { color: theme.textPrimary }]}
                    >
                      View Profile
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeSection === 'search' && (
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Search Users
            </ThemedText>

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="search for new friends"
              placeholderTextColor="#8E8E93"
              style={[
                styles.searchInput,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            />

            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const matchColors = getMatchColors(item.matchPercent);

                return (
                  <View style={[styles.friendCard, { backgroundColor: theme.surface }]}>
                    <View style={styles.searchHeaderTopRow}>
                      <View style={styles.userRow}>
                        <Image source={{ uri: item.avatar }} style={styles.profileImage} />
                        <ThemedText
                          style={[styles.friendUsernameOnly, { color: theme.textPrimary }]}
                        >
                          {item.username}
                        </ThemedText>
                      </View>

                      <View
                        style={[
                          styles.matchPill,
                          { backgroundColor: matchColors.backgroundColor },
                        ]}
                      >
                        <ThemedText
                          style={[styles.matchText, { color: matchColors.textColor }]}
                        >
                          {item.matchPercent}% AI match
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.genreSection}>
                      <ThemedText
                        style={[styles.detailLabel, { color: theme.textPrimary, opacity: 0.8 }]}
                      >
                        Liked genres
                      </ThemedText>

                      <View style={styles.genreChipsRow}>
                        {item.genres.map((genre) => (
                          <View
                            key={genre}
                            style={[
                              styles.genreChip,
                              { backgroundColor: theme.background },
                            ]}
                          >
                            <ThemedText
                              style={[styles.genreChipText, { color: theme.textPrimary }]}
                            >
                              {genre}
                            </ThemedText>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() => handleViewProfile(item)}
                        style={[
                          styles.halfButton,
                          {
                            backgroundColor: theme.primary,
                          },
                        ]}
                      >
                        <ThemedText
                          style={[styles.viewProfileButtonText, { color: theme.textInverse }]}
                        >
                          View Profile
                        </ThemedText>
                      </Pressable>

                      <Pressable
                        onPress={() => handleAddFriend(item)}
                        style={[
                          styles.halfButton,
                          {
                            backgroundColor: theme.secondary,
                          },
                        ]}
                      >
                        <ThemedText
                          style={[styles.secondaryActionText, { color: theme.textPrimary }]}
                        >
                          Add
                        </ThemedText>
                      </Pressable>
                    </View>
                  </View>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height: Spacing.three }} />}
            />
          </View>
        )}

        {activeSection === 'requests' && (
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Friend Requests
            </ThemedText>

            <View style={styles.requestsColumn}>
              <Pressable
                onPress={() => setShowReceivedRequests(!showReceivedRequests)}
                style={[styles.requestsHeaderRow, { backgroundColor: theme.surface }]}
              >
                <ThemedText style={[styles.requestsChevron, { color: theme.textPrimary }]}>
                  {showReceivedRequests ? '▾' : '▸'}
                </ThemedText>
                <ThemedText style={[styles.requestsHeaderText, { color: theme.textPrimary }]}>
                  Received
                </ThemedText>
              </Pressable>

              {showReceivedRequests &&
                receivedRequests.map((request) => (
                  <View
                    key={request.id}
                    style={[styles.friendCard, { backgroundColor: theme.surface }]}
                  >
                    <View style={styles.friendHeaderRow}>
                      <View style={styles.userRow}>
                        <Image source={{ uri: request.avatar }} style={styles.profileImage} />
                        <ThemedText
                          style={[styles.friendUsernameOnly, { color: theme.textPrimary }]}
                        >
                          {request.username}
                        </ThemedText>
                      </View>

                      <View
                        style={[
                          styles.pendingPill,
                          { backgroundColor: theme.background },
                        ]}
                      >
                        <ThemedText style={styles.pendingIcon}>⏳</ThemedText>
                        <ThemedText
                          style={[styles.pendingText, { color: theme.textPrimary, opacity: 0.8 }]}
                        >
                          Pending
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.genreSection}>
                      <ThemedText
                        style={[styles.detailLabel, { color: theme.textPrimary, opacity: 0.8 }]}
                      >
                        Liked genres
                      </ThemedText>

                      <View style={styles.genreChipsRow}>
                        {request.genres.map((genre) => (
                          <View
                            key={genre}
                            style={[
                              styles.genreChip,
                              { backgroundColor: theme.background },
                            ]}
                          >
                            <ThemedText
                              style={[styles.genreChipText, { color: theme.textPrimary }]}
                            >
                              {genre}
                            </ThemedText>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() => handleAcceptRequest(request)}
                        style={[styles.halfButton, { backgroundColor: theme.primary }]}
                      >
                        <ThemedText
                          style={[styles.viewProfileButtonText, { color: theme.textInverse }]}
                        >
                          Accept
                        </ThemedText>
                      </Pressable>

                      <Pressable
                        onPress={() => handleDeclineRequest(request)}
                        style={[styles.halfButton, { backgroundColor: theme.secondary }]}
                      >
                        <ThemedText
                          style={[styles.secondaryActionText, { color: theme.textPrimary }]}
                        >
                          Decline
                        </ThemedText>
                      </Pressable>
                    </View>
                  </View>
                ))}
            </View>

            <View style={styles.requestsColumn}>
              <Pressable
                onPress={() => setShowSentRequests(!showSentRequests)}
                style={[styles.requestsHeaderRow, { backgroundColor: theme.surface }]}
              >
                <ThemedText style={[styles.requestsChevron, { color: theme.textPrimary }]}>
                  {showSentRequests ? '▾' : '▸'}
                </ThemedText>
                <ThemedText style={[styles.requestsHeaderText, { color: theme.textPrimary }]}>
                  Sent
                </ThemedText>
              </Pressable>

              {showSentRequests &&
                sentRequests.map((request) => (
                  <View
                    key={request.id}
                    style={[styles.friendCard, { backgroundColor: theme.surface }]}
                  >
                    <View style={styles.friendHeaderRow}>
                      <View style={styles.userRow}>
                        <Image source={{ uri: request.avatar }} style={styles.profileImage} />
                        <ThemedText
                          style={[styles.friendUsernameOnly, { color: theme.textPrimary }]}
                        >
                          {request.username}
                        </ThemedText>
                      </View>

                      <View
                        style={[
                          styles.pendingPill,
                          { backgroundColor: theme.background },
                        ]}
                      >
                        <ThemedText style={styles.pendingIcon}>⏳</ThemedText>
                        <ThemedText
                          style={[styles.pendingText, { color: theme.textPrimary, opacity: 0.8 }]}
                        >
                          Pending
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.genreSection}>
                      <ThemedText
                        style={[styles.detailLabel, { color: theme.textPrimary, opacity: 0.8 }]}
                      >
                        Liked genres
                      </ThemedText>

                      <View style={styles.genreChipsRow}>
                        {request.genres.map((genre) => (
                          <View
                            key={genre}
                            style={[
                              styles.genreChip,
                              { backgroundColor: theme.background },
                            ]}
                          >
                            <ThemedText
                              style={[styles.genreChipText, { color: theme.textPrimary }]}
                            >
                              {genre}
                            </ThemedText>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() => handlePendingRequest(request)}
                        style={[
                          styles.fullWidthSecondaryButton,
                          { backgroundColor: theme.secondary },
                        ]}
                      >
                        <ThemedText
                          style={[styles.secondaryActionText, { color: theme.textPrimary }]}
                        >
                          Pending
                        </ThemedText>
                      </Pressable>

                      <Pressable
                        onPress={() => handleViewProfile(request)}
                        style={[
                          styles.fullWidthPrimaryButton,
                          { backgroundColor: theme.primary },
                        ]}
                      >
                        <ThemedText
                          style={[styles.viewProfileButtonText, { color: theme.textInverse }]}
                        >
                          View Profile
                        </ThemedText>
                      </Pressable>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}

type SegmentButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function SegmentButton({ label, active, onPress }: SegmentButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.segmentButton,
        {
          backgroundColor: active ? theme.primary : theme.secondary,
        },
        pressed && { opacity: 0.85 },
      ]}
    >
      <ThemedText
        style={[
          styles.segmentButtonText,
          { color: active ? theme.textInverse : theme.textPrimary },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function getMatchColors(matchPercent: number) {
  if (matchPercent >= 90) {
    return {
      backgroundColor: '#DCFCE7',
      textColor: '#166534',
    };
  }

  if (matchPercent >= 80) {
    return {
      backgroundColor: '#FEF9C3',
      textColor: '#854D0E',
    };
  }

  if (matchPercent >= 70) {
    return {
      backgroundColor: '#FEF2F2',
      textColor: '#B91C1C',
    };
  }

  return {
    backgroundColor: '#FEE2E2',
    textColor: '#991B1B',
  };
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: Spacing.four,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  header: {
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: Spacing.one,
  },
  subtext: {
    fontSize: 14,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
  sectionTitle: {
    marginBottom: Spacing.one,
    fontSize: 20,
    fontWeight: '700',
  },

  friendCard: {
    borderRadius: 20,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    minHeight: 150,
    marginBottom: Spacing.two,
    gap: 12,
  },
  friendHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  searchHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileImageLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: 'center',
  },
  friendUsernameOnly: {
    fontSize: 16,
    fontWeight: '700',
  },

  searchCard: {
    borderRadius: 20,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 150,
    marginBottom: Spacing.two,
  },
  requestCardContainer: {
    borderRadius: 20,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    minHeight: 150,
    marginBottom: Spacing.two,
  },

  searchInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  searchTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  searchNameBlock: {
    flex: 1,
    paddingRight: 10,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  addIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addIconText: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
  },
  matchPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  friendsSincePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    maxWidth: '52%',
  },
  friendsSinceText: {
    fontSize: 12,
    fontWeight: '700',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
  },
  matchText: {
    fontSize: 12,
    fontWeight: '700',
  },
  genreSection: {
    gap: 4,
  },
  genreChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  genreChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchInput: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: Spacing.three,
    fontSize: 16,
    borderWidth: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: 2,
  },
  halfButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProfileButton: {
    marginTop: 2,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProfileButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  requestsColumn: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  requestsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
  },
  requestsChevron: {
    fontSize: 16,
    fontWeight: '700',
  },
  requestsHeaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
  requestTopMeta: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  pendingIcon: {
    fontSize: 12,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  requestContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    width: '100%',
    marginTop: 18,
  },
  fullWidthSecondaryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthPrimaryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});