import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Header  from './components/Header';
import Footer  from './components/Footer';
import Login   from './pages/Login';

// Ambassador pages
import Dashboard from './pages/ambassador/Dashboard';
import Profile   from './pages/ambassador/Profile';
import Ranking   from './pages/ambassador/Ranking';

// Admin pages
import Meetings from './pages/admin/Meetings';
import Rewards  from './pages/admin/Rewards';

// ─── Route Guards ────────────────────────────────────────────

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role } = useAuth();
  if (role === 'guest') return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
};

// ─── App Shell ───────────────────────────────────────────────

const AppContent = () => {
  const { role } = useAuth();
  const isAuthenticated = role !== 'guest';

  return (
    <>
      {isAuthenticated && <Header />}
      <main style={{ flexGrow: 1, paddingBottom: isAuthenticated ? '2rem' : 0 }}>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Ambassador */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['ambassador']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['ambassador']}>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Shared */}
          <Route path="/ranking" element={
            <ProtectedRoute allowedRoles={['ambassador', 'admin']}>
              <Ranking />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Meetings />
            </ProtectedRoute>
          } />
          <Route path="/admin/rewards" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Rewards />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {isAuthenticated && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
