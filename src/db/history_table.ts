import * as SQLite from "expo-sqlite";
import type { HistoryQuote } from "@/src/types/historyQuote";

const db = SQLite.openDatabaseSync("quotes.db");

export const initializeHistoryTable = async () => {
    try {
        await db.execAsync(`
           CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                quote TEXT NOT NULL,
                author TEXT NOT NULL,
                viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user(id)
            )
        `);
        console.log("History table initialized.");
    } catch (error) {
        console.error("Error initializing history table:", error);
    }
};


export const addQuoteToHistory = async (quote: string, author: string) => {
    try {
        await db.runAsync("INSERT OR IGNORE INTO history (quote, author) VALUES (?, ?)", [quote, author]);
        console.log(`Inserted: "${quote}" by ${author}`);
    } catch (error) {
        console.error("Error inserting quote into history:", error);
    }
};


export const getHistoryQuotes = async (): Promise<HistoryQuote[]> => {
    try {
        const quotes = await db.getAllAsync("SELECT * FROM history ORDER BY viewed_at DESC");
        console.log("Fetched history quotes:", quotes);
        return quotes as HistoryQuote[];
    } catch (error) {
        console.error("Error fetching history quotes:", error);
        return [];
    }
};

export const seedHistoryWithRandomQuotes = async () => {
    await addQuoteToHistory("The only limit to our realization of tomorrow is our doubts of today.", "Franklin D. Roosevelt");
    await addQuoteToHistory("In the middle of every difficulty lies opportunity.", "Albert Einstein");
    await addQuoteToHistory("Do what you can, with what you have, where you are.", "Theodore Roosevelt");
};
