// src/pages/Favorites.jsx
import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { formatDate } from '../utils/formatDate';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import styles from './Favorites.module.css';

export default function FavoritesPage() {
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate(); // Initialize navigate

  // Group favorites by show
  const favoritesByShow = favorites.reduce((acc, favorite) => {
    if (!acc[favorite.showTitle]) {
      acc[favorite.showTitle] = [];
    }
    acc[favorite.showTitle].push(favorite);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1>Your Favorites</h1>

      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't favorited any episodes yet.</p>
          <Link
            to="/"
            className={styles.browseLink}
          >
            Browse Podcasts
          </Link>
        </div>
      ) : (
        Object.entries(favoritesByShow).map(([showTitle, episodes]) => (
          <div
            key={showTitle}
            className={styles.showGroup}
          >
            <h2>
              <Link to={`/show/${episodes[0].showId}`}>{showTitle}</Link>
            </h2>
            <div className={styles.episodesList}>
              {episodes.map((episode) => (
                <div
                  key={episode.id}
                  className={styles.episodeCard}
                >
                  <h3>{episode.title}</h3>
                  <p className={styles.dateAdded}>
                    Added on {formatDate(episode.addedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
