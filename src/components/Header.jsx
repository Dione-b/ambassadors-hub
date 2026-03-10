import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Header.module.css';

const AMBASSADOR_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Profile',   to: '/profile' },
  { label: 'Ranking',   to: '/ranking' },
];

const ADMIN_LINKS = [
  { label: 'Meetings', to: '/admin' },
  { label: 'Rewards',  to: '/admin/rewards' },
  { label: 'Ranking',  to: '/ranking' },
];

const Header = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const links = role === 'admin' ? ADMIN_LINKS : AMBASSADOR_LINKS;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const homeRoute = role === 'admin' ? '/admin' : '/dashboard';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <NavLink to={homeRoute} className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>
            Stellar<span className={styles.logoAccent}>Hub</span> BR
          </span>
        </NavLink>

        {/* Navigation */}
        <nav className={styles.nav} aria-label="Main navigation">
          {links.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className={styles.userArea}>
          {role === 'ambassador' && user && (
            <div className={styles.pointsPill}>
              <span className={styles.pointsStar}>★</span>
              <span className={styles.pointsValue}>{user.points}</span>
              <span className={styles.pointsLabel}>pts</span>
            </div>
          )}
          <div className={styles.userName}>{user?.name?.split(' ')[0]}</div>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            aria-label="Logout"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
