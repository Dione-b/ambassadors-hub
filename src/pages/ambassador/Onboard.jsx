import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getOnboardingSteps, awardGenesisBadge } from '../../services/mockApi';
import OnboardingProgress from '../../components/OnboardingProgress';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const VideoThumbnail = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div className="overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-lg">
        <div className="relative w-full pb-[56.25%]">
          <iframe
            className="absolute left-0 top-0 h-full w-full border-0"
            src="https://www.youtube.com/embed/5C_HPTJg5ek?rel=0&autoplay=1"
            title="Welcome Ambassador"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border-default shadow-lg cursor-pointer transition-all duration-300 hover:border-primary-dim hover:shadow-glow-primary" onClick={() => setIsPlaying(true)}>
      <div className="relative w-full pb-[56.25%] bg-gradient-to-br from-bg-elevated via-bg-card to-bg-base">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_60%)]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md">Welcome, Ambassador!</h2>
            <p className="mt-2 text-sm sm:text-base font-semibold text-text-secondary drop-shadow-sm">Click to watch your orientation video</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-dim text-white shadow-glow-secondary shadow-[0_0_20px_rgba(244,114,182,0.4)] transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary">
            <svg className="ml-1 h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const Onboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchSteps = useCallback(async () => {
    try {
      const stepsData = await getOnboardingSteps(user.id);
      setSteps(stepsData);

      // Check if all steps were completed (e.g. from the detail page)
      const allDone = stepsData.every(s => s.completed);
      if (allDone && !user.onboarded) {
        const fullyOnboarded = await awardGenesisBadge(user.id);
        updateUser({
          points: fullyOnboarded.points,
          badges: fullyOnboarded.badges,
          onboarded: fullyOnboarded.onboarded,
        });
        fireConfetti();
        setShowModal(true);
      }

      return stepsData;
    } catch (err) { console.error(err); }
  }, [user.id, user.onboarded]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchSteps();
      setLoading(false);
    };
    init();
  }, [fetchSteps]);

  // Re-fetch when user returns to this tab (after completing a step in StepDetail)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchSteps();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchSteps]);

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#818cf8', '#fbbf24', '#f472b6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#818cf8', '#fbbf24', '#f472b6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  if (loading) return (
    <div className="flex h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
    </div>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-[1000px] px-6 py-10">
      <div className="mb-10 flex flex-col gap-6">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold text-text-primary">Welcome to Stellar Hub</h1>
          <p className="text-sm text-text-secondary">Watch your orientation video below before starting your ambassador journey.</p>
        </div>
        <VideoThumbnail />
      </div>

      {/* Hint */}
      <p className="mb-4 text-xs font-semibold text-text-muted">
        💡 Click on any step card to view detailed instructions.
      </p>

      <OnboardingProgress steps={steps} />

      {/* Celebration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="animate-slide-up mx-4 w-full max-w-sm rounded-2xl border border-primary/30 bg-bg-card p-8 text-center shadow-glow-primary">
            <div className="mb-4 flex justify-center text-5xl drop-shadow-lg">🎉</div>
            <h2 className="mb-2 text-xl font-extrabold text-text-primary">Welcome, Global Ambassador!</h2>
            <p className="mb-6 text-sm leading-relaxed text-text-secondary">
              You have completed all onboarding steps and earned <strong className="text-text-primary">70 points</strong>. Your exclusive <strong className="text-primary-hover">Genesis Ambassador</strong> badge has been added to your profile!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setShowModal(false); navigate('/dashboard'); }}
                className="w-full rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition-all hover:bg-primary-hover hover:shadow-glow-primary"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => { setShowModal(false); navigate('/profile'); }}
                className="w-full rounded-full border border-border-bright bg-transparent px-5 py-3 text-sm font-semibold text-text-secondary transition-all hover:bg-border-default hover:text-text-primary"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboard;
