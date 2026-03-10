import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getOnboardingSteps, completeStep, getUserProfile } from '../../services/mockApi';
import OnboardingProgress from '../../components/OnboardingProgress';
import styles from './Onboard.module.css';

const Onboard = () => {
  const { user, updateUser: updateContextUser } = useAuth();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(null);
  
  const fetchSteps = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOnboardingSteps(user.id);
      setSteps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => { fetchSteps(); }, [fetchSteps]);

  const handleCompleteStep = async (stepName) => {
    try {
      setLoadingStep(stepName);
      
      const updatedUser = await completeStep(user.id, stepName);
      // Synchronize changes to context (badges array, points, onboarded boolean)
      updateContextUser({ 
        points: updatedUser.points, 
        badges: updatedUser.badges,
        onboarded: updatedUser.onboarded 
      });

      // Reload steps to visually update
      await fetchSteps();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingStep(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <OnboardingProgress 
        steps={steps} 
        onCompleteStep={handleCompleteStep} 
        loadingStep={loadingStep} 
      />
    </div>
  );
};

export default Onboard;
