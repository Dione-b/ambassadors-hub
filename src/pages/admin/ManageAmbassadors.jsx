import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUser } from '../../services/mockApi';
import styles from './ManageAmbassadors.module.css';
import BadgeList from '../../components/BadgeList';

const ManageAmbassadors = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  
  // Edit State
  const [points, setPoints] = useState(0);
  const [newBadge, setNewBadge] = useState('');
  const [isOnboarded, setIsOnboarded] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      data.sort((a, b) => b.points - a.points);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleEdit = (u) => {
    setEditId(u.id);
    setPoints(u.points);
    setNewBadge('');
    setIsOnboarded(u.onboarded);
  };

  const handleSave = async (user) => {
    try {
      const updates = { points, onboarded: isOnboarded };
      if (newBadge.trim() !== '') {
        const bdg = user.badges || [];
        if (!bdg.includes(newBadge.trim())) {
          updates.badges = [...bdg, newBadge.trim()];
        }
      }
      
      await updateUser(user.id, updates);
      setEditId(null);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className={styles.loaderWrapper}><div className={styles.spinner}></div></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ambassadors Directory</h1>
      <p className={styles.subtitle}>Supervise users, adjust points, and manually grant badges.</p>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ambassador</th>
              <th>Location</th>
              <th>Status</th>
              <th>Points</th>
              <th>Badges</th>
              <th className={styles.thActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const editing = editId === u.id;

              return (
                <tr key={u.id} className={styles.row}>
                  <td>
                    <div className={styles.userCol}>
                      <div className={styles.avatar}>{u.name.charAt(0)}</div>
                      <div className={styles.userInfo}>
                        <span className={styles.name}>{u.name}</span>
                        <span className={styles.email}>{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.location}>{u.city}, {u.country}</td>
                  <td>
                    {editing ? (
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          checked={isOnboarded} 
                          onChange={(e) => setIsOnboarded(e.target.checked)} 
                        />
                        Onboarded
                      </label>
                    ) : (
                      <span className={`${styles.statusBadge} ${u.onboarded ? styles.statusOk : styles.statusPending}`}>
                        {u.onboarded ? 'Verified' : 'Pending'}
                      </span>
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <input 
                        type="number" 
                        value={points} 
                        onChange={e => setPoints(Number(e.target.value))} 
                        className={`${styles.input} ${styles.ptsInput}`} 
                      />
                    ) : (
                      <span className={styles.ptsValue}>★ {u.points}</span>
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <div className={styles.editBadges}>
                        <BadgeList badges={u.badges} />
                        <input 
                          type="text" 
                          placeholder="+ Add New Badge" 
                          value={newBadge} 
                          onChange={e => setNewBadge(e.target.value)} 
                          className={styles.input} 
                        />
                      </div>
                    ) : (
                      <BadgeList badges={u.badges} />
                    )}
                  </td>
                  <td className={styles.tdActions}>
                    {editing ? (
                      <div className={styles.actionRow}>
                        <button className={styles.btnSave} onClick={() => handleSave(u)}>Save</button>
                        <button className={styles.btnCancel} onClick={() => setEditId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button className={styles.btnEdit} onClick={() => handleEdit(u)}>Edit</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAmbassadors;
