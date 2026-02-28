import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Shadows } from '../theme';

import LearnScreen from '../screens/LearnScreen';
import PlayScreen from '../screens/PlayScreen';
import ConnectScreen from '../screens/ConnectScreen';
import ParentsScreen from '../screens/ParentsScreen';
import SubjectBlocksScreen from '../screens/SubjectBlocksScreen';
import BlockLessonScreen from '../screens/BlockLessonScreen';
import PlansScreen from '../screens/PlansScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Rasmga 1:1 — oval yashil tugmalar, oq matn
function CustomTabBar({ state, navigation }) {
  const TABS = [
    { name: 'Learn', label: 'Learn' },
    { name: 'Play', label: 'Play' },
    { name: 'Connect', label: 'Connect' },
    { name: 'Parents', label: 'Parents' },
  ];
  return (
    <View style={tb.bar}>
      {TABS.map((tab, index) => {
        const focused = state.index === index;
        return (
          <TouchableOpacity
            key={tab.name}
            style={[tb.tab, focused && tb.tabActive]}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.85}
          >
            <Text style={[tb.label, focused && tb.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function LearnStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LearnHome" component={LearnScreen} />
      <Stack.Screen name="SubjectBlocks" component={SubjectBlocksScreen} />
      <Stack.Screen name="BlockLesson" component={BlockLessonScreen} />
      <Stack.Screen name="Plans" component={PlansScreen} />
    </Stack.Navigator>
  );
}

function ParentsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ParentsHome" component={ParentsScreen} />
      <Stack.Screen name="Plans" component={PlansScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Learn" component={LearnStack} />
      <Tab.Screen name="Play" component={PlayScreen} />
      <Tab.Screen name="Connect" component={ConnectScreen} />
      <Tab.Screen name="Parents" component={ParentsStack} />
    </Tab.Navigator>
  );
}

const tb = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.bgMain,         // Fon — mint green, rasmga mos
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 20,
    gap: 8,
    borderTopWidth: 0,
    // Yuqori chegarada engil soya
    shadowColor: '#60A060',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.round,        // Oval tugma
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: Colors.primary,        // Yashil oval — rasmga mos
    ...Shadows.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMid,                   // Aktiv bo'lmagan — kulrang
  },
  labelActive: {
    color: Colors.white,                     // Aktiv — oq matn
  },
});
