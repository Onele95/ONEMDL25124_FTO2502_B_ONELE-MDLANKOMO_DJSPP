// src/context/FavoritesContext.js
import { createContext, useContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('podcast-favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites);
    localStorage.setItem('podcast-favorites', JSON.stringify(newFavorites));
  };

  const addFavorite = (episode, show) => {
    const newFavorite = {
      ...episode,
      showId: show.id,
      showTitle: show.title,
      addedAt: new Date().toISOString(),
    };
    saveFavorites([...favorites, newFavorite]);
  };

  const removeFavorite = (episodeId) => {
    saveFavorites(favorites.filter((fav) => fav.id !== episodeId));
  };

  const isFavorite = (episodeId) => {
    return favorites.some((fav) => fav.id === episodeId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
