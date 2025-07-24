import { useContext, useState } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import styles from "./Favorites.module.css";

export default function FavoritesPage({ setCurrentEpisode }) {
  const { favorites } = useContext(FavoritesContext);
  const [sortKey, setSortKey] = useState("date-desc");
  const navigate = useNavigate();

  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortKey === "title-asc") return a.episode.title.localeCompare(b.episode.title);
    if (sortKey === "title-desc") return b.episode.title.localeCompare(a.episode.title);
    if (sortKey === "date-asc") return new Date(a.addedAt) - new Date(b.addedAt);
    return new Date(b.addedAt) - new Date(a.addedAt); // date-desc
  });

  const groupedByShow = sortedFavorites.reduce((acc, fav) => {
    const showTitle = fav.show.title;
    acc[showTitle] = acc[showTitle] || [];
    acc[showTitle].push(fav);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <h1>Favorites</h1>
      <select onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
        <option value="title-asc">Title A → Z</option>
        <option value="title-desc">Title Z → A</option>
        <option value="date-asc">Oldest</option>
        <option value="date-desc">Newest</option>
      </select>
      {Object.entries(groupedByShow).map(([showTitle, episodes]) => (
        <div key={showTitle}>
          <h2>{showTitle}</h2>
          {episodes.map((fav) => (
            <div
              key={fav.episode.id}
              className={styles.favoriteItem}
              onClick={() => navigate(`/show/${fav.show.id}`, { state: { genres: fav.show.genres } })}
            >
              <p>{fav.episode.title}</p>
              <p>Season: {fav.season.title}</p>
              <p>Added: {formatDate(fav.addedAt)}</p>
              <button onClick={(e) => {
                e.stopPropagation();
                setCurrentEpisode(fav.episode);
              }}>
                Play
              </button>
            </div>
          ))}
        </div>
      ))}
      {favorites.length === 0 && <p>No favorites added yet.</p>}
    </div>
  );
}