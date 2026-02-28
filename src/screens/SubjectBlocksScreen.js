import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, StatusBar,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useApp } from '../context/AppContext';

const SUBJECT_META = {
  math:       { emoji: '🔢', bg: Colors.mathGreen,       headerBg: '#6DC49A' },
  nature:     { emoji: '🌿', bg: Colors.natureMint,      headerBg: '#7AC98A' },
  language:   { emoji: '📖', bg: Colors.languageYellow,  headerBg: '#E8C840' },
  lifeSkills: { emoji: '🎯', bg: Colors.lifeOrange,      headerBg: '#E89060' },
};

const ROW_PATTERN = [1, 2, 3, 2, 1];

function BlockItem({ block, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const tap = () => {
    if (block.locked) return;
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.88, duration: 90, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1,    duration: 90, useNativeDriver: true }),
    ]).start(() => onPress(block));
  };

  const state = block.completed ? 'done' : block.current ? 'active' : 'locked';
  const bgColor = state === 'done' ? Colors.primary : state === 'active' ? Colors.gold : '#D8EDD8';
  const borderColor = state === 'done' ? Colors.primaryDark : state === 'active' ? Colors.goldDark : '#B8CDB8';
  const textColor = state === 'locked' ? '#9AAA9A' : Colors.white;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.block, { backgroundColor: bgColor, borderColor }]}
        onPress={tap}
        activeOpacity={block.locked ? 1 : 0.8}
      >
        {state === 'locked'
          ? <Text style={styles.blockLock}>🔒</Text>
          : state === 'done'
          ? <View style={styles.blockInner}>
              <Text style={[styles.blockNum, { color: textColor }]}>{block.blockNumber}</Text>
              <Text style={styles.blockStars}>{'⭐'.repeat(Math.min(block.stars, 3))}</Text>
            </View>
          : <View style={styles.blockInner}>
              <Text style={[styles.blockNum, { color: textColor }]}>{block.blockNumber}</Text>
              <View style={styles.activeDot} />
            </View>
        }
      </TouchableOpacity>
    </Animated.View>
  );
}

function buildRows(blocks) {
  const rows = [];
  let i = 0;
  while (i < blocks.length) {
    for (const count of ROW_PATTERN) {
      if (i >= blocks.length) break;
      rows.push(blocks.slice(i, i + count));
      i += count;
    }
  }
  return rows;
}

export default function SubjectBlocksScreen({ navigation, route }) {
  const { subject, label } = route.params;
  const { blocks, activeChild: child, currentPlan } = useApp();

  const meta = SUBJECT_META[subject] || SUBJECT_META.math;
  const subjectBlocks = blocks[subject] || [];
  const subjectData = child?.subjects?.[subject];

  const applyPlanLock = (block) => {
    if (currentPlan === 'free' && block.blockNumber > 10)
      return { ...block, locked: true };
    if (currentPlan === 'premium' && block.blockNumber > 50)
      return { ...block, locked: true };
    return block;
  };

  const completedCount = subjectBlocks.filter(b => b.completed).length;
  const progress = Math.round((completedCount / 100) * 100);
  const rows = buildRows(subjectBlocks);

  return (
    <View style={[styles.root, { backgroundColor: Colors.bgMain }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: meta.headerBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerEmoji}>{meta.emoji}</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{label}</Text>
          <Text style={styles.headerSub}>{completedCount}/100 blok</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelTxt}>Lv.{Math.floor(completedCount / 10) + 1}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressRow}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressPct}>{progress}%</Text>
      </View>

      {/* Plan lock notice */}
      {currentPlan === 'free' && (
        <TouchableOpacity style={styles.planNotice} onPress={() => navigation.navigate('Plans')}>
          <Text style={styles.planNoticeTxt}>🔒 11-100 bloklar Premium — Upgrade qiling</Text>
        </TouchableOpacity>
      )}
      {currentPlan === 'premium' && (
        <TouchableOpacity style={styles.planNotice} onPress={() => navigation.navigate('Plans')}>
          <Text style={styles.planNoticeTxt}>🔒 51-100 bloklar Gold — Upgrade qiling</Text>
        </TouchableOpacity>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map(block => {
              const b = applyPlanLock(block);
              return (
                <BlockItem
                  key={block.id}
                  block={b}
                  onPress={bl => {
                    if (bl.locked) {
                      navigation.navigate('Plans');
                    } else {
                      navigation.navigate('BlockLesson', {
                        block: bl, subject, subjectLabel: label,
                      });
                    }
                  }}
                />
              );
            })}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 14,
    gap: 10,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 22, color: Colors.white, fontWeight: '700' },
  headerEmoji: { fontSize: 28 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: BorderRadius.round,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  levelTxt: { color: Colors.white, fontSize: 13, fontWeight: '800' },
  progressRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: Colors.bgCard, gap: 8,
    ...Shadows.sm,
  },
  progressBg: { flex: 1, height: 10, backgroundColor: Colors.progressBg, borderRadius: 5 },
  progressFill: { height: 10, backgroundColor: Colors.progressGreen, borderRadius: 5 },
  progressPct: { fontSize: 13, fontWeight: '800', color: Colors.primaryDark, width: 38 },
  planNotice: {
    backgroundColor: Colors.goldLight, paddingVertical: 7,
    paddingHorizontal: 16, alignItems: 'center',
  },
  planNoticeTxt: { fontSize: 12, color: Colors.goldDark, fontWeight: '600' },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  row: { flexDirection: 'row', justifyContent: 'center', marginVertical: 6, gap: 10 },
  block: {
    width: 62, height: 62, borderRadius: BorderRadius.md,
    borderWidth: 3, justifyContent: 'center', alignItems: 'center',
    ...Shadows.sm,
  },
  blockInner: { alignItems: 'center' },
  blockNum: { fontSize: 16, fontWeight: '800' },
  blockStars: { fontSize: 7, marginTop: 1 },
  blockLock: { fontSize: 20 },
  activeDot: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: Colors.white, marginTop: 3,
  },
});
