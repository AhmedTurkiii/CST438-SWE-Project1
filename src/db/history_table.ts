import { useSQLiteContext } from "expo-sqlite";

export interface HistoryQuote {
    id: number;
    quote: string;
    author: string;
    viewed_at: string;
}

export const initializeHistoryTable = async () => {
    const db = useSQLiteContext();
    try {
        const createTableQuery = await db.prepareAsync(`
           CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                quote TEXT NOT NULL,
                author TEXT NOT NULL,
                viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user(id)
            )`
        );
        await createTableQuery.executeAsync(); // Execute the statement
    } catch (error) {
        console.error("Error initializing history table:", error);
    }
};


export const addQuoteToHistory = async (quote: string, author: string) => {
    const db = useSQLiteContext();

    try {
        const insertQuery = await db.prepareAsync(
            `INSERT INTO history (quote, author) VALUES (?, ?)`
        );
        await insertQuery.executeAsync({ 1: quote, 2: author });
    } catch (error) {
        console.error("Error inserting quote into history:", error);
    }
};

export const getHistoryQuotes = async (): Promise<HistoryQuote[]> => {
    const db = useSQLiteContext();
    try {
        const quotes = await db.getAllAsync("SELECT * FROM history ORDER BY viewed_at DESC");
        return quotes as HistoryQuote[];
    } catch (error) {
        console.error("Error fetching history quotes:", error);
        return [];
    }
};

// Function to add some seed quotes (for testing)
export const seedHistoryWithRandomQuotes = async () => {
    await addQuoteToHistory("The only limit to our realization of tomorrow is our doubts of today.", "Franklin D. Roosevelt");
    await addQuoteToHistory("In the middle of every difficulty lies opportunity.", "Albert Einstein");
    await addQuoteToHistory("Do what you can, with what you have, where you are.", "Theodore Roosevelt");
};
