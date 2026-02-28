// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

// Context va navigator import
import { AppProvider, useApp } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';

// RootNavigator – onboarding tugagach asosiy app navigatorni ko‘rsatadi
function RootNavigator() {
  const { onboardingStep } = useApp();

  // Agar onboarding hali tugamagan bo‘lsa
  if (onboardingStep !== 'done') {
    return <OnboardingScreen />;
  }

  // Onboarding tugagach asosiy navigatorni ko‘rsatadi
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

// App component
export default function App() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProvider>
  );
}
