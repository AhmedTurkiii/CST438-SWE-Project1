import { Image, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import React from 'react';

const API_URL = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
const TRANSLATION_API_URL = 'https://api.mymemory.translated.net/get';
const API_HEADERS = {
    'X-RapidAPI-Key': 'a5a304577amsh4a57cfe3d7f6242p1bd77bjsn25ca0059531e', 
    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com',
};

export default function HomeScreen() {
    const [quote, setQuote] = useState(null);
    const [quoteId, setQuoteId] = useState(null);
    const [translatedQuote, setTranslatedQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getQuote = async () => {
            try {
                const response = await axios.get(API_URL, { headers: API_HEADERS });
                const fetchedQuote = response.data.content;
                const fetchedQuoteId = response.data.id;
                setQuote(fetchedQuote);
                setQuoteId(fetchedQuoteId);

                // Translate the quote to French
                const translationResponse = await axios.get(TRANSLATION_API_URL, {
                    params: {
                        q: fetchedQuote,
                        langpair: 'en|es',
                    },
                });
                setTranslatedQuote(translationResponse.data.responseData.translatedText);
            } catch (error) {
                setError('Failed to fetch quote');
            } finally {
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
                    source={require('@/assets/images/Designer-1.jpeg')}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Today’s Quote</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                {/* <ThemedText type="subtitle">
                    This is the page where all your favorite quotes will appear! Below is a randomly generated quote.
                </ThemedText> */}
            </ThemedView>
            <ThemedView style={styles.quoteContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="black" />
                ) : error ? (
                    <ThemedText>{error}</ThemedText>
                ) : (
                    <>
                        {/* <ThemedText>ID: {quoteId}</ThemedText> */}
                        <ThemedText style={styles.quoteText}>{quote}</ThemedText>
                        <ThemedText style={styles.translatedText}>{translatedQuote}</ThemedText>
                    </>
                )}
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    reactLogo: {
        height: 250,
        width: 410,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    quoteContainer: {
        margin: 0.1,
        padding: 5,
        backgroundColor: '#89cff0',
        borderRadius: 10,
    },
    quoteText: {
      fontSize: 18, 
      color: '#1E3A8A', // Dark blue for a professional and readable look
      fontWeight: 'bold', // Emphasize the original quote
      textAlign: 'center',
      padding: 10,
  },
  
  translatedText: {
      fontSize: 16, 
      color: '#6B7280', // Soft gray for a subtle contrast
      fontStyle: 'italic', // Differentiate translation with italics
      textAlign: 'center',
      padding: 10,
      backgroundColor: '#F3F4F6', // Light gray background for a distinct separation
      borderRadius: 8, // Soft rounded corners
  },
  
});
