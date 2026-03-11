import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchRewards, fetchUpdateUser } from '../../services/apiClient';
import BadgeList from '../../components/BadgeList';
import RewardCard from '../../components/RewardCard';

const Profile = () => {
  const { user, role, updateUser } = useAuth();
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit state (ambassador can edit city/country only)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ city: '', country: '' });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const allRewards = await fetchRewards();
      setRewardsHistory(allRewards.filter(r => r.user_id === user.id));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [user.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const startEditing = () => {
    setFormData({ city: user.city, country: user.country });
    setFeedback(null);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await fetchUpdateUser(user.id, formData, role, user.id);
      updateUser(updated);
      setFeedback({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

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

        {/* Location & Wallet Info */}
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

        {/* Edit Location Section */}
        <div className="flex flex-col gap-4">
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="self-start rounded-md border border-border-bright bg-transparent px-5 py-2 text-sm font-bold text-text-primary transition-all hover:bg-bg-elevated hover:border-primary-dim"
            >
              ✏️ Edit Location
            </button>
          ) : (
            <div className="animate-slide-up rounded-xl border border-primary/40 bg-primary/5 p-6 shadow-glow-primary">
              <h3 className="mb-4 text-base font-extrabold text-text-primary">Update Your Location</h3>
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.72rem] font-bold uppercase tracking-wide text-text-muted">City</label>
                    <input
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="rounded-md border border-border-default bg-bg-input px-4 py-2.5 text-sm font-medium text-text-primary transition-all focus:border-primary-dim focus:shadow-[0_0_0_3px_rgba(251,191,36,0.15)] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.72rem] font-bold uppercase tracking-wide text-text-muted">Country</label>
                    <input
                      name="country"
                      type="text"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="rounded-md border border-border-default bg-bg-input px-4 py-2.5 text-sm font-medium text-text-primary transition-all focus:border-primary-dim focus:shadow-[0_0_0_3px_rgba(251,191,36,0.15)] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-primary-dim px-6 py-2 text-sm font-bold text-bg-base transition-all hover:bg-primary hover:shadow-glow-primary disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-md border border-border-bright bg-transparent px-6 py-2 text-sm font-semibold text-text-secondary transition-all hover:bg-border-default hover:text-text-primary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          {feedback && (
            <div className={`animate-fade-in rounded-md border px-4 py-2.5 text-sm font-semibold ${
              feedback.type === 'success' ? 'border-success/20 bg-success-bg text-success' : 'border-danger/20 bg-danger-bg text-danger'
            }`}>
              {feedback.text}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-col gap-4">
          <h3 className="border-b border-border-subtle pb-2 text-lg font-bold text-text-primary">Badges Collection</h3>
          <BadgeList badges={user.badges} />
        </div>

        {/* Rewards History */}
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
