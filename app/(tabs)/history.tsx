import { Image, StyleSheet,  ActivityIndicator,  } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';
import { useUser } from '@/context/UserContext';

const db = SQLite.openDatabaseSync("database.db");

export default function HistoryScreen() {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    

    const { user_id } = useUser();
    console.log('User ID on History screen:', user_id);

    useEffect(() => {
        if (!user_id) {
            setError('No user ID provided.');
            setLoading(false);
            return;
        }
        
        const fetchQuotes = async () => {
            try {
                const result = await db.getAllAsync(
                    `SELECT * FROM quote
                    WHERE user_id = ?
                    AND translated_quote IN (
                        SELECT DISTINCT translated_quote FROM quote WHERE user_id = ?
                    )
                    ORDER BY id DESC`, 
                   [user_id, user_id]
               );
                setQuotes(result);
                console.log('Quotes:', result);
            } catch (error) {
                console.error('Error fetching quotes:', error);
                setError('Failed to load quotes.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, [user_id]);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={<Image source={require('@/assets/images/Designer-2.jpeg')} style={styles.reactLogo} />}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Quote History</ThemedText>
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="black" />
                ) : error ? (
                    <ThemedText>{error}</ThemedText>
                ) : quotes.length === 0 ? (
                    <ThemedText>No quotes found.</ThemedText>
                ) : (
                    <ScrollView>
                        {quotes.map((quoteItem: any) => (
                            <ThemedView style={styles.quoteContainer} key={quoteItem.id}>
                                <ThemedText style={styles.quoteText}>{quoteItem.original_quote}</ThemedText>
                                {quoteItem.translated_quote && (
                                    <ThemedText style={styles.translatedText}>
                                        {quoteItem.translated_quote}
                                    </ThemedText>
                                )}
                            </ThemedView>
                        ))}
                    </ScrollView>
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
        marginTop: 20,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    quoteContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: '#89cff0',
        borderRadius: 10,
        marginBottom: 15,
    },
    quoteText: {
        fontSize: 18,
        color: '#1E3A8A',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    translatedText: {
        fontSize: 16,
        color: '#6B7280',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingTop: 10,
    },
});
