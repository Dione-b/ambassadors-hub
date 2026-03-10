import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentMeetings, hasUserAttended, registerAttendance, getOnboardingSteps } from '../../services/mockApi';
import MeetingCard from '../../components/MeetingCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [attended, setAttended] = useState(false);
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  const [submitting, setSubmitting] = useState(false);
  const [onboardSteps, setOnboardSteps] = useState([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [meetings, steps] = await Promise.all([getCurrentMeetings(), getOnboardingSteps(user.id)]);
      setOnboardSteps(steps);
      if (meetings.length > 0) {
        setMeeting(meetings[0]);
        const att = await hasUserAttended(user.id, meetings[0].id);
        setAttended(att);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [user.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleConfirmAttendance = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', msg: '' });
    try {
      const res = await registerAttendance(user.id, meeting.id, password);
      if (res.success) {
        updateUser({ points: user.points + 10 });
        setAttended(true);
        setFeedback({ type: 'success', msg: res.message });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setSubmitting(false);
      setPassword('');
    }
  };

  if (loading) return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
    </div>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-[1000px] px-6 py-8">
      {/* Welcome */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="mb-1 text-3xl font-extrabold text-text-primary">Welcome back, {user.name} 👋</h1>
          <p className="text-sm text-text-secondary">Your ambassador mission control center.</p>
        </div>
        <div className="flex gap-4">
          <div
            className="flex items-center gap-4 rounded-xl border border-border-default bg-bg-card px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
          >
            <span className="text-3xl text-primary-hover">★</span>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold leading-tight text-text-primary">{user.points}</span>
              <span className="text-[0.72rem] font-bold uppercase tracking-wide text-text-muted">Total Points</span>
            </div>
          </div>
          <div
            onClick={() => navigate('/profile')}
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-border-default bg-bg-card px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-primary-dim hover:shadow-sm"
          >
            <span className="text-3xl">🏅</span>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold leading-tight text-text-primary">{user.badges.length}</span>
              <span className="text-[0.72rem] font-bold uppercase tracking-wide text-text-muted">Badges Earned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Onboard Alert */}
      {!user.onboarded && (
        <div className="mb-8 flex flex-wrap items-center gap-5 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/[0.03] p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-dim text-xl shadow-[0_0_15px_rgba(99,102,241,0.4)]">🚀</div>
          <div className="min-w-[200px] grow">
            <h3 className="text-lg font-extrabold text-text-primary">You are almost there!</h3>
            <p className="text-sm text-text-secondary">Complete your onboarding checklist to become verified.</p>
          </div>
          <button
            onClick={() => navigate('/onboard')}
            className="whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-px hover:shadow-glow-primary"
          >
            Go to Onboarding
          </button>
        </div>
      )}

      {/* Meeting Section */}
      <h2 className="mb-5 text-lg font-extrabold uppercase tracking-wide text-text-primary">Weekly Global Sync</h2>
      <div className="max-w-[600px]">
        {meeting ? (
          <MeetingCard meeting={meeting} hasAttended={attended}>
            {!attended ? (
              <div className="flex flex-col gap-4">
                {meeting.isOpen ? (
                  <form className="flex gap-3" onSubmit={handleConfirmAttendance}>
                    <input
                      type="text"
                      placeholder="Enter 4+ char password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value.toUpperCase())}
                      required
                      disabled={submitting}
                      className="grow rounded-md border border-border-default bg-bg-input px-4 py-3 text-base font-semibold uppercase text-text-primary transition-all focus:border-primary-dim focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={password.trim().length < 4 || submitting}
                      className="whitespace-nowrap rounded-md bg-primary-dim px-6 text-sm font-bold text-white transition-all hover:bg-primary hover:shadow-glow-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? 'Verifying...' : 'Register'}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-3 rounded-sm border-l-[3px] border-l-border-default bg-bg-elevated/60 px-4 py-3.5 text-sm text-text-muted">
                    <span className="text-lg">🔒</span>
                    Wait for the Admin to open the attendance window during the sync.
                  </div>
                )}
                {feedback.msg && (
                  <div className={`animate-fade-in rounded-md border px-4 py-3 text-sm font-semibold ${
                    feedback.type === 'success' ? 'border-success/20 bg-success-bg text-success' : 'border-danger/20 bg-danger-bg text-danger'
                  }`}>
                    {feedback.msg}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-md border border-dashed border-success/30 bg-success/5 p-4 font-semibold text-success">
                🎉 Awesome! You've secured your +10 points for this meeting.
              </div>
            )}
          </MeetingCard>
        ) : (
          <p className="text-sm italic text-text-muted">No meetings scheduled right now.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
