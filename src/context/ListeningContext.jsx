import { createContext, useState, useEffect } from "react";

export const ListeningContext = createContext();

export function ListeningProvider({ children }) {
  const [progress, setProgress] = useState(() => JSON.parse(localStorage.getItem("listeningProgress") || "{}"));
  const [finished, setFinished] = useState(() => JSON.parse(localStorage.getItem("finishedEpisodes") || "[]"));

  useEffect(() => {
    localStorage.setItem("listeningProgress", JSON.stringify(progress));
    localStorage.setItem("finishedEpisodes", JSON.stringify(finished));
  }, [progress, finished]);

  const updateProgress = (episodeId, time) => {
    setProgress((prev) => ({ ...prev, [episodeId]: time }));
  };

  const markFinished = (episodeId) => {
    setFinished((prev) => [...new Set([...prev, episodeId])]);
  };

  const isFinished = (episodeId) => finished.includes(episodeId);

  const resetProgress = () => {
    setProgress({});
    setFinished([]);
  };

  return (
    <ListeningContext.Provider value={{ progress, updateProgress, markFinished, isFinished, resetProgress }}>
      {children}
    </ListeningContext.Provider>
  );
}