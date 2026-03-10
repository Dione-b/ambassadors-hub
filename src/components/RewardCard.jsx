import React from 'react';

const RewardCard = ({ reward, userName }) => {
  const dateStr = new Date(reward.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border-subtle bg-bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-[0.95rem] font-bold text-text-primary">{reward.title}</h4>
        <span className="shrink-0 whitespace-nowrap rounded-sm bg-primary-dim/12 px-2.5 py-0.5 text-sm font-extrabold text-primary-hover">
          ✦ {reward.amount_xlm} XLM
        </span>
      </div>

      <div className="flex gap-4 text-sm text-text-secondary">
        {userName && <span>👤 {userName}</span>}
        <span>📅 {dateStr}</span>
      </div>

      <div className="mt-2 flex flex-col gap-0.5 border-t border-dashed border-border-default pt-3">
        <span className="text-[0.65rem] font-bold uppercase text-text-muted">TX Hash</span>
        <span className="break-all font-mono text-xs text-accent-teal">{reward.transaction_hash}</span>
      </div>
    </div>
  );
};

export default RewardCard;
