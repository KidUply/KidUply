import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '../theme';
import { useApp } from '../context/AppContext';
import AddChildModal from './AddChildModal';

export default function AppHeader({ title, showBack, onBack }) {
  const { activeChild, childList, activeChildIndex, setActiveChildIndex } = useApp();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  if (!activeChild) return null;

  return (
    <>
      <View style={s.header}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={s.backBtn}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={s.logoRow}>
            <View style={s.logoCircle}>
              <Text style={s.logoEmoji}>🐢</Text>
            </View>
            <Text style={s.logoTxt}>
              <Text style={s.logoK}>Kid</Text>
              <Text style={s.logoU}>Uply</Text>
            </Text>
          </View>
        )}
        {title ? <Text style={s.title}>{title}</Text> : <View style={{ flex: 1 }} />}
        <View style={s.right}>
          <View style={s.badge}><Text style={s.badgeIcon}>⭐</Text><Text style={s.badgeVal}>{activeChild.stars}</Text></View>
          <View style={s.badge}><Text style={s.badgeIcon}>🪙</Text><Text style={s.badgeVal}>{activeChild.coins}</Text></View>
          <TouchableOpacity onPress={() => setShowSwitcher(true)} style={s.avatarWrap}>
            <Text style={s.avatar}>{activeChild.avatar}</Text>
            {childList.length > 1 && <View style={s.switchDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Child Switcher */}
      <Modal visible={showSwitcher} transparent animationType="fade">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowSwitcher(false)}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Farzandni tanlash</Text>
            <ScrollView>
              {childList.map((child, idx) => (
                <TouchableOpacity
                  key={child.id}
                  style={[s.childItem, idx === activeChildIndex && s.childItemActive]}
                  onPress={() => { setActiveChildIndex(idx); setShowSwitcher(false); }}
                >
                  <Text style={s.childAvatar}>{child.avatar}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.childName}>{child.name}</Text>
                    <Text style={s.childInfo}>{child.age} yosh • ⭐ {child.stars}</Text>
                  </View>
                  {idx === activeChildIndex && (
                    <View style={s.checkBadge}><Text style={s.checkTxt}>✓</Text></View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={s.addBtn}
              onPress={() => { setShowSwitcher(false); setShowAdd(true); }}
            >
              <Text style={s.addBtnTxt}>+ Yangi farzand qo'shish</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <AddChildModal visible={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: Colors.bgMain,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  logoCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  logoEmoji: { fontSize: 16 },
  logoTxt: { fontSize: 18 },
  logoK: { fontWeight: '800', color: Colors.textDark },
  logoU: { fontWeight: '800', color: Colors.primary },
  backBtn: { padding: 4, marginRight: 8 },
  backIcon: { fontSize: 22, color: Colors.primaryDark, fontWeight: '700' },
  title: { flex: 1, fontSize: 17, fontWeight: '800', color: Colors.textDark, marginLeft: 8 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.bgCard, borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 4, ...Shadows.sm,
  },
  badgeIcon: { fontSize: 11 },
  badgeVal: { fontSize: 12, fontWeight: '800', color: Colors.textDark },
  avatarWrap: { position: 'relative' },
  avatar: { fontSize: 28 },
  switchDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 9, height: 9, borderRadius: 4.5,
    backgroundColor: Colors.gold, borderWidth: 1.5, borderColor: Colors.bgMain,
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, maxHeight: '60%',
  },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: Colors.textDark, marginBottom: 14 },
  childItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, borderRadius: BorderRadius.lg, gap: 10, marginBottom: 8,
    backgroundColor: Colors.bgMain,
  },
  childItemActive: { backgroundColor: Colors.primaryPale, borderWidth: 2, borderColor: Colors.primary },
  childAvatar: { fontSize: 32 },
  childName: { fontSize: 14, fontWeight: '700', color: Colors.textDark },
  childInfo: { fontSize: 11, color: Colors.textLight, marginTop: 2 },
  checkBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  checkTxt: { color: Colors.white, fontSize: 12, fontWeight: '800' },
  addBtn: {
    marginTop: 8, backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round, padding: 13, alignItems: 'center',
  },
  addBtnTxt: { color: Colors.white, fontSize: 14, fontWeight: '700' },
});
