import { useEffect } from 'react';
import { createTables, insertDefaultUsers } from '@/src/db/statements';
import HomeScreen from './(tabs)/home'; // Adjust the path if needed

export default function App() {
    useEffect(() => {
        createTables();
        insertDefaultUsers(); // Add default users
    }, []);

    return <HomeScreen />;
}
