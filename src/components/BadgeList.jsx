import React from 'react';
import styles from './BadgeList.module.css';

const BadgeList = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return <p className={styles.empty}>No badges earned yet.</p>;
  }

  return (
    <div className={styles.list}>
      {badges.map((b) => (
        <span key={b} className={styles.badge} title={b}>
          ✮ {b}
        </span>
      ))}
    </div>
  );
};

export default BadgeList;
