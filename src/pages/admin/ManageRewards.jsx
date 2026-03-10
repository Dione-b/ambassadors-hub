import React, { useState, useEffect } from 'react';
import { fetchRewards, fetchDistributeReward, fetchAllUsers } from '../../services/apiClient';
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
      const [rData, uData] = await Promise.all([fetchRewards(), fetchAllUsers()]);
      rData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRewards(rData);
      setUsers(uData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const getUserName = (id) => users.find((u) => u.id === id)?.name ?? 'Unknown';

  const resetForm = () => { setTitle(''); setAmount(''); setSelectedUser(''); setShowForm(false); };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchDistributeReward({ title, amount_xlm: Number(amount), user_id: Number(selectedUser) });
      resetForm();
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
    </div>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-[1000px] px-6 py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-extrabold text-text-primary">XLM Rewards</h1>
          <p className="text-sm text-text-secondary">Distribute bonus XLM to standout global ambassadors.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="whitespace-nowrap rounded-full bg-primary-dim px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary hover:shadow-glow-primary">
            + Distribute Reward
          </button>
        )}
      </div>

      {showForm && (
        <div className="animate-slide-up mb-10 rounded-xl border border-border-bright bg-bg-card p-7 shadow-glow-primary">
          <h2 className="mb-5 text-lg font-extrabold text-text-primary">New Distribution</h2>
          <form onSubmit={handleCreate}>
            <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-bold uppercase tracking-wide text-text-muted">Reason / Title</label>
                <input required placeholder="e.g. Content Creator Bonus" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="rounded-md border border-border-default bg-bg-input px-4 py-3 text-sm text-text-primary transition-all focus:border-primary-dim focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-bold uppercase tracking-wide text-text-muted">Ambassador</label>
                <select required value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}
                  className="rounded-md border border-border-default bg-bg-input px-4 py-3 text-sm text-text-primary transition-all focus:border-primary-dim focus:outline-none [&_option]:bg-bg-base">
                  <option value="" disabled>Select Ambassador...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} — {u.country} ({u.points} pts)</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-bold uppercase tracking-wide text-text-muted">Amount (XLM)</label>
                <input type="number" required min="1" placeholder="e.g. 50" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="rounded-md border border-border-default bg-bg-input px-4 py-3 text-sm text-text-primary transition-all focus:border-primary-dim focus:outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="rounded-full border border-border-bright bg-transparent px-6 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:bg-border-default hover:text-text-primary">Cancel</button>
              <button type="submit" disabled={submitting} className="rounded-full bg-primary-dim px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary hover:shadow-glow-primary disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? 'Sending...' : 'Confirm Distribution'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-4">
        <h3 className="mb-5 border-b border-border-subtle pb-2 text-lg font-extrabold text-text-primary">Distribution History</h3>
        {rewards.length === 0 ? (
          <div className="rounded-md border border-dashed border-border-default bg-bg-card p-8 text-center text-sm italic text-text-muted">
            No rewards distributed yet.
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
            {rewards.map(reward => <RewardCard key={reward.id} reward={reward} userName={getUserName(reward.user_id)} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRewards;
