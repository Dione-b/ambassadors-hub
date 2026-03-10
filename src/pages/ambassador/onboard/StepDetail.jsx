import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchOnboardingSteps, fetchCompleteStep, fetchAwardGenesisBadge } from '../../../services/apiClient';

const STEP_GUIDES = [
  {
    id: 1,
    name: 'Connect Stellar Wallet',
    icon: '🔗',
    instructions: [
      'Download a Stellar-compatible wallet such as Freighter, Albedo, or xBull.',
      'Create a new account or import an existing one using your secret key.',
      'Copy your public Stellar address (starts with G...).',
      'Paste your public address in the verification field below.',
      'Your wallet will be linked to your Ambassador profile for future XLM distributions.',
    ],
    tip: 'Never share your secret key with anyone. Only share your public address.',
    externalLink: { label: 'Get Freighter Wallet', url: 'https://www.freighter.app/' },
  },
  {
    id: 2,
    name: 'Join Discord/Telegram',
    icon: '💬',
    instructions: [
      'Click the invite link below to join the official Stellar community server.',
      'Complete the server verification process (react to the welcome message).',
      'Introduce yourself in the #introductions channel.',
      'Make sure your Discord/Telegram username matches your ambassador profile for verification.',
    ],
    tip: 'Enable notifications for the #announcements channel to stay updated on meetings and events.',
    externalLink: { label: 'Join Stellar Discord', url: 'https://discord.gg/stellardev' },
  },
  {
    id: 3,
    name: 'Attend First Meeting',
    icon: '📅',
    instructions: [
      'Check the Meetings page for the next scheduled Global Sync.',
      'Join the Discord voice channel at the scheduled time.',
      'When the Admin opens the attendance window, enter the meeting password.',
      'You will receive +10 attendance points plus the "First Meeting" badge.',
    ],
    tip: 'Meetings happen weekly. Check your timezone — the schedule shows times in UTC by default.',
    externalLink: null,
  },
  {
    id: 4,
    name: 'Complete Ambassador Training',
    icon: '🎓',
    instructions: [
      'Watch the full orientation video on the Onboarding page.',
      'Review the Stellar Ambassador Guidelines document.',
      'Understand the rewards structure: points, badges, and XLM distributions.',
      'Confirm you have read and agree to the Ambassador Code of Conduct.',
      'Click "Mark as Done" below to complete your training verification.',
    ],
    tip: 'You can re-watch the orientation video anytime from the Onboarding page.',
    externalLink: null,
  },
];

const StepDetail = () => {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [stepData, setStepData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const stepIndex = parseInt(stepId, 10) - 1;
  const guide = STEP_GUIDES[stepIndex];

  useEffect(() => {
    if (!user || !guide) return;

    const fetchStep = async () => {
      try {
        setLoading(true);
        const steps = await fetchOnboardingSteps(user.id);

        const locked = stepIndex > 0 && !steps[stepIndex - 1].completed;
        setIsLocked(locked);

        const current = steps[stepIndex];
        setStepData(current);
        setCompleted(current?.completed ?? false);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStep();
  }, [user, stepIndex, guide]);

  const handleMarkAsDone = async () => {
    if (!stepData || completed) return;

    try {
      setSubmitting(true);
      setFeedback(null);
      const updatedUser = await fetchCompleteStep(user.id, stepData.name);

      const allSteps = await fetchOnboardingSteps(user.id);
      const isAllDone = allSteps.every(s => s.completed);

      if (isAllDone) {
        const fullyOnboarded = await fetchAwardGenesisBadge(user.id);
        updateUser({
          points: fullyOnboarded.points,
          badges: fullyOnboarded.badges,
          onboarded: fullyOnboarded.onboarded,
        });
      } else {
        updateUser({
          points: updatedUser.points,
          badges: updatedUser.badges,
          onboarded: updatedUser.onboarded,
        });
      }

      setCompleted(true);
      setFeedback({
        type: 'success',
        msg: `Step completed! +${stepData.points} points and "${stepData.badge_awarded}" badge awarded.`,
      });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!guide) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-text-secondary">
        <span className="text-4xl">🚫</span>
        <p className="text-lg font-semibold">Step not found.</p>
        <Link to="/onboard" className="text-sm font-bold text-primary hover:text-primary-hover transition-colors">
          ← Back to Onboarding
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-bg-card border border-border-default text-text-muted shadow-sm">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary mb-2">Wait a Minute!</h2>
          <p className="text-text-secondary max-w-sm mx-auto">
            This step is currently locked. You must complete the previous step before you can access this one.
          </p>
        </div>
        <Link to="/onboard" className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white transition-all hover:bg-primary-hover hover:shadow-glow-primary">
          Back to Onboarding
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-[700px] px-6 py-10">
      <Link
        to="/onboard"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-primary"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Onboarding
      </Link>

      <div className="mb-8 flex items-start gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-dim/15 text-3xl shadow-sm">
          {guide.icon}
        </div>
        <div>
          <span className="mb-1 inline-block rounded-sm bg-primary-dim/15 px-2 py-0.5 text-[0.7rem] font-extrabold text-primary-dim">
            Step {guide.id} of 4
          </span>
          <h1 className="text-2xl font-extrabold text-text-primary">{guide.name}</h1>
        </div>
      </div>

      {completed && (
        <div className="animate-fade-in mb-6 flex items-center gap-3 rounded-lg border border-success/20 bg-success-bg px-5 py-4">
          <svg className="h-5 w-5 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-bold text-success">This step has been completed!</span>
        </div>
      )}

      <div className="mb-6 rounded-xl border border-border-default bg-bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-extrabold uppercase tracking-widest text-text-muted">How to Complete</h2>
        <ol className="flex flex-col gap-4">
          {guide.instructions.map((instruction, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-dim/15 text-xs font-extrabold text-primary-dim">
                {i + 1}
              </span>
              <p className="text-[0.9rem] leading-relaxed text-text-secondary">{instruction}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-accent-gold/20 bg-accent-gold/5 px-5 py-4">
        <span className="mt-0.5 text-lg">💡</span>
        <p className="text-sm leading-relaxed text-text-secondary">
          <strong className="text-accent-gold">Tip:</strong> {guide.tip}
        </p>
      </div>

      {guide.externalLink && (
        <a
          href={guide.externalLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 flex items-center justify-center gap-2 rounded-lg border border-border-default bg-bg-elevated px-5 py-3.5 text-sm font-bold text-text-primary transition-all hover:border-primary-dim hover:shadow-glow-primary"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {guide.externalLink.label}
        </a>
      )}

      {feedback && (
        <div className={`animate-fade-in mb-6 rounded-lg border px-5 py-4 text-sm font-semibold ${
          feedback.type === 'success'
            ? 'border-success/20 bg-success-bg text-success'
            : 'border-danger/20 bg-danger-bg text-danger'
        }`}>
          {feedback.msg}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {!completed ? (
          <button
            onClick={handleMarkAsDone}
            disabled={submitting}
            className="flex grow items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-hover hover:shadow-glow-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Verifying...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Mark as Done
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => navigate('/onboard')}
            className="flex grow items-center justify-center gap-2 rounded-full bg-success px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Done — Return to Onboarding
          </button>
        )}
      </div>
    </div>
  );
};

export default StepDetail;
