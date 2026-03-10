import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchRewards } from '../../services/apiClient';
import BadgeList from '../../components/BadgeList';
import RewardCard from '../../components/RewardCard';

const Profile = () => {
  const { user } = useAuth();
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const allRewards = await fetchRewards();
      setRewardsHistory(allRewards.filter(r => r.user_id === user.id));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [user.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="animate-fade-in px-6 py-10">
      <div className="mx-auto flex max-w-[800px] flex-col gap-8">
        <div className="relative flex items-center gap-6 overflow-hidden rounded-xl border border-border-default bg-bg-card p-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-bg-base bg-gradient-to-br from-primary-dim to-secondary-dim text-4xl font-extrabold text-white shadow-[0_0_0_2px_var(--color-primary-dim)]">
            {initials}
          </div>
          <div className="grow">
            <div className="mb-1 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold text-text-primary">{user.name}</h1>
              {user.onboarded && (
                <span className="rounded-full border border-success/30 bg-success-bg px-2.5 py-0.5 text-[0.7rem] font-bold text-success">
                  ✓ Verified Global Ambassador
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-5 py-2">
            <span className="text-xl text-accent-gold">★</span>
            <span className="text-2xl font-extrabold text-text-primary">{user.points}</span>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
          <div className="flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-bg-card p-5">
            <span className="text-[0.7rem] font-bold uppercase tracking-wide text-text-muted">Location</span>
            <span className="text-[0.95rem] font-semibold text-text-primary">{user.city}, {user.country}</span>
          </div>
          <div className="flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-bg-card p-5">
            <span className="text-[0.7rem] font-bold uppercase tracking-wide text-text-muted">Wallet Type</span>
            <span className="text-[0.95rem] font-semibold text-text-primary">Stellar Network</span>
          </div>
          <div className="col-span-full flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-bg-card p-5">
            <span className="text-[0.7rem] font-bold uppercase tracking-wide text-text-muted">Wallet Address</span>
            <span className="break-all font-mono text-sm font-semibold text-accent-teal">
              {user.stellar_wallet || 'Not connected yet'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="border-b border-border-subtle pb-2 text-lg font-bold text-text-primary">Badges Collection</h3>
          <BadgeList badges={user.badges} />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="border-b border-border-subtle pb-2 text-lg font-bold text-text-primary">XLM Rewards History</h3>
          {loading ? (
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-3 border-border-default border-t-primary" />
          ) : rewardsHistory.length === 0 ? (
            <div className="rounded-md border border-dashed border-border-default bg-bg-card p-8 text-center text-sm italic text-text-muted">
              No XLM distributions received yet.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
              {rewardsHistory.map(reward => <RewardCard key={reward.id} reward={reward} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
