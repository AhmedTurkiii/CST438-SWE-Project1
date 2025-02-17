import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import {  SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '@/src/db/database';
import { LinearGradient } from 'expo-linear-gradient'; 
import { StyleSheet } from 'react-native';
import { UserProvider } from '@/context/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> {/* Wrap your app in GestureHandlerRootView */}

    <UserProvider>  {/* Wrap the whole app in UserProvider */}
    <SQLiteProvider databaseName='database.db' onInit={initializeDatabase}>

    <Tabs initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'index',
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'favorites',
          tabBarIcon: ({ color }) => <AntDesign name="heart" size={28} color={color}/>,
        }}
        />
      <Tabs.Screen
        name="history"
        options={{
          title: 'history',
          tabBarIcon: ({ color }) => <AntDesign name="clockcircleo" size={28} color={color}/>,
        }}
        />
    </Tabs>
    </SQLiteProvider>
    </UserProvider>
    </GestureHandlerRootView>

  );
}
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1, // Ensures the gradient covers the entire screen
    backgroundColor: 'transparent', 
  },
});
