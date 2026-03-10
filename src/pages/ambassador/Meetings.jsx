import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentMeetings, hasUserAttended, registerAttendance } from '../../services/mockApi';
import MeetingCard from '../../components/MeetingCard';
import styles from './Meetings.module.css';

const MeetingsPage = () => {
  const { user, updateUser } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendances, setAttendances] = useState({});
  const [passwords, setPasswords] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [feedback, setFeedback] = useState({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCurrentMeetings();
      setMeetings(data);

      const attMap = {};
      const pwMap = {};
      
      await Promise.all(
        data.map(async (m) => {
          const attended = await hasUserAttended(user.id, m.id);
          attMap[m.id] = attended;
          pwMap[m.id] = '';
        })
      );
      
      setAttendances(attMap);
      setPasswords(pwMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handlePasswordChange = (meetingId, value) => {
    setPasswords((prev) => ({ ...prev, [meetingId]: value.toUpperCase() }));
  };

  const handleConfirmAttendance = async (e, meetingId) => {
    e.preventDefault();
    setSubmitting((prev) => ({ ...prev, [meetingId]: true }));
    setFeedback((prev) => ({ ...prev, [meetingId]: null }));

    try {
      const res = await registerAttendance(user.id, meetingId, passwords[meetingId]);
      if (res.success) {
        updateUser({ points: user.points + 10 });
        setAttendances((prev) => ({ ...prev, [meetingId]: true }));
        setFeedback((prev) => ({ ...prev, [meetingId]: { type: 'success', text: res.message } }));
      }
    } catch (err) {
      setFeedback((prev) => ({ ...prev, [meetingId]: { type: 'error', text: err.message } }));
    } finally {
      setSubmitting((prev) => ({ ...prev, [meetingId]: false }));
      handlePasswordChange(meetingId, '');
    }
  };

  if (loading) return (
    <div className={styles.loaderWrapper}><div className={styles.spinner}></div></div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Global Sync Meetings</h1>
      <p className={styles.pageSub}>
        Keep track of all upcoming and past syncs.
      </p>

      <div className={styles.list}>
        {meetings.length === 0 ? (
          <p className={styles.empty}>There are no meetings right now.</p>
        ) : (
          meetings.map((meeting) => {
            const attended = attendances[meeting.id];
            const feed = feedback[meeting.id];
            const pw = passwords[meeting.id] || '';
            const isSubmitting = submitting[meeting.id];

            return (
              <MeetingCard key={meeting.id} meeting={meeting} hasAttended={attended}>
                {!attended ? (
                  <div className={styles.attendanceFormSection}>
                    {meeting.isOpen ? (
                      <form className={styles.formRow} onSubmit={(e) => handleConfirmAttendance(e, meeting.id)}>
                        <input
                          type="text"
                          placeholder="PASSWORD (4+ CHARS)"
                          value={pw}
                          onChange={(e) => handlePasswordChange(meeting.id, e.target.value)}
                          min="4"
                          required
                          disabled={isSubmitting}
                          className={styles.input}
                        />
                        <button 
                          type="submit" 
                          disabled={isSubmitting || pw.length < 4}
                          className={styles.btnConfirm}
                        >
                          {isSubmitting ? 'Verifying...' : 'Register'}
                        </button>
                      </form>
                    ) : (
                      <div className={styles.formClosedAlert}>
                        <span className={styles.lockIcon}>🔒</span>
                        Window closed.
                      </div>
                    )}

                    {feed && (
                      <div className={`${styles.feedback} ${styles[feed.type]}`}>
                        {feed.text}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.rewardSuccess}>
                    🎉 Form verified. Points secured.
                  </div>
                )}
              </MeetingCard>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;
