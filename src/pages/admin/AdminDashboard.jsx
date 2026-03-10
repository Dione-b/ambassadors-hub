import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllMeetings, getRewards } from '../../services/mockApi';
import styles from './AdminDashboard.module.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [users, meetings, rewards] = await Promise.all([
          getAllUsers(),
          getAllMeetings(),
          getRewards()
        ]);

        const totalAmbassadors = users.length;
        const fullyOnboarded = users.filter((u) => u.onboarded).length;
        const upcomingMeetings = meetings.filter((m) => new Date(m.date) >= new Date()).length;
        const totalXlm = rewards.reduce((sum, r) => sum + r.amount_xlm, 0);

        setMetrics({ totalAmbassadors, fullyOnboarded, upcomingMeetings, totalXlm });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <div className={styles.loaderWrapper}>
         <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Global Admin Dashboard</h1>
        <p className={styles.subtitle}>Overview of the Stellar Ambassadors program.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card} onClick={() => navigate('/admin/ambassadors')}>
          <div className={styles.iconWrapper}>👥</div>
          <div className={styles.cardInfo}>
            <span className={styles.value}>{metrics.totalAmbassadors}</span>
            <span className={styles.label}>Total Ambassadors</span>
          </div>
        </div>

        <div className={styles.card} onClick={() => navigate('/admin/ambassadors')}>
          <div className={styles.iconWrapper}>✅</div>
          <div className={styles.cardInfo}>
            <span className={styles.value}>{metrics.fullyOnboarded}</span>
            <span className={styles.label}>Fully Onboarded</span>
          </div>
        </div>

        <div className={styles.card} onClick={() => navigate('/admin/meetings')}>
          <div className={styles.iconWrapper}>📅</div>
          <div className={styles.cardInfo}>
            <span className={styles.value}>{metrics.upcomingMeetings}</span>
            <span className={styles.label}>Upcoming Meetings</span>
          </div>
        </div>

        <div className={styles.card} onClick={() => navigate('/admin/rewards')}>
          <div className={styles.iconWrapper}>💎</div>
          <div className={styles.cardInfo}>
            <span className={styles.value}>{metrics.totalXlm} XLM</span>
            <span className={styles.label}>Distributed Rewards</span>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h3 className={styles.qaTitle}>Quick Actions</h3>
        <div className={styles.btnRow}>
          <button className={styles.actionBtn} onClick={() => navigate('/admin/meetings')}>Manage Meetings</button>
          <button className={styles.actionBtn} onClick={() => navigate('/admin/rewards')}>Distribute XLM</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
