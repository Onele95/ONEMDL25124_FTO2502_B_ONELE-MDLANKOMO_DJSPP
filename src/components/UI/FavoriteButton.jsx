// src/components/UI/FavoriteButton.jsx
import { useContext } from 'react';
import { FavoritesContext } from '../../context/FavoritesContext';
import styles from './FavoriteButton.module.css';

export default function FavoriteButton({ episode, show }) {
  const { isFavorite, addFavorite, removeFavorite } =
    useContext(FavoritesContext);

  const handleClick = () => {
    if (isFavorite(episode.id)) {
      removeFavorite(episode.id);
    } else {
      addFavorite(episode, show);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={styles.favoriteButton}
    >
      {isFavorite(episode.id) ? '❤️' : '🤍'}
    </button>
  );
}
