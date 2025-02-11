import { Image, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { db } from '@/src/db/statements';
import bcrypt from 'bcryptjs';
import { Transaction } from 'better-sqlite3';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const userLogin = async () => {
    if (!username || !password) {
        Alert.alert('Error', 'Please enter both username and password.');
        return;
    }

    db.transaction(tx => {
        tx.executeSql(
            'SELECT password FROM users WHERE username = ?;',
            [username],
            (_, { rows }) => {
                if (rows.length > 0) {
                    const storedHashedPassword = rows.item(0).password;

                    if (bcrypt.compareSync(password, storedHashedPassword)) {
                        AsyncStorage.setItem('isAuthenticated', 'true');
                        router.replace('/(tabs)'); // Navigate to tabs after successful login
                    } else {
                        Alert.alert('Error', 'Invalid username or password.');
                    }
                } else {
                    Alert.alert('Error', 'User not found.');
                }
            },
            (_, error) => {
                console.error('Error checking user:', error);
                Alert.alert('Error', 'An error occurred while logging in.');
            }
        );
    });
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
        <Button title='Login!' onPress={userLogin} />
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
