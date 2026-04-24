import React, { useState } from 'react';
import {
  View, ScrollView, StyleSheet, TouchableOpacity, Image,
  TextInput, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useUser, MovieResult } from '@/context/usercontent';
import { Spacing, Radius } from '@/constants/theme';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_PLATFORMS = [
  'Netflix', 'Hulu', 'Disney+', 'HBO Max',
  'Prime Video', 'Apple TV+', 'Peacock', 'Paramount+',
];

const ALL_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Superhero',
  'Anime', 'Spy', 'Western',
];

// Genre → color mapping matching the mockup's colored chips
const GENRE_COLORS: Record<string, string> = {
  Action: '#3B82F6', Adventure: '#8B5CF6', Animation: '#EC4899',
  Comedy: '#F59E0B', Crime: '#6B7280', Documentary: '#10B981',
  Drama: '#1655E8', Family: '#F97316', Fantasy: '#A855F7',
  Horror: '#EF4444', Mystery: '#6366F1', Romance: '#F43F5E',
  'Sci-Fi': '#06B6D4', Thriller: '#84CC16', Superhero: '#3B82F6',
  Anime: '#EC4899', Spy: '#6B7280', Western: '#D97706',
};

// Achievements definition
const ACHIEVEMENTS = [
  { id: 'first_party', icon: 'bonfire-outline' as const, label: 'First Party', desc: 'Host your first watch party' },
  { id: 'social', icon: 'people-outline' as const, label: 'Social', desc: 'Invite 3+ friends' },
  { id: 'cinephile', icon: 'film-outline' as const, label: 'Cinephile', desc: 'Add 10 favorites' },
  { id: 'streamer', icon: 'tv-outline' as const, label: 'Streamer', desc: 'Connect 3+ services' },
  { id: 'binge', icon: 'time-outline' as const, label: 'Binge Mode', desc: 'Watch 5 parties in a week' },
];

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

function EditProfileModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const theme = useTheme();
  const {
    name, email, username, platforms, genres, profilePicture,
    setUser, setEmail, setUsername, setPlatforms, setProfilePicture,
  } = useUser();

  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);
  const [draftUsername, setDraftUsername] = useState(username);
  const [draftPlatforms, setDraftPlatforms] = useState<string[]>(platforms);
  const [draftGenres, setDraftGenres] = useState<string[]>(genres);

  const togglePlatform = (p: string) =>
    setDraftPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const toggleGenre = (g: string) =>
    setDraftGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo library access to set a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) setProfilePicture(result.assets[0].uri);
  };

  const handleSave = () => {
    setUser(draftName, draftGenres, draftEmail);
    setUsername(draftUsername);
    setPlatforms(draftPlatforms);
    setEmail(draftEmail);
    onClose();
  };

  const initials = draftName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={em.overlay}>
        <View style={[em.box, { backgroundColor: theme.surface }]}>

          {/* Header */}
          <View style={[em.header, { borderBottomColor: theme.background }]}>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={{ color: theme.muted, fontWeight: '600' }}>Cancel</ThemedText>
            </TouchableOpacity>
            <ThemedText style={{ fontWeight: '700', fontSize: 16 }}>Edit Profile</ThemedText>
            <TouchableOpacity onPress={handleSave}>
              <ThemedText style={{ color: theme.primary, fontWeight: '700' }}>Save</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 48 }}
          >
            {/* Avatar picker */}
            <View style={em.avatarSection}>
              <TouchableOpacity onPress={pickImage} style={em.avatarWrap}>
                {profilePicture
                  ? <Image source={{ uri: profilePicture }} style={[em.avatar, { borderColor: theme.primary }]} />
                  : <View style={[em.avatar, { backgroundColor: theme.primary, borderColor: theme.primary, alignItems: 'center', justifyContent: 'center' }]}>
                      <ThemedText style={{ color: '#fff', fontSize: 30, fontWeight: '700' }}>{initials}</ThemedText>
                    </View>}
                <View style={[em.cameraBtn, { backgroundColor: theme.primary }]}>
                  <Ionicons name="camera" size={14} color="#fff" />
                </View>
              </TouchableOpacity>
              <ThemedText style={{ color: theme.muted, fontSize: 12, marginTop: 8 }}>Tap to change photo</ThemedText>
            </View>

            {/* Display Name */}
            <View style={em.fieldGroup}>
              <ThemedText style={[em.label, { color: theme.muted }]}>DISPLAY NAME</ThemedText>
              <TextInput value={draftName} onChangeText={setDraftName} placeholder="Your name"
                placeholderTextColor={theme.muted}
                style={[em.input, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.background }]} />
            </View>

            {/* Username */}
            <View style={em.fieldGroup}>
              <ThemedText style={[em.label, { color: theme.muted }]}>USERNAME</ThemedText>
              <TextInput value={draftUsername} onChangeText={setDraftUsername} placeholder="@username"
                placeholderTextColor={theme.muted} autoCapitalize="none"
                style={[em.input, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.background }]} />
            </View>

            {/* Email */}
            <View style={em.fieldGroup}>
              <ThemedText style={[em.label, { color: theme.muted }]}>EMAIL</ThemedText>
              <TextInput value={draftEmail} onChangeText={setDraftEmail} placeholder="email@example.com"
                placeholderTextColor={theme.muted} keyboardType="email-address" autoCapitalize="none"
                style={[em.input, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.background }]} />
            </View>

            {/* Platforms */}
            <View style={em.fieldGroup}>
              <ThemedText style={[em.label, { color: theme.muted }]}>STREAMING SERVICES</ThemedText>
              <ThemedText style={{ color: theme.muted, fontSize: 11, marginBottom: 8 }}>
                These filter movies app-wide
              </ThemedText>
              <View style={em.chipWrap}>
                {ALL_PLATFORMS.map(p => {
                  const sel = draftPlatforms.includes(p);
                  return (
                    <TouchableOpacity key={p} onPress={() => togglePlatform(p)}
                      style={[em.chip, { backgroundColor: sel ? theme.primary : theme.background, borderColor: theme.primary }]}>
                      <ThemedText style={{ color: sel ? '#fff' : theme.primary, fontWeight: '600', fontSize: 12 }}>{p}</ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Genres */}
            <View style={em.fieldGroup}>
              <ThemedText style={[em.label, { color: theme.muted }]}>FAVORITE GENRES</ThemedText>
              <View style={em.chipWrap}>
                {ALL_GENRES.map(g => {
                  const sel = draftGenres.includes(g);
                  const color = GENRE_COLORS[g] ?? theme.primary;
                  return (
                    <TouchableOpacity key={g} onPress={() => toggleGenre(g)}
                      style={[em.chip, { backgroundColor: sel ? color : theme.background, borderColor: sel ? color : theme.border }]}>
                      <ThemedText style={{ color: sel ? '#fff' : theme.muted, fontWeight: '600', fontSize: 12 }}>{g}</ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const em = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  box: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '92%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  avatarSection: { alignItems: 'center' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3 },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  fieldGroup: { gap: 8 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  input: { fontSize: 15, paddingVertical: 11, paddingHorizontal: 14, borderWidth: 1, borderRadius: Radius.md },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5 },
});

// ─── Favorite Poster Card ─────────────────────────────────────────────────────

function FavCard({ movie }: { movie: MovieResult }) {
  const theme = useTheme();
  const { removeFavorite } = useUser();
  return (
    <View style={fc.wrap}>
      {movie.poster_path
        ? <Image source={{ uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}` }} style={fc.poster} />
        : <View style={[fc.poster, { backgroundColor: theme.muted }]} />}
      <TouchableOpacity onPress={() => removeFavorite(movie.id)} style={[fc.removeBtn, { backgroundColor: '#EF4444' }]}>
        <Ionicons name="close" size={10} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const fc = StyleSheet.create({
  wrap: { position: 'relative', marginRight: 10 },
  poster: { width: 72, height: 100, borderRadius: 10 },
  removeBtn: { position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
});

// ─── Achievement Badge ────────────────────────────────────────────────────────

function AchievementBadge({ icon, label, unlocked }: { icon: any; label: string; unlocked: boolean }) {
  const theme = useTheme();
  return (
    <View style={[ab.wrap, { opacity: unlocked ? 1 : 0.3 }]}>
      <View style={[ab.circle, { backgroundColor: unlocked ? theme.primary : theme.surface, borderColor: unlocked ? theme.primary : theme.muted }]}>
        <Ionicons name={icon} size={20} color={unlocked ? '#fff' : theme.muted} />
      </View>
      <ThemedText style={[ab.label, { color: unlocked ? theme.textPrimary : theme.muted }]}>{label}</ThemedText>
    </View>
  );
}

const ab = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 6, width: 58 },
  circle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  label: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { name, email, username, genres, platforms, profilePicture, favorites, parties } = useUser();
  const [editVisible, setEditVisible] = useState(false);

  const displayName = name || 'Guest User';
  const displayUsername = username || (email ? '@' + email.split('@')[0] : '@user');
  const displayGenres = genres.length > 0 ? genres : ['Action', 'Sci-Fi', 'Drama'];

  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  // Membership label derived from platforms
  const membershipLabel = platforms.length > 0
    ? platforms.slice(0, 2).join(' & ') + ' Member'
    : 'No services added';

  // Which achievements are unlocked
  const unlockedIds = new Set<string>();
  if (parties.length >= 1) unlockedIds.add('first_party');
  if (parties.some(p => p.invitedFriends.length >= 3)) unlockedIds.add('social');
  if (favorites.length >= 10) unlockedIds.add('cinephile');
  if (platforms.length >= 3) unlockedIds.add('streamer');

  // Recent activity items — always Ionicons, no emojis
  const recentActivity = [
    ...(parties.slice(0, 3).map(p => ({
      icon: 'bonfire-outline' as const,
      text: `Hosted "${p.partyName}"`,
      sub: p.movie.title,
    }))),
    ...(favorites.slice(0, 2).map(f => ({
      icon: 'heart-outline' as const,
      text: `Added to favorites`,
      sub: f.title,
    }))),
    { icon: 'person-add-outline' as const, text: 'Joined WatchClub', sub: 'Welcome!' },
  ].slice(0, 5);

  const menuItems = [
    { label: 'Notifications', icon: 'notifications-outline' as const },
    { label: 'Privacy Settings', icon: 'lock-closed-outline' as const },
    { label: 'Appearance', icon: 'color-palette-outline' as const },
    { label: 'Help & Support', icon: 'help-circle-outline' as const },
    { label: 'Sign Out', icon: 'log-out-outline' as const, danger: true },
  ];

  return (
    <SafeAreaView style={[s.screen, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Top bar ── */}
        <View style={s.topBar}>
          <ThemedText style={[s.topTitle, { color: theme.textPrimary }]}>Profile</ThemedText>
          <TouchableOpacity onPress={() => setEditVisible(true)}
            style={[s.editIconBtn, { backgroundColor: theme.surface }]}>
            <Ionicons name="pencil" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Hero card ── */}
        <View style={[s.heroCard, { backgroundColor: theme.surface }]}>
          {/* Avatar */}
          <TouchableOpacity onPress={() => setEditVisible(true)} style={s.avatarWrap}>
            {profilePicture
              ? <Image source={{ uri: profilePicture }} style={[s.avatar, { borderColor: theme.primary }]} />
              : <View style={[s.avatarFallback, { backgroundColor: theme.primary, borderColor: theme.primary }]}>
                  <ThemedText style={{ color: '#fff', fontSize: 30, fontWeight: '800' }}>{initials}</ThemedText>
                </View>}
            <View style={[s.cameraTag, { backgroundColor: theme.primary }]}>
              <Ionicons name="camera" size={12} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* Name & badge */}
          <ThemedText style={[s.heroName, { color: theme.textPrimary }]}>{displayName}</ThemedText>
          <ThemedText style={[s.heroHandle, { color: theme.muted }]}>{displayUsername}</ThemedText>

          {/* Membership pill */}
          <View style={[s.memberPill, { backgroundColor: theme.background }]}>
            <Ionicons name="tv-outline" size={12} color={theme.primary} />
            <ThemedText style={{ color: theme.primary, fontSize: 12, fontWeight: '600' }}>{membershipLabel}</ThemedText>
          </View>

          {/* Stats row */}
          <View style={[s.statsRow, { borderTopColor: theme.background }]}>
            {[
              { icon: 'bonfire-outline' as const, value: parties.length, label: 'Parties' },
              { icon: 'heart-outline' as const, value: favorites.length, label: 'Favorites' },
              { icon: 'tv-outline' as const, value: platforms.length, label: 'Services' },
            ].map((stat, i, arr) => (
              <React.Fragment key={stat.label}>
                <View style={s.statItem}>
                  <ThemedText style={[s.statValue, { color: theme.primary }]}>{stat.value}</ThemedText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Ionicons name={stat.icon} size={11} color={theme.muted} />
                    <ThemedText style={{ color: theme.muted, fontSize: 11 }}>{stat.label}</ThemedText>
                  </View>
                </View>
                {i < arr.length - 1 && <View style={[s.statDivider, { backgroundColor: theme.background }]} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Favorite Genres ── */}
        <View style={[s.section, { backgroundColor: theme.surface }]}>
          <View style={s.sectionHead}>
            <View style={s.sectionTitleRow}>
              <Ionicons name="film-outline" size={16} color={theme.primary} />
              <ThemedText style={[s.sectionTitle, { color: theme.textPrimary }]}>Favorite Genres</ThemedText>
            </View>
            <TouchableOpacity onPress={() => setEditVisible(true)}>
              <ThemedText style={{ color: theme.primary, fontSize: 13, fontWeight: '600' }}>Edit</ThemedText>
            </TouchableOpacity>
          </View>
          {displayGenres.length === 0 ? (
            <TouchableOpacity onPress={() => setEditVisible(true)} style={[s.emptyRow, { borderColor: theme.border }]}>
              <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
              <ThemedText style={{ color: theme.primary, fontSize: 13 }}>Add your favorite genres</ThemedText>
            </TouchableOpacity>
          ) : (
            <View style={s.genreWrap}>
              {displayGenres.map(g => (
                <View key={g} style={[s.genreChip, { backgroundColor: GENRE_COLORS[g] ?? theme.primary }]}>
                  <ThemedText style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{g}</ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Favorite Movies ── */}
        <View style={[s.section, { backgroundColor: theme.surface }]}>
          <View style={s.sectionHead}>
            <View style={s.sectionTitleRow}>
              <Ionicons name="heart" size={16} color="#EF4444" />
              <ThemedText style={[s.sectionTitle, { color: theme.textPrimary }]}>Favorite Movies</ThemedText>
            </View>
            {favorites.length > 0 && (
              <ThemedText style={{ color: theme.muted, fontSize: 12 }}>{favorites.length} saved</ThemedText>
            )}
          </View>
          {favorites.length === 0 ? (
            <TouchableOpacity onPress={() => router.push('/(tabs)/home')}
              style={[s.emptyRow, { borderColor: theme.border }]}>
              <Ionicons name="heart-outline" size={18} color={theme.muted} />
              <ThemedText style={{ color: theme.muted, fontSize: 13 }}>Search movies on Home to add favorites</ThemedText>
            </TouchableOpacity>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
              {favorites.map(m => <FavCard key={m.id} movie={m} />)}
            </ScrollView>
          )}
        </View>

        {/* ── Achievements ── */}
        <View style={[s.section, { backgroundColor: theme.surface }]}>
          <View style={s.sectionHead}>
            <View style={s.sectionTitleRow}>
              <Ionicons name="trophy-outline" size={16} color={theme.primary} />
              <ThemedText style={[s.sectionTitle, { color: theme.textPrimary }]}>Achievements</ThemedText>
            </View>
            <ThemedText style={{ color: theme.muted, fontSize: 12 }}>
              {unlockedIds.size}/{ACHIEVEMENTS.length}
            </ThemedText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingVertical: 4 }}>
            {ACHIEVEMENTS.map(a => (
              <AchievementBadge key={a.id} icon={a.icon} label={a.label} unlocked={unlockedIds.has(a.id)} />
            ))}
          </ScrollView>
        </View>

        {/* ── Recent Activity ── */}
        <View style={[s.section, { backgroundColor: theme.surface }]}>
          <View style={[s.sectionTitleRow, { marginBottom: 4 }]}>
            <Ionicons name="time-outline" size={16} color={theme.primary} />
            <ThemedText style={[s.sectionTitle, { color: theme.textPrimary }]}>Recent Activity</ThemedText>
          </View>
          {recentActivity.map((item, i) => (
            <View key={i} style={[s.actRow, { borderBottomColor: theme.background, borderBottomWidth: i < recentActivity.length - 1 ? 1 : 0 }]}>
              <View style={[s.actIconWrap, { backgroundColor: theme.background }]}>
                <Ionicons name={item.icon} size={15} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontSize: 13, fontWeight: '500', color: theme.textPrimary }}>{item.text}</ThemedText>
                <ThemedText style={{ fontSize: 11, color: theme.muted, marginTop: 1 }}>{item.sub}</ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* ── Settings Menu ── */}
        <View style={[s.section, { backgroundColor: theme.surface }]}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.danger ? () => router.replace('/auth/signin') : undefined}
              style={[s.menuRow, { borderBottomColor: theme.background, borderBottomWidth: i < menuItems.length - 1 ? 1 : 0 }]}
            >
              <View style={s.menuLeft}>
                <View style={[s.menuIconBox, { backgroundColor: item.danger ? '#FEE2E2' : theme.background }]}>
                  <Ionicons name={item.icon} size={16} color={item.danger ? '#EF4444' : theme.primary} />
                </View>
                <ThemedText style={{ fontSize: 14, fontWeight: '500', color: item.danger ? '#EF4444' : theme.textPrimary }}>
                  {item.label}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.muted} />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <EditProfileModal visible={editVisible} onClose={() => setEditVisible(false)} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: Spacing.three, gap: Spacing.two, paddingBottom: 100 },

  // Top bar
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  topTitle: { fontSize: 22, fontWeight: '700' },
  editIconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

  // Hero card
  heroCard: { borderRadius: Radius.lg, padding: Spacing.four, alignItems: 'center', gap: 8 },
  avatarWrap: { position: 'relative', marginBottom: 4 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3 },
  avatarFallback: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  cameraTag: { position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  heroName: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  heroHandle: { fontSize: 13, textAlign: 'center', marginTop: -2 },
  memberPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.pill, marginTop: 4 },
  statsRow: { flexDirection: 'row', width: '100%', marginTop: 16, paddingTop: 16, borderTopWidth: 1, justifyContent: 'space-around' },
  statItem: { alignItems: 'center', flex: 1, gap: 3 },
  statValue: { fontSize: 22, fontWeight: '700' },
  statDivider: { width: 1, height: 36, alignSelf: 'center' },

  // Sections
  section: { borderRadius: Radius.lg, padding: Spacing.three, gap: Spacing.two },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },

  // Genre chips
  genreWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genreChip: { borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 6 },

  // Empty states
  emptyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderStyle: 'dashed', borderRadius: Radius.md, padding: 14 },

  // Activity
  actRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  actIconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },

  // Menu
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});