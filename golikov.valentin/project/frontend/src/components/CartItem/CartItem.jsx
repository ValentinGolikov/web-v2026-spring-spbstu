import React from 'react';
import styles from './CartItem.module.css';

const CartItem = ({ item, onQuantityChange, onDelete, onToggleSelect }) => {
  const { product, quantity, selected } = item;

  return (
    <div className={styles.item}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={selected}
        onChange={() => onToggleSelect(product.id)}
        aria-label={`Выбрать ${product.name}`}
      />

      <div className={styles.imageWrapper}>
        <img
          src={`/images/goods/${product.image}`}
          alt={product.name}
          className={styles.image}
        />
      </div>

      <p className={styles.name}>{product.name}</p>

      <div className={styles.qty}>
        <button
          className={styles.qtyBtn}
          onClick={() => onQuantityChange(product.id, quantity - 1)}
          aria-label="Уменьшить количество"
        >
          −
        </button>
        <span className={styles.qtyValue}>{quantity}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => onQuantityChange(product.id, quantity + 1)}
          aria-label="Увеличить количество"
        >
          +
        </button>
      </div>

      <p className={styles.price}>
        {(product.price * quantity).toLocaleString('ru-RU')} ₽
      </p>

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(item)}
        aria-label={`Удалить ${product.name}`}
      >
        × Удалить
      </button>
    </div>
  );
};

export default CartItem;
