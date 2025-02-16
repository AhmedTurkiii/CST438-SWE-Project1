import { Image, StyleSheet, Platform, ActivityIndicator, TouchableOpacity, Button, Text } from 'react-native';
import axios from 'axios';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import React from 'react';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SQLiteDatabase } from 'expo-sqlite';
import { initializeDatabase } from '@/src/db/database';
import * as SQLite from 'expo-sqlite';



const API_URL = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
const TRANSLATION_API_URL = 'https://api.mymemory.translated.net/get';

const API_HEADERS = {
    'X-RapidAPI-Key': 'a5a304577amsh4a57cfe3d7f6242p1bd77bjsn25ca0059531e', 
    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com',
};

const LANGUAGES = [
    {name: "Spanish", code: "es"},
    {name: "French", code: "fr"},
    {name: "Portugues", code: "pt"},
    {name: "Russian", code: "ru"},
];
const db = SQLite.openDatabaseSync("database.db");
if (!db) {
    console.error("Database failed to open.");
}

export default function HomeScreen() {
    const [quote, setQuote] = useState(null);
    const [quoteId, setQuoteId] = useState(null);
    const [translatedQuote, setTranslatedQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);



    useEffect(() => {
        if (db) {
            initializeDatabase(db);
        } else {
            console.error("Database not initialized.");
        }

        const getQuote = async () => {
            try {
                const response = await axios.get(API_URL, { headers: API_HEADERS });
                const fetchedQuote = response.data.content;
                const fetchedQuoteId = response.data.id;
                setQuote(fetchedQuote);
                setQuoteId(fetchedQuoteId);
            
            } catch (error) {
                console.error("Error fetching quote:", error);
                setError('Failed to fetch quote');
            } finally {
                setLoading(false);
            }
        };


            

        getQuote();
    }, []);

    const translateQuote = async (languageCode : string) => {
        if (!quote) return;

        setSelectedLanguage(languageCode);
        setTranslatedQuote(null);

        try {
            const translationResponse = await axios.get(TRANSLATION_API_URL, {
                params: { q: quote, langpair:  `en|${languageCode}`},
            });
            setTranslatedQuote(translationResponse.data.responseData.translatedText);
        } catch(error) { 
            console.error("Error translating quote: ", error);
           // setTranslatedQuote("Translation failed :((");
        }
    };

    const addQuote = async (db: SQLiteDatabase, quote: string, translatedQuote: string | null, quoteId: string) => {
        if (!quote) {
            console.error("No quote to add.");
            return;
        }
    
        try {
            await db.runAsync(
                `INSERT INTO quote (user_id, original_quote, translated_quote, quote_api_id) 
                 VALUES (?, ?, ?, ?)`,
                [1, quote, translatedQuote || null, quoteId]
            );
    
            console.log("Quote added successfully!");
    
            // Fetch the last saved quote
            const lastSaved = await db.getFirstAsync(
                `SELECT * FROM quote ORDER BY id DESC LIMIT 1`
            );
    
            if (lastSaved) {
                console.log("Last saved quote:", lastSaved);
  
            }
    
        } catch (error) {
            console.error("Error adding quote:", error);
        }
    };
    
    

    const addQuoteToFavorites = async (db: SQLiteDatabase, quote: string, translatedQuote: string | null) => {
        if (!quote) {
            console.error("No quote to add to favorites.");
            return;
        }
    
        try {
            await db.runAsync(
                `INSERT INTO favorites (user_id, quote, translated_quote) 
                 VALUES (?, ?, ?)`,
                [1, quote, translatedQuote || null]
            );
    
            console.log("Quote added to favorites!");
    
            // Fetch the last saved favorite
            const lastFavorite = await db.getFirstAsync(
                `SELECT * FROM favorites ORDER BY id DESC LIMIT 1`
            );
    
            if (lastFavorite) {
                console.log("Last saved favorite:", lastFavorite);

            }
    
        } catch (error) {
            console.error("Error adding quote to favorites:", error);
        }
    };
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/Designer-2.jpeg')}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Today’s Quote</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
            <TouchableOpacity 
    style={styles.button} 
    onPress={() => quote && addQuoteToFavorites(db, quote, translatedQuote)}
>
    <ThemedText style={styles.buttonText}>Add to Favorites</ThemedText>
</TouchableOpacity>
                <TouchableOpacity 
    style={styles.button} 
    onPress={() => quoteId && addQuote(db, quote!, translatedQuote, quoteId)}
>
    <ThemedText style={styles.buttonText}>Save Quote</ThemedText>
</TouchableOpacity>

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
                        {/* <ThemedText style={styles.translatedText}>{translatedQuote}</ThemedText> */}
                    </>
                    
                )}
                
            {/* Display the translated Quote */}
            {selectedLanguage && (
                <ThemedView style={styles.translatedContainer}>
                    {translatedQuote ? (
                        <ThemedText style={styles.translatedText}>{translatedQuote}</ThemedText>
                    ) : (
                        <ActivityIndicator size="small" color="black"/>
                    )}
                    
                </ThemedView>
            )}
            </ThemedView>
            {/* language selection message */}
            <ThemedView style={styles.languagePrompt}>
                <ThemedText>Select a language to translate to: </ThemedText>
            </ThemedView>

            {/* List of language buttons fetched from API */}
            <ThemedView style={styles.languageContainer}>
                {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                        key ={lang.code}
                        style = {[styles.button, selectedLanguage === lang.code && styles.selectedButton]}
                        onPress={() => translateQuote(lang.code)}>
                            <ThemedText style={styles.buttonText}>{lang.name}</ThemedText>
                    </TouchableOpacity>
                ))}
            </ThemedView>

            {/* Display the translated Quote
            {selectedLanguage && (
                <ThemedView style={styles.translatedContainer}>
                    {translatedQuote ? (
                        <ThemedText style={styles.translatedText}>{translatedQuote}</ThemedText>
                    ) : (
                        <ActivityIndicator size="small" color="black"/>
                    )}
                    
                </ThemedView>
            )} */}
            
        </ParallaxScrollView>
    </GestureHandlerRootView>
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

     languagePrompt: {
        marginTop: 20,
        alignItems: "center",
},
    languageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
        marginTop: 10,
        paddingHorizontal: 10,

    },
    button: {
        backgroundColor: "#1E3A8A",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginHorizontal: 4,
        minWidth: 80,
        alignItems: "center",
},
selectedButton: {
    backgroundColor: "#89cff0",
},
buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
},
translatedContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    alignItems: "center",
},
  translatedText: {
      fontSize: 16, 
      color: '#6B7280',
      fontStyle: 'italic',
      textAlign: 'center',
      padding: 10,
      backgroundColor: '#F3F4F6', 
      borderRadius: 8, 
  },
  
});


function openDatabase(arg0: string) {
    throw new Error('Function not implemented.');
}

