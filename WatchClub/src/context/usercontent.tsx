import React, { createContext, useContext, useState } from 'react';

type UserContextType = {
  name: string;
  genres: string[];
  services: string[];
  setUser: (name: string, genres: string[]) => void;
  setServices: (services: string[]) => void;
};

const UserContext = createContext<UserContextType>({
  name: '',
  genres: [],
  services: [],
  setUser: () => {},
  setServices: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [services, setServicesState] = useState<string[]>([]);

  function setUser(newName: string, newGenres: string[]) {
    setName(newName);
    setGenres(newGenres);
  }

  function setServices(newServices: string[]) {
    setServicesState(newServices);
  }

  return (
    <UserContext.Provider value={{ name, genres, services, setUser, setServices }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}