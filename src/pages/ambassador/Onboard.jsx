import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getOnboardingSteps, completeStep } from '../../services/mockApi';
import OnboardingProgress from '../../components/OnboardingProgress';

const Onboard = () => {
  const { user, updateUser } = useAuth();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(null);

  const fetchSteps = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOnboardingSteps(user.id);
      setSteps(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [user.id]);

  useEffect(() => { fetchSteps(); }, [fetchSteps]);

  const handleCompleteStep = async (stepName) => {
    try {
      setLoadingStep(stepName);
      const updatedUser = await completeStep(user.id, stepName);
      updateUser({ points: updatedUser.points, badges: updatedUser.badges, onboarded: updatedUser.onboarded });
      await fetchSteps();
    } catch (err) { alert(err.message); }
    finally { setLoadingStep(null); }
  };

  if (loading) return (
    <div className="flex h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
    </div>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-[1000px] px-6 py-10">
      <OnboardingProgress steps={steps} onCompleteStep={handleCompleteStep} loadingStep={loadingStep} />
    </div>
  );
};

export default Onboard;
