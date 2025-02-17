
// UserContext.tsx
// this file is used to share the user id accross all the pages in the app
// after creading this context we can set it from any where and use it from any where
// this is a very good way to share data accross the app
// you have to wrap the app with the UserProvider in the layout.tsx file

import React, { useEffect, useState, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserContextType = {
    user_id: string | null;
  setUserId: (id: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user_id, setUserId] = useState<string | null>(null);

  // On app load, check AsyncStorage for user_id
  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('user_id');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    };

    loadUserId();
  }, []);

  return (
    <UserContext.Provider value={{ user_id, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
