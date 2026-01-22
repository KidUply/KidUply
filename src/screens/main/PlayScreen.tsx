import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export const PlayScreen = () => {
  const games = [
    {
      id: '1',
      title: 'Pizza Adventure',
      subtitle: 'Math Fraction Fun',
      icon: 'pizza',
      progress: 89,
      coins: 622,
      color: '#EF4444',
    },
    {
      id: '2',
      title: 'Math Quest',
      subtitle: 'Defeat Gargoyles from mystical console',
      icon: 'sword-cross',
      progress: 23,
      coins: 150,
      color: '#F59E0B',
    },
    {
      id: '3',
      title: 'Spelling Challenge',
      subtitle: 'Logic Puzzler Race',
      icon: 'alphabetical',
      progress: 22,
      coins: 89,
      color: '#8B5CF6',
    },
  ];

  return (
    <LinearGradient
      colors={['#E8F5E9', '#F1F8F4', '#FFFFFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hi, Emma!</Text>
              <Text style={styles.subGreeting}>Ready to play?</Text>
            </View>
            <View style={styles.xpBadge}>
              <MaterialCommunityIcons name="trophy" size={20} color="#F59E0B" />
              <Text style={styles.xpText}>100%</Text>
            </View>
          </View>

          {/* Game Recommendations */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Game Recommendations</Text>
            <View style={styles.coinsBadge}>
              <MaterialCommunityIcons name="star-circle" size={16} color="#F59E0B" />
              <Text style={styles.coinsText}>Zon SHA.AI</Text>
            </View>
          </View>

          {games.map((game, index) => (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              activeOpacity={0.8}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            >
              <View style={styles.gameHeader}>
                <View style={styles.gameIconContainer}>
                  <View style={[styles.gameIconBg, { backgroundColor: `${game.color}20` }]}>
                    <MaterialCommunityIcons
                      name={game.icon as any}
                      size={32}
                      color={game.color}
                    />
                  </View>
                  <View style={styles.gameTitleContainer}>
                    <Text style={styles.gameTitle}>{game.title}</Text>
                    <Text style={styles.gameSubtitle}>{game.subtitle}</Text>
                  </View>
                </View>
                <View style={styles.coinsContainer}>
                  <MaterialCommunityIcons name="circle-multiple" size={20} color="#F59E0B" />
                  <Text style={styles.coinsValue}>{game.coins} Coins</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressInfo}>
                  <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.progressText}>{game.progress}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${game.progress}%` }]} />
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Adaptive Option */}
          <View style={styles.adaptiveCard}>
            <View style={styles.adaptiveHeader}>
              <View style={styles.adaptiveIconBg}>
                <MaterialCommunityIcons name="robot" size={28} color="#3B82F6" />
              </View>
              <View style={styles.adaptiveInfo}>
                <Text style={styles.adaptiveTitle}>Adaptive Option</Text>
                <Text style={styles.adaptiveSubtitle}>
                  Select AI entities: Hades 10 Roaches Greeks haunting as 3 frantiloptergobizoid vobminity.
                </Text>
              </View>
              <View style={styles.adaptiveBadge}>
                <MaterialCommunityIcons name="trophy-variant" size={16} color="#F59E0B" />
                <Text style={styles.adaptiveBadgeText}>100</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  subGreeting: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3748',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gameIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  gameIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTitleContainer: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  coinsValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  progressContainer: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3748',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6BCF7F',
    borderRadius: 3,
  },
  adaptiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  adaptiveHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  adaptiveIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adaptiveInfo: {
    flex: 1,
  },
            {/* Adaptive Option */}
          <View style={styles.adaptiveCard}>
            <View style={styles.adaptiveHeader}>
              <View style={styles.adaptiveIconBg}>
                <MaterialCommunityIcons name="robot" size={28} color="#3B82F6" />
              </View>
              <View style={styles.adaptiveInfo}>
                <Text style={styles.adaptiveTitle}>Adaptive Option</Text>
                <Text style={styles.adaptiveSubtitle}>
                  Select AI entities: Hades 10 Roaches Greeks haunting as 3 frantiloptergobizoid vobminity.
                </Text>
              </View>
              {/* MANA SHU YERDAN MEN BERGAN KOD BOSHLANADI */}
              <View style={styles.adaptiveBadge}>
                <MaterialCommunityIcons name="trophy-variant" size={16} color="#F59E0B" />
                <Text style={styles.adaptiveBadgeText}>100</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

