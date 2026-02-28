import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useApp } from '../context/AppContext';

// Rasmdagi fan kartalari
const SUBJECTS = [
  {
    key: 'math', label: 'Math',
    emoji: '🔢', bg: Colors.mathGreen,
    illustEmoji: '🌳🔢',
    lockedFor: null,
  },
  {
    key: 'nature', label: 'Nature',
    emoji: '🌿', bg: Colors.natureMint,
    illustEmoji: '🌿🍃',
    lockedFor: 'premium',
  },
  {
    key: 'language', label: 'Language',
    emoji: '📖', bg: Colors.languageYellow,
    illustEmoji: '✏️📝',
    lockedFor: null,
  },
  {
    key: 'lifeSkills', label: 'Life Skills',
    emoji: '🌟', bg: Colors.lifeOrange,
    illustEmoji: '🎯💡',
    lockedFor: 'premium',
  },
];

export default function LearnScreen({ navigation }) {
  const { activeChild: child, currentPlan, getDailyPercent } = useApp();
  if (!child) return null;

  const dailyPct = getDailyPercent();
  const isLocked = (subj) => subj.lockedFor && currentPlan === 'free';

  return (
    <View style={s.bg}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgMain} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          <View style={s.logoRow}>
            <View style={s.logoCircle}>
              <Text style={s.logoEmoji}>🐢</Text>
            </View>
            <Text style={s.logoTxt}>
              <Text style={s.logoK}>Kid</Text>
              <Text style={s.logoU}>Uply</Text>
            </Text>
            <Text style={s.headerStar}>⭐</Text>
          </View>
          <View style={s.headerRight}>
            <TouchableOpacity style={s.avatarBtn}>
              <Text style={s.avatarEmoji}>{child.avatar}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.coinBtn}>
              <Text style={s.coinEmoji}>🪙</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── GREETING ── */}
        <View style={s.greetBox}>
          <View>
            <Text style={s.greetHi}>Hi, {child.name}!</Text>
            <Text style={s.greetSub}>Ready to learn?</Text>
          </View>
          <View style={s.coinBox}>
            <Text style={s.coinBoxEmoji}>🪙</Text>
            <Text style={s.coinBoxVal}>{child.coins}</Text>
          </View>
        </View>

        {/* ── DAILY PROGRESS ── */}
        <View style={s.progressCard}>
          <View style={s.progressTop}>
            <Text style={s.progressLabel}>Today's Progress: {dailyPct}%</Text>
            <Text style={s.progressStars}>⭐⭐⭐</Text>
            <View style={s.progressCircle}>
              <Text style={s.progressCircleEmoji}>🔄</Text>
            </View>
          </View>
          <View style={s.progressBarBg}>
            <View style={[s.progressBarFill, { width: `${Math.max(4, dailyPct)}%` }]} />
          </View>
          {dailyPct < 100 && (
            <Text style={s.progressHint}>
              📹 {child.dailyVideosWatched}/{child.dailyGoalVideos} video  •  🎮 {child.dailyGamesCompleted}/{child.dailyGoalGames} o'yin  →  100% = +50🪙
            </Text>
          )}
          {dailyPct >= 100 && (
            <Text style={[s.progressHint, { color: Colors.primaryDark, fontWeight: '700' }]}>
              🎉 Kunlik reja bajarildi! +50🪙 +30⭐
            </Text>
          )}
        </View>

        {/* ── SUBJECTS ── */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Subjects</Text>
          <TouchableOpacity>
            <Text style={s.seeAll}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* 2x2 grid — rasmdek */}
        <View style={s.grid}>
          {/* Qator 1: Math + Nature */}
          <View style={s.gridRow}>
            {SUBJECTS.slice(0, 2).map(subj => {
              const locked = isLocked(subj);
              const sData = child.subjects[subj.key];
              return (
                <TouchableOpacity
                  key={subj.key}
                  style={[s.subjCard, { backgroundColor: subj.bg }]}
                  onPress={() => locked
                    ? navigation.navigate('Plans')
                    : navigation.navigate('SubjectBlocks', { subject: subj.key, label: subj.label })}
                  activeOpacity={0.85}
                >
                  {locked && (
                    <View style={s.lockOverlay}>
                      <Text style={s.lockIcon}>🔒</Text>
                    </View>
                  )}
                  <Text style={s.subjIllust}>{subj.illustEmoji}</Text>
                  <Text style={s.subjLabel}>{subj.label}</Text>
                  <View style={s.subjProgressBg}>
                    <View style={[s.subjProgressFill, {
                      width: `${Math.max(4, Math.round(((sData.unlockedBlocks - 1) / 100) * 100))}%`
                    }]} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Qator 2: Language (keng) + Life Skills */}
          <View style={s.gridRow}>
            <TouchableOpacity
              style={[s.subjCardWide, { backgroundColor: Colors.languageYellow }]}
              onPress={() => navigation.navigate('SubjectBlocks', { subject: 'language', label: 'Language' })}
              activeOpacity={0.85}
            >
              <Text style={s.subjIllust}>✏️📖</Text>
              <Text style={s.subjLabel}>Language</Text>
              <View style={s.subjProgressBg}>
                <View style={[s.subjProgressFill, { width: `${Math.max(4, Math.round(((child.subjects.language.unlockedBlocks - 1) / 100) * 100))}%` }]} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.subjCardSmall, { backgroundColor: Colors.lifeOrange }]}
              onPress={() => currentPlan === 'free'
                ? navigation.navigate('Plans')
                : navigation.navigate('SubjectBlocks', { subject: 'lifeSkills', label: 'Life Skills' })}
              activeOpacity={0.85}
            >
              {currentPlan === 'free' && <View style={s.lockOverlay}><Text style={s.lockIcon}>🔒</Text></View>}
              <Text style={s.subjIllust}>🎯💡</Text>
              <Text style={s.subjLabel}>Life Skills</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sieve row rasmdek */}
        <View style={s.filterRow}>
          <View style={s.filterProgress}>
            <View style={s.filterBar}>
              <View style={[s.filterBarFill, { width: '30%' }]} />
            </View>
          </View>
          <Text style={s.filterSieve}>{'>'}</Text>
          <Text style={s.filterLabel}>Sieve ∧ {'>'}</Text>
        </View>

        {/* ── CONTINUE LEARNING ── */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Continue Learning</Text>
          <View style={s.continueBadges}>
            <Text style={s.continueBadge}>📖</Text>
            <Text style={s.continueBadge}>🎯</Text>
            <Text style={s.continueBadge}>🌟</Text>
            <Text style={s.continueBadge}>🎮</Text>
          </View>
        </View>

        <View style={s.continueCard}>
          <View style={s.continueThumbnail}>
            <Text style={s.continueThumbnailEmoji}>🔢</Text>
          </View>
          <View style={s.continueInfo}>
            <Text style={s.continueTitle}>
              <Text style={s.continueBold}>Fractions</Text> for Beginners
            </Text>
            <Text style={s.continueSub}>Pending for me! Videls</Text>
            <View style={s.continueBtns}>
              <TouchableOpacity
                style={s.watchBtn}
                onPress={() => navigation.navigate('SubjectBlocks', { subject: 'math', label: 'Math' })}
              >
                <Text style={s.watchBtnIcon}>▶</Text>
                <Text style={s.watchBtnTxt}>Watch Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.startSmallBtn}>
                <Text style={s.startSmallTxt}>Start Small</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {currentPlan === 'free' && (
          <TouchableOpacity style={s.upgradeBanner} onPress={() => navigation.navigate('Plans')}>
            <Text style={s.upgradeBannerEmoji}>⭐</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.upgradeBannerTitle}>Premium ga o'ting!</Text>
              <Text style={s.upgradeBannerSub}>4 fan + 50 blok + IQ tahlil</Text>
            </View>
            <Text style={s.upgradeBannerArrow}>›</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bgMain },
  scroll: { paddingHorizontal: 16 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 52, paddingBottom: 4,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  logoEmoji: { fontSize: 18 },
  logoTxt: { fontSize: 20 },
  logoK: { fontWeight: '800', color: Colors.textDark },
  logoU: { fontWeight: '800', color: Colors.primary },
  headerStar: { fontSize: 18, marginLeft: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatarBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.bgCard, justifyContent: 'center', alignItems: 'center',
    ...Shadows.sm,
  },
  avatarEmoji: { fontSize: 22 },
  coinBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.bgCard, justifyContent: 'center', alignItems: 'center',
    ...Shadows.sm,
  },
  coinEmoji: { fontSize: 20 },

  // Greeting
  greetBox: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 12, marginBottom: 12,
  },
  greetHi: { fontSize: 28, fontWeight: '800', color: Colors.textDark },
  greetSub: { fontSize: 15, color: Colors.textLight, marginTop: 1 },
  coinBox: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.goldLight, borderRadius: BorderRadius.round,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  coinBoxEmoji: { fontSize: 16 },
  coinBoxVal: { fontSize: 15, fontWeight: '800', color: Colors.goldDark },

  // Progress
  progressCard: {
    backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg,
    padding: 14, ...Shadows.sm, marginBottom: 16,
  },
  progressTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  progressLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: Colors.textMid },
  progressStars: { fontSize: 13, marginRight: 6 },
  progressCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primaryPale, justifyContent: 'center', alignItems: 'center',
  },
  progressCircleEmoji: { fontSize: 14 },
  progressBarBg: {
    height: 12, backgroundColor: Colors.progressBg,
    borderRadius: 6, overflow: 'hidden',
  },
  progressBarFill: {
    height: 12, backgroundColor: Colors.progressGreen,
    borderRadius: 6,
  },
  progressHint: { fontSize: 11, color: Colors.textLight, marginTop: 6 },

  // Section
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  seeAll: { fontSize: 18, color: Colors.textMid, fontWeight: '600' },

  // Subjects grid
  grid: { gap: 10, marginBottom: 8 },
  gridRow: { flexDirection: 'row', gap: 10 },

  subjCard: {
    flex: 1, borderRadius: BorderRadius.xl, padding: 14,
    minHeight: 110, justifyContent: 'flex-end',
    position: 'relative', overflow: 'hidden',
    ...Shadows.sm,
  },
  subjCardWide: {
    flex: 1.5, borderRadius: BorderRadius.xl, padding: 14,
    minHeight: 90, justifyContent: 'flex-end',
    position: 'relative', overflow: 'hidden',
    ...Shadows.sm,
  },
  subjCardSmall: {
    flex: 1, borderRadius: BorderRadius.xl, padding: 14,
    minHeight: 90, justifyContent: 'flex-end',
    position: 'relative', overflow: 'hidden',
    ...Shadows.sm,
  },
  lockOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.32)', borderRadius: BorderRadius.xl,
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  lockIcon: { fontSize: 26 },
  subjIllust: { fontSize: 28, marginBottom: 4 },
  subjLabel: { fontSize: 15, fontWeight: '800', color: Colors.textDark, marginBottom: 8 },
  subjProgressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 3 },
  subjProgressFill: { height: 6, backgroundColor: Colors.primaryDark, borderRadius: 3 },

  // Filter row
  filterRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 16, paddingHorizontal: 2,
  },
  filterProgress: { flex: 1 },
  filterBar: {
    height: 6, backgroundColor: Colors.progressBg,
    borderRadius: 3, overflow: 'hidden',
  },
  filterBarFill: { height: 6, backgroundColor: Colors.progressGreen, borderRadius: 3 },
  filterSieve: { fontSize: 16, color: Colors.textLight },
  filterLabel: { fontSize: 12, color: Colors.textLight },

  // Continue
  continueBadges: { flexDirection: 'row', gap: 2 },
  continueBadge: { fontSize: 14 },
  continueCard: {
    flexDirection: 'row', backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl, padding: 14,
    ...Shadows.card, marginBottom: 14, gap: 12, alignItems: 'center',
  },
  continueThumbnail: {
    width: 68, height: 68, backgroundColor: Colors.bgMuted,
    borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center',
  },
  continueThumbnailEmoji: { fontSize: 34 },
  continueInfo: { flex: 1 },
  continueTitle: { fontSize: 14, color: Colors.textDark },
  continueBold: { fontWeight: '800' },
  continueSub: { fontSize: 11, color: Colors.textLight, marginTop: 2, marginBottom: 8 },
  continueBtns: { flexDirection: 'row', gap: 8 },
  watchBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.round,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  watchBtnIcon: { color: Colors.white, fontSize: 11 },
  watchBtnTxt: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  startSmallBtn: {
    borderWidth: 1.5, borderColor: Colors.primary,
    borderRadius: BorderRadius.round,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  startSmallTxt: { color: Colors.primary, fontSize: 12, fontWeight: '700' },

  // Upgrade
  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl,
    padding: 14, gap: 10,
  },
  upgradeBannerEmoji: { fontSize: 24 },
  upgradeBannerTitle: { fontSize: 14, fontWeight: '800', color: Colors.white },
  upgradeBannerSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  upgradeBannerArrow: { fontSize: 22, color: Colors.white, marginLeft: 'auto' },
});
