import React from 'react';
import { createPortal } from 'react-dom';
import styles from './OrderSuccessModal.module.css';

const OrderSuccessModal = ({ orderNumber, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.icon}>🎉</div>
        <h2 className={styles.title}>Спасибо за заказ!</h2>
        <p className={styles.orderNum}>Номер заказа {orderNumber}.</p>
        <p className={styles.message}>
          Мы свяжемся с вами в течение 10 минут, чтобы уточнить удобное для вас время доставки
        </p>
        <button className={styles.okBtn} onClick={onClose}>
          Ok
        </button>
      </div>
    </div>,
    document.body
  );
};

export default OrderSuccessModal;
