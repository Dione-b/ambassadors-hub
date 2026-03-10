import React, { useState, useEffect, useCallback } from 'react';
import { getAllMeetings, setMeetingPassword, toggleMeetingWindow, getMeetingAttendees } from '../../services/mockApi';
import MeetingCard from '../../components/MeetingCard';

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
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMeetings(data);
      const aMap = {};
      const pMap = {};
      await Promise.all(data.map(async (m) => {
        aMap[m.id] = await getMeetingAttendees(m.id);
        pMap[m.id] = m.password || '';
      }));
      setAttendeesMap(aMap);
      setPasswords(pMap);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const showFeedback = (meetingId, type, msg) => {
    setFeedback((prev) => ({ ...prev, [meetingId]: { type, msg } }));
    setTimeout(() => setFeedback((prev) => ({ ...prev, [meetingId]: null })), 4000);
  };

  const handleSetPassword = async (meetingId) => {
    try {
      await setMeetingPassword(meetingId, passwords[meetingId]);
      showFeedback(meetingId, 'success', 'Password updated.');
      loadData();
    } catch (err) { showFeedback(meetingId, 'error', err.message); }
  };

  const handleToggleWindow = async (meetingId) => {
    try { await toggleMeetingWindow(meetingId); loadData(); }
    catch (err) { showFeedback(meetingId, 'error', err.message); }
  };

  if (loading) return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
    </div>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-[900px] px-6 py-10">
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-extrabold text-text-primary">Manage Meetings</h1>
        <p className="text-sm text-text-secondary">Supervise attendance windows and security passwords.</p>
      </div>

      <div className="flex flex-col gap-7">
        {meetings.length === 0 ? (
          <p className="text-center text-sm italic text-text-muted p-8">No meetings available.</p>
        ) : (
          meetings.map((meeting) => {
            const pw = passwords[meeting.id] || '';
            const attendees = attendeesMap[meeting.id] || [];
            const feed = feedback[meeting.id];

            return (
              <MeetingCard key={meeting.id} meeting={meeting}>
                {/* Admin Controls */}
                <div className="mb-6 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-3">
                    <input
                      type="text"
                      placeholder="SET PASSWORD"
                      value={pw}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, [meeting.id]: e.target.value.toUpperCase() }))}
                      className="min-w-[200px] grow rounded-md border border-border-default bg-bg-input px-4 py-2.5 text-sm font-semibold uppercase text-text-primary transition-all focus:border-primary-dim focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] focus:outline-none"
                    />
                    <button
                      onClick={() => handleSetPassword(meeting.id)}
                      className="rounded-md border border-border-bright bg-bg-elevated px-5 py-2.5 text-sm font-bold text-text-primary transition-all hover:border-primary-dim hover:bg-bg-card-hover"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => handleToggleWindow(meeting.id)}
                      className={`rounded-md px-6 py-2.5 text-sm font-bold transition-all ${
                        meeting.isOpen
                          ? 'border border-danger/30 bg-danger/15 text-danger hover:bg-danger/25'
                          : 'border border-success/30 bg-success/15 text-success hover:bg-success/25'
                      }`}
                    >
                      {meeting.isOpen ? '🔒 Close Window' : '🔓 Open Window'}
                    </button>
                  </div>
                  {feed && (
                    <div className={`animate-fade-in rounded-md border px-4 py-2.5 text-sm font-semibold ${
                      feed.type === 'success' ? 'border-success/20 bg-success-bg text-success' : 'border-danger/20 bg-danger-bg text-danger'
                    }`}>
                      {feed.msg}
                    </div>
                  )}
                </div>

                {/* Attendees */}
                <div className="border-t border-dashed border-border-subtle pt-4">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                    Attendees ({attendees.length})
                  </h4>
                  {attendees.length === 0 ? (
                    <p className="text-sm italic text-text-muted">No attendees registered yet.</p>
                  ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                      {attendees.map(att => (
                        <div key={att.user_id} className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-base px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary-dim to-secondary-dim text-[0.65rem] font-extrabold text-white">
                              {att.userName.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-text-primary">{att.userName}</span>
                          </div>
                          <span className="font-mono text-xs text-text-muted">
                            {new Date(att.registered_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
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
