import React from 'react';
import styles from './ConfirmationModal.module.css';

/**
 * Generic confirmation modal overlay.
 * Renders nothing when isOpen is false.
 */
const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.btnConfirm} onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
