import React from 'react';
import { createPortal } from 'react-dom';
import styles from './DeleteConfirmModal.module.css';

const DeleteConfirmModal = ({ productName, isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onCancel} aria-label="Закрыть">
          ×
        </button>
        <p className={styles.message}>
          Вы действительно хотите удалить{' '}
          <strong>{productName}</strong>?
        </p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Отмена
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Да, удалить
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmModal;
