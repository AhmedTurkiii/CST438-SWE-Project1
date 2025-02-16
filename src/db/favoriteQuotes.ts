import { SQLiteDatabase } from "expo-sqlite";

// Insert a new quote
export const insertQuote = async (
    db: SQLiteDatabase,
    userId: number,
    originalQuote: string,
    translatedQuote?: string,
    quoteApiId?: string
) => {
    try {
        await db.runAsync(
            `INSERT INTO quote (user_id, original_quote, translated_quote, quote_api_id) VALUES (?, ?, ?, ?)`,
            [userId, originalQuote, translatedQuote || null, quoteApiId || null]
        );
        console.log("Quote inserted successfully!");
    } catch (error) {
        console.error("Error inserting quote:", error);
    }
};

// Fetch all quotes for a user
export const getQuotes = async (db: SQLiteDatabase, userId: number) => {
    try {
        const quotes = await db.getAllAsync(
            `SELECT * FROM quote WHERE user_id = ?`,
            [userId]
        );
        return quotes;
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return [];
    }
};

// Add a quote to favorites
export const addToFavorites = async (
    db: SQLiteDatabase,
    userId: number,
    quote: string,
    translatedQuote?: string
) => {
    try {
        await db.runAsync(
            `INSERT INTO favorites (user_id, quote, translated_quote) VALUES (?, ?, ?)`,
            [userId, quote, translatedQuote || null]
        );
        console.log("Quote added to favorites!");
    } catch (error) {
        console.error("Error adding quote to favorites:", error);
    }
};
