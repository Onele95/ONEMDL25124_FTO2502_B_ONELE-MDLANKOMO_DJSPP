import { useState, useRef, useEffect, useContext } from "react";
import { ListeningContext } from "../../context/ListeningContext";
import styles from "./AudioPlayer.module.css";

export default function AudioPlayer({ episode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(new Audio());
  const { updateProgress, markFinished, isFinished } = useContext(ListeningContext);

  useEffect(() => {
    const audio = audioRef.current;
    if (episode?.file) {
      audio.src = episode.file; // Assuming API provides audio file URL
      audio.load();
      const savedProgress = JSON.parse(localStorage.getItem("listeningProgress") || "{}");
      const savedTime = savedProgress[episode.id] || 0;
      audio.currentTime = savedTime;
    }

    const updateProgressHandler = () => {
      const progressPercent = (audio.currentTime / audio.duration) * 100 || 0;
      setProgress(progressPercent);
      if (episode) updateProgress(episode.id, audio.currentTime);
      if (progressPercent >= 99) markFinished(episode.id);
    };

    audio.addEventListener("timeupdate", updateProgressHandler);
    return () => audio.removeEventListener("timeupdate", updateProgressHandler);
  }, [episode, updateProgress, markFinished]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlaying) {
        e.preventValue = "Audio is playing. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    setProgress(e.target.value);
    updateProgress(episode.id, seekTime);
  };

  return (
    episode && (
      <div className={styles.player}>
        <p>{episode.title}</p>
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          min="0"
          max="100"
          className={styles.seekBar}
        />
        {isFinished(episode.id) && <span>✅ Finished</span>}
      </div>
    )
  );
}