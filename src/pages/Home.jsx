import {
  SearchBar,
  SortSelect,
  GenreFilter,
  PodcastGrid,
  Pagination,
  Loading,
  Error,
} from "../components";
import styles from "./Home.module.css";
import { genres } from "../data";
import { PodcastContext } from "../context/PodcastContext";
import { useContext } from "react";
import Carousel from '../components/UI/Carousel';

/**
 * Home page of the Podcast Explorer app.
 *
 * - Displays the main podcast browsing interface.
 * - Includes search, genre filter, and sort controls.
 * - Shows a loading indicator or error message based on fetch state.
 * - Renders the podcast grid and pagination once data is loaded.
 *
 * Context:
 * - Consumes `PodcastContext` to access podcast data, loading, and error states.
 *
 * @returns {JSX.Element} The home page content with filters, results, and feedback states.
 */
export default function Home() {
  const { podcasts, loading, error, allPodcasts } = useContext(PodcastContext);

   const recommendedShows = [...allPodcasts]
     .sort(() => 0.5 - Math.random())
     .slice(0, 6);

  return (
    <main className={styles.main}>
      <section className={styles.carouselSection}>
        <h2>Recommended Shows</h2>
        <Carousel shows={recommendedShows} />
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
