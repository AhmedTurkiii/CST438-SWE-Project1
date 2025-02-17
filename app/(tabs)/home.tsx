import { Image, StyleSheet, Platform, ActivityIndicator, TouchableOpacity, Button, Text } from 'react-native';
import axios from 'axios';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SQLiteDatabase } from 'expo-sqlite';
import { initializeDatabase } from '@/src/db/database';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, SearchParams, router } from 'expo-router';
import { View } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';
import { useUser } from '@/context/UserContext';



const API_URL = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
const TRANSLATION_API_URL = 'https://api.mymemory.translated.net/get';

const API_HEADERS = {
    'X-RapidAPI-Key': 'a5a304577amsh4a57cfe3d7f6242p1bd77bjsn25ca0059531e', 
    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com',
};

const LANGUAGES = [
    {name: "Spanish", code: "es"},
    {name: "French", code: "fr"},
    {name: "Portuguese", code: "pt"},
    {name: "Russian", code: "ru"},
    {name: "Arabic", code: "ar"},

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
 

    // function that fetches quote from API
    const { user_id } = useUser();
    console.log('User ID on Home screen:', user_id); 
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

    //function that translates original quote to selected language
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
                [user_id, quote, translatedQuote || null, quoteId]
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

    if (quote && quoteId) {
        addQuote(db, quote, translatedQuote, quoteId);
    } else {
        console.error('Quote or QuoteId is missing.');
    }
    

    const addQuoteToFavorites = async (db: SQLiteDatabase, quote: string, translatedQuote: string | null) => {
        if (!quote) {
            console.error("No quote to add to favorites.");
            return;
        }
    
        try {
            await db.runAsync(
                `INSERT INTO favorites (user_id, quote, translated_quote) 
                 VALUES (?, ?, ?)`,
                [user_id, quote, translatedQuote || null]
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
                <ThemedText type="title" style={styles.titleText}>Welcome to Quotelingo! 🌍✨{'\n'}Learn languages by translating daily quotes.</ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
            <TouchableOpacity 
    style={styles.button} 
    onPress={() => quote && addQuoteToFavorites(db, quote, translatedQuote)}
>
    <ThemedText style={styles.buttonText}>❤️Add Original Quote to Favorites!❤️</ThemedText>
</TouchableOpacity>
            </ThemedView>
        
            <ThemedView style={styles.quoteContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="black" />
                ) : error ? (
                    <ThemedText>{error}</ThemedText>
                ) : (
                    <>
                        <ThemedText style={styles.quoteText}>{quote}

                        </ThemedText>
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
            </ThemedView>
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
        marginTop: 10, 
        padding: 12,  
        backgroundColor: '#FFFFFF',  
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 3 },
        // shadowOpacity: 0.05,
        // shadowRadius: 5,
        // elevation: 3,
    },
    titleText: {
        fontSize: 16,
        color: '#1E3A8A', 
        fontWeight: '600', 
        textAlign: 'center', 
        letterSpacing: 1, 
        lineHeight: 36,
        fontFamily: 'Arial', 
        paddingHorizontal: 10, 
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    quoteContainer: {
        margin: 16,
        padding: 20,
        backgroundColor: '#A1CEDC',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    quoteText: {
        fontSize: 18,
        color: '#1E3A8A',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
  },

     languagePrompt: {
        marginTop: 20,
        alignItems: "center",
        padding: 15, 
        backgroundColor: '#F0F4F8', 
        borderRadius: 10, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 3 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 5, 
        elevation: 2, 
        fontFamily: 'Arial',
        fontWeight: '600',  
     
},
    languageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',

    },
    button: {
        backgroundColor: "#1E3A8A", 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30, 
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
},
selectedButton: {
    backgroundColor: "#89cff0",
    transform: [{ scale: 0.98 }],
},
buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: 'center',
},
translatedContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 5, 

},
  translatedText: {
    fontSize: 18, 
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

