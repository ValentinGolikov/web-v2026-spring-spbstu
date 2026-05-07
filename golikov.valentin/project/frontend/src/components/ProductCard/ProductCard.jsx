import React from 'react';
import styles from './ProductCard.module.css';

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<span key={i} className={styles.starFull}>★</span>);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<span key={i} className={styles.starHalf}>★</span>);
    } else {
      stars.push(<span key={i} className={styles.starEmpty}>★</span>);
    }
  }
  return <div className={styles.stars}>{stars}</div>;
};

const ProductCard = ({ product, onOpenModal }) => {
  const { name, price, rating, badge, image } = product;

  return (
    <div className={styles.card} onClick={() => onOpenModal(product)}>
      <div className={styles.imageWrapper}>
        <img
          src={`/images/goods/${image}`}
          alt={name}
          className={styles.image}
        />
        {badge === 'new' && (
          <span className={`${styles.badge} ${styles.badgeNew}`}>Новинка</span>
        )}
        {badge === 'hit' && (
          <span className={`${styles.badge} ${styles.badgeHit}`}>Хит</span>
        )}
      </div>
      <div className={styles.body}>
        <p className={styles.price}>{price.toLocaleString('ru-RU')} ₽</p>
        <p className={styles.name}>{name}</p>
        <StarRating rating={rating} />
      </div>
    </div>
  );
};

export default ProductCard;
