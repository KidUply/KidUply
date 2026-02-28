import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar, Vibration } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { useApp } from '../context/AppContext';

export default function ParentsPinScreen({ onSuccess }) {
  const { verifyPin, parentName } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Vibration.vibrate(200);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleKey = (k) => {
    if (k === '⌫') { setPin(p => p.slice(0, -1)); setError(''); return; }
    const newPin = pin + k;
    setPin(newPin);
    if (newPin.length === 4) {
      setTimeout(() => {
        if (verifyPin(newPin)) {
          onSuccess();
        } else {
          shake();
          setAttempts(a => a + 1);
          setError(attempts >= 2 ? 'Parol noto\'g\'ri! 3 urinish qilindi.' : 'Noto\'g\'ri parol');
          setPin('');
        }
      }, 200);
    }
  };

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <View style={styles.bg}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <View style={styles.container}>
        <View style={styles.lockCircle}>
          <Text style={styles.lockEmoji}>🔐</Text>
        </View>
        <Text style={styles.title}>Ota-ona paneli</Text>
        <Text style={styles.subtitle}>Salom, {parentName}! PIN kiriting</Text>

        <Animated.View style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
          {Array.from({ length: 4 }, (_, i) => (
            <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
          ))}
        </Animated.View>

        {error ? <Text style={styles.errorTxt}>{error}</Text> : <View style={styles.errorPlaceholder} />}

        <View style={styles.pad}>
          {keys.map((k, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.key, k === '' && styles.keyHidden]}
              onPress={() => k && handleKey(k)}
              activeOpacity={0.7}
              disabled={!k}
            >
              <Text style={[styles.keyTxt, k === '⌫' && styles.keyBack]}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bgDeep },
  blob1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: Colors.primaryGlow, top: -100, left: -80,
  },
  blob2: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: Colors.goldGlow, bottom: 40, right: -60,
  },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  lockCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center',
    ...Shadows.card, marginBottom: 20,
  },
  lockEmoji: { fontSize: 42 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textDark, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textLight, marginBottom: 32 },
  dotsRow: { flexDirection: 'row', gap: 18, marginBottom: 8 },
  dot: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2.5, borderColor: Colors.primaryLight, backgroundColor: 'transparent',
  },
  dotFilled: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  errorPlaceholder: { height: 22, marginBottom: 20 },
  errorTxt: { color: Colors.danger, fontSize: 13, fontWeight: '700', marginBottom: 20 },
  pad: {
    flexDirection: 'row', flexWrap: 'wrap',
    width: 260, justifyContent: 'center', gap: 14, marginTop: 8,
  },
  key: {
    width: 74, height: 74, borderRadius: 37,
    backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center',
    ...Shadows.sm,
  },
  keyHidden: { backgroundColor: 'transparent', shadowColor: 'transparent', elevation: 0 },
  keyTxt: { fontSize: 24, fontWeight: '700', color: Colors.textDark },
  keyBack: { fontSize: 20 },
});
