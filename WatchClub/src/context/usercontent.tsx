import React, { createContext, useContext, useState } from 'react';
 
export type MovieResult = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};
 
export type WatchParty = {
  id: string;
  partyName: string;
  movie: MovieResult;
  platform: string;
  date: string;
  time: string;
  maxGuests: number;
  isPrivate: boolean;
  description: string;
  invitedFriends: string[];
  status: 'upcoming' | 'live' | 'past';
  createdAt: number;
};
 
type UserContextType = {
  name: string;
  email: string;
  username: string;
  genres: string[];
  platforms: string[];
  profilePicture: string | null;
  favorites: MovieResult[];
  parties: WatchParty[];
  setUser: (name: string, genres: string[], email?: string) => void;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setPlatforms: (platforms: string[]) => void;
  setProfilePicture: (uri: string | null) => void;
  addFavorite: (movie: MovieResult) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  addParty: (party: WatchParty) => void;
  updateParty: (id: string, updates: Partial<WatchParty>) => void;
};
 
const UserContext = createContext<UserContextType>({
  name: '', email: '', username: '', genres: [], platforms: [],
  profilePicture: null, favorites: [], parties: [],
  setUser: () => {}, setEmail: () => {}, setUsername: () => {},
  setPlatforms: () => {}, setProfilePicture: () => {},
  addFavorite: () => {}, removeFavorite: () => {}, isFavorite: () => false,
  addParty: () => {}, updateParty: () => {},
});
 
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('');
  const [email, setEmailState] = useState('');
  const [username, setUsernameState] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [platforms, setPlatformsState] = useState<string[]>([]);
  const [profilePicture, setProfilePictureState] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<MovieResult[]>([]);
  const [parties, setParties] = useState<WatchParty[]>([]);
 
  function setUser(newName: string, newGenres: string[], newEmail?: string) {
    setName(newName);
    setGenres(newGenres);
    if (newEmail) setEmailState(newEmail);
  }
 
  function setEmail(newEmail: string) {
    setEmailState(newEmail);
    const derived = newEmail.split('@')[0] ?? '';
    if (!username) setUsernameState(derived);
  }
 
  function setUsername(u: string) { setUsernameState(u); }
  function setPlatforms(p: string[]) { setPlatformsState(p); }
  function setProfilePicture(uri: string | null) { setProfilePictureState(uri); }
 
  function addFavorite(movie: MovieResult) {
    setFavorites(prev => prev.find(m => m.id === movie.id) ? prev : [movie, ...prev]);
  }
 
  function removeFavorite(movieId: number) {
    setFavorites(prev => prev.filter(m => m.id !== movieId));
  }
 
  function isFavorite(movieId: number) {
    return favorites.some(m => m.id === movieId);
  }
 
  function addParty(party: WatchParty) {
    setParties(prev => [party, ...prev]);
  }
 
  function updateParty(id: string, updates: Partial<WatchParty>) {
    setParties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }
 
  return (
    <UserContext.Provider value={{
      name, email, username, genres, platforms, profilePicture, favorites, parties,
      setUser, setEmail, setUsername, setPlatforms, setProfilePicture,
      addFavorite, removeFavorite, isFavorite, addParty, updateParty,
    }}>
      {children}
    </UserContext.Provider>
  );
}
 
export function useUser() { return useContext(UserContext); }