import React from 'react';
import styles from './RankingTable.module.css';

const MEDAL = ['🥇', '🥈', '🥉'];

/**
 * Reusable ranking table.
 * Highlights the row of the currently logged user (if ambassador).
 */
const RankingTable = ({ users, currentUserId }) => (
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.thPos}>#</th>
          <th>Embaixador</th>
          <th>Cidade</th>
          <th className={styles.thPoints}>Pontos</th>
          <th>Badges</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => {
          const isCurrentUser = user.id === currentUserId;
          const position = index + 1;

          return (
            <tr
              key={user.id}
              className={`${styles.row} ${isCurrentUser ? styles.currentUser : ''}`}
            >
              <td className={styles.pos}>
                {position <= 3 ? (
                  <span className={styles.medal}>{MEDAL[position - 1]}</span>
                ) : (
                  <span className={styles.posNum}>#{position}</span>
                )}
              </td>
              <td className={styles.name}>
                <div className={styles.avatar}>
                  {user.name.charAt(0)}
                </div>
                <span>{user.name}</span>
                {isCurrentUser && <span className={styles.youTag}>você</span>}
              </td>
              <td className={styles.city}>{user.city}</td>
              <td className={styles.points}>
                <span className={styles.pointsValue}>★ {user.points}</span>
              </td>
              <td>
                <div className={styles.badges}>
                  {user.badges.map(b => (
                    <span key={b} className={styles.badge}>{b}</span>
                  ))}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default RankingTable;
