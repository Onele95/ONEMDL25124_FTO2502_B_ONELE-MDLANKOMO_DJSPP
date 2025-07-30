// src/components/UI/ThemeToggle.jsx
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
