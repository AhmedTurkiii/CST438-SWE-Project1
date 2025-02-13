import { SQLiteDatabase } from "expo-sqlite";

export const initializeDatabase = async (db : SQLiteDatabase) => {

    try {
        await db.execAsync(`
        
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS quote (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                original_quote TEXT NOT NULL,
                translated_quote TEXT,
                quote_api_id TEXT,
                FOREIGN KEY (user_id) REFERENCES user(id)
            );
            
            CREATE TABLE IF NOT EXISTS favorites(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                quote TEXT NOT NULL,
                translated_quote TEXT,
                FOREIGN KEY (user_id) REFERENCES user(id))
            
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                quote TEXT NOT NULL,
                author TEXT NOT NULL,
                viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user(id)
            )`
        );

        // await db.runAsync(`
        //     INSERT OR IGNORE INTO user (username, password) 
        //     VALUES('admin', 'password');

        //     INSERT OR IGNORE INTO user (username, password) 
        //     VALUES('test', '123');

        //     INSERT OR IGNORE INTO user (username, password) 
        //     VALUES('aleon', '123');
        // `);
        try {
            await db.runAsync(`
                INSERT OR IGNORE INTO user (username, password) VALUES('admin', 'password');
                INSERT OR IGNORE INTO user (username, password) VALUES('test', '123');
                INSERT OR IGNORE INTO user (username, password) VALUES('aleon', '123');
            `);
            const users = await db.getAllAsync("SELECT * FROM user");
            console.log("Users in database:", users);
            console.log("Database initialized and default users are inserted.", db);
            console.log("Database Path:", db.databasePath);

        } catch (error) {
            console.error("Error inserting users:", error);
        }
        

        
        // const users = await db.getAllAsync("SELECT * FROM user");
        // console.log("Users in database:", users);
        // console.log("Database initialized and default users are inserted.", db);
        
    } catch (e) {
        console.error ("Error initializing database", e);
    }
}