import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { ProgressDots } from '../../components/ProgressDots';
import * as Haptics from 'expo-haptics';

export const LanguageScreen = ({ navigation }: any) => {
  const { data, updateData } = useOnboarding();
  const [selectedLang, setSelectedLang] = React.useState<'uz' | 'en'>(data.language);

  const handleSelect = (lang: 'uz' | 'en') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLang(lang);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateData('language', selectedLang);
    navigation.navigate('ChildInfo');
  };

  return (
    <LinearGradient
      colors={['#E8F5E9', '#F1F8F4', '#FFFFFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Progress */}
          <ProgressDots total={3} current={0} />

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBg}>
              <MaterialCommunityIcons name="translate" size={48} color="#6BCF7F" />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {selectedLang === 'uz' ? 'Tilni tanlang' : 'Select Language'}
          </Text>

          {/* Language Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.languageCard,
                selectedLang === 'uz' && styles.languageCardActive,
              ]}
              onPress={() => handleSelect('uz')}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={styles.flagContainer}>
                  <Text style={styles.flag}>🇺🇿</Text>
                </View>
                <Text style={styles.languageText}>O'zbek tili</Text>
              </View>
              {selectedLang === 'uz' && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={28}
                  color="#6BCF7F"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageCard,
                selectedLang === 'en' && styles.languageCardActive,
              ]}
              onPress={() => handleSelect('en')}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={styles.flagContainer}>
                  <Text style={styles.flag}>🇬🇧</Text>
                </View>
                <Text style={styles.languageText}>English</Text>
              </View>
              {selectedLang === 'en' && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={28}
                  color="#6BCF7F"
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#6BCF7F', '#5AB86D']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>
                {selectedLang === 'uz' ? 'Davom etish' : 'Continue'}
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBg: {
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
  optionsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  languageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  languageCardActive: {
    borderColor: '#6BCF7F',
    backgroundColor: '#F0FDF4',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  flagContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    fontSize: 32,
  },
  languageText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6BCF7F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
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
