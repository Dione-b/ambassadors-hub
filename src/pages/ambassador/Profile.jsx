import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getRewards } from '../../services/mockApi';
import BadgeList from '../../components/BadgeList';
import RewardCard from '../../components/RewardCard';
import styles from './Profile.module.css';

const Profile = () => {
  const { user } = useAuth();
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const allRewards = await getRewards();
      // Filter for this user only
      setRewardsHistory(allRewards.filter(r => r.user_id === user.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Profile Card Summary */}
        <div className={styles.cardInfo}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.basicInfo}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>{user.name}</h1>
              {user.onboarded && <span className={styles.verifiedTag}>✓ Verified Global Ambassador</span>}
            </div>
            <p className={styles.email}>{user.email}</p>
          </div>
          <div className={styles.pointsBadge}>
            <span className={styles.star}>★</span>
            <span className={styles.pts}>{user.points}</span>
          </div>
        </div>

        {/* Global Details Grid */}
        <div className={styles.detailsGrid}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Location</span>
            <span className={styles.value}>{user.city}, {user.country}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Wallet Type</span>
            <span className={styles.value}>Stellar Network</span>
          </div>
          <div className={`${styles.detailRow} ${styles.colSpan2}`}>
            <span className={styles.label}>Wallet Address</span>
            <span className={styles.walletAddr}>{user.stellar_wallet || 'Not connected yet'}</span>
          </div>
        </div>

        {/* Badges Earned */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Badges Collection</h3>
          <BadgeList badges={user.badges} />
        </div>

        {/* Total Rewards */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>XLM Rewards History</h3>
          
          {loading ? (
             <div className={styles.spinner}></div>
          ) : rewardsHistory.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>No XLM distributions received yet.</p>
            </div>
          ) : (
            <div className={styles.rewardsGrid}>
              {rewardsHistory.map(reward => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
