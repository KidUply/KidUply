import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export const LearnScreen = () => {
  const [childName, setChildName] = useState('Emma');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const profileData = await AsyncStorage.getItem('user_profile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        setChildName(profile.child_name);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const subjects = [
    { id: 'math', name: 'Math', icon: 'calculator', color: '#6BCF7F', progress: 5 },
    { id: 'reading', name: 'Reading', icon: 'book-open-page-variant', color: '#F59E0B', progress: 12 },
    { id: 'logic', name: 'Logic', icon: 'puzzle', color: '#8B5CF6', progress: 8 },
    { id: 'science', name: 'Science', icon: 'flask', color: '#EF4444', progress: 3 },
    { id: 'memory', name: 'Memory', icon: 'brain', color: '#3B82F6', progress: 0 },
    { id: 'creativity', name: 'Creativity', icon: 'palette', color: '#EC4899', progress: 0 },
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
            <View style={styles.headerLeft}>
              <View style={styles.avatarContainer}>
                <MaterialCommunityIcons name="account-circle" size={40} color="#6BCF7F" />
              </View>
              <View>
                <Text style={styles.greeting}>Hi, {childName}!</Text>
                <Text style={styles.subGreeting}>Ready to learn?</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <MaterialCommunityIcons name="bell-outline" size={24} color="#2D3748" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Today's Progress: {progress}%</Text>
              <MaterialCommunityIcons name="trophy" size={24} color="#F59E0B" />
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                <Text style={styles.statText}>0</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="fire" size={16} color="#EF4444" />
                <Text style={styles.statText}>0</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="trophy-variant" size={16} color="#6BCF7F" />
                <Text style={styles.statText}>0</Text>
              </View>
            </View>
          </View>

          {/* Subjects Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subjects</Text>
            <TouchableOpacity>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#6BCF7F" />
            </TouchableOpacity>
          </View>

          <View style={styles.subjectsGrid}>
            {subjects.map((subject, index) => (
              <TouchableOpacity
                key={subject.id}
                style={styles.subjectCard}
                activeOpacity={0.8}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              >
                <View style={[styles.subjectIcon, { backgroundColor: `${subject.color}20` }]}>
                  <MaterialCommunityIcons
                    name={subject.icon as any}
                    size={32}
                    color={subject.color}
                  />
                </View>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <View style={styles.subjectProgressBar}>
                  <View
                    style={[
                      styles.subjectProgress,
                      { width: `${(subject.progress / 30) * 100}%`, backgroundColor: subject.color },
                    ]}
                  />
                </View>
                <Text style={styles.subjectLevel}>
                  {subject.progress > 0 ? `Level ${subject.progress}` : 'Start'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Continue Learning */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
          </View>

          <View style={styles.continueCard}>
            <View style={styles.continueContent}>
              <View style={styles.continueIconBg}>
                <MaterialCommunityIcons name="play-circle" size={32} color="#6BCF7F" />
              </View>
              <View style={styles.continueText}>
                <Text style={styles.continueTitle}>Fractions for Beginners</Text>
                <Text style={styles.continueSubtitle}>Piecing up math models</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.watchButton}>
              <MaterialCommunityIcons name="play" size={20} color="#FFFFFF" />
              <Text style={styles.watchButtonText}>Watch Video</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing for Tab Bar */}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  subGreeting: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6BCF7F',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  subjectCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  subjectIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  subjectProgressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  subjectProgress: {
    height: '100%',
    borderRadius: 2,
  },
  subjectLevel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  continueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  continueIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    flex: 1,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  continueSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6BCF7F',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  watchButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
