import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Header.module.css';

const AMBASSADOR_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Onboard',   to: '/onboard' },
  { label: 'Meetings',  to: '/meetings' },
  { label: 'Ranking',   to: '/ranking' },
  { label: 'Profile',   to: '/profile' },
];

const ADMIN_LINKS = [
  { label: 'Overview',     to: '/admin' },
  { label: 'Meetings',     to: '/admin/meetings' },
  { label: 'Rewards',      to: '/admin/rewards' },
  { label: 'Ambassadors',  to: '/admin/ambassadors' },
];

const Header = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const links = role === 'admin' ? ADMIN_LINKS : AMBASSADOR_LINKS;
  const homeRoute = role === 'admin' ? '/admin' : '/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to={homeRoute} className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>
            Stellar<span className={styles.logoAccent}>Hub</span>
          </span>
        </NavLink>

        <nav className={styles.nav} aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.userArea}>
          {role === 'ambassador' && user && (
            <div className={styles.pointsPill}>
              <span className={styles.pointsStar}>★</span>
              <span className={styles.pointsValue}>{user.points}</span>
              <span className={styles.pointsLabel}>pts</span>
            </div>
          )}
          <div className={styles.userName}>{user?.name?.split(' ')[0]}</div>
          <button className={styles.logoutBtn} onClick={handleLogout} aria-label="Log out">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
