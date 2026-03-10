import React from 'react';
import styles from './RewardCard.module.css';

const RewardCard = ({ reward, userName }) => {
  const dateStr = new Date(reward.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.title}>{reward.title}</h4>
        <span className={styles.amount}>✦ {reward.amount_xlm} XLM</span>
      </div>
      
      <div className={styles.details}>
        {userName && (
          <span className={styles.recipient}>
            👤 {userName}
          </span>
        )}
        <span className={styles.date}>📅 {dateStr}</span>
      </div>

      <div className={styles.footer}>
        <span className={styles.hashLabel}>TX Hash</span>
        <span className={styles.hashValue}>{reward.transaction_hash}</span>
      </div>
    </div>
  );
};

export default RewardCard;
