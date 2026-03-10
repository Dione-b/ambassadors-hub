import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentMeetings, hasUserAttended, registerAttendance } from '../../services/mockApi';
import MeetingCard from '../../components/MeetingCard';

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
      await Promise.all(data.map(async (m) => {
        attMap[m.id] = await hasUserAttended(user.id, m.id);
        pwMap[m.id] = '';
      }));
      setAttendances(attMap);
      setPasswords(pwMap);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
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
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
    </div>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-[800px] px-6 py-10">
      <h1 className="mb-1 text-3xl font-extrabold text-text-primary">Global Sync Meetings</h1>
      <p className="mb-8 text-sm text-text-secondary">Keep track of all upcoming and past syncs.</p>

      <div className="flex flex-col gap-6">
        {meetings.length === 0 ? (
          <p className="text-center text-sm italic text-text-muted p-8">There are no meetings right now.</p>
        ) : (
          meetings.map((meeting) => {
            const attended = attendances[meeting.id];
            const feed = feedback[meeting.id];
            const pw = passwords[meeting.id] || '';
            const isSubmitting = submitting[meeting.id];

            return (
              <MeetingCard key={meeting.id} meeting={meeting} hasAttended={attended}>
                {!attended ? (
                  <div className="flex flex-col gap-3.5">
                    {meeting.isOpen ? (
                      <form className="flex gap-3" onSubmit={(e) => handleConfirmAttendance(e, meeting.id)}>
                        <input
                          type="text"
                          placeholder="PASSWORD (4+ CHARS)"
                          value={pw}
                          onChange={(e) => handlePasswordChange(meeting.id, e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="grow rounded-md border border-border-default bg-bg-input px-4 py-3 text-sm font-semibold uppercase text-text-primary transition-all focus:border-primary-dim focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting || pw.length < 4}
                          className="rounded-md bg-primary-dim px-5 text-sm font-bold text-white transition-all hover:-translate-y-px hover:bg-primary hover:shadow-glow-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSubmitting ? 'Verifying...' : 'Register'}
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3 rounded-sm border-l-[3px] border-l-border-default bg-bg-elevated/60 px-4 py-3 text-sm text-text-muted">
                        <span className="text-lg">🔒</span> Window closed.
                      </div>
                    )}
                    {feed && (
                      <div className={`animate-fade-in rounded-md border px-4 py-2.5 text-sm font-semibold ${
                        feed.type === 'success' ? 'border-success/20 bg-success-bg text-success' : 'border-danger/20 bg-danger-bg text-danger'
                      }`}>
                        {feed.text}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-md border border-dashed border-success/30 bg-success/5 p-3 text-sm font-semibold text-success">
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
