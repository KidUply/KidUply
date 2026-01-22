import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { LanguageScreen } from './src/screens/onboarding/LanguageScreen';
import { ChildInfoScreen } from './src/screens/onboarding/ChildInfoScreen';
import { ParentInfoScreen } from './src/screens/onboarding/ParentInfoScreen';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboarding_completed');
      setIsOnboarded(completed === 'true');
    } catch (error) {
      console.error('Error checking onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6BCF7F" />
      </View>
    );
  }

  return (
    <OnboardingProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
          initialRouteName={isOnboarded ? 'MainApp' : 'Language'}
        >
          {/* Onboarding Screens */}
          <Stack.Screen name="Language" component={LanguageScreen} />
          <Stack.Screen name="ChildInfo" component={ChildInfoScreen} />
          <Stack.Screen name="ParentInfo" component={ParentInfoScreen} />
          
          {/* Main App (placeholder for now) */}
          <Stack.Screen 
            name="MainApp" 
            component={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24 }}>🎉 Main App Here!</Text>
              </View>
            )} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </OnboardingProvider>
  );
}
