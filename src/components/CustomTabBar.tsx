import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Icon mapping
            const getIconName = () => {
              switch (route.name) {
                case 'Learn':
                  return 'book-open-variant';
                case 'Play':
                  return 'gamepad-variant';
                case 'Connect':
                  return 'account-group';
                case 'Parents':
                  return 'shield-account';
                default:
                  return 'help-circle';
              }
            };

            // Label mapping
            const getLabel = () => {
              switch (route.name) {
                case 'Learn':
                  return 'Learn';
                case 'Play':
                  return 'Play';
                case 'Connect':
                  return 'Connect';
                case 'Parents':
                  return 'Parents';
                default:
                  return route.name;
              }
            };

            const scale = useSharedValue(1);
            const iconColor = isFocused ? '#6BCF7F' : '#94A3B8';

            const animatedIconStyle = useAnimatedStyle(() => ({
              transform: [{ scale: scale.value }],
            }));

            const animatedButtonStyle = useAnimatedStyle(() => ({
              backgroundColor: withTiming(
                isFocused ? 'rgba(107, 207, 127, 0.15)' : 'transparent',
                { duration: 200 }
              ),
            }));

            React.useEffect(() => {
              scale.value = withSpring(isFocused ? 1.1 : 1, {
                damping: 15,
                stiffness: 200,
              });
            }, [isFocused]);

            return (
              <AnimatedTouchable
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                style={[styles.tabButton, animatedButtonStyle]}
                activeOpacity={0.7}
              >
                <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                  <MaterialCommunityIcons
                    name={getIconName() as any}
                    size={24}
                    color={iconColor}
                  />
                </Animated.View>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: iconColor, fontWeight: isFocused ? '700' : '500' },
                  ]}
                >
                  {getLabel()}
                </Text>
              </AnimatedTouchable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 16,
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 16,
    gap: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
});
