import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { ProgressDots } from '../../components/ProgressDots';
import { supabase } from '../../services/supabase';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uz from '../../translations/uz.json';
import en from '../../translations/en.json';

export const ParentInfoScreen = ({ navigation }: any) => {
  const { data, updateData } = useOnboarding();
  const t = data.language === 'uz' ? uz : en;

  const [parentName, setParentName] = useState(data.parentName);
  const [parentGender, setParentGender] = useState<'male' | 'female' | null>(
    data.parentGender
  );
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!parentName.trim() || !parentGender) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      // Save to Supabase
      const { data: profile, error } = await supabase.from('profiles').insert([
        {
          language: data.language,
          child_name: data.childName,
          child_birth_year: data.childBirthYear,
          child_gender: data.childGender,
          parent_name: parentName.trim(),
          parent_gender: parentGender,
          total_xp: 0,
          stars: 0,
          created_at: new Date().toISOString(),
        },
      ]).select();

      if (error) throw error;

      // Save to AsyncStorage
      await AsyncStorage.setItem('onboarding_completed', 'true');
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile[0]));
      await AsyncStorage.setItem('language', data.language);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate to main app
      navigation.replace('MainApp');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Xatolik',
        error.message || 'Ro\'yxatdan o\'tishda muammo yuz berdi'
      );
    } finally {
      setLoading(false);
    }
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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#2D3748" />
          </TouchableOpacity>

          <ProgressDots total={3} current={2} />

          <View style={styles.iconContainer}>
            <View style={styles.iconBg}>
              <MaterialCommunityIcons name="account-heart" size={48} color="#6BCF7F" />
            </View>
          </View>

          <Text style={styles.title}>{t.onboarding.parentInfo}</Text>

          {/* Parent Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t.onboarding.parentName}</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="account" size={20} color="#94A3B8" />
              <TextInput
                style={styles.input}
                placeholder={placeholder={t.onboarding.parentNamePlaceholder}
                placeholderTextColor="#94A3B8"
                value={parentName}
                onChangeText={setParentName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Parent Gender */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t.onboarding.gender}</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderCard,
                  parentGender === 'male' && styles.genderCardActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setParentGender('male');
                }}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.genderIcon,
                    parentGender === 'male' && styles.genderIconActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="human-male"
                    size={40}
                    color={parentGender === 'male' ? '#FFFFFF' : '#3B82F6'}
                  />
                </View>
                <Text style={styles.genderText}>{t.onboarding.male}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderCard,
                  parentGender === 'female' && styles.genderCardActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setParentGender('female');
                }}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.genderIcon,
                    parentGender === 'female' && styles.genderIconActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="human-female"
                    size={40}
                    color={parentGender === 'female' ? '#FFFFFF' : '#EC4899'}
                  />
                </View>
                <Text style={styles.genderText}>{t.onboarding.female}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Finish Button */}
          <TouchableOpacity
            style={[
              styles.finishButton,
              (!parentName.trim() || !parentGender) && styles.finishButtonDisabled,
            ]}
            onPress={handleFinish}
            disabled={!parentName.trim() || !parentGender || loading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={
                !parentName.trim() || !parentGender
                  ? ['#CBD5E0', '#A0AEC0']
                  : ['#6BCF7F', '#5AB86D']
              }
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.buttonText}>{t.onboarding.finish}</Text>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color="#FFFFFF"
                  />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Child Preview */}
          <View style={styles.previewContainer}>
            <View style={styles.previewCard}>
              <MaterialCommunityIcons
                name={
                  data.childGender === 'boy'
                    ? 'human-male-child'
                    : 'human-female-child'
                }
                size={32}
                color="#6BCF7F"
              />
              <View style={styles.previewText}>
                <Text style={styles.previewLabel}>
                  {data.language === 'uz' ? 'Farzand' : 'Child'}
                </Text>
                <Text style={styles.previewName}>{data.childName}</Text>
                <Text style={styles.previewAge}>
                  {2026 - (data.childBirthYear || 2020)}{' '}
                  {data.language === 'uz' ? 'yosh' : 'years old'}
                </Text>
              </View>
            </View>
          </View>
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
  finishButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    shadowColor: '#6BCF7F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  finishButtonDisabled: {
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
  previewContainer: {
    marginTop: 32,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  previewText: {
    flex: 1,
  },
  previewLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 4,
  },
  previewName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 2,
  },
  previewAge: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
});
