//login page: 
import { Image, StyleSheet, TouchableOpacity, View, Text, TextInput, Button, Alert, } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeDatabase} from '@/src/db/database';
import { useSQLiteContext } from 'expo-sqlite';
import { User } from '@/src/types/userInfo';
import { LinearGradient } from 'expo-linear-gradient';
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
        await AsyncStorage.setItem('userId', user.id.toString());
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
        const ExistingUser = (await db.getFirstAsync('SELECT * FROM user WHERE username = ?', [username])) as User;
        if (ExistingUser) {
          Alert.alert("Error", "username already exists, please enter a new one");
          return;
        }

        const insertNewUser = await db.prepareAsync('INSERT INTO user(username, password) VALUES (?,?)');
        await insertNewUser.executeAsync([username, password]);

        Alert.alert("Success", "Account has been created." );
        await AsyncStorage.setItem('isAuthenticated', 'true');
        router.replace('/(tabs)/home');

      } catch (error) {
        console.error("error creating user account: ", error);
        Alert.alert("Error", "There was an issue creating the account");
      }

      finally {
        setIsLoading(false);
      }



    };



  return (
    
    <LinearGradient
    colors={['#04A4FC', 'white']} // Your gradient colors
    style={styles.gradientContainer} // Ensure gradient covers the full screen
    >
  <View style={{ flex: 1 }}>

    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/QuoteLingo_Logo.jpeg')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.themedText}>Welcome to QuoteLingo!{'\n'}Please Login or Create an Account!</ThemedText>

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
            <TouchableOpacity style={styles.loginButton} onPress={userLogin}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
            <TouchableOpacity style={styles.createAccButton} onPress={createAccount}><Text style={styles.buttonTextSecondary}>Create Account</Text></TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
    </View>
    </LinearGradient>

  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1, 
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
   backgroundColor: 'transparent'
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    backgroundColor: 'transparent'
  },
  reactLogo: {
    height: 250,
    width: 410,
    bottom: 0,
    left: 0,
    position: 'absolute',

  },
  themedText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  input: {
    height: 50,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  loginButton: {
    backgroundColor: '#1E90FF', 
    paddingVertical: 15, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 10,
  },
  createAccButton: {
    borderColor: '#1E90FF', 
    borderWidth: 2, 
    paddingVertical: 15, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center',
  },

  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  
  buttonTextSecondary: { color: '#1E90FF', fontSize: 16, fontWeight: '600' },
});