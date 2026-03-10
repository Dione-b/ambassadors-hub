import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile, fetchUpdateUser } from '../../services/apiClient';
import BadgeList from '../../components/BadgeList';

const AmbassadorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState(0);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [newBadge, setNewBadge] = useState('');
  const [saving, setSaving] = useState(false);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProfile(Number(id));
      setUser(data);
      setPoints(data.points);
      setIsOnboarded(data.onboarded);
    } catch (err) {
      console.error(err);
      navigate('/admin/ambassadors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = { points, onboarded: isOnboarded };
      if (newBadge.trim() !== '' && !user.badges?.includes(newBadge.trim())) {
        updates.badges = [...(user.badges || []), newBadge.trim()];
      }
      await fetchUpdateUser(user.id, updates);
      await loadUser();
      setIsEditing(false);
      setNewBadge('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
    </div>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-[1000px] px-6 py-10">
      <button 
        onClick={() => navigate('/admin/ambassadors')}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
      >
        <span>←</span> Back to Directory
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Summary & Controls */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="rounded-xl border border-border-default bg-bg-card p-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-dim to-secondary-dim text-2xl font-extrabold text-white shadow-[0_0_0_4px_rgba(251,191,36,0.1)]">
              {user.name.charAt(0)}
            </div>
            <h1 className="text-xl font-extrabold text-text-primary">{user.name}</h1>
            <p className="mb-4 text-sm font-medium text-text-secondary">{user.city}, {user.country}</p>
            
            <div className="flex mb-5 items-center justify-center gap-3">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold uppercase border ${
                user.onboarded ? 'border-success/30 bg-success-bg text-success' : 'border-warning/30 bg-warning-bg text-warning'
              }`}>
                {user.onboarded ? 'Verified' : 'Pending'}
              </span>
              <span className="flex items-center gap-1 text-base font-extrabold text-accent-gold">
                ★ <span>{user.points}</span>
              </span>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="w-full rounded-md border border-border-bright bg-transparent px-4 py-2 text-sm font-bold text-text-primary transition-all hover:bg-bg-elevated hover:border-primary-dim"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile Status'}
            </button>
          </div>

          <div className="rounded-xl border border-border-default bg-bg-card p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-text-muted">Contact Info</h3>
            <div className="flex flex-col gap-3">
              <div>
                <span className="block text-xs font-semibold text-text-muted">Email</span>
                <span className="text-sm font-medium text-text-primary">{user.email || `${user.name.toLowerCase().replace(' ', '.')}@example.com`}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-text-muted">Stellar Wallet</span>
                <span className="break-all font-mono text-xs text-accent-teal">{user.stellar_wallet || 'Not connected'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions / Stats / Meetups */}
        <div className="flex flex-col gap-6 md:col-span-2">
          
          {isEditing && (
            <div className="animate-slide-up rounded-xl border border-primary/40 bg-primary/5 p-6 shadow-glow-primary cursor-default">
              <h2 className="mb-4 text-lg font-extrabold text-text-primary">Edit Ambassador Progress</h2>
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-text-primary cursor-pointer">
                    <input type="checkbox" checked={isOnboarded} onChange={(e) => setIsOnboarded(e.target.checked)} className="accent-primary" />
                    Verified / Onboarded
                  </label>
                  <label className="flex items-center gap-3 text-sm font-semibold text-text-primary">
                    Points:
                    <input type="number" min="0" value={points} onChange={(e) => setPoints(Number(e.target.value))} required className="w-24 rounded-md border border-border-default bg-bg-input px-3 py-1.5 focus:border-primary-dim focus:outline-none" />
                  </label>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-primary">Manually Award a Badge</label>
                  <input type="text" placeholder="e.g. Master Trainer" value={newBadge} onChange={(e) => setNewBadge(e.target.value)} className="w-full sm:w-1/2 rounded-md border border-border-default bg-bg-input px-4 py-2 font-medium focus:border-primary-dim focus:outline-none" />
                </div>
                
                <div className="mt-4 flex gap-3">
                  <button type="submit" disabled={saving} className="rounded-md bg-primary-dim px-6 py-2 text-sm font-bold text-bg-base transition-all hover:bg-primary hover:shadow-glow-primary">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-xl border border-border-default bg-bg-card p-6">
            <h3 className="mb-5 border-b border-border-subtle pb-3 text-lg font-extrabold text-text-primary">Badges Earned</h3>
            <BadgeList badges={user.badges} />
          </div>

          <div className="rounded-xl border border-border-default bg-bg-card p-6">
            <div className="mb-5 flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-lg font-extrabold text-text-primary">Events & Meetups</h3>
              <span className="rounded-full bg-border-subtle px-3 py-1 text-xs font-bold text-text-muted">Hosted / Handled</span>
            </div>
            {/* Mocked Events list for frontend demonstration */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center rounded-md border border-border-subtle bg-bg-elevated px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-bold text-text-primary">Intro to Soroban Bootcamp</span>
                  <span className="text-xs text-text-secondary">Hosted at local university, 40+ attendees.</span>
                </div>
                <span className="text-xs font-bold text-accent-gold border border-accent-gold/30 px-2 py-1 rounded-sm">COMPLETED</span>
              </div>
              <div className="flex justify-between items-center rounded-md border border-border-subtle bg-bg-elevated px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-bold text-text-primary">Stellar Developers Meetup ({user.city})</span>
                  <span className="text-xs text-text-secondary">Monthly local ecosystem sync.</span>
                </div>
                <span className="text-xs font-bold text-primary border border-primary/30 px-2 py-1 rounded-sm">UPCOMING</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AmbassadorDetail;
