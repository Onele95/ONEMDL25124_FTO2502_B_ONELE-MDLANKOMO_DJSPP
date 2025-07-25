import { Routes, Route } from 'react-router-dom';
import Header from './components/UI/Header';
import Home from './pages/Home';
import ShowDetail from './pages/ShowDetail';
import FavoritesPage from './pages/Favorites';
import { PodcastProvider } from './context/PodcastContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AudioProvider } from './context/AudioContext';
import { ThemeProvider } from './context/ThemeContext';
import AudioPlayer from './components/UI/AudioPlayer';


export default function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <PodcastProvider>
          <FavoritesProvider>
            <Header />
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path={`/show/:id`}
                element={<ShowDetail />}
              />
              <Route
                path="/favorites"
                element={<FavoritesPage />}
              />
            </Routes>
            <AudioPlayer />
          </FavoritesProvider>
        </PodcastProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}
