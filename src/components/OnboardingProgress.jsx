import React from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingProgress = ({ steps, onCompleteStep, loadingStep }) => {
  const navigate = useNavigate();
  const completedCount = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const handleCardClick = (index, isAvailable) => {
    if (isAvailable) {
      navigate(`/onboard/step/${index + 1}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border-default bg-bg-card p-6 shadow-sm">
        <div>
          <h2 className="mb-1 text-xl font-extrabold text-text-primary">Onboarding Progress</h2>
          <p className="text-sm text-text-secondary">Complete these steps to become a fully active global ambassador.</p>
        </div>
        <div className="h-[60px] w-[60px] shrink-0">
          <svg viewBox="0 0 36 36" className="block h-full w-full drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">
            <path
              className="fill-none stroke-border-default"
              strokeWidth="3.5"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="fill-none stroke-primary"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${progressPercent}, 100`}
              style={{ transition: 'stroke-dasharray 1s ease-out' }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="fill-text-primary text-[0.6rem] font-extrabold" textAnchor="middle">
              {completedCount}/{totalSteps}
            </text>
          </svg>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
        {steps.map((step, index) => {
          const isDone = step.completed;
          const isNext = !isDone && (index === 0 || steps[index - 1].completed);
          const isAvailable = isDone || isNext;

          let stateClasses = 'border-transparent bg-bg-card/40 opacity-40 cursor-not-allowed';
          if (isDone) stateClasses = 'border-success/30 bg-success/5 cursor-pointer';
          else if (isNext) stateClasses = 'border-primary/50 shadow-glow-primary bg-bg-card cursor-pointer';

          return (
            <div
              key={step.name}
              onClick={() => handleCardClick(index, isAvailable)}
              className={`group relative flex flex-col rounded-xl border p-6 transition-all duration-200 ${
                isAvailable ? 'hover:border-primary/50 hover:shadow-[0_0_20px_rgba(129,140,248,0.2)] hover:scale-[1.02]' : ''
              } ${stateClasses}`}
            >
              {isNext && (
                <span className="absolute -right-3 -top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-glow-primary animate-pulse-dot">
                  Next: +{step.points} pts
                </span>
              )}

              <div className="mb-3 flex justify-between items-center">
                <span className="rounded-sm bg-primary-dim/15 px-2 py-0.5 text-[0.7rem] font-extrabold text-primary-dim">
                  #{index + 1}
                </span>
                {isDone ? (
                  <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                ) : !isAvailable ? (
                  <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </div>
              <h3 className="mb-2 text-base font-bold text-text-primary">{step.name}</h3>
              <p className="mb-5 grow text-[0.8rem] leading-relaxed text-text-secondary">{step.description}</p>

              <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                <span className="text-[0.7rem] font-bold text-accent-gold">+{step.points} pts & Badge</span>
                {isDone ? (
                  <span className="text-sm font-bold text-success">Completed</span>
                ) : isAvailable ? (
                  <span className="rounded-full bg-primary-dim/15 px-3 py-1 text-xs font-bold text-primary transition-all group-hover:bg-primary group-hover:text-white">
                    View Details →
                  </span>
                ) : (
                  <span className="text-xs font-bold text-text-muted flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingProgress;
