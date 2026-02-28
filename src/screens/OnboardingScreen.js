import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Animated, KeyboardAvoidingView, Platform, ScrollView,
  Dimensions, StatusBar,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');
const AGES = Array.from({ length: 11 }, (_, i) => i + 4);

export default function OnboardingScreen() {
  const { finishOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [parentName, setParentNameLocal] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(null);
  const [childGender, setChildGender] = useState(null);
  const [pinError, setPinError] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animate = (cb) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      cb();
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    });
  };

  const goNext = () => animate(() => setStep(s => s + 1));
  const goBack = () => animate(() => setStep(s => s - 1));

  const handlePinNext = () => {
    if (pin.length !== 4) { setPinError("4 ta raqam kiriting"); return; }
    if (pinConfirm && pinConfirm !== pin) { setPinError("Parollar mos kelmaydi"); return; }
    if (!pinConfirm) { goNext(); return; }
    goNext();
  };

  const handleFinish = () => {
    finishOnboarding(parentName.trim(), pin, { name: childName.trim(), age: childAge, gender: childGender });
  };

  const canProceed = () => {
    if (step === 1) return parentName.trim().length >= 2;
    if (step === 2) return pin.length === 4;
    if (step === 3) return pinConfirm.length === 4;
    if (step === 4) return childName.trim().length >= 2;
    if (step === 5) return childAge !== null;
    if (step === 6) return childGender !== null;
    return true;
  };

  const steps = [
    { label: null }, // welcome
    { label: "Ota-ona" },
    { label: "Parol" },
    { label: "Tasdiqlash" },
    { label: "Farzand" },
    { label: "Yosh" },
    { label: "Jins" },
  ];

  const PinDots = ({ value, length = 4 }) => (
    <View style={styles.pinDots}>
      {Array.from({ length }, (_, i) => (
        <View key={i} style={[styles.pinDot, i < value.length && styles.pinDotFilled]} />
      ))}
    </View>
  );

  const PinPad = ({ value, onChange, maxLen = 4 }) => {
    const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
    return (
      <View style={styles.pinPad}>
        {keys.map((k, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.pinKey, k === '' && styles.pinKeyEmpty]}
            onPress={() => {
              if (!k) return;
              if (k === '⌫') { onChange(value.slice(0, -1)); setPinError(''); }
              else if (value.length < maxLen) onChange(value + k);
            }}
            disabled={k === ''}
          >
            <Text style={styles.pinKeyTxt}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.bg}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />

      {/* Progress bar */}
      {step > 0 && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 6) * 100}%` }]} />
        </View>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

          {/* STEP 0: Welcome */}
          {step === 0 && (
            <View style={styles.center}>
              <View style={styles.logoWrap}>
                <Text style={styles.logoEmoji}>🦋</Text>
                <Text style={styles.logoMain}>
                  <Text style={styles.logoKid}>Kid</Text>
                  <Text style={styles.logoUply}>Uply</Text>
                </Text>
              </View>
              <Text style={styles.welcomeTag}>Ta'lim — O'yin — Rivojlanish</Text>
              <View style={styles.welcomeCards}>
                {[
                  { icon: '📚', label: '4 ta fan', sub: 'Math, Nature, Language, Life' },
                  { icon: '🎮', label: 'O\'yinlar', sub: 'O\'rganib, o\'yna!' },
                  { icon: '🤖', label: 'AI Tahlil', sub: 'Ota-ona uchun' },
                  { icon: '👑', label: 'IQ o\'sish', sub: 'Har kuni yangi daraja' },
                ].map(c => (
                  <View key={c.icon} style={styles.welcomeCard}>
                    <Text style={styles.welcomeCardIcon}>{c.icon}</Text>
                    <Text style={styles.welcomeCardLabel}>{c.label}</Text>
                    <Text style={styles.welcomeCardSub}>{c.sub}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.startBtn} onPress={goNext}>
                <Text style={styles.startBtnTxt}>Boshlash →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 1: Parent name */}
          {step === 1 && (
            <View style={styles.formStep}>
              <Text style={styles.stepEmoji}>👤</Text>
              <Text style={styles.stepTitle}>Sizning ismingiz?</Text>
              <Text style={styles.stepDesc}>Ota-ona yoki vasiy sifatida kiring</Text>
              <TextInput
                style={styles.textInput}
                placeholder="To'liq ismingiz..."
                placeholderTextColor={Colors.textLight}
                value={parentName}
                onChangeText={setParentNameLocal}
                autoFocus autoCapitalize="words"
              />
              <TouchableOpacity
                style={[styles.nextBtn, !canProceed() && styles.nextBtnOff]}
                onPress={() => canProceed() && goNext()}
              >
                <Text style={styles.nextBtnTxt}>Davom etish →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: PIN set */}
          {step === 2 && (
            <View style={styles.formStep}>
              <Text style={styles.stepEmoji}>🔒</Text>
              <Text style={styles.stepTitle}>Ota-ona paroli</Text>
              <Text style={styles.stepDesc}>4 xonali maxfiy PIN o'rnating.{'\n'}Faqat siz kira olasiz.</Text>
              <PinDots value={pin} />
              {pinError ? <Text style={styles.pinError}>{pinError}</Text> : null}
              <PinPad value={pin} onChange={setPin} />
              <TouchableOpacity
                style={[styles.nextBtn, pin.length < 4 && styles.nextBtnOff]}
                onPress={() => pin.length === 4 && goNext()}
              >
                <Text style={styles.nextBtnTxt}>Davom etish →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 3: PIN confirm */}
          {step === 3 && (
            <View style={styles.formStep}>
              <Text style={styles.stepEmoji}>🔐</Text>
              <Text style={styles.stepTitle}>Parolni tasdiqlang</Text>
              <Text style={styles.stepDesc}>Xavfsizlik uchun qayta kiriting</Text>
              <PinDots value={pinConfirm} />
              {pinError ? <Text style={styles.pinError}>{pinError}</Text> : null}
              <PinPad value={pinConfirm} onChange={(v) => { setPinConfirm(v); if (v.length === 4 && v !== pin) setPinError("Parollar mos kelmaydi"); else setPinError(''); }} />
              <TouchableOpacity
                style={[styles.nextBtn, (pinConfirm.length < 4 || pinConfirm !== pin) && styles.nextBtnOff]}
                onPress={() => { if (pinConfirm === pin) goNext(); else setPinError("Parollar mos kelmaydi"); }}
              >
                <Text style={styles.nextBtnTxt}>Tasdiqlash →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 4: Child name */}
          {step === 4 && (
            <View style={styles.formStep}>
              <Text style={styles.stepEmoji}>👶</Text>
              <Text style={styles.stepTitle}>Farzandingiz ismi?</Text>
              <Text style={styles.stepDesc}>Ilova shu ism bilan murojaat qiladi</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Farzand ismi..."
                placeholderTextColor={Colors.textLight}
                value={childName}
                onChangeText={setChildName}
                autoFocus autoCapitalize="words"
              />
              <TouchableOpacity
                style={[styles.nextBtn, !canProceed() && styles.nextBtnOff]}
                onPress={() => canProceed() && goNext()}
              >
                <Text style={styles.nextBtnTxt}>Davom etish →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 5: Child age */}
          {step === 5 && (
            <View style={styles.formStep}>
              <Text style={styles.stepEmoji}>🎂</Text>
              <Text style={styles.stepTitle}>{childName}ning yoshi?</Text>
              <Text style={styles.stepDesc}>O'quv dasturi yoshga qarab moslashadi</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.agesRow}>
                {AGES.map(age => (
                  <TouchableOpacity
                    key={age}
                    style={[styles.ageChip, childAge === age && styles.ageChipOn]}
                    onPress={() => setChildAge(age)}
                  >
                    <Text style={[styles.ageNum, childAge === age && styles.ageNumOn]}>{age}</Text>
                    <Text style={[styles.ageSub, childAge === age && styles.ageSubOn]}>yosh</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.nextBtn, !canProceed() && styles.nextBtnOff]}
                onPress={() => canProceed() && goNext()}
              >
                <Text style={styles.nextBtnTxt}>Davom etish →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 6: Gender */}
          {step === 6 && (
            <View style={styles.formStep}>
              <Text style={styles.stepEmoji}>🌈</Text>
              <Text style={styles.stepTitle}>{childName} kim?</Text>
              <Text style={styles.stepDesc}>Avatar va o'yin personaji shu asosda</Text>
              <View style={styles.genderRow}>
                {[{ g: 'boy', emoji: '👦', label: "O'g'il bola" }, { g: 'girl', emoji: '👧', label: 'Qiz bola' }].map(item => (
                  <TouchableOpacity
                    key={item.g}
                    style={[styles.genderCard, childGender === item.g && styles.genderCardOn]}
                    onPress={() => setChildGender(item.g)}
                  >
                    <Text style={styles.genderEmoji}>{item.emoji}</Text>
                    <Text style={[styles.genderLabel, childGender === item.g && styles.genderLabelOn]}>{item.label}</Text>
                    {childGender === item.g && <View style={styles.genderCheck}><Text style={styles.genderCheckTxt}>✓</Text></View>}
                  </TouchableOpacity>
                ))}
              </View>
              {/* Summary */}
              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Xulosa</Text>
                <Text style={styles.summaryRow}>👤 {parentName}  •  🔒 PIN sozlandi</Text>
                <Text style={styles.summaryRow}>
                  {childGender === 'girl' ? '👧' : '👦'} {childName}  •  {childAge} yosh
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.nextBtn, styles.finishBtn, !canProceed() && styles.nextBtnOff]}
                onPress={() => canProceed() && handleFinish()}
              >
                <Text style={styles.nextBtnTxt}>🚀 Boshlash!</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>

      {step > 0 && (
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backBtnTxt}>← Orqaga</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bgDeep },
  blob1: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: Colors.primaryGlow, top: -80, right: -60,
  },
  blob2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.goldGlow, bottom: 60, left: -60,
  },
  blob3: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(168,85,247,0.08)', top: height * 0.4, right: -40,
  },
  progressBar: {
    height: 4, backgroundColor: Colors.border,
    marginTop: Platform.OS === 'ios' ? 50 : 30,
    marginHorizontal: Spacing.lg, borderRadius: 2,
  },
  progressFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.lg },
  center: { alignItems: 'center' },

  // Logo
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  logoEmoji: { fontSize: 44 },
  logoMain: { fontSize: 42, fontWeight: '800' },
  logoKid: { color: Colors.textDark },
  logoUply: { color: Colors.primary },
  welcomeTag: {
    fontSize: 14, color: Colors.textLight, letterSpacing: 1.5,
    textTransform: 'uppercase', marginBottom: 32,
  },
  welcomeCards: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 12, justifyContent: 'center', marginBottom: 36, width: '100%',
  },
  welcomeCard: {
    width: '45%', backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center', ...Shadows.sm,
  },
  welcomeCardIcon: { fontSize: 28, marginBottom: 4 },
  welcomeCardLabel: { fontSize: 13, fontWeight: '700', color: Colors.textDark },
  welcomeCardSub: { fontSize: 11, color: Colors.textLight, marginTop: 2, textAlign: 'center' },
  startBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.round,
    paddingVertical: 16, paddingHorizontal: 56,
    ...Shadows.glow,
  },
  startBtnTxt: { color: Colors.white, fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },

  // Form
  formStep: { alignItems: 'center', paddingTop: 20 },
  stepEmoji: { fontSize: 60, marginBottom: 12 },
  stepTitle: { fontSize: 26, fontWeight: '800', color: Colors.textDark, textAlign: 'center', marginBottom: 6 },
  stepDesc: { fontSize: 14, color: Colors.textLight, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  textInput: {
    width: '100%', backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.md, fontSize: 17, color: Colors.textDark,
    borderWidth: 2.5, borderColor: Colors.border, marginBottom: 24,
    ...Shadows.sm,
  },

  // PIN
  pinDots: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  pinDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2.5, borderColor: Colors.primaryLight, backgroundColor: 'transparent' },
  pinDotFilled: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pinError: { color: Colors.danger, fontSize: 13, marginBottom: 8, fontWeight: '600' },
  pinPad: {
    flexDirection: 'row', flexWrap: 'wrap', width: 240,
    justifyContent: 'center', gap: 12, marginVertical: 16,
  },
  pinKey: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center',
    ...Shadows.sm,
  },
  pinKeyEmpty: { backgroundColor: 'transparent', shadowColor: 'transparent', elevation: 0 },
  pinKeyTxt: { fontSize: 22, fontWeight: '700', color: Colors.textDark },

  // Age
  agesRow: { flexDirection: 'row', gap: 10, paddingVertical: 4, marginBottom: 28 },
  ageChip: {
    width: 64, height: 72, borderRadius: BorderRadius.md, backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2.5, borderColor: Colors.border, ...Shadows.sm,
  },
  ageChipOn: { backgroundColor: Colors.primary, borderColor: Colors.primaryDark, ...Shadows.glow },
  ageNum: { fontSize: 22, fontWeight: '800', color: Colors.textDark },
  ageNumOn: { color: Colors.white },
  ageSub: { fontSize: 10, color: Colors.textLight },
  ageSubOn: { color: 'rgba(255,255,255,0.75)' },

  // Gender
  genderRow: { flexDirection: 'row', gap: 16, marginBottom: 20, width: '100%' },
  genderCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    paddingVertical: 28, alignItems: 'center',
    borderWidth: 2.5, borderColor: Colors.border, ...Shadows.sm,
    position: 'relative',
  },
  genderCardOn: { borderColor: Colors.primary, backgroundColor: Colors.primaryPale, ...Shadows.glow },
  genderEmoji: { fontSize: 52, marginBottom: 8 },
  genderLabel: { fontSize: 15, fontWeight: '700', color: Colors.textMid },
  genderLabelOn: { color: Colors.primaryDark },
  genderCheck: {
    position: 'absolute', top: 10, right: 10,
    width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  genderCheckTxt: { color: Colors.white, fontSize: 13, fontWeight: '800' },

  // Summary
  summary: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.md, width: '100%', marginBottom: 20,
    borderLeftWidth: 4, borderLeftColor: Colors.primary, ...Shadows.sm,
  },
  summaryTitle: { fontSize: 11, fontWeight: '700', color: Colors.textLight, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  summaryRow: { fontSize: 14, color: Colors.textMid, marginBottom: 4, fontWeight: '600' },

  // Buttons
  nextBtn: {
    width: '100%', backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round, paddingVertical: 16,
    alignItems: 'center', ...Shadows.glow,
  },
  nextBtnOff: { backgroundColor: '#B0C4B8', shadowColor: 'transparent', elevation: 0 },
  nextBtnTxt: { color: Colors.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  finishBtn: { backgroundColor: Colors.primaryDark },
  backBtn: { position: 'absolute', bottom: 36, left: Spacing.lg },
  backBtnTxt: { fontSize: 14, color: Colors.textLight, fontWeight: '600' },
});
