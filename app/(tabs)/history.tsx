import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// API URL and headers needed to fetch quotes
const API_URL = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
const API_HEADERS = {
    'X-RapidAPI-Key': 'a5a304577amsh4a57cfe3d7f6242p1bd77bjsn25ca0059531e',
    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com',
};

export default function HomeScreen() {
    const [quote, setQuote] = useState('Tap a button to see a quote');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuote = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(API_URL, { headers: API_HEADERS });
            setQuote(response.data.content);
        } catch (error) {
            setError('Failed to fetch quote');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image source={require('@/assets/images/QuoteLingo_Logo.jpeg')} style={styles.reactLogo} />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Quote History</ThemedText>
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Here you will find all the quotes you have seen.</ThemedText>
            </ThemedView>

            <ThemedView style={styles.quoteContainer}>
                <TouchableOpacity onPress={fetchQuote}>
                    <ThemedText type="default" style={styles.quoteText}>
                        {loading ? 'Fetching quote...' : error ? error : quote}
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.quoteContainer}>
                <TouchableOpacity onPress={fetchQuote}>
                    <ThemedText type="default" style={styles.quoteText}>
                        {loading ? 'Fetching quote...' : error ? error : quote}
                    </ThemedText>
                </TouchableOpacity>
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
        margin: 5,
        padding: 10,
        backgroundColor: '#89cff0',
        borderRadius: 10,
    },
    quoteText: {
        fontSize: 16,
        color: '#333',
    },
});
