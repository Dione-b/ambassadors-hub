import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getRanking } from '../../services/mockApi';
import RankingTable from '../../components/RankingTable';
import styles from './Ranking.module.css';

const Ranking = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await getRanking();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Global Leaderboard</h1>
          <p className={styles.subtitle}>Ranking is updated in real-time based on your contributions.</p>
        </div>

        {loading ? (
          <div className={styles.loaderWrapper}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <RankingTable users={users} currentUserId={user.id} />
        )}
      </div>
    </div>
  );
};

export default Ranking;
