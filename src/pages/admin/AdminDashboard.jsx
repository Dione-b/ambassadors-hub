import React, { useState, useEffect } from 'react';
import { fetchAllUsers, fetchAllMeetings, fetchRewards } from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [users, meetings, rewards] = await Promise.all([fetchAllUsers(), fetchAllMeetings(), fetchRewards()]);
        setMetrics({
          totalAmbassadors: users.length,
          fullyOnboarded: users.filter((u) => u.onboarded).length,
          upcomingMeetings: meetings.filter((m) => new Date(m.date) >= new Date()).length,
          totalXlm: rewards.reduce((sum, r) => sum + r.amount_xlm, 0),
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchMetrics();
  }, []);

  if (loading || !metrics) return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
    </div>
  );

  const cards = [
    { icon: '👥', value: metrics.totalAmbassadors, label: 'Total Ambassadors', route: '/admin/ambassadors' },
    { icon: '✅', value: metrics.fullyOnboarded, label: 'Fully Onboarded', route: '/admin/ambassadors' },
    { icon: '📅', value: metrics.upcomingMeetings, label: 'Upcoming Meetings', route: '/admin/meetings' },
    { icon: '💎', value: `${metrics.totalXlm} XLM`, label: 'Distributed Rewards', route: '/admin/rewards' },
  ];

  return (
    <div className="animate-fade-in mx-auto max-w-[1000px] px-6 py-10">
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-extrabold text-text-primary">Global Admin Dashboard</h1>
        <p className="text-sm text-text-secondary">Overview of the Stellar Ambassadors program.</p>
      </div>

      <div className="mb-12 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        {cards.map((card) => (
          <div
            key={card.label}
            onClick={() => navigate(card.route)}
            className="flex cursor-pointer items-center gap-5 rounded-xl border border-border-default bg-bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary-dim hover:shadow-sm"
          >
            <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl">
              {card.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold leading-tight text-text-primary">{card.value}</span>
              <span className="mt-0.5 text-[0.72rem] font-bold uppercase tracking-wide text-text-muted">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border-subtle bg-gradient-to-br from-bg-elevated/40 to-bg-card p-6">
        <h3 className="mb-4 text-lg font-bold text-text-primary">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => navigate('/admin/meetings')} className="rounded-full bg-primary-dim px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary hover:shadow-glow-primary">
            Manage Meetings
          </button>
          <button onClick={() => navigate('/admin/rewards')} className="rounded-full bg-primary-dim px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary hover:shadow-glow-primary">
            Distribute XLM
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
