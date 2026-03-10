import React from 'react';
import styles from './MeetingCard.module.css';

/**
 * Reusable card for meetings.
 * Admin view: password editing and status toggle buttons.
 * Ambassador view: registration form (managed by parent).
 */
const MeetingCard = ({ meeting, hasAttended = false, children }) => {
  const meetingDate = new Date(meeting.date);
  
  // Format Date and Time
  const formattedDate = meetingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const formattedTime = meetingDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <div className={styles.details}>
          <h3 className={styles.title}>{meeting.title}</h3>
          <p className={styles.date}>
            📅 {formattedDate} • {formattedTime} ({meeting.timezone})
          </p>
        </div>
        
        {hasAttended && (
          <div className={styles.confirmedBadge}>
            ✅ Attendance Confirmed
          </div>
        )}
      </div>

      <div className={styles.statusRow}>
        <span className={`${styles.badge} ${meeting.isOpen ? styles.open : styles.closed}`}>
          <span className={styles.dot} />
          {meeting.isOpen ? 'Window Open' : 'Window Closed'}
        </span>
        <span className={`${styles.badge} ${meeting.password ? styles.hasPassword : styles.noPassword}`}>
          {meeting.password ? '🔑 Password Set' : '⚠ No Password'}
        </span>
        <span className={styles.windowInfo}>
          ⏳ Closes {meeting.validityWindowMinutes}m after start
        </span>
      </div>

      {/* Render children (like form inputs mapping) inside */}
      {children && (
        <div className={styles.cardChildren}>
          {children}
        </div>
      )}
    </div>
  );
};

export default MeetingCard;
