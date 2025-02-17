import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native"; // import for automatic refresh
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUser } from "@/context/UserContext";

// open the database
const db = SQLite.openDatabaseSync("database.db");

export default function FavoriteQuotes() {
  const [favoriteQuotes, setFavoriteQuotes] = useState<
    { id: number; quote: string; translated_quote?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user_id } = useUser();
  console.log('User ID on Favorite screen:', user_id);

  

  // Fetch Favorite Quotes Function
  const fetchFavoriteQuotes = async () => {
    try {
      setLoading(true);
      const result = await db.getAllAsync<{ id: number; quote: string; translated_quote?: string }>(
        `SELECT * FROM favorites WHERE user_id = ? ORDER BY id DESC`,
        [user_id]  // Inject user_id parameter here
      );
      console.log("Favorite Quotes:", result);
      setFavoriteQuotes(result.length > 0 ? result : []);
    } catch (err) {
      console.error("Error fetching favorite quotes:", err);
      setError("Failed to fetch favorite quotes.");
    } finally {
      setLoading(false);
    }
  };

  // unlike Function
  const deleteFromFavorites = async (id: number) => {
    try {
      await db.runAsync("DELETE FROM favorites WHERE id = ?", [id]);
      fetchFavoriteQuotes(); // refresh data after deletion
    } catch (err) {
      console.error("Error deleting from favorites:", err);
      setError("Failed to delete the quote.");
    }
  };

  // pull-to-Refresh Handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavoriteQuotes();
    setRefreshing(false);
  };

  // auto Refresh when Screen is Focused
  useFocusEffect(
    useCallback(() => {
      fetchFavoriteQuotes();
    }, [])
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={<Image source={require("@/assets/images/Designer-2.jpeg")} style={styles.reactLogo} />}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Favorite Quotes</ThemedText>
        </ThemedView>

        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : error ? (
          <ThemedText>{error}</ThemedText>
        ) : (
          <FlatList
            data={favoriteQuotes}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <ThemedView style={styles.quoteContainer}>
                <ThemedText style={styles.quoteText}>{item.quote}</ThemedText>
                {item.translated_quote && (
                  <ThemedText style={styles.translatedText}>{item.translated_quote}</ThemedText>
                )}
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFromFavorites(item.id)}>
                  <ThemedText style={styles.deleteButtonText}>Unlike</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}
          />
        )}
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
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  quoteContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#89cff0",
    borderRadius: 10,
  },
  quoteText: {
    fontSize: 18,
    color: "#1E3A8A",
    fontWeight: "bold",
    textAlign: "center",
  },
  translatedText: {
    fontSize: 16,
    color: "#6B7280",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "#E63946",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
