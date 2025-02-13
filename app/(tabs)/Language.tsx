import {ActivityIndicator, Image, Text, StyleSheet, TouchableOpacity} from "react-native";
import React, {useEffect, useState, useCallback, useRef,} from "react";
import axios from "axios";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {HelloWave} from "@/components/HelloWave";
import {countries} from "@/components/ui/countries";
import Dropdown from "@/components/DropDown";
import { StatusBar} from "expo-status-bar";


// Poner una caja (box) donde el usuario pueda elegir que lenaguge poner
// En ambas
const API_URL = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
const TRANSLATION_API_URL = 'https://api.mymemory.translated.net/get';
const API_HEADERS = {
    'X-RapidAPI-Key': 'a5a304577amsh4a57cfe3d7f6242p1bd77bjsn25ca0059531e',
    'X-RapidAPI-Host': 'quotes15.p.rapidapi.com',
};

const formattedCountries = countries.map((c)=>({
    value: c.label,
    label: `${c.flag} ${c.value}`,
}));



export default function FavoriteLanguage() {



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
    /**
     Right here is the option where the user can pick up which language the user would liek to use
     */



    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/QuoteLingo_Logo.jpeg')}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Favorite Language </ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer }>

            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle"> This box is for the language you speak (English) </ThemedText>
            </ThemedView>
              Please, pick up the language you speak
            <ThemedText type="subtitle">

               -- List of Language --
            </ThemedText>
            <ThemedView style={styles.stepContainer}>
                <StatusBar style='auto'/>
                <Dropdown data={formattedCountries} onChange={console.log} placeholder="Select country"/>
            </ThemedView>




-------------------------------------------------------------------------------






            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle"> Your favorite language </ThemedText>
            </ThemedView>
            Please, pick up your favorite language
            <ThemedText type="subtitle">
                -- List of your favorite Language --
            </ThemedText>
            <ThemedView style={styles.stepContainer}>
                <StatusBar style='auto'/>
                <Dropdown data={formattedCountries} onChange={console.log} placeholder="Select country"/>
                <StatusBar style='auto'/>
                <Dropdown data={formattedCountries} onChange={console.log} placeholder="Select country"/>
                <StatusBar style='auto'/>
                <Dropdown data={formattedCountries} onChange={console.log} placeholder="Select country"/>
                <StatusBar style='auto'/>
                <Dropdown data={formattedCountries} onChange={console.log} placeholder="Select country"/>
                <StatusBar style='auto'/>
                <Dropdown data={formattedCountries} onChange={console.log} placeholder="Select country"/>

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
    },
    quoteText: {
        fontSize: 18,
        color: '#1E3A8A',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
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
    ////
    container: {
        flex: 1,
        backgroundColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        gap: 10,
    },
    backdrop: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    optionItem: {
        height: 40,
        justifyContent: "center",
    },
    separator: {
        height: 4,
    },
    options: {
        position: "absolute",
        // top: 53,
        backgroundColor: "white",
        width: "100%",
        padding: 10,
        borderRadius: 6,
        maxHeight: 250,
    },
    button: {
        height: 50,
        justifyContent: "space-between",
        backgroundColor: "#fff",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 15,
        borderRadius: 8,
    },
});






















