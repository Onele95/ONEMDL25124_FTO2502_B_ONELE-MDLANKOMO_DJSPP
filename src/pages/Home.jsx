import { useContext } from "react";
import { PodcastContext } from "../context/PodcastContext";
import {
  SearchBar,
  SortSelect,
  GenreFilter,
  PodcastGrid,
  Pagination,
  Loading,
  Error,
  Carousel,
} from "../components";
import { genres } from "../data";
import styles from "./Home.module.css";

export default function Home({ setCurrentEpisode }) {
  const { podcasts, loading, error } = useContext(PodcastContext);
  const recommended = podcasts.slice(0, 5); // Select top 5 for carousel

  return (
    <main className={styles.main}>
      <h2>Recommended Shows</h2>
      <Carousel shows={recommended} />
      <section className={styles.controls}>
        <SearchBar />
        <GenreFilter genres={genres} />
        <SortSelect />
      </section>
      {loading && <Loading message="Loading podcasts..." />}
      {error && (
        <Error message={`Error occurred while fetching podcasts: ${error}`} />
      )}
      {!loading && !error && (
        <>
          <PodcastGrid />
          <Pagination />
        </>
      )}
    </main>
  );
}