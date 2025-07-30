// src/components/UI/AudioPlayer.jsx
import { useContext, useEffect } from 'react';
import { AudioContext } from '../../context/AudioContext';
import styles from './AudioPlayer.module.css';

export default function AudioPlayer() {
  const {
    currentEpisode,
    isPlaying,
    progress,
    duration,
    togglePlayPause,
    seek,
  } = useContext(AudioContext);

  if (!currentEpisode) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Add this to your AudioPlayer.jsx
  useEffect(() => {
    if (!currentEpisode) return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, currentEpisode]);

  return (
    <div className={styles.playerContainer}>
      <div className={styles.playerInfo}>
        <img
          src={currentEpisode.show.image}
          alt={currentEpisode.show.title}
          className={styles.playerImage}
        />
        <div>
          <h4>{currentEpisode.title}</h4>
          <p>{currentEpisode.show.title}</p>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          onClick={togglePlayPause}
          className={styles.controlButton}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className={styles.progressContainer}>
          <span className={styles.time}>{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className={styles.progressBar}
          />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
