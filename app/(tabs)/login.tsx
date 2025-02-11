//login page: 
import { Image, StyleSheet, Platform, ActivityIndicator, View, Text, TextInput, Button, Alert, } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';


export default function LoginScreen() {
  const router = useRouter();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

    const userLogin = async () => {
        if (username === "test" && password === "123") {
          try {
            await AsyncStorage.setItem('isAuthenticated', 'true');
            router.replace('/(tabs)');
          } catch(error) {
            console.error("Failed to save authentication", error)
          }
        }else {
            alert('Invalid credentials');
          }


    };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/QuoteLingo_Logo.jpeg')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to QuoteLingo! Please Login or Create an Account!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <TextInput
            placeholder='Enter Username'
            value={username}
            onChangeText={setUserName}
            style={styles.input}
        />
        <TextInput
            placeholder='Enter Password'
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
        />
        <Button title='Login!' onPress={userLogin}/>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 250,
    width: 410,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});