import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { role, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'ambassador') navigate('/dashboard');
    if (role === 'admin') navigate('/admin');
  }, [role, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-base p-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-screen w-screen -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_60%)]" />

      <div className="animate-slide-up relative z-10 w-full max-w-[440px] rounded-2xl border border-white/[0.08] bg-bg-base/60 p-10 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-[20px]">
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary-dim/30 bg-gradient-to-br from-primary-dim/20 to-primary-dim/5 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          <span className="animate-pulse-dot text-3xl text-primary-hover">✦</span>
        </div>

        <h1 className="mb-0.5 text-[1.7rem] font-extrabold tracking-tight text-text-primary">
          Stellar Ambassadors Hub
        </h1>
        <p className="mb-8 text-sm font-bold uppercase tracking-widest text-text-secondary">
          Global Platform
        </p>
        <p className="mb-5 text-sm text-text-muted">Select a mock profile to enter:</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => login('ambassador')}
            className="flex items-center gap-4 rounded-xl border border-primary-dim/40 bg-primary-dim p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:border-primary-hover hover:shadow-[0_10px_25px_-5px_rgba(99,102,241,0.4)]"
          >
            <span className="text-2xl">🚀</span>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white">Enter as Ambassador</span>
              <span className="mt-0.5 text-sm text-white/70">Alice Chen • 120 pts</span>
            </div>
          </button>

          <button
            onClick={() => login('admin')}
            className="flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-elevated/80 p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-border-bright hover:bg-bg-card-hover"
          >
            <span className="text-2xl">⚙️</span>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white">Enter as Admin</span>
              <span className="mt-0.5 text-sm text-text-muted">Global Control Panel</span>
            </div>
          </button>
        </div>

        <div className="mt-8 text-[0.7rem] text-text-muted opacity-60">
          Demo Environment — No real backend connectivity
        </div>
      </div>
    </div>
  );
};

export default Login;
