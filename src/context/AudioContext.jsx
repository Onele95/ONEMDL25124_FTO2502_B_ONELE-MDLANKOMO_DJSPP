// src/context/AudioContext.js
import { createContext, useContext, useState, useEffect } from 'react';

export const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioElement, setAudioElement] = useState(null);
  const [listenHistory, setListenHistory] = useState([]);

  // Load history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('podcastListenHistory');
    if (savedHistory) {
      try {
        setListenHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse listen history:', e);
      }
    }
  }, []);


  // Inside your AudioProvider component
  useEffect(() => {
    const handleUnload = (e) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = 'Audio is playing. Close anyway?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [isPlaying]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('podcastListenHistory', JSON.stringify(listenHistory));
  }, [listenHistory]);

  const updateProgressInHistory = (
    episodeId,
    currentTime,
    duration,
    isFinished = false
  ) => {
    setListenHistory((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.episodeId === episodeId
      );
      const newEntry = {
        episodeId,
        progress: currentTime,
        duration,
        lastUpdated: new Date().toISOString(),
        isFinished,
        completed: isFinished || (duration && currentTime >= duration * 0.95), // Mark as completed if within 5% of end
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newEntry;
        return updated;
      }
      return [...prev, newEntry];
    });
  };

 const playEpisode = async (episode, show) => {
   try {
     // Pause current audio if playing
     if (audioElement) {
       audioElement.pause();
       if (currentEpisode) {
         updateProgressInHistory(
           currentEpisode.id,
           audioElement.currentTime,
           audioElement.duration
         );
       }
     }

     const newAudio = new Audio(episode.file);
     setAudioElement(newAudio);
     setCurrentEpisode({ ...episode, show });

     // Resume from saved position if available
     const historyItem = listenHistory.find(
       (item) => item.episodeId === episode.id
     );
     if (historyItem && !historyItem.completed) {
       newAudio.currentTime = historyItem.progress;
     }

     // Wait for audio to be ready
     newAudio.load();
     await newAudio.play();
     setIsPlaying(true);
   } catch (error) {
     console.error('Playback failed:', error);
     setIsPlaying(false);
   }
 };

  const togglePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      // Update progress when pausing
      if (currentEpisode) {
        updateProgressInHistory(
          currentEpisode.id,
          audioElement.currentTime,
          audioElement.duration
        );
      }
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (time) => {
    if (!audioElement) return;
    audioElement.currentTime = time;
    setProgress(time);
  };

  const resetProgress = (episodeId) => {
    setListenHistory((prev) =>
      prev.filter((item) => item.episodeId !== episodeId)
    );
    if (currentEpisode?.id === episodeId && audioElement) {
      audioElement.currentTime = 0;
      setProgress(0);
    }
  };

  useEffect(() => {
    if (!audioElement) return;

    const updateProgress = () => {
      const currentTime = audioElement.currentTime;
      setProgress(currentTime);
      setDuration(audioElement.duration || 0);

      // Auto-save progress every 10 seconds
      if (currentTime % 10 < 0.1 && currentEpisode) {
        updateProgressInHistory(
          currentEpisode.id,
          currentTime,
          audioElement.duration
        );
      }
    };

    const handleEnded = () => {
      if (currentEpisode) {
        updateProgressInHistory(
          currentEpisode.id,
          audioElement.duration,
          audioElement.duration,
          true
        );
      }
      setIsPlaying(false);
      setProgress(0);
    };

    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', updateProgress);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioElement, currentEpisode]);

  return (
    <AudioContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        progress,
        duration,
        listenHistory,
        playEpisode,
        togglePlayPause,
        seek,
        resetProgress,
        getEpisodeProgress: (episodeId) =>
          listenHistory.find((item) => item.episodeId === episodeId) || null,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
