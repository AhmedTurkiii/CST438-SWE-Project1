import { Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import React, { useEffect, useState } from "react";
import { getHistoryQuotes, initializeHistoryTable, seedHistoryWithRandomQuotes } from "@/src/db/history_table";
import type { HistoryQuote } from "@/src/types/historyQuote";

export default function HistoryScreen() {
    const [historyQuotes, setHistoryQuotes] = useState<HistoryQuote[]>([]);

    useEffect(() => {
        const fetchHistoryQuotes = async () => {
            await initializeHistoryTable(); 
            await seedHistoryWithRandomQuotes(); 
            const storedQuotes = await getHistoryQuotes();
            setHistoryQuotes(storedQuotes);
        };
    
        fetchHistoryQuotes();
    }, []);
    

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
                <ThemedText type="title">Quote History</ThemedText>
            </ThemedView>

            <FlatList
            data={historyQuotes}
            keyExtractor={(item) => item.id.toString()}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
                <View style={styles.quoteContainer}>
                    <ThemedText type="default" style={styles.quoteText}>
                        Quote: "{item.quote}" - {item.author}
                    </ThemedText>
                </View>
            )}
            />

        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 16,
    },
    reactLogo: {
        height: 250,
        width: 410,
        bottom: 0,
        left: 0,
        position: 'absolute',
      },
    quoteContainer: {
        margin: 10,
        padding: 15,
        backgroundColor: "#89cff0",
        borderRadius: 10,
    },
    quoteText: {
        fontSize: 16,
        color: "#333",
    },
});
