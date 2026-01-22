import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../services/supabase';
import { useUserData } from '../../hooks/useUserData';

const { width } = Dimensions.get('window');

// 1. Leaderboard uchun soxta ma'lumotlar (Buni keyin Supabase'dan real-time tortamiz)
const TOP_PLAYERS = [
  { id: '1', name: 'Alisher', xp: 2540, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alisher', rank: 1, frame: '#FFD700', badge: 'Math King' },
  { id: '2', name: 'Sofia', xp: 2100, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', rank: 2, frame: '#C0C0C0', badge: 'Explorer' },
  { id: '3', name: 'Jasur', xp: 1950, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasur', rank: 3, frame: '#CD7F32', badge: 'Quick Learner' },
];

const LEADERBOARD_LIST = [
  { id: '4', name: 'Madina', xp: 1800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Madina', rank: 4, frame: 'transparent' },
  { id: '5', name: 'Leon', xp: 1750, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leon', rank: 5, frame: 'transparent' },
  { id: '6', name: 'Zahro', xp: 1600, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zahro', rank: 6, frame: '#00F3FF' }, // Neon frame egasi
  { id: '7', name: 'Sardor', xp: 1550, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sardor', rank: 7, frame: 'transparent' },
  { id: '8', name: 'Emina', xp: 1400, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emina', rank: 8, frame: 'transparent' },
];

export const ConnectScreen = () => {
  const { user } = useUserData();
  const [activeTab, setActiveTab] = useState('global');
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header animatsiyasi uchun
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const renderTopThree = () => (
    <View style={styles.podiumContainer}>
      {/* 2-O'rin */}
      <View style={[styles.podiumItem, { marginTop: 40 }]}>
        <View style={[styles.avatarWrapper, { borderColor: '#C0C0C0' }]}>
          <Image source={{ uri: TOP_PLAYERS[1].avatar }} style={styles.avatarPodium} />
          <View style={[styles.rankBadge, { backgroundColor: '#C0C0C0' }]}>
            <Text style={styles.rankBadgeText}>2</Text>
          </View>
        </View>
        <Text style={styles.podiumName}>{TOP_PLAYERS[1].name}</Text>
        <View style={styles.xpPill}><Text style={styles.xpPillText}>{TOP_PLAYERS[1].xp} XP</Text></View>
      </View>

      {/* 1-O'rin (G'olib) */}
      <View style={styles.podiumItem}>
        <MaterialCommunityIcons name="crown" size={34} color="#FFD700" style={styles.crownIcon} />
        <View style={[styles.avatarWrapper, { borderColor: '#FFD700', width: 90, height: 90, borderRadius: 45 }]}>
          <Image source={{ uri: TOP_PLAYERS[0].avatar }} style={styles.avatarPodium} />
          <View style={[styles.rankBadge, { backgroundColor: '#FFD700', width: 28, height: 28 }]}>
            <Text style={[styles.rankBadgeText, { color: '#000' }]}>1</Text>
          </View>
        </View>
        <Text style={[styles.podiumName, { fontSize: 18 }]}>{TOP_PLAYERS[0].name}</Text>
        <View style={[styles.xpPill, { backgroundColor: '#FFD700' }]}>
          <Text style={[styles.xpPillText, { color: '#1A2B3C' }]}>{TOP_PLAYERS[0].xp} XP</Text>
        </View>
      </View>

      {/* 3-O'rin */}
      <View style={[styles.podiumItem, { marginTop: 60 }]}>
        <View style={[styles.avatarWrapper, { borderColor: '#CD7F32' }]}>
          <Image source={{ uri: TOP_PLAYERS[2].avatar }} style={styles.avatarPodium} />
          <View style={[styles.rankBadge, { backgroundColor: '#CD7F32' }]}>
            <Text style={styles.rankBadgeText}>3</Text>
          </View>
        </View>
        <Text style={styles.podiumName}>{TOP_PLAYERS[2].name}</Text>
        <View style={styles.xpPill}><Text style={styles.xpPillText}>{TOP_PLAYERS[2].xp} XP</Text></View>
      </View>
    </View>
  );

  const renderLeaderboardItem = ({ item }: any) => (
    <Animated.View style={styles.listCard}>
      <View style={styles.listLeft}>
        <Text style={styles.rankNumber}>{item.rank}</Text>
        <View style={[styles.listAvatarFrame, { borderColor: item.frame || 'transparent' }]}>
          <Image source={{ uri: item.avatar }} style={styles.avatarSmall} />
        </View>
        <View>
          <Text style={styles.listName}>{item.name}</Text>
          {item.badge && (
            <View style={styles.badgeContainer}>
              <MaterialCommunityIcons name="shield-check" size={12} color="#6BCF7F" />
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.listRight}>
        <Text style={styles.listXpText}>{item.xp}</Text>
        <Text style={styles.listXpLabel}>XP</Text>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.topSection}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.tabBar}>
            <TouchableOpacity 
              onPress={() => { setActiveTab('global'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[styles.tabButton, activeTab === 'global' && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === 'global' && styles.tabTextActive]}>Global</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => { setActiveTab('friends'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[styles.tabButton, activeTab === 'friends' && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>Friends</Text>
            </TouchableOpacity>
          </View>

          {renderTopThree()}
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.bottomSection}>
        <Animated.FlatList
          data={LEADERBOARD_LIST}
          keyExtractor={(item) => item.id}
          renderItem={renderLeaderboardItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>All Time Challengers</Text>
              <TouchableOpacity style={styles.filterBtn}>
                <MaterialCommunityIcons name="filter-variant" size={20} color="#718096" />
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      {/* User's Fixed Position Bar */}
      <BlurView intensity={80} tint="dark" style={styles.userBar}>
        <View style={styles.listLeft}>
          <Text style={[styles.rankNumber, { color: '#6BCF7F' }]}>128</Text>
          <View style={[styles.listAvatarFrame, { borderColor: user?.active_frame_color || '#6BCF7F' }]}>
            <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.child_name}` }} style={styles.avatarSmall} />
          </View>
          <Text style={[styles.listName, { color: '#FFF' }]}>{user?.child_name || 'You'}</Text>
        </View>
        <View style={styles.listRight}>
          <Text style={[styles.listXpText, { color: '#6BCF7F' }]}>{user?.total_xp || 0}</Text>
          <Text style={[styles.listXpLabel, { color: '#A0AEC0' }]}>XP</Text>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topSection: { height: 420, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  tabBar: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 60, borderRadius: 20, padding: 4, marginTop: 10 },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 16 },
  tabActive: { backgroundColor: '#FFF' },
  tabText: { color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 14 },
  tabTextActive: { color: '#1e3c72' },
  
  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginTop: 25 },
  podiumItem: { alignItems: 'center', width: width * 0.28 },
  avatarWrapper: { width: 75, height: 75, borderRadius: 37.5, borderWidth: 3, padding: 3, backgroundColor: 'rgba(255,255,255,0.1)' },
  avatarPodium: { width: '100%', height: '100%', borderRadius: 40 },
  crownIcon: { marginBottom: -10, zIndex: 1 },
  rankBadge: { position: 'absolute', bottom: -5, right: -5, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  rankBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  podiumName: { color: '#FFF', fontWeight: '800', marginTop: 12, fontSize: 14 },
  xpPill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 6 },
  xpPillText: { color: '#FFF', fontSize: 11, fontWeight: '900' },

  bottomSection: { flex: 1, marginTop: -30, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40 },
  listContent: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 120 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  listTitle: { fontSize: 20, fontWeight: '900', color: '#2D3748' },
  filterBtn: { padding: 8, backgroundColor: '#F7FAFC', borderRadius: 10 },

  listCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 15, borderRadius: 22, marginBottom: 12, borderWidth: 1, borderColor: '#EDF2F7' },
  listLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rankNumber: { fontSize: 16, fontWeight: '900', color: '#A0AEC0', width: 35 },
  listAvatarFrame: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, padding: 2, marginRight: 15 },
  avatarSmall: { width: '100%', height: '100%', borderRadius: 25 },
  listName: { fontSize: 16, fontWeight: '700', color: '#2D3748' },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  badgeText: { fontSize: 11, color: '#6BCF7F', fontWeight: '700', marginLeft: 4 },
  listRight: { alignItems: 'flex-end' },
  listXpText: { fontSize: 17, fontWeight: '900', color: '#2D3748' },
  listXpLabel: { fontSize: 10, fontWeight: '700', color: '#A0AEC0' },

  userBar: { position: 'absolute', bottom: 100, left: 15, right: 15, borderRadius: 25, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', elevation: 10 }
});
