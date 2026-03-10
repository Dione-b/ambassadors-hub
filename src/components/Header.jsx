import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AMBASSADOR_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Onboard',   to: '/onboard' },
  { label: 'Meetings',  to: '/meetings' },
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
    <header className="sticky top-0 z-50 border-b border-border-default bg-bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
        {/* Logo */}
        <NavLink to={homeRoute} className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-text-primary">
          <span className="text-primary animate-pulse-dot">✦</span>
          <span>Stellar<span className="text-primary-hover">Hub</span></span>
        </NavLink>

        {/* Nav */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-bg-elevated text-text-primary border border-border-bright'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* User Area */}
        <div className="flex items-center gap-3">
          {role === 'ambassador' && user && (
            <div className="flex items-center gap-1.5 rounded-full border border-border-bright bg-bg-card px-3 py-1.5 text-sm font-bold">
              <span className="text-accent-gold">★</span>
              <span className="text-text-primary">{user.points}</span>
              <span className="text-text-muted text-xs">pts</span>
            </div>
          )}
          <div className="text-sm font-semibold text-text-secondary">{user?.name?.split(' ')[0]}</div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-border-default bg-bg-elevated px-3 py-1.5 text-xs font-bold text-text-secondary transition-all hover:border-border-bright hover:text-text-primary"
            aria-label="Log out"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
