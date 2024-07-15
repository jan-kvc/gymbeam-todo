"use client";

// Adjustments to UserDatabaseIdProvider.tsx

import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserContextType {
  userDatabaseId?: string | null;
  setUserDatabaseId: (id: string | null) => void; // Add this line
}

const defaultValue: UserContextType = {
  userDatabaseId: null,
  setUserDatabaseId: () => {},
};

const UserContext = createContext<UserContextType>(defaultValue);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userDatabaseId, setUserDatabaseId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userDatabaseId, setUserDatabaseId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserDatabaseId = () => useContext(UserContext);
