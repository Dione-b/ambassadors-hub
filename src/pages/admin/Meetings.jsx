import React, { useState, useEffect, useCallback } from 'react';
import {
  getAllMeetings,
  setMeetingPassword,
  toggleMeetingWindow,
  getMeetingAttendees,
} from '../../services/mockApi';
import styles from './Meetings.module.css';

const Meetings = () => {
  const [meetings,      setMeetings]      = useState([]);
  const [attendeesMap,  setAttendeesMap]  = useState({});
  const [passwordInputs, setPasswordInputs] = useState({});
  const [feedback,      setFeedback]      = useState({ type: '', message: '' });
  const [loading,       setLoading]       = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const meetingsData = await getAllMeetings();
      setMeetings(meetingsData);

      // Fetch attendees for every meeting in parallel
      const entries = await Promise.all(
        meetingsData.map(async (m) => [m.id, await getMeetingAttendees(m.id)])
      );
      setAttendeesMap(Object.fromEntries(entries));
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 3500);
  };

  const handleSetPassword = async (meetingId) => {
    const pw = passwordInputs[meetingId];
    if (!pw?.trim()) return;

    try {
      await setMeetingPassword(meetingId, pw.trim());
      showFeedback('success', `Senha definida para a reunião #${meetingId}`);
      setPasswordInputs(prev => ({ ...prev, [meetingId]: '' }));
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  const handleToggle = async (meetingId) => {
    try {
      await toggleMeetingWindow(meetingId);
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });

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
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Reuniões Semanais</h1>
          <p className={styles.pageSub}>
            Gerencie senhas e janelas de presença das reuniões do Discord
          </p>
        </div>

        {feedback.message && (
          <div className={`${styles.globalFeedback} ${styles[feedback.type]}`}>
            {feedback.message}
          </div>
        )}

        <div className={styles.meetingList}>
          {meetings.map((meeting) => {
            const attendees = attendeesMap[meeting.id] ?? [];

            return (
              <div key={meeting.id} className={styles.meetingCard}>
                {/* Card header */}
                <div className={styles.cardHeader}>
                  <div>
                    <h2 className={styles.meetingTitle}>{meeting.title}</h2>
                    <p className={styles.meetingDate}>📅 {formatDate(meeting.date)}</p>
                  </div>
                  <div className={styles.statusBadges}>
                    <span className={`${styles.badge} ${meeting.isOpen ? styles.open : styles.closed}`}>
                      <span className={styles.dot} />
                      {meeting.isOpen ? 'Aberta' : 'Fechada'}
                    </span>
                    <span className={`${styles.badge} ${meeting.password ? styles.hasPassword : styles.noPassword}`}>
                      {meeting.password ? '🔑 Senha OK' : '⚠ Sem senha'}
                    </span>
                    <span className={`${styles.badge} ${styles.neutral}`}>
                      👥 {attendees.length}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className={styles.controls}>
                  <div className={styles.passwordGroup}>
                    <input
                      id={`password-input-${meeting.id}`}
                      className={styles.input}
                      placeholder="Ex: SOROBAN2026"
                      value={passwordInputs[meeting.id] ?? ''}
                      onChange={(e) =>
                        setPasswordInputs(prev => ({
                          ...prev,
                          [meeting.id]: e.target.value.toUpperCase(),
                        }))
                      }
                    />
                    <button
                      id={`btn-set-password-${meeting.id}`}
                      className={styles.btnSave}
                      onClick={() => handleSetPassword(meeting.id)}
                      disabled={!passwordInputs[meeting.id]?.trim()}
                    >
                      Definir Senha
                    </button>
                  </div>

                  <button
                    id={`btn-toggle-window-${meeting.id}`}
                    className={`${styles.btnToggle} ${meeting.isOpen ? styles.btnClose : styles.btnOpen}`}
                    onClick={() => handleToggle(meeting.id)}
                    disabled={!meeting.password}
                    title={!meeting.password ? 'Defina uma senha primeiro' : ''}
                  >
                    {meeting.isOpen ? '🔒 Fechar Janela' : '🔓 Abrir Janela'}
                  </button>
                </div>

                {/* Attendees list */}
                <div className={styles.attendeesSection}>
                  <h3 className={styles.attendeesTitle}>
                    Presenças Confirmadas ({attendees.length})
                  </h3>
                  {attendees.length === 0 ? (
                    <p className={styles.emptyAttendees}>
                      Nenhuma presença registrada ainda.
                    </p>
                  ) : (
                    <div className={styles.attendeeList}>
                      {attendees.map((a, i) => (
                        <div key={i} className={styles.attendeeItem}>
                          <div className={styles.attendeeAvatar}>
                            {a.userName.charAt(0)}
                          </div>
                          <span className={styles.attendeeName}>{a.userName}</span>
                          <span className={styles.attendeeTime}>
                            {new Date(a.registered_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Meetings;
