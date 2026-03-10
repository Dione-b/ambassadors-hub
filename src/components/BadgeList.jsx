import React from 'react';

const BadgeList = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return <p className="text-sm italic text-text-muted">No badges earned yet.</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {badges.map((b) => (
        <span
          key={b}
          title={b}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-bright bg-bg-card px-3.5 py-1.5 text-xs font-bold text-text-primary shadow-sm transition-all hover:-translate-y-px hover:border-primary"
        >
          ✮ {b}
        </span>
      ))}
    </div>
  );
};

export default BadgeList;
