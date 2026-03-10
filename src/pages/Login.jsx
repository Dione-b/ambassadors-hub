import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

/**
 * Login page — simulates role selection.
 * Already-authenticated users are redirected to their home.
 */
const Login = () => {
  const { role, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (role === 'ambassador') navigate('/dashboard', { replace: true });
    if (role === 'admin')      navigate('/admin',     { replace: true });
  }, [role, navigate]);

  const handleLogin = (selectedRole) => {
    login(selectedRole);
    navigate(selectedRole === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className={styles.page}>
      {/* Background decoration */}
      <div className={styles.bgOrbs} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoBlock}>
          <div className={styles.logoIcon}>✦</div>
          <h1 className={styles.title}>Stellar Ambassadors Hub</h1>
          <p className={styles.subtitle}>Brasil</p>
        </div>

        <p className={styles.prompt}>Selecione um perfil para entrar</p>

        <div className={styles.buttons}>
          <button
            id="btn-login-ambassador"
            className={`${styles.btn} ${styles.btnAmbassador}`}
            onClick={() => handleLogin('ambassador')}
          >
            <span className={styles.btnIcon}>🚀</span>
            <span>
              <strong>Embaixador</strong>
              <small>Ana Silva · 120 pts</small>
            </span>
          </button>

          <button
            id="btn-login-admin"
            className={`${styles.btn} ${styles.btnAdmin}`}
            onClick={() => handleLogin('admin')}
          >
            <span className={styles.btnIcon}>⚙️</span>
            <span>
              <strong>Admin (Líder)</strong>
              <small>Painel de controle</small>
            </span>
          </button>
        </div>

        <p className={styles.disclaimer}>
          Ambiente de demonstração — sem backend real
        </p>
      </div>
    </div>
  );
};

export default Login;
