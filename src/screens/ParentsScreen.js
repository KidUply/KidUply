import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useApp } from '../context/AppContext';
import ParentsPinScreen from './ParentsPinScreen';
import AddChildModal from '../components/AddChildModal';

const { width } = Dimensions.get('window');

// Mini bar chart component
function BarChart({ data, title }) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  const BAR_COLORS = [Colors.sky, Colors.primary, Colors.coral, Colors.purple, Colors.gold];
  return (
    <View style={chart.wrap}>
      {title && <Text style={chart.title}>{title}</Text>}
      <View style={chart.bars}>
        {entries.map(([label, val], i) => (
          <View key={label} style={chart.col}>
            <Text style={chart.val}>{val}%</Text>
            <View style={chart.barBg}>
              <View style={[chart.barFill, {
                height: `${(val / max) * 100}%`,
                backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
              }]} />
            </View>
            <Text style={chart.label}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// IQ Line chart (simple)
function IQChart({ iqHistory, currentIq }) {
  if (!iqHistory || iqHistory.length < 2) return null;
  const min = Math.min(...iqHistory) - 5;
  const max = Math.max(...iqHistory) + 5;
  const range = max - min || 10;
  const chartW = width - Spacing.md * 2 - Spacing.md * 2 - 32;
  const chartH = 80;
  const pts = iqHistory.map((v, i) => ({
    x: (i / (iqHistory.length - 1)) * chartW,
    y: chartH - ((v - min) / range) * chartH,
    v,
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <View style={iq.wrap}>
      <View style={iq.header}>
        <Text style={iq.title}>🧠 IQ Darajasi</Text>
        <View style={iq.badge}>
          <Text style={iq.badgeTxt}>{currentIq}</Text>
        </View>
      </View>
      {/* Simple SVG-like chart using Views */}
      <View style={[iq.chart, { height: chartH + 20 }]}>
        {pts.map((p, i) => {
          if (i === 0) return null;
          const prev = pts[i - 1];
          const dx = p.x - prev.x;
          const dy = p.y - prev.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: prev.x,
                top: prev.y,
                width: len,
                height: 3,
                backgroundColor: Colors.primary,
                borderRadius: 1.5,
                transform: [{ rotate: `${angle}deg` }, { translateY: -1.5 }],
                transformOrigin: '0 50%',
              }}
            />
          );
        })}
        {pts.map((p, i) => (
          <View key={`dot-${i}`} style={[iq.dot, {
            left: p.x - 5, top: p.y - 5,
            backgroundColor: i === pts.length - 1 ? Colors.primary : Colors.primaryLight,
          }]}>
            {i === pts.length - 1 && <View style={iq.dotPulse} />}
          </View>
        ))}
      </View>
      <View style={iq.legend}>
        <Text style={iq.legendTxt}>7 kunlik IQ o'sishi</Text>
        <Text style={[iq.legendTxt, { color: Colors.primary, fontWeight: '700' }]}>
          {iqHistory[iqHistory.length - 1] > iqHistory[0] ? '↑ O\'smoqda' : '→ Barqaror'}
        </Text>
      </View>
    </View>
  );
}

export default function ParentsScreen({ navigation }) {
  const { activeChild, parentName, currentPlan, upgradePlan, childList, activeChildIndex, setActiveChildIndex, addChild } = useApp();
  const [unlocked, setUnlocked] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);

  if (!unlocked) {
    return <ParentsPinScreen onSuccess={() => setUnlocked(true)} />;
  }

  const child = activeChild;
  if (!child) return null;

  const isPremium = currentPlan !== 'free';
  const topSubject = Object.entries(child.weeklyProgress).sort((a, b) => b[1] - a[1])[0];

  const iqLevel = child.iq < 90 ? { label: 'Boshlang\'ich', color: Colors.sky, emoji: '🌱' }
    : child.iq < 100 ? { label: 'O\'rtacha', color: Colors.gold, emoji: '⭐' }
    : child.iq < 115 ? { label: 'Yuqori', color: Colors.primary, emoji: '🚀' }
    : { label: 'Iste\'dodli', color: Colors.purple, emoji: '🧠' };

  return (
    <View style={styles.bg}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Ota-ona paneli</Text>
          <Text style={styles.headerTitle}>Salom, {parentName}! 👋</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.planBadge, { backgroundColor: currentPlan === 'gold' ? Colors.goldLight : currentPlan === 'premium' ? '#FFF3E0' : Colors.primaryPale }]}>
            <Text style={styles.planBadgeTxt}>
              {currentPlan === 'free' ? '🌱 Free' : currentPlan === 'premium' ? '⭐ Premium' : '👑 Gold'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setUnlocked(false)} style={styles.lockBtn}>
            <Text style={styles.lockBtnTxt}>🔒</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Child switcher */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.childRow}>
          {childList.map((c, idx) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.childChip, idx === activeChildIndex && styles.childChipActive]}
              onPress={() => setActiveChildIndex(idx)}
            >
              <Text style={styles.childChipAvatar}>{c.avatar}</Text>
              <Text style={[styles.childChipName, idx === activeChildIndex && styles.childChipNameActive]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addChip} onPress={() => setShowAddChild(true)}>
            <Text style={styles.addChipTxt}>+ Qo'shish</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* AI Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryAvatar}>{child.avatar}</Text>
            <View>
              <Text style={styles.summaryName}>{child.name}</Text>
              <Text style={styles.summaryInfo}>{child.age} yosh • Daraja {child.level}</Text>
            </View>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{child.stars}</Text>
              <Text style={styles.statLabel}>⭐ Yulduz</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{child.coins}</Text>
              <Text style={styles.statLabel}>🪙 Tanga</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{child.streak}</Text>
              <Text style={styles.statLabel}>🔥 Streak</Text>
            </View>
          </View>
        </View>

        {/* IQ Level - Premium only */}
        {isPremium ? (
          <View style={styles.iqCard}>
            <View style={styles.iqTop}>
              <View style={[styles.iqBadge, { backgroundColor: iqLevel.color + '20' }]}>
                <Text style={styles.iqBadgeEmoji}>{iqLevel.emoji}</Text>
                <Text style={[styles.iqBadgeLabel, { color: iqLevel.color }]}>{iqLevel.label}</Text>
              </View>
              <View style={styles.iqScore}>
                <Text style={styles.iqScoreNum}>{child.iq}</Text>
                <Text style={styles.iqScoreSub}>IQ ball</Text>
              </View>
            </View>
            <Text style={styles.iqDesc}>
              {child.name} o'yinlarni qanchalik tez va to'g'ri yechishiga qarab IQ ball hisoblanadi. 
              {child.iq >= 100 ? " Zo'r natija!" : " Har kuni o'ynab oshiring!"}
            </Text>
            <IQChart iqHistory={child.iqHistory} currentIq={child.iq} />
          </View>
        ) : (
          <TouchableOpacity style={styles.iqLockedCard} onPress={() => navigation.navigate('Plans')}>
            <Text style={styles.iqLockedEmoji}>🧠</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.iqLockedTitle}>IQ Darajasi</Text>
              <Text style={styles.iqLockedDesc}>Premium rejalarda mavjud</Text>
            </View>
            <View style={styles.iqLockedBadge}>
              <Text style={styles.iqLockedBadgeTxt}>🔒 Unlock</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Today's AI Report */}
        <View style={styles.reportCard}>
          <Text style={styles.cardTitle}>❤️ Bugungi AI Hisobot</Text>
          <View style={styles.reportRow}>
            <View style={styles.reportStat}>
              <Text style={styles.reportBig}>{child.dailyVideosWatched}</Text>
              <Text style={styles.reportSmall}>/{child.dailyGoalVideos}</Text>
              <Text style={styles.reportLabel}>📹 Video</Text>
            </View>
            <View style={styles.reportStat}>
              <Text style={styles.reportBig}>{child.dailyGamesCompleted}</Text>
              <Text style={styles.reportSmall}>/{child.dailyGoalGames}</Text>
              <Text style={styles.reportLabel}>🎮 O'yin</Text>
            </View>
            <View style={styles.reportStat}>
              <Text style={[styles.reportBig, { color: Colors.primary }]}>
                {Math.round(((child.dailyVideosWatched / child.dailyGoalVideos + child.dailyGamesCompleted / child.dailyGoalGames) / 2) * 100)}%
              </Text>
              <Text style={styles.reportLabel}>Kunlik reja</Text>
            </View>
          </View>
          {child.dailyCompleted && (
            <View style={styles.dailyDoneBanner}>
              <Text style={styles.dailyDoneTxt}>🎉 Kunlik reja bajarildi! +{50} 🪙 +{30} ⭐</Text>
            </View>
          )}
        </View>

        {/* Weekly Progress Chart */}
        <View style={styles.chartCard}>
          <BarChart data={child.weeklyProgress} title="📊 Haftalik Progress" />
        </View>

        {/* AI Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.cardTitle}>🤖 AI Tavsiyalar</Text>
          <View style={styles.insightRow}>
            <View style={[styles.insightDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.insightTxt}>
              <Text style={styles.insightBold}>Kuchli tomoni: </Text>
              <Text style={{ color: Colors.primary }}>{topSubject[0]} ({topSubject[1]}%)</Text>
              {' '}— {child.name} bu fanda juda yaxshi!
            </Text>
          </View>
          <View style={styles.insightRow}>
            <View style={[styles.insightDot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.insightTxt}>
              <Text style={styles.insightBold}>Rivojlantirish: </Text>
              {child.improvements[0]} bo'yicha ko'proq mashq qiling.
            </Text>
          </View>
          <View style={styles.insightRow}>
            <View style={[styles.insightDot, { backgroundColor: Colors.info }]} />
            <Text style={styles.insightTxt}>
              <Text style={styles.insightBold}>AI Tavsiya: </Text>
              {child.aiSuggestion}
            </Text>
          </View>
        </View>

        {/* Plan upgrade */}
        {currentPlan !== 'gold' && (
          <TouchableOpacity style={styles.upgradeBanner} onPress={() => navigation.navigate('Plans')} activeOpacity={0.9}>
            <Text style={styles.upgradeEmoji}>👑</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>
                {currentPlan === 'free' ? 'Premium ga o\'ting' : 'Gold ga o\'ting'}
              </Text>
              <Text style={styles.upgradeSub}>Ko'proq imkoniyatlar oching</Text>
            </View>
            <Text style={styles.upgradeArrow}>›</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
      <AddChildModal visible={showAddChild} onClose={() => setShowAddChild(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bgDeep },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingTop: 52, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md,
    backgroundColor: Colors.bgDeep,
  },
  headerSub: { fontSize: 11, color: Colors.textLight, textTransform: 'uppercase', letterSpacing: 1.2 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textDark, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  planBadgeTxt: { fontSize: 12, fontWeight: '700', color: Colors.textDark },
  lockBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', ...Shadows.sm,
  },
  lockBtnTxt: { fontSize: 16 },
  scroll: { paddingHorizontal: Spacing.md },
  childRow: { flexDirection: 'row', gap: 8, marginBottom: 14, paddingVertical: 2 },
  childChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.white, borderRadius: BorderRadius.round,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 2, borderColor: Colors.border, ...Shadows.sm,
  },
  childChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryPale },
  childChipAvatar: { fontSize: 20 },
  childChipName: { fontSize: 13, fontWeight: '700', color: Colors.textMid },
  childChipNameActive: { color: Colors.primaryDark },
  addChip: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.round,
    paddingHorizontal: 16, paddingVertical: 8, justifyContent: 'center', ...Shadows.glow,
  },
  addChipTxt: { fontSize: 13, fontWeight: '700', color: Colors.white },
  summaryCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadows.card, marginBottom: 12,
  },
  summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  summaryAvatar: { fontSize: 40 },
  summaryName: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  summaryInfo: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  summaryStats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: Colors.textDark },
  statLabel: { fontSize: 11, color: Colors.textLight, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  iqCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadows.card, marginBottom: 12,
  },
  iqTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  iqBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.round, paddingHorizontal: 14, paddingVertical: 6, gap: 6 },
  iqBadgeEmoji: { fontSize: 18 },
  iqBadgeLabel: { fontSize: 14, fontWeight: '800' },
  iqScore: { alignItems: 'flex-end' },
  iqScoreNum: { fontSize: 32, fontWeight: '900', color: Colors.textDark, lineHeight: 36 },
  iqScoreSub: { fontSize: 11, color: Colors.textLight },
  iqDesc: { fontSize: 13, color: Colors.textMid, lineHeight: 20, marginBottom: 4 },
  iqLockedCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadows.sm, marginBottom: 12,
    borderWidth: 2, borderColor: Colors.border, gap: 12,
    borderStyle: 'dashed',
  },
  iqLockedEmoji: { fontSize: 32 },
  iqLockedTitle: { fontSize: 15, fontWeight: '700', color: Colors.textDark },
  iqLockedDesc: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  iqLockedBadge: { backgroundColor: '#FFF3E0', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  iqLockedBadgeTxt: { fontSize: 12, fontWeight: '700', color: Colors.warning },
  reportCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadows.card, marginBottom: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: Colors.textDark, marginBottom: 14 },
  reportRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  reportStat: { alignItems: 'center' },
  reportBig: { fontSize: 28, fontWeight: '900', color: Colors.textDark, lineHeight: 32 },
  reportSmall: { fontSize: 13, color: Colors.textLight },
  reportLabel: { fontSize: 11, color: Colors.textLight, marginTop: 4 },
  dailyDoneBanner: {
    backgroundColor: Colors.primaryPale, borderRadius: BorderRadius.md,
    padding: Spacing.sm, marginTop: 12, alignItems: 'center',
  },
  dailyDoneTxt: { fontSize: 13, fontWeight: '700', color: Colors.primaryDark },
  chartCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadows.card, marginBottom: 12,
  },
  insightsCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadows.card, marginBottom: 12, gap: 10,
  },
  insightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  insightDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  insightTxt: { flex: 1, fontSize: 13, color: Colors.textMid, lineHeight: 20 },
  insightBold: { fontWeight: '700', color: Colors.textDark },
  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl,
    padding: Spacing.md, gap: 12, ...Shadows.glow,
  },
  upgradeEmoji: { fontSize: 28 },
  upgradeTitle: { fontSize: 15, fontWeight: '800', color: Colors.white },
  upgradeSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  upgradeArrow: { fontSize: 24, color: Colors.white, marginLeft: 'auto' },
});

const chart = StyleSheet.create({
  wrap: {},
  title: { fontSize: 15, fontWeight: '800', color: Colors.textDark, marginBottom: 4 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 6, marginTop: 8 },
  col: { flex: 1, alignItems: 'center' },
  barBg: { flex: 1, width: '85%', backgroundColor: Colors.bgDeep, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 6 },
  label: { fontSize: 9, color: Colors.textLight, marginTop: 4, textAlign: 'center' },
  val: { fontSize: 9, fontWeight: '700', color: Colors.textMid, marginBottom: 2 },
});

const iq = StyleSheet.create({
  wrap: { marginTop: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 13, fontWeight: '700', color: Colors.textMid },
  badge: { backgroundColor: Colors.primaryPale, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeTxt: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  chart: { position: 'relative', marginVertical: 4 },
  dot: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
  dotPulse: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.primaryGlow, top: -4, left: -4 },
  legend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  legendTxt: { fontSize: 11, color: Colors.textLight },
});
