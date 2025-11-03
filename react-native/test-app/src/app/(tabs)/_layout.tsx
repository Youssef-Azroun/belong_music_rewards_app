// Tab layout for main navigation
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet, Platform, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { THEME } from '../../constants/theme';

function AnimatedTabIcon({ 
  icon, 
  focused 
}: { 
  icon: string; 
  focused: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1.1 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.5)).current;
  const indicatorOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(indicatorOpacity, {
        toValue: focused ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={styles.tabItem}>
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            opacity: indicatorOpacity,
          },
        ]}
      />
      <Animated.Text
        style={[
          styles.icon,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {icon}
      </Animated.Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.colors.accent,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 70 : 58,
          paddingTop: Platform.OS === 'ios' ? 6 : 4,
          paddingBottom: Platform.OS === 'ios' ? 20 : 6,
          paddingHorizontal: THEME.spacing.lg,
          elevation: 0,
          shadowOpacity: 0,
          borderTopColor: 'transparent',
          position: 'absolute',
        },
        tabBarItemStyle: {
          flex: 1,
          paddingVertical: 0,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginTop: 4,
          marginBottom: 0,
        },
        tabBarLabelPosition: 'below-icon',
        headerStyle: {
          backgroundColor: THEME.colors.background,
        },
        headerTintColor: THEME.colors.text.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Challenges',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon icon="🎵" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon icon="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 2.5,
    backgroundColor: THEME.colors.accent,
    borderRadius: 2,
    shadowColor: THEME.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 22,
  },
});