import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../../contexts/CartContext';
import styles from './ProductModal.module.css';

const SPEC_LABELS = {
  warranty: 'Гарантия',
  screen: 'Экран',
  processor: 'Процессор',
  battery: 'Батарея',
  connectivity: 'Подключение',
  capacity: 'Ёмкость',
  ports: 'Порты',
  resolution: 'Разрешение',
  connector: 'Разъём',
  frequency: 'Частота',
  material: 'Материал',
  compatibility: 'Совместимость',
  storage: 'Память',
  speed: 'Скорость',
  power: 'Мощность',
  protocols: 'Протоколы',
  weight: 'Вес',
};

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.round(rating) ? styles.starFull : styles.starEmpty}>
        ★
      </span>
    );
  }
  return <div className={styles.stars}>{stars}</div>;
};

const ProductModal = ({ product, isOpen, onClose }) => {
  const { items, addItem, updateQuantity } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const cartTotal = cartItem ? cartItem.product.price * cartItem.quantity : 0;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleDecrement = () => {
    updateQuantity(product.id, quantity - 1);
  };

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const specs = product.specs || {};

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <div className={styles.content}>
          <div className={styles.imageWrapper}>
            <img
              src={`/images/goods/${product.image}`}
              alt={product.name}
              className={styles.image}
            />
          </div>

          <div className={styles.info}>
            <h2 className={styles.name}>{product.name}</h2>

            <div className={styles.ratingRow}>
              <StarRating rating={product.rating} />
              <span className={styles.ratingValue}>{product.rating}</span>
            </div>

            {product.description && (
              <p className={styles.description}>{product.description}</p>
            )}

            {Object.keys(specs).length > 0 && (
              <div className={styles.specs}>
                <h3 className={styles.specsTitle}>Характеристики</h3>
                <dl className={styles.specsList}>
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className={styles.specRow}>
                      <dt className={styles.specKey}>
                        {SPEC_LABELS[key] || key}
                      </dt>
                      <dd className={styles.specValue}>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <p className={styles.price}>
              {product.price.toLocaleString('ru-RU')} ₽
            </p>

            {quantity === 0 ? (
              <button className={styles.addBtn} onClick={handleAddToCart}>
                🛒 В корзину
              </button>
            ) : (
              <div className={styles.cartControls}>
                <button className={styles.qtyBtn} onClick={handleDecrement}>−</button>
                <span className={styles.qty}>{quantity}</span>
                <button className={styles.qtyBtn} onClick={handleIncrement}>+</button>
                <button className={styles.inCartBtn} onClick={onClose}>
                  🛒 В корзине {cartTotal.toLocaleString('ru-RU')} ₽
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;
