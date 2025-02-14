//login page: 
import { Image, StyleSheet, Platform, ActivityIndicator, View, Text, TextInput, Button, Alert, } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeDatabase} from '@/src/db/database';
import { useSQLiteContext } from 'expo-sqlite';
import { User } from '@/src/types/userInfo';



import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';


export default function LoginScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    initializeDatabase(db);
  }, [db]);
  
  
  const userLogin = async () => {
      
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }
    setIsLoading(true); // Show loading state
// Check if there's a username and if there's no username
    // create a checker for the userLogin
    try {
      const user = (await db.getFirstAsync('SELECT * FROM user WHERE username = ?', [username])) as User;
      if (!user) {
        Alert.alert("Error", "Invalid username.");
        return;
      }
      if (user.password === password) {
        await AsyncStorage.setItem('isAuthenticated', 'true');
        router.replace('/(tabs)/home');
      }else {
        Alert.alert("Login Failed", "Incorrect password.");
      }
    } catch (error) {
      console.error("Authentication Error:", error);
      Alert.alert("Error", "An error occurred during authentication.");
      } finally {
        setIsLoading(false);
      }
    };
    const createAccount = async () => {
      if (!username || !password) {
        Alert.alert("Error", "Please enter both username and password.");
        return;
      }
      setIsLoading(true);
      try {
        const user = (await db.getFirstAsync('SELECT * FROM user WHERE username = ?', [username])) as User;
        if (user) {
          Alert.alert("Error", "username already exists, please enter a new one");
          return;
        }
      } catch (error) {
        console.error("Authentication Error:", error);
        Alert.alert("Error", "An error occurred during authentication.");
      } finally {
        setIsLoading(false);
      }

      const UserDeletion = () => {
        const [username, setUserName] = useState<User | null>(null);

        const loadUser = async () => {
          try {
            const storedUser = await AsyncStorage.getItem('username');
            if (storedUser) { ///await db.getFirstAsync('SELECT * FROM user WHERE username = ?', [username])) as User;
              setUserName(JSON.parse(storedUser));
            }
          } catch (error) {
            console.error("Error loading user:", error);
            Alert.alert("Error", "Failed to load user data.");
          } finally {
            setIsLoading(false);
          }

        };

        const deleteUser = async () => {
          try {
            await AsyncStorage.removeItem('user');
            setUserName(null);
            Alert.alert("Success", "User deleted successfully.");
          } catch (error) {
            console.error("Error deleting user:", error);
            Alert.alert("Error", "Failed to delete user.");
          }
        };

      };




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
        <Button title='Create Account!' onPress={createAccount}/>
        <Button title="userdeletion!" onPress={UserDeletion }/>
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