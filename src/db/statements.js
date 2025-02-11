import * as SQLite from 'expo-sqlite';
import bcrypt from 'bcryptjs';

// Open the database asynchronously
let db;


const initializeDatabase = async () => {
    db = await SQLite.openDatabaseAsync('database.db');
    await db.execAsync('PRAGMA foreign_keys = ON;');
    await db.execAsync(CREATE_USERS_TABLE);
    await insertDefaultUsers();
};

// Create Users Table
const CREATE_USERS_TABLE = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );
`;

// Insert default users
const insertDefaultUsers = async () => {
    const users = [
        { username: "admin1", password: bcrypt.hashSync("admin1", 10) },
        { username: "test", password: bcrypt.hashSync("test123", 10) },
        { username: "aleon", password: bcrypt.hashSync("greencow", 10) }
    ];

    for (const user of users) {
        await db.runAsync('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)', user.username, user.password);
        console.log(`Inserted ${user.username}`);
    }
};

// Create tables and insert default users
const createTables = async () => {
    await db.execAsync(CREATE_USERS_TABLE);
    await insertDefaultUsers();
};

// Function to insert a new user
const insertUser = async (username, password) => {
    const result = await db.runAsync('INSERT INTO users (username, password) VALUES (?, ?)', username, password);
    console.log('Inserted new user with ID:', result.lastInsertRowId);
};

// Function to authenticate a user
export const authenticateUser = async (username, password) => {
    const result = await db.getAllAsync('SELECT * FROM users WHERE username = ?', [username]);
    if (result.length > 0) {
        const user = result[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid ? user : null;
    } else {
        return null;
    }
};

// Example to get all users
const getAllUsers = async () => {
    const allUsers = await db.getAllAsync('SELECT * FROM users');
    console.log(allUsers);
};

// Export the necessary functions
export {
    createTables,
    insertUser,
    getAllUsers,
    db
};
