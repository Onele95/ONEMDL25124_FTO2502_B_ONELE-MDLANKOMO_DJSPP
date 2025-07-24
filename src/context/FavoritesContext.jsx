import { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (episode, show, season) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.episode.id === episode.id);
      if (exists) {
        return prev.filter((fav) => fav.episode.id !== episode.id);
      }
      return [...prev, { episode, show, season, addedAt: new Date().toISOString() }];
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}