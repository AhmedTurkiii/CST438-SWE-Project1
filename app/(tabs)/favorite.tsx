import { Image, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';

//API URL and headers needed to fetch quotes
const API_URL = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
const API_HEADERS = {
    'X-RapidAPI-Key': 'a5a304577amsh4a57cfe3d7f6242p1bd77bjsn25ca0059531e', 
    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com',

}
export default function FavoriteQuotes() {
    // this is an example of how the API will function
    // wanted to test fetching API
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const getQuote = async () => {
            try {
                const response = await axios.get(API_URL, { headers:API_HEADERS});
                setQuote(response.data.content);
            }catch (error) {
                setError('Failed to fetch quote');
            }finally{
                setLoading(false);
            }
        };

        getQuote();
    }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/quotelingo_logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Favorite Quotes</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">This is the page where all your Favorite quotes will appear! for now, below you will see a quote that is randomly generated.</ThemedText>
      </ThemedView>
      <ThemedView style={styles.quoteContainer}>
        {loading ? (
            <ActivityIndicator size={"large"} color={"black"}/>
        ) : error ? (
            <ThemedText>{error}</ThemedText>
        ) : (
            <ThemedText>{quote}</ThemedText>
        )}
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
  quoteContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#A1CEDC',
    borderRadius: 8
  }
});