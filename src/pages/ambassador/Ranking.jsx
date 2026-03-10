import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getRanking } from '../../services/mockApi';
import RankingTable from '../../components/RankingTable';
import styles from './Ranking.module.css';

const Ranking = () => {
  const { user, role } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRanking()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  // The current user ID is only relevant for ambassador highlighting
  const currentUserId = role === 'ambassador' ? user?.id : null;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Ranking de Embaixadores</h1>
          <p className={styles.pageSub}>
            Classificação por pontos — atualizado em tempo real
          </p>
        </div>

        {loading ? (
          <div className={styles.loaderWrapper}>
            <div className={styles.spinner} />
          </div>
        ) : (
          <RankingTable users={users} currentUserId={currentUserId} />
        )}
      </div>
    </div>
  );
};

export default Ranking;
