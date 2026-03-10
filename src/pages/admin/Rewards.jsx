import React, { useState, useEffect } from 'react';
import { getRewards, distributeReward, getAllUsers } from '../../services/mockApi';
import styles from './Rewards.module.css';

const Rewards = () => {
  const [rewards,      setRewards]      = useState([]);
  const [users,        setUsers]        = useState([]);
  const [showForm,     setShowForm]     = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);

  // New reward form fields
  const [title,        setTitle]        = useState('');
  const [amount,       setAmount]       = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [rewardsData, usersData] = await Promise.all([getRewards(), getAllUsers()]);
    setRewards(rewardsData);
    setUsers(usersData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getUserName = (id) =>
    users.find((u) => u.id === id)?.name ?? 'Unknown';

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
        user_id:    Number(selectedUser),
      });
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Failed to distribute reward', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Recompensas XLM</h1>
            <p className={styles.pageSub}>
              Distribua recompensas em XLM para embaixadores destaque
            </p>
          </div>
          {!showForm && (
            <button
              id="btn-new-reward"
              className={styles.btnNew}
              onClick={() => setShowForm(true)}
            >
              + Distribuir Recompensa
            </button>
          )}
        </div>

        {/* Create form */}
        {showForm && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Nova Recompensa</h3>
            <form id="form-new-reward" onSubmit={handleCreate}>
              <div className={styles.fields}>
                <div className={styles.formGroup}>
                  <label htmlFor="reward-title">Título / Motivo</label>
                  <input
                    id="reward-title"
                    required
                    className={styles.input}
                    placeholder="Ex: Monthly Bonus – Top 3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reward-user">Embaixador</label>
                  <select
                    id="reward-user"
                    required
                    className={styles.select}
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecione um embaixador…
                    </option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.points} pts)
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reward-amount">Quantidade (XLM)</label>
                  <input
                    id="reward-amount"
                    type="number"
                    required
                    min="1"
                    className={styles.input}
                    placeholder="Ex: 50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={resetForm}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Enviando…' : '🚀 Distribuir'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Rewards table */}
        {loading ? (
          <div className={styles.loaderWrapper}>
            <div className={styles.spinner} />
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Motivo</th>
                  <th>Embaixador</th>
                  <th className={styles.thRight}>XLM</th>
                  <th>Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {rewards.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={styles.emptyCell}>
                      Nenhuma recompensa distribuída ainda.
                    </td>
                  </tr>
                ) : (
                  rewards.map((reward) => (
                    <tr key={reward.id} className={styles.row}>
                      <td className={styles.rewardTitle}>{reward.title}</td>
                      <td>{getUserName(reward.user_id)}</td>
                      <td className={styles.amount}>
                        <span className={styles.xlmPill}>
                          ✦ {reward.amount_xlm} XLM
                        </span>
                      </td>
                      <td>
                        <span className={styles.hash}>
                          {reward.transaction_hash}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
