import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Carousel.module.css";
import GenreTags from "./GenreTags";

export default function Carousel({ shows }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };

  const checkScroll = () => {
    const container = scrollRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.offsetWidth
    );
  };

  return (
    <div className={styles.carousel}>
      <button
        onClick={() => scroll(-1)}
        disabled={!canScrollLeft}
        className={styles.arrow}
      >
        ←
      </button>
      <div className={styles.carouselInner} ref={scrollRef} onScroll={checkScroll}>
        {shows.map((show) => (
          <div
            key={show.id}
            className={styles.carouselItem}
            onClick={() => navigate(`/show/${show.id}`, { state: { genres: show.genres } })}
          >
            <img src={show.image} alt={show.title} />
            <h3>{show.title}</h3>
            <GenreTags genres={show.genres} />
          </div>
        ))}
      </div>
      <button
        onClick={() => scroll(1)}
        disabled={!canScrollRight}
        className={styles.arrow}
      >
        →
      </button>
    </div>
  );
}