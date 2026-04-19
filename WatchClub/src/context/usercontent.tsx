import React, { createContext, useContext, useState } from 'react';

type UserContextType = {
  name: string;
  email: string;
  username: string;
  genres: string[];
  setUser: (name: string, genres: string[], email?: string) => void;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
};

const UserContext = createContext<UserContextType>({
  name: '',
  email: '',
  username: '',
  genres: [],
  services: [],
  setUser: () => {},
  setEmail: () => {},
  setUsername: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('');
  const [email, setEmailState] = useState('');
  const [username, setUsernameState] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [services, setServicesState] = useState<string[]>([]);

  function setUser(newName: string, newGenres: string[], newEmail?: string) {
    setName(newName);
    setGenres(newGenres);
    if (newEmail) setEmailState(newEmail);
  }

  function setEmail(newEmail: string) {
    setEmailState(newEmail);
    // Derive a username from email (part before @)
    const derived = newEmail.split('@')[0] ?? '';
    if (!username) setUsernameState(derived);
  }

  function setUsername(newUsername: string) {
    setUsernameState(newUsername);
  }

  function setServices(newServices: string[]) {
    setServicesState(newServices);
  }

  return (
    <UserContext.Provider value={{ name, email, username, genres, setUser, setEmail, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
