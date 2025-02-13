import { Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import { getHistoryQuotes, HistoryQuote, initializeHistoryTable } from "@/src/db/history_table";

export default function HistoryScreen() {
    const [historyQuotes, setHistoryQuotes] = useState<HistoryQuote[]>([]);

    useEffect(() => {
        const fetchHistoryQuotes = async () => {
            await initializeHistoryTable();
            const storedQuotes = await getHistoryQuotes();
            setHistoryQuotes(storedQuotes);
        };

        fetchHistoryQuotes();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require("@/assets/images/QuoteLingo_Logo.jpeg")} style={styles.reactLogo} />
            
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Quote History</ThemedText>
            </ThemedView>

            <FlatList
                data={historyQuotes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.quoteContainer}>
                        <ThemedText type="default" style={styles.quoteText}>
                            Quote: "{item.quote}" - {item.author}
                        </ThemedText>
                    </View>
                )}
            />
        </SafeAreaView>
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
        width: "100%",
        resizeMode: "contain",
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
