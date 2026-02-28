import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Colors, BorderRadius, Shadows } from '../theme';
import { useApp } from '../context/AppContext';

export default function ConnectScreen() {
  const { activeChild: child } = useApp();
  const [playing, setPlaying] = useState(false);
  if (!child) return null;

  const progress = child.collaborationProgress;
  const goal = child.collaborationGoal;

  return (
    <View style={s.bg}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgMain} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Header */}
        <View style={s.header}>
          <View style={s.logoRow}>
            <View style={s.logoCircle}><Text style={s.logoEmoji}>🤝</Text></View>
            <Text style={s.pageTitle}>Connect</Text>
          </View>
          <View style={s.headerRight}>
            <TouchableOpacity style={s.avatarBtn}><Text>{child.avatar}</Text></TouchableOpacity>
            <TouchableOpacity style={s.avatarBtn}><Text>🪙</Text></TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={s.greetBox}>
          <Text style={s.greetHi}>Hi, {child.name}!</Text>
          <Text style={s.greetSub}>
            Looks like you and your friends need{'\n'}fal 300%. Quest: Great teamwork!
          </Text>
          <View style={s.questBadge}><Text style={s.questBadgeTxt}>📋</Text></View>
        </View>

        {/* Weekly Collaboration */}
        <View style={s.collabCard}>
          <View style={s.collabHeader}>
            <Text style={s.collabTitle}>Weekly Collaboration</Text>
            <View style={s.collabBadge}>
              <Text style={s.collabBadgeTxt}>⭐ {progress} / {goal}</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.friendsRow}>
            {child.friends.map(f => (
              <View key={f.id} style={s.friendItem}>
                <View style={s.friendAvatarWrap}>
                  <Text style={s.friendAvatar}>{f.avatar}</Text>
                  {f.online && <View style={s.onlineDot} />}
                </View>
                <Text style={s.friendName}>{f.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Math Quest Teamwork Challenge */}
        <View style={s.challengeCard}>
          <View style={s.challengeTop}>
            <View>
              <Text style={s.challengeTitle}>Math Quest</Text>
              <Text style={s.challengeSub}>Teamwork Challenge</Text>
            </View>
            <Text style={s.challengeEmoji}>🏆</Text>
          </View>
          <View style={s.challengeBarRow}>
            <View style={s.challengeBarBg}>
              <View style={[s.challengeBarFill, { width: '24%' }]} />
            </View>
            <Text style={s.challengePct}>-24%</Text>
          </View>
          <View style={s.challengeSteps}>
            <Text style={s.challengeStep}>🎯  Solve 3 puzzles with Leigh Quest.</Text>
            <Text style={s.challengeStep}>🎮  Seady fow hallenge!</Text>
          </View>
          <TouchableOpacity
            style={[s.startGameBtn, playing && { backgroundColor: Colors.primaryLight }]}
            onPress={() => setPlaying(!playing)}
          >
            <Text style={s.startGameBtnTxt}>{playing ? 'O\'yindaman...' : 'Start Game'}</Text>
          </TouchableOpacity>
        </View>

        {/* Friends & Family */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Friends & Family</Text>
          <View style={s.starRow}>
            <Text style={s.starFilled}>⭐</Text>
            <Text style={s.starEmpty}>☆</Text>
            <Text style={s.starEmpty}>☆</Text>
            <Text style={s.starEmpty}>☆</Text>
          </View>
        </View>

        <View style={s.friendsGrid}>
          {child.friends.map(f => (
            <View key={f.id} style={s.friendCard}>
              <Text style={s.friendCardAvatar}>{f.avatar}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.friendCardName}>{f.name}:</Text>
                <Text style={s.friendCardStatus}>
                  {f.online ? 'Lettle team up!' : 'Sophi.nte.tigfer'}
                </Text>
              </View>
              <Text style={s.friendCardArrow}>›</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bgMain },
  scroll: { paddingHorizontal: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 52, paddingBottom: 4,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  logoEmoji: { fontSize: 18 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: Colors.textDark },
  headerRight: { flexDirection: 'row', gap: 8 },
  avatarBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.bgCard, justifyContent: 'center', alignItems: 'center',
    ...Shadows.sm,
  },
  greetBox: { marginTop: 12, marginBottom: 14, position: 'relative' },
  greetHi: { fontSize: 28, fontWeight: '800', color: Colors.textDark },
  greetSub: { fontSize: 13, color: Colors.textMid, marginTop: 4, lineHeight: 20 },
  questBadge: {
    position: 'absolute', right: 0, top: 0,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  questBadgeTxt: { fontSize: 18 },
  collabCard: {
    backgroundColor: Colors.bgCard, borderRadius: BorderRadius.xl,
    padding: 14, ...Shadows.card, marginBottom: 12,
  },
  collabHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  collabTitle: { fontSize: 15, fontWeight: '800', color: Colors.textDark },
  collabBadge: {
    backgroundColor: Colors.goldLight, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  collabBadgeTxt: { fontSize: 12, fontWeight: '700', color: Colors.goldDark },
  friendsRow: { flexDirection: 'row', gap: 16 },
  friendItem: { alignItems: 'center' },
  friendAvatarWrap: { position: 'relative' },
  friendAvatar: { fontSize: 36 },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.primary, borderWidth: 1.5, borderColor: Colors.bgCard,
  },
  friendName: { fontSize: 10, color: Colors.textLight, marginTop: 3 },
  challengeCard: {
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl,
    padding: 14, ...Shadows.card, marginBottom: 14,
  },
  challengeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  challengeTitle: { fontSize: 18, fontWeight: '900', color: Colors.white },
  challengeSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  challengeEmoji: { fontSize: 28 },
  challengeBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  challengeBarBg: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4, overflow: 'hidden' },
  challengeBarFill: { height: 8, backgroundColor: Colors.gold, borderRadius: 4 },
  challengePct: { fontSize: 12, color: Colors.white, fontWeight: '700' },
  challengeSteps: { gap: 4, marginBottom: 14 },
  challengeStep: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  startGameBtn: {
    backgroundColor: Colors.progressGreen, borderRadius: BorderRadius.round,
    paddingVertical: 12, alignItems: 'center',
  },
  startGameBtnTxt: { fontSize: 15, fontWeight: '800', color: Colors.textDark },
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textDark },
  starRow: { flexDirection: 'row' },
  starFilled: { fontSize: 14 },
  starEmpty: { fontSize: 14, opacity: 0.3 },
  friendsGrid: { gap: 10 },
  friendCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: BorderRadius.xl,
    padding: 12, ...Shadows.sm, gap: 10,
  },
  friendCardAvatar: { fontSize: 32 },
  friendCardName: { fontSize: 14, fontWeight: '700', color: Colors.textDark },
  friendCardStatus: { fontSize: 11, color: Colors.textLight, marginTop: 2 },
  friendCardArrow: { fontSize: 20, color: Colors.textLight },
});
