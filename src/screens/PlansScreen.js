import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Alert, StatusBar,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useApp } from '../context/AppContext';

export default function PlansScreen({ navigation }) {
  const { plans, currentPlan, upgradePlan } = useApp();
  const [selected, setSelected] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelect = (plan) => {
    if (plan.id === currentPlan) return;
    setSelected(plan);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    upgradePlan(selected.id);
    setShowConfirm(false);
    Alert.alert('🎉 Tabriklaymiz!', `${selected.name} faollashtirildi!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={s.bg}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Tariflar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Text style={s.subtitle}>Farzandingiz uchun eng yaxshi rejani tanlang</Text>

        {plans.map((plan) => {
          const isActive = currentPlan === plan.id;
          return (
            <View key={plan.id} style={[
              s.planCard,
              isActive && s.planCardActive,
              plan.popular && !isActive && s.planCardPopular,
            ]}>
              {plan.popular && !isActive && (
                <View style={[s.badge, { backgroundColor: Colors.coral }]}>
                  <Text style={s.badgeTxt}>🔥 Ommabop</Text>
                </View>
              )}
              {isActive && (
                <View style={[s.badge, { backgroundColor: Colors.primary }]}>
                  <Text style={s.badgeTxt}>✓ Faol</Text>
                </View>
              )}

              <View style={s.planHead}>
                <Text style={s.planIcon}>{plan.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.planName}>{plan.name}</Text>
                  <Text style={[s.planPrice, { color: plan.color }]}>{plan.priceLabel}</Text>
                </View>
              </View>

              {plan.features.map((f, i) => (
                <View key={i} style={s.featureRow}>
                  <Text style={s.featureCheck}>✅</Text>
                  <Text style={s.featureTxt}>{f}</Text>
                </View>
              ))}

              {plan.locked?.map((f, i) => (
                <View key={i} style={s.featureRow}>
                  <Text style={s.featureCheck}>🔒</Text>
                  <Text style={[s.featureTxt, s.lockedTxt]}>{f}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={[s.selectBtn, { backgroundColor: isActive ? Colors.progressBg : plan.color }]}
                onPress={() => handleSelect(plan)}
                disabled={isActive}
              >
                <Text style={[s.selectBtnTxt, isActive && { color: Colors.textLight }]}>
                  {isActive ? '✓ Faol tarif' : `${plan.name} tanlash`}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* FAQ */}
        <View style={s.faqCard}>
          <Text style={s.faqTitle}>❓ Ko'p so'raladigan savollar</Text>
          {[
            { q: "Rejani o'zgartirish mumkinmi?", a: "Ha, istalgan vaqtda." },
            { q: "Bepul reja qancha davom etadi?", a: "Muddatsiz, 2 fan va 10 blok ochiq." },
            { q: "To'lovni bekor qilish mumkinmi?", a: "Ha, istalgan vaqtda bekor qilasiz." },
          ].map((item, i) => (
            <View key={i} style={s.faqItem}>
              <Text style={s.faqQ}>{item.q}</Text>
              <Text style={s.faqA}>{item.a}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Confirm Modal */}
      <Modal visible={showConfirm} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalIcon}>{selected?.icon}</Text>
            <Text style={s.modalTitle}>{selected?.name}</Text>
            <Text style={s.modalPrice}>{selected?.priceLabel}</Text>
            <Text style={s.modalDesc}>
              {selected?.price === 0
                ? "Bepul rejaga o'tmoqchisiz."
                : `${selected?.priceLabel} to'lab ushbu rejani faollashtirasiz.`}
            </Text>
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowConfirm(false)}>
                <Text style={s.cancelTxt}>Bekor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.confirmBtn, { backgroundColor: selected?.color || Colors.primary }]}
                onPress={handleConfirm}
              >
                <Text style={s.confirmTxt}>Tasdiqlash</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bgMain },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 14,
    backgroundColor: Colors.primaryDark,
  },
  backBtn: { width: 40, padding: 4 },
  backIcon: { fontSize: 22, color: Colors.white, fontWeight: '700' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: Colors.white },
  scroll: { padding: 16 },
  subtitle: { fontSize: 14, color: Colors.textMid, textAlign: 'center', marginBottom: 20 },
  planCard: {
    backgroundColor: Colors.bgCard, borderRadius: BorderRadius.xl,
    padding: 16, marginBottom: 16, ...Shadows.card,
    borderWidth: 2, borderColor: 'transparent', position: 'relative', paddingTop: 44,
  },
  planCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryPale },
  planCardPopular: { borderColor: Colors.coral },
  badge: {
    position: 'absolute', top: 0, right: 0,
    borderTopRightRadius: BorderRadius.xl, borderBottomLeftRadius: BorderRadius.md,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  badgeTxt: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  planHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  planIcon: { fontSize: 34 },
  planName: { fontSize: 17, fontWeight: '800', color: Colors.textDark },
  planPrice: { fontSize: 20, fontWeight: '800', marginTop: 2 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  featureCheck: { fontSize: 13 },
  featureTxt: { flex: 1, fontSize: 13, color: Colors.textMid },
  lockedTxt: { color: Colors.textLight, textDecorationLine: 'line-through' },
  selectBtn: {
    borderRadius: BorderRadius.round, paddingVertical: 13,
    alignItems: 'center', marginTop: 10,
  },
  selectBtnTxt: { color: Colors.white, fontSize: 14, fontWeight: '800' },
  faqCard: {
    backgroundColor: Colors.bgCard, borderRadius: BorderRadius.xl,
    padding: 16, ...Shadows.sm, gap: 12,
  },
  faqTitle: { fontSize: 15, fontWeight: '800', color: Colors.textDark },
  faqItem: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10 },
  faqQ: { fontSize: 13, fontWeight: '700', color: Colors.textDark },
  faqA: { fontSize: 12, color: Colors.textMid, marginTop: 3 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: Colors.bgCard, borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl, padding: 32, alignItems: 'center',
  },
  modalIcon: { fontSize: 48, marginBottom: 8 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: Colors.textDark },
  modalPrice: { fontSize: 18, fontWeight: '700', color: Colors.primary, marginTop: 4 },
  modalDesc: { fontSize: 13, color: Colors.textMid, textAlign: 'center', marginTop: 10, marginBottom: 24 },
  modalBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn: {
    flex: 1, borderWidth: 2, borderColor: Colors.border,
    borderRadius: BorderRadius.round, paddingVertical: 13, alignItems: 'center',
  },
  cancelTxt: { fontSize: 14, fontWeight: '600', color: Colors.textMid },
  confirmBtn: { flex: 1, borderRadius: BorderRadius.round, paddingVertical: 13, alignItems: 'center' },
  confirmTxt: { color: Colors.white, fontSize: 14, fontWeight: '800' },
});
