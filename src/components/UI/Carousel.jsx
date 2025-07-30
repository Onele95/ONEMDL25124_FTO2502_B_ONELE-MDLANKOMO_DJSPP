// src/components/UI/Carousel.jsx
import { useState, useEffect } from 'react';
import styles from './Carousel.module.css';
import PodcastCard from '../Podcasts/PodcastCard';

export default function Carousel({ shows, title = 'Recommended Shows' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);

  // Responsive item count
  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 480) setVisibleItems(1);
      else if (width < 768) setVisibleItems(2);
      else if (width < 1024) setVisibleItems(3);
      else setVisibleItems(4);
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, shows.length - visibleItems));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselHeader}>
        <h2 className={styles.carouselTitle}>{title}</h2>
      </div>

      <div className={styles.carouselContent}>
        {shows.slice(currentIndex, currentIndex + visibleItems).map((show) => (
          <div
            key={show.id}
            className={styles.carouselItem}
          >
            <PodcastCard podcast={show} />
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className={styles.navButton}
        disabled={currentIndex === 0}
        aria-label="Previous shows"
      >
        &lt;
      </button>

      <button
        onClick={next}
        className={styles.navButton}
        disabled={currentIndex >= shows.length - visibleItems}
        aria-label="Next shows"
      >
        &gt;
      </button>

      {/* Indicators for mobile */}
      <div className={styles.carouselIndicators}>
        {Array.from({ length: Math.ceil(shows.length / visibleItems) }).map(
          (_, i) => (
            <div
              key={i}
              className={`${styles.indicator} ${
                currentIndex >= i * visibleItems &&
                currentIndex < (i + 1) * visibleItems
                  ? styles.active
                  : ''
              }`}
              onClick={() => setCurrentIndex(i * visibleItems)}
            />
          )
        )}
      </div>
    </div>
  );
}
