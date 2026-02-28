import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '../theme';
import { useApp } from '../context/AppContext';

const AGES = Array.from({ length: 11 }, (_, i) => i + 4);

export default function AddChildModal({ visible, onClose }) {
  const { addChild } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);

  const reset = () => { setStep(0); setName(''); setAge(null); setGender(null); };

  const handleClose = () => { reset(); onClose(); };

  const handleAdd = () => {
    addChild(name.trim(), age, gender);
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={s.sheet}>
          <View style={s.handle} />
          <Text style={s.title}>
            {step === 0 ? '👶 Yangi farzand' : step === 1 ? '🎂 Yoshi?' : '🌈 Kim?'}
          </Text>

          {/* Step 0: Name */}
          {step === 0 && (
            <View>
              <Text style={s.label}>Farzand ismi</Text>
              <TextInput
                style={s.input}
                placeholder="Ismini kiriting..."
                placeholderTextColor={Colors.textLight}
                value={name}
                onChangeText={setName}
                autoFocus autoCapitalize="words"
              />
              <TouchableOpacity
                style={[s.nextBtn, name.trim().length < 2 && s.nextBtnOff]}
                onPress={() => name.trim().length >= 2 && setStep(1)}
              >
                <Text style={s.nextBtnTxt}>Davom etish →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 1: Age */}
          {step === 1 && (
            <View>
              <Text style={s.label}>{name}ning yoshi:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.agesRow}>
                {AGES.map(a => (
                  <TouchableOpacity
                    key={a}
                    style={[s.ageChip, age === a && s.ageChipOn]}
                    onPress={() => setAge(a)}
                  >
                    <Text style={[s.ageNum, age === a && s.ageNumOn]}>{a}</Text>
                    <Text style={[s.ageLbl, age === a && s.ageLblOn]}>yosh</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[s.nextBtn, !age && s.nextBtnOff]}
                onPress={() => age && setStep(2)}
              >
                <Text style={s.nextBtnTxt}>Davom etish →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: Gender */}
          {step === 2 && (
            <View>
              <Text style={s.label}>{name} kim?</Text>
              <View style={s.genderRow}>
                {[{ g: 'boy', emoji: '👦', label: "O'g'il" }, { g: 'girl', emoji: '👧', label: 'Qiz' }].map(item => (
                  <TouchableOpacity
                    key={item.g}
                    style={[s.genderCard, gender === item.g && s.genderCardOn]}
                    onPress={() => setGender(item.g)}
                  >
                    <Text style={s.genderEmoji}>{item.emoji}</Text>
                    <Text style={[s.genderLabel, gender === item.g && s.genderLabelOn]}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={[s.nextBtn, !gender && s.nextBtnOff]}
                onPress={() => gender && handleAdd()}
              >
                <Text style={s.nextBtnTxt}>✅ Qo'shish</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={s.cancelBtn} onPress={handleClose}>
            <Text style={s.cancelTxt}>Bekor qilish</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingTop: 12, minHeight: 360,
  },
  handle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  title: { fontSize: 19, fontWeight: '800', color: Colors.textDark, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textMid, marginBottom: 10 },
  input: {
    backgroundColor: Colors.bgMain, borderRadius: BorderRadius.md,
    padding: 14, fontSize: 16, color: Colors.textDark,
    borderWidth: 2, borderColor: Colors.border, marginBottom: 20,
  },
  agesRow: { flexDirection: 'row', gap: 10, paddingVertical: 4, marginBottom: 20 },
  ageChip: {
    width: 56, height: 62, borderRadius: BorderRadius.md,
    backgroundColor: Colors.bgMain, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.border,
  },
  ageChipOn: { backgroundColor: Colors.primary, borderColor: Colors.primaryDark },
  ageNum: { fontSize: 19, fontWeight: '800', color: Colors.textDark },
  ageNumOn: { color: Colors.white },
  ageLbl: { fontSize: 9, color: Colors.textLight },
  ageLblOn: { color: 'rgba(255,255,255,0.8)' },
  genderRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  genderCard: {
    flex: 1, backgroundColor: Colors.bgMain,
    borderRadius: BorderRadius.xl, paddingVertical: 22,
    alignItems: 'center', borderWidth: 2.5, borderColor: Colors.border,
  },
  genderCardOn: { borderColor: Colors.primary, backgroundColor: Colors.primaryPale },
  genderEmoji: { fontSize: 44, marginBottom: 8 },
  genderLabel: { fontSize: 14, fontWeight: '700', color: Colors.textMid },
  genderLabelOn: { color: Colors.primaryDark },
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.round,
    paddingVertical: 13, alignItems: 'center',
  },
  nextBtnOff: { backgroundColor: Colors.textLight },
  nextBtnTxt: { color: Colors.white, fontSize: 15, fontWeight: '800' },
  cancelBtn: { marginTop: 14, alignItems: 'center' },
  cancelTxt: { fontSize: 13, color: Colors.textLight, fontWeight: '600' },
});
