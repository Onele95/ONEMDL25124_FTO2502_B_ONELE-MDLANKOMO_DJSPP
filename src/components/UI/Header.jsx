import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import styles from "./Header.module.css";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className={styles.appHeader}>
      <h1>
        <Link to="/">🎙️ Podcast App</Link>
      </h1>
      <nav>
        <Link to="/favorites">Favorites</Link>
        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </nav>
    </header>
  );
}