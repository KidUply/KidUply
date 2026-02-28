import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useApp } from '../context/AppContext';

const GAMES = [
  {
    id: 1, title: 'Pizza Adventure',
    subject: 'Math', progress: 89, coins: 220,
    emoji: '🍕', bg: '#A8D9A0',
    desc: 'Fraction va division o\'rgan!',
  },
  {
    id: 2, title: 'Math Quest',
    subject: 'Math', progress: 23, coins: 150,
    emoji: '⚔️', bg: '#C8E4F8',
    desc: 'Goal: Complete face matching gamecolle.',
  },
  {
    id: 3, title: 'Spelling Challenge',
    subject: 'Language', progress: 22, coins: 100,
    emoji: '📝', bg: '#E8D8F8',
    desc: 'Language: please face matching coincolles',
  },
];

export default function PlayScreen() {
  const { activeChild: child } = useApp();
  const [playing, setPlaying] = useState(null);
  if (!child) return null;

  return (
    <View style={s.bg}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgMain} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Header */}
        <View style={s.header}>
          <View style={s.logoRow}>
            <View style={s.logoCircle}><Text style={s.logoEmoji}>🎮</Text></View>
            <Text style={s.pageTitle}>Play</Text>
            <Text style={s.headerStar}>⭐</Text>
          </View>
          <View style={s.headerRight}>
            <TouchableOpacity style={s.avatarBtn}><Text style={s.avatarEmoji}>{child.avatar}</Text></TouchableOpacity>
            <TouchableOpacity style={s.avatarBtn}><Text style={s.avatarEmoji}>🪙</Text></TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={s.greetRow}>
          <View>
            <Text style={s.greetHi}>Hi, {child.name}!</Text>
            <Text style={s.greetSub}>Ready to play?</Text>
          </View>
          <View style={s.levelBox}>
            <Text style={s.levelArrow}>→</Text>
            <Text style={s.levelPct}>100%</Text>
            <View style={s.levelBarBg}>
              <View style={[s.levelBarFill, { width: '100%' }]} />
            </View>
            <Text style={s.levelSave}>Save!</Text>
          </View>
        </View>

        {/* Game Recommendations */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Game Recommendations</Text>
          <View style={s.starTag}>
            <Text style={s.starTagTxt}>⭐ 2on $16.41</Text>
          </View>
        </View>

        {GAMES.map(game => (
          <TouchableOpacity
            key={game.id}
            style={s.gameCard}
            onPress={() => setPlaying(game)}
            activeOpacity={0.88}
          >
            {/* Left — rasm/thumbnail */}
            <View style={[s.gameThumb, { backgroundColor: game.bg }]}>
              <Text style={s.gameThumbEmoji}>{game.emoji}</Text>
              {game.id === 1 && (
                <Text style={s.gameThumbTitle}>Pizza{'\n'}Adventure</Text>
              )}
            </View>
            {/* Right — info */}
            <View style={s.gameInfo}>
              <Text style={s.gameTitle}>{game.title}</Text>
              <Text style={s.gameDesc} numberOfLines={1}>{game.desc}</Text>
              <View style={s.gameBottom}>
                <Text style={s.gameStar}>⭐</Text>
                <View style={s.gameBarBg}>
                  <View style={[s.gameBarFill, { width: `${game.progress}%` }]} />
                </View>
                <Text style={s.gameBarPct}>{game.progress}%</Text>
                <TouchableOpacity style={s.playBtn} onPress={() => setPlaying(game)}>
                  <Text style={s.playBtnTxt}>Let's Play</Text>
                </TouchableOpacity>
              </View>
              <View style={s.coinRow}>
                <Text style={s.coinTag}>🪙 {game.coins} Clms</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Adaptive Option */}
        <View style={s.adaptiveCard}>
          <View style={s.adaptiveLeft}>
            <Text style={s.adaptiveEmoji}>🤖</Text>
          </View>
          <View style={s.adaptiveInfo}>
            <Text style={s.adaptiveTitle}>Adaptive Option</Text>
            <Text style={s.adaptiveDesc} numberOfLines={2}>
              Social AI: items 10 Rockets Games. Starting ats a mini-improvement daily.
            </Text>
          </View>
          <Text style={s.adaptiveCoin}>🪙 700</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Mini game modal */}
      {playing && (
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalEmoji}>{playing.emoji}</Text>
            <Text style={s.modalTitle}>{playing.title}</Text>
            <Text style={s.modalDesc}>O'yin ishga tushmoqda...</Text>
            <TouchableOpacity style={s.closeBtn} onPress={() => setPlaying(null)}>
              <Text style={s.closeBtnTxt}>Yopish</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  headerStar: { fontSize: 18 },
  headerRight: { flexDirection: 'row', gap: 8 },
  avatarBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.bgCard, justifyContent: 'center', alignItems: 'center',
    ...Shadows.sm,
  },
  avatarEmoji: { fontSize: 20 },
  greetRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginTop: 12, marginBottom: 14,
  },
  greetHi: { fontSize: 28, fontWeight: '800', color: Colors.textDark },
  greetSub: { fontSize: 15, color: Colors.textLight, marginTop: 2 },
  levelBox: {
    backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg,
    padding: 8, width: 100, alignItems: 'center', ...Shadows.sm,
  },
  levelArrow: { fontSize: 11, color: Colors.textLight },
  levelPct: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  levelBarBg: { width: '100%', height: 5, backgroundColor: Colors.progressBg, borderRadius: 2.5, marginVertical: 4 },
  levelBarFill: { height: 5, backgroundColor: Colors.progressGreen, borderRadius: 2.5 },
  levelSave: { fontSize: 10, color: Colors.textLight },
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textDark },
  starTag: {
    backgroundColor: Colors.goldLight, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  starTagTxt: { fontSize: 11, fontWeight: '700', color: Colors.goldDark },
  gameCard: {
    flexDirection: 'row', backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.xl, marginBottom: 12,
    overflow: 'hidden', ...Shadows.card,
  },
  gameThumb: {
    width: 100, minHeight: 100,
    justifyContent: 'center', alignItems: 'center', padding: 8,
  },
  gameThumbEmoji: { fontSize: 36 },
  gameThumbTitle: { fontSize: 12, fontWeight: '800', color: Colors.textDark, textAlign: 'center', marginTop: 4 },
  gameInfo: { flex: 1, padding: 12 },
  gameTitle: { fontSize: 15, fontWeight: '800', color: Colors.textDark },
  gameDesc: { fontSize: 11, color: Colors.textLight, marginTop: 2 },
  gameBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 5 },
  gameStar: { fontSize: 13 },
  gameBarBg: { flex: 1, height: 8, backgroundColor: Colors.progressBg, borderRadius: 4, overflow: 'hidden' },
  gameBarFill: { height: 8, backgroundColor: Colors.progressGreen, borderRadius: 4 },
  gameBarPct: { fontSize: 10, fontWeight: '700', color: Colors.textMid },
  playBtn: {
    backgroundColor: Colors.primary, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  playBtnTxt: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  coinRow: { marginTop: 4 },
  coinTag: { fontSize: 10, color: Colors.goldDark, fontWeight: '600' },
  adaptiveCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: BorderRadius.xl,
    padding: 14, ...Shadows.sm, gap: 10,
  },
  adaptiveLeft: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.bgMuted, justifyContent: 'center', alignItems: 'center',
  },
  adaptiveEmoji: { fontSize: 24 },
  adaptiveInfo: { flex: 1 },
  adaptiveTitle: { fontSize: 14, fontWeight: '700', color: Colors.textDark },
  adaptiveDesc: { fontSize: 11, color: Colors.textLight, marginTop: 2 },
  adaptiveCoin: { fontSize: 13, fontWeight: '700', color: Colors.goldDark },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.bgCard, borderRadius: BorderRadius.xxl,
    padding: 32, alignItems: 'center', width: '80%', ...Shadows.card,
  },
  modalEmoji: { fontSize: 56, marginBottom: 10 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: Colors.textDark },
  modalDesc: { fontSize: 13, color: Colors.textLight, marginTop: 6, marginBottom: 20 },
  closeBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.round,
    paddingHorizontal: 32, paddingVertical: 12,
  },
  closeBtnTxt: { color: Colors.white, fontSize: 14, fontWeight: '700' },
});
