import { Redirect, Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState <boolean | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authStatus = await AsyncStorage.getItem('isAuthenticated');
        if(authStatus !== isAuthenticated){
          setIsAuthenticated(authStatus === 'true');
          console.log("Authentication successful!");
        }
        
      } catch(error) {
        console.error("Error reading authorization status from storage", error);
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  if(isAuthenticated === null) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <Redirect href={"/login"}/>;
  }
  return (
    <Tabs
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
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color }) => <AntDesign name="heart" size={28} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <AntDesign name="heart" size={28} color={color}/>,
        }}
        />
              <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <AntDesign name="heart" size={28} color={color}/>,
        }}
        />
     
    </Tabs>
  );
}
