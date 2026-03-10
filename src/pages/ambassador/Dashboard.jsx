import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getCurrentMeeting,
  hasUserAttended,
  registerAttendance,
  getUserProfile,
} from '../../services/mockApi';
import MeetingCard from '../../components/MeetingCard';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, updateUser } = useAuth();

  const [meeting,    setMeeting]    = useState(null);
  const [attended,   setAttended]   = useState(false);
  const [password,   setPassword]   = useState('');
  const [status,     setStatus]     = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentMeeting = await getCurrentMeeting();
        setMeeting(currentMeeting);
        if (currentMeeting) {
          const didAttend = await hasUserAttended(user.id, currentMeeting.id);
          setAttended(didAttend);
        }
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const handlePasswordChange = (e) => {
    // Spec: password input auto-uppercases
    setPassword(e.target.value.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await registerAttendance(user.id, meeting.id, password);
      setStatus({ type: 'success', message: response.message });
      setAttended(true);
      setPassword('');

      // Sync updated points from the mock store back to AuthContext
      const updated = await getUserProfile(user.id);
      if (updated) updateUser({ points: updated.points });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Page heading */}
        <div className={styles.pageHeader}>
          <h1 className={styles.greeting}>
            Olá, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className={styles.subGreeting}>
            Confira seu progresso e confirme sua presença esta semana.
          </p>
        </div>

        {/* Stats row */}
        <div className={styles.stats}>
          <div className={styles.statCard} id="stat-points">
            <div className={styles.statIcon}>★</div>
            <div className={styles.statValue}>{user?.points ?? 0}</div>
            <div className={styles.statLabel}>Pontos Totais</div>
          </div>
          <div className={styles.statCard} id="stat-badges">
            <div className={styles.statIcon}>🏅</div>
            <div className={styles.statValue}>{user?.badges?.length ?? 0}</div>
            <div className={styles.statLabel}>Badges</div>
          </div>
        </div>

        {/* Current week meeting section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Reunião da Semana</h2>

          {meeting ? (
            <div className={styles.meetingBlock}>
              <MeetingCard meeting={meeting} hasAttended={attended} />

              {/* Attendance confirmation form */}
              {meeting.isOpen && !attended && (
                <form className={styles.attendForm} onSubmit={handleSubmit}>
                  <div className={styles.attendRow}>
                    <input
                      id="attendance-password"
                      type="text"
                      className={styles.attendInput}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Senha da reunião"
                      autoFocus
                      required
                    />
                    <button
                      type="submit"
                      id="btn-confirm-attendance"
                      className={styles.attendBtn}
                      disabled={submitting || !password.trim()}
                    >
                      {submitting ? (
                        <span className={styles.spinner} />
                      ) : (
                        'Confirmar'
                      )}
                    </button>
                  </div>

                  {status.message && (
                    <div className={`${styles.feedback} ${styles[status.type]}`}>
                      {status.message}
                    </div>
                  )}
                </form>
              )}

              {attended && (
                <p className={styles.confirmedMsg}>
                  ✅ Presença confirmada nesta reunião!
                </p>
              )}

              {!meeting.isOpen && !attended && (
                <p className={styles.closedMsg}>
                  🔒 Aguarde o líder abrir a janela de presença durante a reunião.
                </p>
              )}
            </div>
          ) : (
            <p className={styles.closedMsg}>
              Nenhuma reunião programada no momento.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
