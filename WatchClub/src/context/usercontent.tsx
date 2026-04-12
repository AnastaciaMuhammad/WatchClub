import React, { createContext, useContext, useState } from 'react';

type UserContextType = {
  name: string;
  genres: string[];
  setUser: (name: string, genres: string[]) => void;
};

const UserContext = createContext<UserContextType>({
  name: '',
  genres: [],
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('');
  const [genres, setGenres] = useState<string[]>([]);

  function setUser(newName: string, newGenres: string[]) {
    setName(newName);
    setGenres(newGenres);
  }

  return (
    <UserContext.Provider value={{ name, genres, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}