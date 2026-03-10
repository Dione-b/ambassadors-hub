import React, { useState, useEffect, useCallback } from 'react';
import { getAllMeetings, setMeetingPassword, toggleMeetingWindow, getMeetingAttendees } from '../../services/mockApi';
import MeetingCard from '../../components/MeetingCard';
import styles from './ManageMeetings.module.css';

const ManageMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [attendeesMap, setAttendeesMap] = useState({});
  const [passwords, setPasswords] = useState({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllMeetings();
      // Sort descending
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMeetings(data);

      const aMap = {};
      const pMap = {};
      await Promise.all(
        data.map(async (m) => {
          const mAtt = await getMeetingAttendees(m.id);
          aMap[m.id] = mAtt;
          pMap[m.id] = m.password || '';
        })
      );
      setAttendeesMap(aMap);
      setPasswords(pMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const showFeedback = (meetingId, type, msg) => {
    setFeedback((prev) => ({ ...prev, [meetingId]: { type, msg } }));
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, [meetingId]: null }));
    }, 4000);
  };

  const handleSetPassword = async (meetingId) => {
    try {
      await setMeetingPassword(meetingId, passwords[meetingId]);
      showFeedback(meetingId, 'success', 'Password updated.');
      loadData(); // refresh visually
    } catch (err) {
      showFeedback(meetingId, 'error', err.message);
    }
  };

  const handleToggleWindow = async (meetingId) => {
    try {
      await toggleMeetingWindow(meetingId);
      loadData();
    } catch (err) {
      showFeedback(meetingId, 'error', err.message);
    }
  };

  if (loading) return (
    <div className={styles.loaderWrapper}><div className={styles.spinner}></div></div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Meetings</h1>
        <p className={styles.subtitle}>Supervise attendance windows and security passwords.</p>
      </div>

      <div className={styles.list}>
        {meetings.length === 0 ? (
          <p className={styles.empty}>No meetings available.</p>
        ) : (
          meetings.map((meeting) => {
            const pw = passwords[meeting.id] || '';
            const attendees = attendeesMap[meeting.id] || [];
            const feed = feedback[meeting.id];

            return (
              <MeetingCard key={meeting.id} meeting={meeting}>
                {/* Admin Controls */}
                <div className={styles.adminControls}>
                  <div className={styles.controlsRow}>
                    <input
                      type="text"
                      placeholder="SET PASSWORD"
                      className={styles.input}
                      value={pw}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, [meeting.id]: e.target.value.toUpperCase() }))}
                    />
                    <button 
                      className={styles.btnSet} 
                      onClick={() => handleSetPassword(meeting.id)}
                    >
                      Update Password
                    </button>
                    <button 
                      className={`${styles.btnToggle} ${meeting.isOpen ? styles.btnClose : styles.btnOpen}`}
                      onClick={() => handleToggleWindow(meeting.id)}
                    >
                      {meeting.isOpen ? '🔒 Close Window' : '🔓 Open Window'}
                    </button>
                  </div>
                  
                  {feed && (
                    <div className={`${styles.feedback} ${styles[feed.type]}`}>
                      {feed.msg}
                    </div>
                  )}
                </div>

                {/* Attendees List */}
                <div className={styles.attendeesSection}>
                  <h4 className={styles.attTitle}>Attendees ({attendees.length})</h4>
                  {attendees.length === 0 ? (
                    <p className={styles.attEmpty}>No attendees registered yet.</p>
                  ) : (
                    <ul className={styles.attList}>
                      {attendees.map(att => (
                        <li key={att.user_id} className={styles.attItem}>
                          <div className={styles.attUser}>
                            <div className={styles.attAvatar}>{att.userName.charAt(0)}</div>
                            <span className={styles.attName}>{att.userName}</span>
                          </div>
                          <span className={styles.attTime}>
                            {new Date(att.registered_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </MeetingCard>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageMeetings;
