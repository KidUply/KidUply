import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useApp } from '../context/AppContext';

const QUIZ_QUESTIONS = [
  { q: '3/4 + 1/4 = ?', options: ['1', '4/8', '1/2', '3/8'], correct: 0 },
  { q: '1/2 + 1/2 = ?', options: ['1/4', '2/2', '1', '2'], correct: 2 },
  { q: 'Qaysi katta: 3/4 yoki 1/2?', options: ['1/2', '3/4', 'Teng', "Bilmadim"], correct: 1 },
];

function QuizGame({ block, onComplete }) {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const answer = (i) => {
    if (sel !== null) return;
    setSel(i);
    if (i === QUIZ_QUESTIONS[cur].correct) setScore(s => s + 1);
    setTimeout(() => {
      if (cur + 1 < QUIZ_QUESTIONS.length) { setCur(c => c + 1); setSel(null); }
      else setDone(true);
    }, 900);
  };

  if (done) {
    const stars = score === 3 ? 3 : score >= 2 ? 2 : 1;
    return (
      <View style={g.finish}>
        <Text style={g.finishEmoji}>🎉</Text>
        <Text style={g.finishTitle}>Ajoyib!</Text>
        <Text style={g.finishScore}>{score}/{QUIZ_QUESTIONS.length} to'g'ri</Text>
        <Text style={g.finishStars}>{'⭐'.repeat(stars)}</Text>
        <Text style={g.finishReward}>+{score * 10} ⭐  +{score * 5} 🪙</Text>
        <TouchableOpacity style={g.finishBtn} onPress={() => onComplete(stars)}>
          <Text style={g.finishBtnTxt}>Keyingi blokni ochish 🔓</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = QUIZ_QUESTIONS[cur];
  return (
    <View style={g.quiz}>
      <View style={g.qProgress}>
        {QUIZ_QUESTIONS.map((_, i) => <View key={i} style={[g.qDot, i <= cur && g.qDotActive]} />)}
      </View>
      <Text style={g.qTxt}>{q.q}</Text>
      {q.options.map((opt, i) => {
        let bg = Colors.white, border = Colors.border;
        if (sel !== null) {
          if (i === q.correct) { bg = '#D1FAE5'; border = Colors.primary; }
          else if (i === sel) { bg = '#FEE2E2'; border = Colors.danger; }
        }
        return (
          <TouchableOpacity key={i} style={[g.opt, { backgroundColor: bg, borderColor: border }]} onPress={() => answer(i)}>
            <Text style={g.optTxt}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SimpleGame({ block, onComplete }) {
  const [done, setDone] = useState(false);
  if (done) return (
    <View style={g.finish}>
      <Text style={g.finishEmoji}>🏆</Text>
      <Text style={g.finishTitle}>Zo'r!</Text>
      <Text style={g.finishStars}>⭐⭐⭐</Text>
      <TouchableOpacity style={g.finishBtn} onPress={() => onComplete(3)}>
        <Text style={g.finishBtnTxt}>Keyingi blokni ochish 🔓</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={g.simple}>
      <Text style={g.simpleIcon}>🎮</Text>
      <Text style={g.simpleName}>{block.gameType?.toUpperCase()} o'yini</Text>
      <TouchableOpacity style={g.finishBtn} onPress={() => setDone(true)}>
        <Text style={g.finishBtnTxt}>O'yinni boshlash ▶</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function BlockLessonScreen({ navigation, route }) {
  const { block, subject, subjectLabel } = route.params;
  const { completeBlock, watchVideo } = useApp();
  const [phase, setPhase] = useState('intro'); // intro|video|game
  const [showCelebration, setShowCelebration] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);

  const handleWatchVideo = () => {
    watchVideo();
    setVideoWatched(true);
    setTimeout(() => setPhase('game'), 1500);
  };

  const handleComplete = (stars) => {
    completeBlock(subject, block.id);
    setShowCelebration(true);
  };

  const STEPS = [
    { label: 'Video', icon: '📹', done: phase === 'game', active: phase === 'video' || phase === 'game' },
    { label: "O'yin", icon: '🎮', done: false, active: phase === 'game' },
    { label: 'Unlock', icon: '🔓', done: false, active: false },
  ];

  return (
    <View style={styles.bg}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blok {block.blockNumber}</Text>
        <View style={styles.headerBadge}><Text style={styles.headerBadgeTxt}>{subjectLabel}</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Steps */}
        <View style={styles.stepsRow}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.label}>
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, s.active && styles.stepCircleActive, s.done && styles.stepCircleDone]}>
                  <Text style={styles.stepIcon}>{s.done ? '✓' : s.icon}</Text>
                </View>
                <Text style={[styles.stepLabel, s.active && styles.stepLabelActive]}>{s.label}</Text>
              </View>
              {i < STEPS.length - 1 && <View style={[styles.stepLine, (s.done || s.active) && styles.stepLineActive]} />}
            </React.Fragment>
          ))}
        </View>

        {/* INTRO */}
        {phase === 'intro' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{block.title}</Text>
            <Text style={styles.cardDesc}>
              Bu darsda avval qisqa video ko'rasiz, keyin {block.gameType} o'yini bilan mustahkamlaysiz. Keyin keyingi blok ochiladi!
            </Text>
            <View style={styles.benefitsList}>
              {['📹 Qisqa tushunarli video', '🎮 Interaktiv mini-o\'yin', '⭐ Yulduz va tanga mukofot', '🔓 Keyingi blok ochiladi'].map(b => (
                <View key={b} style={styles.benefit}><Text style={styles.benefitTxt}>{b}</Text></View>
              ))}
            </View>
            <TouchableOpacity style={styles.mainBtn} onPress={() => setPhase('video')}>
              <Text style={styles.mainBtnTxt}>📹 Videoni ko'rish</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* VIDEO */}
        {phase === 'video' && (
          <View style={styles.card}>
            <View style={styles.videoPlayer}>
              <Text style={styles.videoPlayEmoji}>🎬</Text>
              <Text style={styles.videoTitle}>{block.title}</Text>
              <Text style={styles.videoSub}>Video Player</Text>
              {videoWatched && <View style={styles.videoDone}><Text style={styles.videoDoneTxt}>✓ Ko'rildi</Text></View>}
            </View>
            <TouchableOpacity
              style={[styles.mainBtn, videoWatched && styles.mainBtnGold]}
              onPress={handleWatchVideo}
            >
              <Text style={styles.mainBtnTxt}>{videoWatched ? '🎮 O\'yinni boshlash →' : '▶ Videoni ko\'rdim'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* GAME */}
        {phase === 'game' && (
          <View style={styles.card}>
            {block.gameType === 'quiz' ? (
              <QuizGame block={block} onComplete={handleComplete} />
            ) : (
              <SimpleGame block={block} onComplete={handleComplete} />
            )}
          </View>
        )}
      </ScrollView>

      {/* Celebration */}
      <Modal visible={showCelebration} transparent animationType="fade">
        <View style={styles.celebOverlay}>
          <View style={styles.celebCard}>
            <Text style={styles.celebEmoji}>🎊🏆🎊</Text>
            <Text style={styles.celebTitle}>Tabriklaymiz!</Text>
            <Text style={styles.celebSub}>Blok {block.blockNumber} bajarildi!</Text>
            <Text style={styles.celebReward}>+10 ⭐  +5 🪙</Text>
            <Text style={styles.celebNext}>Blok {block.blockNumber + 1} ochildi! 🔓</Text>
            <TouchableOpacity style={styles.mainBtn} onPress={() => { setShowCelebration(false); navigation.goBack(); }}>
              <Text style={styles.mainBtnTxt}>Davom etish →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bgDeep },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 52, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md,
    backgroundColor: Colors.white, ...Shadows.sm,
  },
  backBtn: { padding: 4, marginRight: 10 },
  backIcon: { fontSize: 22, color: Colors.primaryDark, fontWeight: '700' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: Colors.textDark },
  headerBadge: { backgroundColor: Colors.primaryPale, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  headerBadgeTxt: { fontSize: 12, fontWeight: '700', color: Colors.primaryDark },
  scroll: { padding: Spacing.md },
  stepsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadows.sm, marginBottom: 14,
  },
  stepItem: { alignItems: 'center' },
  stepCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.bgDeep, justifyContent: 'center', alignItems: 'center',
  },
  stepCircleActive: { backgroundColor: Colors.goldLight, borderWidth: 2.5, borderColor: Colors.gold },
  stepCircleDone: { backgroundColor: Colors.primary },
  stepIcon: { fontSize: 18 },
  stepLine: { width: 40, height: 3, backgroundColor: Colors.bgDeep, marginBottom: 20, borderRadius: 1.5 },
  stepLineActive: { backgroundColor: Colors.primary },
  stepLabel: { fontSize: 11, color: Colors.textLight, marginTop: 4, fontWeight: '600' },
  stepLabelActive: { color: Colors.primary },
  card: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md, ...Shadows.card },
  cardTitle: { fontSize: 18, fontWeight: '800', color: Colors.textDark, marginBottom: 8 },
  cardDesc: { fontSize: 14, color: Colors.textMid, lineHeight: 22, marginBottom: 16 },
  benefitsList: { gap: 8, marginBottom: 20 },
  benefit: { flexDirection: 'row' },
  benefitTxt: { fontSize: 14, color: Colors.textMid },
  mainBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.round,
    paddingVertical: 15, alignItems: 'center', ...Shadows.glow,
  },
  mainBtnGold: { backgroundColor: Colors.gold, ...Shadows.goldGlow },
  mainBtnTxt: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  videoPlayer: {
    height: 200, backgroundColor: '#0F1E17', borderRadius: BorderRadius.lg,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  videoPlayEmoji: { fontSize: 52 },
  videoTitle: { color: Colors.white, fontSize: 14, fontWeight: '600', marginTop: 8 },
  videoSub: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  videoDone: { marginTop: 8, backgroundColor: Colors.primaryGlow, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  videoDoneTxt: { color: Colors.primary, fontSize: 12, fontWeight: '700' },
  celebOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  celebCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xxl,
    padding: Spacing.xl, alignItems: 'center', width: '85%', ...Shadows.card,
  },
  celebEmoji: { fontSize: 52, marginBottom: 12 },
  celebTitle: { fontSize: 28, fontWeight: '900', color: Colors.textDark },
  celebSub: { fontSize: 14, color: Colors.textMid, marginTop: 6 },
  celebReward: { fontSize: 22, fontWeight: '800', color: Colors.primary, marginVertical: 12 },
  celebNext: { fontSize: 14, color: Colors.textMid, marginBottom: 20 },
});

const g = StyleSheet.create({
  quiz: {},
  qProgress: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 20 },
  qDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.bgDeep },
  qDotActive: { backgroundColor: Colors.primary },
  qTxt: { fontSize: 20, fontWeight: '800', color: Colors.textDark, textAlign: 'center', marginBottom: 20 },
  opt: {
    borderRadius: BorderRadius.md, padding: Spacing.md,
    borderWidth: 2.5, alignItems: 'center', marginBottom: 10,
  },
  optTxt: { fontSize: 15, fontWeight: '700', color: Colors.textDark },
  finish: { alignItems: 'center', paddingVertical: Spacing.md },
  finishEmoji: { fontSize: 64, marginBottom: 10 },
  finishTitle: { fontSize: 28, fontWeight: '900', color: Colors.textDark },
  finishScore: { fontSize: 15, color: Colors.textLight, marginTop: 4 },
  finishStars: { fontSize: 26, marginVertical: 8 },
  finishReward: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 24 },
  finishBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.round,
    paddingVertical: 14, paddingHorizontal: 32, ...Shadows.glow,
  },
  finishBtnTxt: { color: Colors.white, fontSize: 15, fontWeight: '800' },
  simple: { alignItems: 'center', paddingVertical: Spacing.xl },
  simpleIcon: { fontSize: 64, marginBottom: 12 },
  simpleName: { fontSize: 18, fontWeight: '800', color: Colors.textDark, marginBottom: 24 },
});
