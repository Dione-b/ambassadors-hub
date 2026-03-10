import React from 'react';
import styles from './MeetingCard.module.css';

/**
 * Displays a meeting card with status badges.
 * In ambassador view, shows attendance confirmation badge.
 * In admin view, shows attendee count alongside window/password status.
 */
const MeetingCard = ({ meeting, hasAttended = false }) => {
  const formattedDate = new Date(meeting.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div>
          <h3 className={styles.title}>{meeting.title}</h3>
          <p className={styles.date}>📅 {formattedDate}</p>
        </div>
        {hasAttended && (
          <span className={styles.confirmedBadge}>✅ Confirmado</span>
        )}
      </div>

      <div className={styles.statusRow}>
        <span className={`${styles.badge} ${meeting.isOpen ? styles.open : styles.closed}`}>
          <span className={styles.dot} />
          {meeting.isOpen ? 'Janela Aberta' : 'Janela Fechada'}
        </span>
        <span className={`${styles.badge} ${meeting.password ? styles.hasPassword : styles.noPassword}`}>
          {meeting.password ? '🔑 Senha definida' : '⚠ Sem senha'}
        </span>
      </div>
    </div>
  );
};

export default MeetingCard;
