import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Profile.module.css';

/** Generates initials from a full name (e.g. "Ana Silva" → "AS") */
const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.pageTitle}>Meu Perfil</h1>

        <div className={styles.card}>
          {/* Avatar */}
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>{getInitials(user.name)}</div>
            <div>
              <h2 className={styles.name}>{user.name}</h2>
              <p className={styles.city}>📍 {user.city}</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Details */}
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>{user.email}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Carteira Stellar</span>
              <span className={`${styles.detailValue} ${styles.mono}`}>
                {user.stellar_wallet}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Pontos</span>
              <span className={`${styles.detailValue} ${styles.points}`}>
                ★ {user.points}
              </span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Badges */}
          <div className={styles.badgesSection}>
            <h3 className={styles.badgesTitle}>Badges</h3>
            <div className={styles.badges}>
              {user.badges && user.badges.length > 0 ? (
                user.badges.map((badge) => (
                  <span key={badge} className={styles.badge}>
                    🏅 {badge}
                  </span>
                ))
              ) : (
                <p className={styles.noBadges}>
                  Nenhum badge conquistado ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
