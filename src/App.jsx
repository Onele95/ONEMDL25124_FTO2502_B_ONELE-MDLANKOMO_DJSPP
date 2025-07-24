import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "./components/UI/Header";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import FavoritesPage from "./pages/Favorites";
import AudioPlayer from "./components/UI/AudioPlayer";
import { PodcastProvider } from "./context/PodcastContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ListeningProvider } from "./context/ListeningContext";

/**
 * Root component of the Podcast Explorer app.
 *
 * - Wraps the application in multiple context providers for global state.
 * - Includes the Header component, displayed on all pages.
 * - Defines client-side routes using React Router.
 * - Manages the currently playing episode for the global audio player.
 *
 * @returns {JSX.Element} The application component with routing and context.
 */
export default function App() {
  const [currentEpisode, setCurrentEpisode] = useState(null);

  return (
    <ThemeProvider>
      <Helmet>
        <title>Podcast Explorer</title>
        <meta name="description" content="Discover and enjoy your favorite podcasts." />
        <meta property="og:title" content="Podcast Explorer" />
        <meta property="og:description" content="Explore a wide range of podcasts with seamless playback and favorites." />
        <meta property="og:image" content="%PUBLIC_URL%/og-image.jpg" />
        <meta property="og:url" content="https://your-podcast-app.vercel.app" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
      </Helmet>
      <Header />
      <FavoritesProvider>
        <ListeningProvider>
          <PodcastProvider>
            <Routes>
              <Route path="/" element={<Home setCurrentEpisode={setCurrentEpisode} />} />
              <Route path="/show/:id" element={<ShowDetail setCurrentEpisode={setCurrentEpisode} />} />
              <Route path="/favorites" element={<FavoritesPage setCurrentEpisode={setCurrentEpisode} />} />
            </Routes>
            <AudioPlayer episode={currentEpisode} />
          </PodcastProvider>
        </ListeningProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}