import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../services/supabase';
import { useUserData } from '../../hooks/useUserData';

const { width } = Dimensions.get('window');

// Mock data - buni keyinchalik Supabase'dan olamiz
const TOP_PLAYERS = [
  { id: '1', name: 'Alisher', xp: 2540, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alisher', rank: 1, streak: 12 },
  { id: '2', name: 'Sofia', xp: 2100, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', rank: 2, streak: 8 },
  { id: '3', name: 'Jasur', xp: 1950, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasur', rank: 3, streak: 15 },
];

const LEADERBOARD_DATA = [
  { id: '4', name: 'Madina', xp: 1800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Madina', rank: 4 },
  { id: '5', name: 'Leon', xp: 1750, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leon', rank: 5 },
  { id: '6', name: 'Zahro', xp: 1600, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zahro', rank: 6 },
  { id: '7', name: 'Sardor', xp: 1550, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sardor', rank: 7 },
];

export const ConnectScreen = () => {
  const { user } = useUserData();
  const [tab, setTab] = useState('global'); // 'global' | 'friends'
  const scrollY = new Animated.Value(0);

  const renderTopThree = () => (
    <View style={styles.podiumContainer}>
      {/* 2-o'rin */}
      <View style={[styles.podiumItem, { marginTop: 40 }]}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: TOP_PLAYERS[1].avatar }} style={styles.avatarLarge} />
          <View style={[styles.badgeContainer, { backgroundColor: '#C0C0C0' }]}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </View>
        <Text style={styles.podiumName}>{TOP_PLAYERS[1].name}</Text>
        <View style={styles.xpTag}><Text style={styles.xpText}>{TOP_PLAYERS[1].xp} XP</Text></View>
      </View>

      {/* 1-o'rin */}
      <View style={styles.podiumItem}>
        <MaterialCommunityIcons name="crown" size={30} color="#FFD700" style={styles.crown} />
        <View style={[styles.avatarWrapper, { borderColor: '#FFD700', borderWidth: 3 }]}>
          <Image source={{ uri: TOP_PLAYERS[0].avatar }} style={styles.avatarWinner} />
          <View style={[styles.badgeContainer, { backgroundColor: '#FFD700' }]}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </View>
        <Text style={[styles.podiumName, { fontSize: 18, fontWeight: '900' }]}>{TOP_PLAYERS[0].name}</Text>
        <View style={[styles.xpTag, { backgroundColor: '#FFD700' }]}><Text style={[styles.xpText, { color: '#000' }]}>{TOP_PLAYERS[0].xp} XP</Text></View>
      </View>

      {/* 3-o'rin */}
      <View style={[styles.podiumItem, { marginTop: 60 }]}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: TOP_PLAYERS[2].avatar }} style={styles.avatarLarge} />
          <View style={[styles.badgeContainer, { backgroundColor: '#CD7F32' }]}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </View>
        <Text style={styles.podiumName}>{TOP_PLAYERS[2].name}</Text>
        <View style={styles.xpTag}><Text style={styles.xpText}>{TOP_PLAYERS[2].xp} XP</Text></View>
      </View>
    </View>
  );

  const renderLeaderboardItem = ({ item }: any) => (
    <BlurView intensity={20} tint="light" style={styles.listItem}>
      <View style={styles.listLeft}>
        <Text style={styles.rankText}>{item.rank}</Text>
        <Image source={{ uri: item.avatar }} style={styles.avatarSmall} />
        <Text style={styles.listName}>{item.name}</Text>
      </View>
      <View style={styles.listRight}>
        <Text style={styles.listXp}>{item.xp} XP</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E0" />
      </View>
    </BlurView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#1A2B3C', '#2D4A5D']} style={styles.headerBackground}>
        
        {/* Header Tabs */}
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              onPress={() => { setTab('global'); Haptics.selectionAsync(); }}
              style={[styles.tab, tab === 'global' && styles.activeTab]}
            >
              <Text style={[styles.tabText, tab === 'global' && styles.activeTabText]}>Global</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => { setTab('friends'); Haptics.selectionAsync(); }}
              style={[styles.tab, tab === 'friends' && styles.activeTab]}
            >
              <Text style={[styles.tabText, tab === 'friends' && styles.activeTabText]}>Friends</Text>
            </TouchableOpacity>
          </View>

          {renderTopThree()}
        </SafeAreaView>
      </LinearGradient>

      {/* List Section */}
      <View style={styles.listWrapper}>
        <FlatList
          data={LEADERBOARD_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderLeaderboardItem}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Top Challengers</Text>
              <TouchableOpacity style={styles.inviteButton}>
                <MaterialCommunityIcons name="plus" size={18} color="white" />
                <Text style={styles.inviteText}>Invite</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      {/* Fixed User Ranking at Bottom */}
      <BlurView intensity={90} tint="dark" style={styles.currentUserBar}>
        <View style={styles.listLeft}>
          <Text style={[styles.rankText, { color: '#6BCF7F' }]}>124</Text>
          <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.child_name}` }} style={styles.avatarSmall} />
          <Text style={[styles.listName, { color: 'white' }]}>You ({user?.child_name})</Text>
        </View>
        <Text style={[styles.listXp, { color: '#6BCF7F' }]}>{user?.total_xp || 0} XP</Text>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerBackground: { height: 450, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' },
  headerContent: { flex: 1, paddingTop: 40 },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    marginHorizontal: 50, 
    borderRadius: 20, 
    padding: 4 
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 16 },
  activeTab: { backgroundColor: '#6BCF7F' },
  tabText: { color: 'rgba(255,255,255,0.6)', fontWeight: '700' },
  activeTabText: { color: 'white' },
  
  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginTop: 30 },
  podiumItem: { alignItems: 'center', width: width / 3.5 },
  avatarWrapper: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#E2E8F0', padding: 2 },
  avatarLarge: { width: '100%', height: '100%', borderRadius: 35 },
  avatarWinner: { width: '100%', height: '100%', borderRadius: 35 },
  crown: { marginBottom: -10, zIndex: 1 },
  badgeContainer: { 
    position: 'absolute', bottom: -5, right: -5, 
    width: 24, height: 24, borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' 
  },
  badgeText: { color: 'white', fontSize: 12, fontWeight: '900' },
  podiumName: { color: 'white', marginTop: 12, fontWeight: '700', fontSize: 14 },
  xpTag: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 6 },
  xpText: { color: 'white', fontSize: 12, fontWeight: '800' },

  listWrapper: { flex: 1, marginTop: -40, backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 20 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 25 },
  listTitle: { fontSize: 20, fontWeight: '800', color: '#1A365D' },
  inviteButton: { flexDirection: 'row', backgroundColor: '#6BCF7F', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  inviteText: { color: 'white', fontWeight: '700', marginLeft: 4 },
  
  listItem: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    padding: 15, backgroundColor: '#F8FAFC', borderRadius: 20, marginBottom: 12,
    borderWidth: 1, borderColor: '#EDF2F7'
  },
  listLeft: { flexDirection: 'row', alignItems: 'center' },
  rankText: { fontSize: 16, fontWeight: '800', color: '#718096', width: 30 },
  avatarSmall: { width: 45, height: 45, borderRadius: 22, marginRight: 15 },
  listName: { fontSize: 16, fontWeight: '700', color: '#2D3748' },
  listRight: { flexDirection: 'row', alignItems: 'center' },
  listXp: { fontSize: 15, fontWeight: '800', color: '#4A5568', marginRight: 10 },

  currentUserBar: { 
    position: 'absolute', bottom: 90, left: 16, right: 16, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    padding: 15, borderRadius: 25, overflow: 'hidden', elevation: 10
  }
});
