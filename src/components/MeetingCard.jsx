import React from 'react';

const MeetingCard = ({ meeting, hasAttended = false, children }) => {
  const meetingDate = new Date(meeting.date);
  const formattedDate = meetingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  const formattedTime = meetingDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

  return (
    <div className="rounded-lg border border-border-default bg-bg-card p-6 transition-all duration-250 hover:border-border-bright hover:shadow-sm">
      {/* Header Row */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="mb-1 text-lg font-bold text-text-primary">{meeting.title}</h3>
          <p className="text-sm font-medium text-text-secondary">
            📅 {formattedDate} • {formattedTime} ({meeting.timezone})
          </p>
        </div>
        {hasAttended && (
          <span className="shrink-0 whitespace-nowrap rounded-full border border-success/30 bg-success-bg px-3.5 py-1.5 text-xs font-semibold text-success">
            ✅ Attendance Confirmed
          </span>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
          meeting.isOpen
            ? 'bg-success-bg text-success border-success/30'
            : 'bg-bg-elevated/20 text-text-secondary border-border-default'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${
            meeting.isOpen ? 'bg-success shadow-[0_0_6px_var(--color-success)] animate-pulse-dot' : 'bg-text-muted'
          }`} />
          {meeting.isOpen ? 'Window Open' : 'Window Closed'}
        </span>

        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
          meeting.password
            ? 'bg-info-bg text-info border-info/30'
            : 'bg-warning-bg text-warning border-warning/30'
        }`}>
          {meeting.password ? '🔑 Password Set' : '⚠ No Password'}
        </span>

        <span className="ml-2 text-xs text-text-muted">
          ⏳ Closes {meeting.validityWindowMinutes}m after start
        </span>
      </div>

      {/* Children slot */}
      {children && (
        <div className="mt-5 border-t border-border-subtle pt-5">
          {children}
        </div>
      )}
    </div>
  );
};

export default MeetingCard;
