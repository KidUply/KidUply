import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useOnboarding } from '../../context/OnboardingContext';
import { ProgressDots } from '../../components/ProgressDots';
import * as Haptics from 'expo-haptics';
import uz from '../../translations/uz.json';
import en from '../../translations/en.json';

export const ChildInfoScreen = ({ navigation }: any) => {
  const { data, updateData } = useOnboarding();
  const t = data.language === 'uz' ? uz : en;

  const [childName, setChildName] = useState(data.childName);
  const [birthYear, setBirthYear] = useState<number | null>(data.childBirthYear);
  const [gender, setGender] = useState<'boy' | 'girl' | null>(data.childGender);

  const years = Array.from({ length: 7 }, (_, i) => 2022 - i); // 2022, 2021, ..., 2016

  const handleContinue = () => {
    if (!childName.trim() || !birthYear || !gender) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData('childName', childName.trim());
    updateData('childBirthYear', birthYear);
    updateData('childGender', gender);
    navigation.navigate('ParentInfo');
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#E8F5E9', '#F1F8F4', '#FFFFFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#2D3748" />
          </TouchableOpacity>

          <ProgressDots total={3} current={1} />

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBg}>
              <MaterialCommunityIcons name="account-child" size={48} color="#6BCF7F" />
            </View>
          </View>

          <Text style={styles.title}>{t.onboarding.childInfo}</Text>

          {/* Child Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t.onboarding.childName}</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="account" size={20} color="#94A3B8" />
              <TextInput
                style={styles.input}
                placeholder={t.onboarding.childNamePlaceholder}
                placeholderTextColor="#94A3B8"
                value={childName}
                onChangeText={setChildName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Birth Year Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t.onboarding.birthYear}</Text>
            <View style={styles.pickerWrapper}>
              <MaterialCommunityIcons name="calendar" size={20} color="#94A3B8" />
              <Picker
                selectedValue={birthYear}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setBirthYear(value);
                }}
                style={styles.picker}
              >
                <Picker.Item label={t.onboarding.selectYear} value={null} />
                {years.map((year) => (
                  <Picker.Item key={year} label={String(year)} value={year} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Gender Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t.onboarding.gender}</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderCard,
                  gender === 'boy' && styles.genderCardActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setGender('boy');
                }}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.genderIcon,
                    gender === 'boy' && styles.genderIconActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="human-male-child"
                    size={40}
                    color={gender === 'boy' ? '#FFFFFF' : '#6BCF7F'}
                  />
                </View>
                <Text style={styles.genderText}>{t.onboarding.boy}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderCard,
                  gender === 'girl' && styles.genderCardActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setGender('girl');
                }}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.genderIcon,
                    gender === 'girl' && styles.genderIconActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="human-female-child"
                    size={40}
                    color={gender === 'girl' ? '#FFFFFF' : '#FF6BA6'}
                  />
                </View>
                <Text style={styles.genderText}>{t.onboarding.girl}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!childName.trim() || !birthYear || !gender) && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!childName.trim() || !birthYear || !gender}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={
                !childName.trim() || !birthYear || !gender
                  ? ['#CBD5E0', '#A0AEC0']
                  : ['#6BCF7F', '#5AB86D']
              }
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>{t.onboarding.continue}</Text>
              <MaterialCommunityIcons name="arrow-right" size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  iconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6BCF7F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    paddingVertical: 16,
    marginLeft: 12,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  picker: {
    flex: 1,
    marginLeft: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  genderCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  genderCardActive: {
    borderColor: '#6BCF7F',
    backgroundColor: '#F0FDF4',
  },
  genderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  genderIconActive: {
    backgroundColor: '#6BCF7F',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    shadowColor: '#6BCF7F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
