import React, { useRef } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './Carousel.module.css';

const Carousel = ({ title, description, icon, products, onProductClick }) => {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    if (!trackRef.current) return;
    const cardWidth = 220 + 16; // card width + gap
    trackRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth * 2 : cardWidth * 2,
      behavior: 'smooth',
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <div>
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
          </div>
        </div>
      </div>

      <div className={styles.wrapper}>
        <button
          className={`${styles.navBtn} ${styles.navBtnLeft}`}
          onClick={() => scroll('left')}
          aria-label="Прокрутить влево"
        >
          ‹
        </button>

        <div className={styles.track} ref={trackRef}>
          {products.map((product) => (
            <div key={product.id} className={styles.cardWrapper}>
              <ProductCard product={product} onOpenModal={onProductClick} />
            </div>
          ))}
        </div>

        <button
          className={`${styles.navBtn} ${styles.navBtnRight}`}
          onClick={() => scroll('right')}
          aria-label="Прокрутить вправо"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default Carousel;
