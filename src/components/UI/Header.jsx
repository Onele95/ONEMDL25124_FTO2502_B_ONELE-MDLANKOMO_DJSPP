// src/components/UI/Header.jsx
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className={styles.appHeader}>
      <h1>
        <Link to="/">🎙️ Podcast App</Link>
      </h1>
      <nav className={styles.navLinks}>
        <Link
          to="/favorites"
          className={styles.navLink}
        >
          Favorites
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
