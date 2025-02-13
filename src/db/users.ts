import { useSQLiteContext } from "expo-sqlite";
import type { User } from "../types/userInfo";

export const createUser = async (user: User) => {
    const db = useSQLiteContext();

    const userInDb = await db.getFirstAsync('SELECT * FROM user WHERE username = ?', [user.username]);

    if(userInDb) {
        return userInDb;
    }

    const insertUser = await db.prepareAsync(
        'INSERT INTO user (username, password) VALUES ( ?, ?)'
    
    );

    const response = await insertUser.executeAsync({
        1: user.username,
        2: user.password
    });

    return response;
}

