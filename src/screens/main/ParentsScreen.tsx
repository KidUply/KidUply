import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useUserData } from '../../hooks/useUserData';

const { width } = Dimensions.get('window');

// Grafiklar uchun kichik komponent (Senior Style)
const WeeklyBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <View style={styles.barContainer}>
    <View style={[styles.barFill, { height: value * 100, backgroundColor: color }]} />
    <Text style={styles.barLabel}>{label}</Text>
  </View>
);

export const ParentsScreen = () => {
  const { user } = useUserData();
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'premium'>('premium');

  const plans = [
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$4.99/mo',
      features: [
        { text: '50% Lessons & Games', active: true },
        { text: 'Basic Progress Tracking', active: true },
        { text: 'AI Interaction', active: false },
        { text: 'Detailed Parent Reports', active: false },
        { text: 'AI Career Guidance', active: false },
      ],
      color: '#4FACFE'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$9.99/mo',
      features: [
        { text: '100% All Content Unlocked', active: true },
        { text: 'Real-time AI Mentorship', active: true },
        { text: 'Comprehensive Parent Dashboard', active: true },
        { text: 'Personalized AI Insights', active: true },
        { text: 'Early Access to New Games', active: true },
      ],
      color: '#6BCF7F'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={styles.header}>
          <SafeAreaView>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.parentTitle}>Parents Dashboard</Text>
                <Text style={styles.childSelect}>Monitoring: {user?.child_name || 'Emma'}</Text>
              </View>
              <TouchableOpacity style={styles.settingsBtn}>
                <MaterialCommunityIcons name="cog-outline" size={24} color="#4A5568" />
              </TouchableOpacity>
            </View>

            {/* Performance Stats */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Learning Activity (Weekly)</Text>
              <View style={styles.chartRow}>
                <WeeklyBar label="Mon" value={0.4} color="#6BCF7F" />
                <WeeklyBar label="Tue" value={0.8} color="#6BCF7F" />
                <WeeklyBar label="Wed" value={0.6} color="#4FACFE" />
                <WeeklyBar label="Thu" value={0.9} color="#6BCF7F" />
                <WeeklyBar label="Fri" value={0.3} color="#F6AD55" />
                <WeeklyBar label="Sat" value={0.2} color="#CBD5E0" />
                <WeeklyBar label="Sun" value={0.1} color="#CBD5E0" />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* AI Insight Section (Premium Look) */}
        <View style={styles.insightSection}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <BlurView intensity={40} style={styles.aiCard}>
            <LinearGradient 
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(107, 207, 127, 0.1)']} 
              style={styles.aiGradient}
            >
              <View style={styles.aiIconWrapper}>
                <MaterialCommunityIcons name="brain" size={28} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiBadgeText}>AI ANALYSIS</Text>
                <Text style={styles.aiMessage}>
                  {user?.child_name || 'Emma'} has shown 25% improvement in Logical Reasoning this week. 
                  Focus on "Geometry" next to maintain the streak.
                </Text>
              </View>
            </LinearGradient>
          </BlurView>
        </View>

        {/* Subscription / Pricing Section */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Upgrade KidUply</Text>
          <Text style={styles.sectionSubtitle}>Unlock your child's full potential</Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.plansScroll}
            snapToInterval={width * 0.8 + 20}
            decelerationRate="fast"
          >
            {plans.map((plan) => (
              <TouchableOpacity 
                key={plan.id}
                onPress={() => {
                  setSelectedPlan(plan.id as any);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                }}
                activeOpacity={0.95}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && { borderColor: plan.color, borderWidth: 2 }
                ]}
              >
                <View style={styles.planHeader}>
                  <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </View>

                <View style={styles.featuresList}>
                  {plan.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <MaterialCommunityIcons 
                        name={feature.active ? "check-circle" : "close-circle-outline"} 
                        size={20} 
                        color={feature.active ? plan.color : "#CBD5E0"} 
                      />
                      <Text style={[styles.featureText, !feature.active && styles.disabledFeature]}>
                        {feature.text}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.buyButton, { backgroundColor: plan.color }]}
                >
                  <Text style={styles.buyButtonText}>Get {plan.name}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* Free Plan Feedback Card */}
            <View style={styles.freeCard}>
              <Text style={styles.freeLabel}>Current Plan: Free</Text>
              <Text style={styles.freeWarning}>
                You're missing out on 80% of interactive content and AI reports.
              </Text>
              <MaterialCommunityIcons name="trending-down" size={40} color="#CBD5E0" style={{marginTop: 10}} />
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  parentTitle: { fontSize: 26, fontWeight: '900', color: '#1A365D' },
  childSelect: { fontSize: 16, color: '#718096', fontWeight: '600' },
  settingsBtn: { padding: 8, backgroundColor: '#FFF', borderRadius: 12, elevation: 2 },
  
  chartCard: { backgroundColor: '#FFF', marginTop: 25, borderRadius: 24, padding: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  chartTitle: { fontSize: 18, fontWeight: '800', color: '#2D3748', marginBottom: 20 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barContainer: { alignItems: 'center', width: 30 },
  barFill: { width: 12, borderRadius: 6, marginBottom: 8 },
  barLabel: { fontSize: 10, color: '#A0AEC0', fontWeight: '700' },

  insightSection: { paddingHorizontal: 20, marginTop: 30 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#1A365D', marginBottom: 5 },
  sectionSubtitle: { fontSize: 14, color: '#718096', marginBottom: 20 },
  aiCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.2)' },
  aiGradient: { padding: 20, flexDirection: 'row', gap: 15, alignItems: 'center' },
  aiIconWrapper: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  aiBadgeText: { fontSize: 10, fontWeight: '900', color: '#8B5CF6', letterSpacing: 1 },
  aiMessage: { fontSize: 15, color: '#4A5568', lineHeight: 22, fontWeight: '500' },

  pricingSection: { marginTop: 40 },
  plansScroll: { paddingLeft: 20, paddingRight: 20 },
  planCard: { 
    width: width * 0.8, 
    backgroundColor: '#FFF', 
    borderRadius: 30, 
    padding: 24, 
    marginRight: 20, 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.15, 
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  planHeader: { marginBottom: 20 },
  planName: { fontSize: 22, fontWeight: '900' },
  planPrice: { fontSize: 28, fontWeight: '800', color: '#1A365D', marginTop: 5 },
  featuresList: { marginBottom: 25 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  featureText: { fontSize: 14, color: '#4A5568', fontWeight: '600' },
  disabledFeature: { color: '#CBD5E0', textDecorationLine: 'line-through' },
  buyButton: { paddingVertical: 15, borderRadius: 18, alignItems: 'center' },
  buyButtonText: { color: '#FFF', fontWeight: '800', fontSize: 16 },

  freeCard: { 
    width: width * 0.6, 
    backgroundColor: '#F8FAFC', 
    borderRadius: 30, 
    padding: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#CBD5E0'
  },
  freeLabel: { fontSize: 14, fontWeight: '800', color: '#718096' },
  freeWarning: { fontSize: 12, color: '#A0AEC0', textAlign: 'center', marginTop: 10 }
});
