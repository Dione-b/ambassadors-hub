import React, { useState, useEffect } from 'react';
import { getRewards, distributeReward, getAllUsers } from '../../services/mockApi';
import styles from './ManageRewards.module.css';
import RewardCard from '../../components/RewardCard';

const ManageRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rData, uData] = await Promise.all([getRewards(), getAllUsers()]);
      rData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRewards(rData);
      setUsers(uData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getUserName = (id) => users.find((u) => u.id === id)?.name ?? 'Unknown';

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setSelectedUser('');
    setShowForm(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await distributeReward({
        title,
        amount_xlm: Number(amount),
        user_id: Number(selectedUser),
      });
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className={styles.loaderWrapper}><div className={styles.spinner}></div></div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>XLM Rewards</h1>
          <p className={styles.subtitle}>Distribute bonus XLM to standout global ambassadors.</p>
        </div>
        {!showForm && (
          <button className={styles.btnNew} onClick={() => setShowForm(true)}>
            + Distribute Reward
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>New Distribution</h2>
          <form onSubmit={handleCreate}>
            <div className={styles.fields}>
              <div className={styles.formGroup}>
                <label>Reason / Title</label>
                <input
                  required
                  placeholder="e.g. Content Creator Bonus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ambassador</label>
                <select
                  required
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className={styles.input}
                >
                  <option value="" disabled>Select Ambassador...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.country} ({u.points} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Amount (XLM)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={resetForm}>Cancel</button>
              <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                {submitting ? 'Sending...' : 'Confirm Distribution'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.historySection}>
        <h3 className={styles.sectionTitle}>Distribution History</h3>
        {rewards.length === 0 ? (
          <p className={styles.empty}>No rewards distributed yet.</p>
        ) : (
          <div className={styles.grid}>
            {rewards.map(reward => (
               <RewardCard key={reward.id} reward={reward} userName={getUserName(reward.user_id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRewards;
