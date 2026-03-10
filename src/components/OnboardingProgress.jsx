import React from 'react';
import styles from './OnboardingProgress.module.css';

const OnboardingProgress = ({ steps, onCompleteStep, loadingStep }) => {
  const completedCount = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className={styles.container}>
      {/* Progress Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Onboarding Progress</h2>
          <p className={styles.subtitle}>
            Complete these steps to become a fully active global ambassador.
          </p>
        </div>
        <div className={styles.progressCircle}>
          <svg viewBox="0 0 36 36" className={styles.circularChart}>
            <path
              className={styles.circleBg}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={styles.circle}
              strokeDasharray={`${progressPercent}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className={styles.percentage}>
              {completedCount}/{totalSteps}
            </text>
          </svg>
        </div>
      </div>

      {/* Steps List */}
      <div className={styles.stepsGrid}>
        {steps.map((step, index) => {
          const isDone = step.completed;
          const isProcessing = loadingStep === step.name;
          const isNext = !isDone && (index === 0 || steps[index - 1].completed);

          return (
            <div
              key={step.name}
              className={`${styles.stepCard} ${isDone ? styles.stepDone : ''} ${isNext ? styles.stepNext : ''}`}
            >
              <div className={styles.stepHeader}>
                <span className={styles.stepNum}>#{index + 1}</span>
                {isDone && <span className={styles.checkIcon}>✅</span>}
              </div>
              <h3 className={styles.stepTitle}>{step.name}</h3>
              <p className={styles.stepDesc}>{step.description}</p>

              <div className={styles.stepFooter}>
                <span className={styles.rewardTag}>
                  +{step.points} pts & Badge
                </span>
                
                {!isDone ? (
                  <button
                    className={styles.btnAction}
                    onClick={() => onCompleteStep(step.name)}
                    disabled={!isNext || isProcessing}
                  >
                    {isProcessing ? 'Verifying...' : 'Verify'}
                  </button>
                ) : (
                  <span className={styles.statusDone}>Completed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {completedCount === totalSteps && (
        <div className={styles.onboardedAlert}>
          🎉 Congratulations! You have successfully completed your onboarding.
        </div>
      )}
    </div>
  );
};

export default OnboardingProgress;
