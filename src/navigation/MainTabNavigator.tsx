import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from '../components/CustomTabBar';
import { LearnScreen } from '../screens/main/LearnScreen';
import { PlayScreen } from '../screens/main/PlayScreen';
import { ConnectScreen } from '../screens/main/ConnectScreen';
import { ParentsScreen } from '../screens/main/ParentsScreen';

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Play" component={PlayScreen} />
      <Tab.Screen name="Connect" component={ConnectScreen} />
      <Tab.Screen name="Parents" component={ParentsScreen} />
    </Tab.Navigator>
  );
};
