import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentMeetings, hasUserAttended, registerAttendance, updateUser } from '../../services/mockApi';
import MeetingCard from '../../components/MeetingCard';
import OnboardingProgress from '../../components/OnboardingProgress';
import { getOnboardingSteps } from '../../services/mockApi';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, updateUser: updateContextUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [attended, setAttended] = useState(false);
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  const [submitting, setSubmitting] = useState(false);

  // Onboarding state
  const [onboardSteps, setOnboardSteps] = useState([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [meetings, steps] = await Promise.all([
        getCurrentMeetings(),
        getOnboardingSteps(user.id)
      ]);

      setOnboardSteps(steps);

      // Find the most relevant open/upcoming meeting
      if (meetings.length > 0) {
        setMeeting(meetings[0]);
        const att = await hasUserAttended(user.id, meetings[0].id);
        setAttended(att);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleConfirmAttendance = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', msg: '' });

    try {
      const res = await registerAttendance(user.id, meeting.id, password);
      // Synchronize context user + 10 points
      if (res.success) {
        updateContextUser({ points: user.points + 10 });
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

  const isPasswordValid = password.trim().length > 3;

  if (loading) return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner}></div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Welcome Header */}
      <div className={styles.welcomeSection}>
        <div>
          <h1 className={styles.title}>Welcome back, {user.name} 👋</h1>
          <p className={styles.subtitle}>
            Your ambassador mission control center.
          </p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statCard} onClick={() => navigate('/ranking')}>
            <span className={styles.statIcon}>★</span>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{user.points}</span>
              <span className={styles.statLabel}>Total Points</span>
            </div>
          </div>
          <div className={styles.statCard} onClick={() => navigate('/profile')}>
            <span className={styles.statIcon}>🏅</span>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{user.badges.length}</span>
              <span className={styles.statLabel}>Badges Earned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.grid}>
        
        {/* Only show brief onboard tip if not fully onboarded */}
        {!user.onboarded && (
          <div className={styles.onboardWrapper}>
            <div className={styles.onboardAlert}>
              <div className={styles.alertIcon}>🚀</div>
              <div className={styles.alertContent}>
                <h3 className={styles.alertTitle}>You are almost there!</h3>
                <p className={styles.alertDesc}>
                  Complete your onboarding checklist to become verified.
                </p>
              </div>
              <button 
                className={styles.alertBtn}
                onClick={() => navigate('/onboard')}
              >
                Go to Onboarding
              </button>
            </div>
          </div>
        )}

        <div className={styles.meetingWrapper}>
          <h2 className={styles.sectionTitle}>Weekly Global Sync</h2>
          {meeting ? (
            <MeetingCard meeting={meeting} hasAttended={attended}>
              {/* Form specifically for ambassador */}
              {!attended ? (
                <div className={styles.attendanceFormSection}>
                  {meeting.isOpen ? (
                    <form className={styles.formRow} onSubmit={handleConfirmAttendance}>
                      <input
                        type="text"
                        placeholder="Enter 4+ char password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.toUpperCase())}
                        required
                        className={styles.input}
                        disabled={submitting}
                      />
                      <button 
                        type="submit" 
                        disabled={!isPasswordValid || submitting}
                        className={styles.btnConfirm}
                      >
                        {submitting ? 'Verifying...' : 'Register'}
                      </button>
                    </form>
                  ) : (
                    <div className={styles.formClosedAlert}>
                      <span className={styles.lockIcon}>🔒</span>
                      Wait for the Admin to open the attendance window during the sync.
                    </div>
                  )}

                  {feedback.msg && (
                    <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                      {feedback.msg}
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.rewardSuccess}>
                  🎉 Awesome! You've secured your +10 points for this meeting.
                </div>
              )}
            </MeetingCard>
          ) : (
             <p className={styles.noMeeting}>No meetings scheduled right now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
