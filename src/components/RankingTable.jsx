import React from 'react';
import styles from './RankingTable.module.css';

const MEDAL = ['🥇', '🥈', '🥉'];

const RankingTable = ({ users, currentUserId }) => (
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.thPos}>Rank</th>
          <th>Ambassador</th>
          <th>Country</th>
          <th className={styles.thPoints}>Points</th>
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
                {isCurrentUser && <span className={styles.youTag}>You</span>}
              </td>
              <td className={styles.country}>
                {user.country}
              </td>
              <td className={styles.points}>
                <span className={styles.pointsValue}>★ {user.points}</span>
              </td>
              <td>
                <div className={styles.badges}>
                  {user.badges.slice(0, 3).map(b => (
                    <span key={b} className={styles.badge} title={b}>
                      {b}
                    </span>
                  ))}
                  {user.badges.length > 3 && (
                    <span className={styles.badgeMore}>+{user.badges.length - 3}</span>
                  )}
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
