import React, { useState, useEffect } from 'react';
import { fetchAllUsers, fetchUpdateUser } from '../../services/apiClient';
import BadgeList from '../../components/BadgeList';

const ManageAmbassadors = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [points, setPoints] = useState(0);
  const [newBadge, setNewBadge] = useState('');
  const [isOnboarded, setIsOnboarded] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      data.sort((a, b) => b.points - a.points);
      setUsers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleEdit = (u) => { setEditId(u.id); setPoints(u.points); setNewBadge(''); setIsOnboarded(u.onboarded); };

  const handleSave = async (user) => {
    try {
      const updates = { points, onboarded: isOnboarded };
      if (newBadge.trim() !== '' && !user.badges?.includes(newBadge.trim())) {
        updates.badges = [...(user.badges || []), newBadge.trim()];
      }
      await fetchUpdateUser(user.id, updates);
      setEditId(null);
      loadUsers();
    } catch (err) { alert(err.message); }
  };

  if (loading) return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
    </div>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-[1200px] px-6 py-10">
      <h1 className="mb-1 text-3xl font-extrabold text-text-primary">Ambassadors Directory</h1>
      <p className="mb-8 text-sm text-text-secondary">Supervise users, adjust points, and manually grant badges.</p>

      <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-card">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-default bg-bg-elevated">
              <th className="whitespace-nowrap px-5 py-4 text-left text-[0.72rem] font-bold uppercase tracking-wide text-text-secondary">Ambassador</th>
              <th className="whitespace-nowrap px-5 py-4 text-left text-[0.72rem] font-bold uppercase tracking-wide text-text-secondary">Location</th>
              <th className="whitespace-nowrap px-5 py-4 text-left text-[0.72rem] font-bold uppercase tracking-wide text-text-secondary">Status</th>
              <th className="whitespace-nowrap px-5 py-4 text-left text-[0.72rem] font-bold uppercase tracking-wide text-text-secondary">Points</th>
              <th className="whitespace-nowrap px-5 py-4 text-left text-[0.72rem] font-bold uppercase tracking-wide text-text-secondary">Badges</th>
              <th className="whitespace-nowrap px-5 py-4 text-right text-[0.72rem] font-bold uppercase tracking-wide text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const editing = editId === u.id;
              return (
                <tr key={u.id} className="border-b border-border-subtle transition-colors last:border-b-0 hover:bg-bg-card-hover">
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-dim to-secondary-dim text-xs font-extrabold text-white">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[0.95rem] font-bold text-text-primary">{u.name}</span>
                        <span className="text-xs text-text-muted">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle text-sm font-medium text-text-secondary">{u.city}, {u.country}</td>
                  <td className="px-5 py-4 align-middle">
                    {editing ? (
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-text-primary">
                        <input type="checkbox" checked={isOnboarded} onChange={(e) => setIsOnboarded(e.target.checked)} />
                        Onboarded
                      </label>
                    ) : (
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold uppercase border ${
                        u.onboarded ? 'border-success/30 bg-success-bg text-success' : 'border-warning/30 bg-warning-bg text-warning'
                      }`}>
                        {u.onboarded ? 'Verified' : 'Pending'}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 align-middle">
                    {editing ? (
                      <input type="number" value={points} onChange={e => setPoints(Number(e.target.value))}
                        className="w-20 rounded-md border border-border-default bg-bg-input px-3 py-2 text-center text-sm text-text-primary focus:border-primary-dim focus:outline-none" />
                    ) : (
                      <span className="text-base font-extrabold text-accent-gold">★ {u.points}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 align-middle">
                    {editing ? (
                      <div className="flex flex-col gap-3">
                        <BadgeList badges={u.badges} />
                        <input type="text" placeholder="+ Add New Badge" value={newBadge} onChange={e => setNewBadge(e.target.value)}
                          className="rounded-md border border-border-default bg-bg-input px-3 py-2 text-sm text-text-primary focus:border-primary-dim focus:outline-none" />
                      </div>
                    ) : (
                      <BadgeList badges={u.badges} />
                    )}
                  </td>
                  <td className="px-5 py-4 text-right align-middle">
                    {editing ? (
                      <div className="flex flex-wrap justify-end gap-2">
                        <button onClick={() => handleSave(u)} className="rounded-md bg-primary-dim px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-primary hover:shadow-glow-primary">Save</button>
                        <button onClick={() => setEditId(null)} className="rounded-md border border-border-bright bg-transparent px-3.5 py-1.5 text-xs font-semibold text-text-secondary transition-all hover:bg-border-default hover:text-text-primary">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => handleEdit(u)} className="rounded-md border border-border-bright bg-transparent px-3.5 py-1.5 text-xs font-semibold text-text-secondary transition-all hover:bg-border-default hover:text-text-primary">Edit</button>
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
