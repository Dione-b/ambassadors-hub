import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const { role, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect them immediately
    if (role === 'ambassador') navigate('/dashboard');
    if (role === 'admin') navigate('/admin');
  }, [role, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.bgGlowArea} />
      
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <span className={styles.logoStar}>✦</span>
        </div>
        
        <h1 className={styles.title}>
          Stellar Ambassadors Hub
        </h1>
        <p className={styles.subtitle}>
          GLOBAL PLATFORM
        </p>

        <p className={styles.instruction}>
          Select a mock profile to enter:
        </p>

        <div className={styles.buttonGroup}>
          <button 
            className={`${styles.loginBtn} ${styles.ambassadorBtn}`}
            onClick={() => login('ambassador')}
          >
            <span className={styles.btnIcon}>🚀</span>
            <div className={styles.btnContent}>
              <span className={styles.btnTitle}>Enter as Ambassador</span>
              <span className={styles.btnDesc}>Alice Chen • 120 pts</span>
            </div>
          </button>

          <button 
            className={`${styles.loginBtn} ${styles.adminBtn}`}
            onClick={() => login('admin')}
          >
            <span className={styles.btnIcon}>⚙️</span>
            <div className={styles.btnContent}>
              <span className={styles.btnTitle}>Enter as Admin</span>
              <span className={styles.btnDesc}>Global Control Panel</span>
            </div>
          </button>
        </div>

        <div className={styles.footerText}>
          Demo Environment — No real backend connectivity
        </div>
      </div>
    </div>
  );
};

export default Login;
