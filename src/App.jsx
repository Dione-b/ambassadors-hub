import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout / Components
import Header from './components/Header';
import Footer from './components/Footer';

// Public
import Login from './pages/public/Login';

// Ambassador (critical path — loaded eagerly)
import Dashboard from './pages/ambassador/Dashboard';
import Onboard from './pages/ambassador/Onboard';
import Meetings from './pages/ambassador/Meetings';
import Profile from './pages/ambassador/Profile';
import StepDetail from './pages/ambassador/onboard/StepDetail';

// Admin (lazy loaded — only fetched when admin navigates)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageMeetings = lazy(() => import('./pages/admin/ManageMeetings'));
const ManageRewards = lazy(() => import('./pages/admin/ManageRewards'));
const ManageAmbassadors = lazy(() => import('./pages/admin/ManageAmbassadors'));
const AmbassadorDetail = lazy(() => import('./pages/admin/AmbassadorDetail'));

const LazyFallback = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
  </div>
);

/**
 * Basic Route Guard
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role } = useAuth();
  if (role === 'guest') return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
};

/**
 * Core Application Shell
 */
const AppContent = () => {
  const { role } = useAuth();
  const isAuthenticated = role !== 'guest';

  return (
    <>
      {isAuthenticated && <Header />}
      
      <main style={{ flexGrow: 1, paddingBottom: isAuthenticated ? '2rem' : 0 }}>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* AMBASSADOR ROUTES */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ambassador']}><Dashboard /></ProtectedRoute>} />
          <Route path="/onboard" element={<ProtectedRoute allowedRoles={['ambassador']}><Onboard /></ProtectedRoute>} />
          <Route path="/onboard/step/:stepId" element={<ProtectedRoute allowedRoles={['ambassador']}><StepDetail /></ProtectedRoute>} />
          <Route path="/meetings" element={<ProtectedRoute allowedRoles={['ambassador']}><Meetings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['ambassador']}><Profile /></ProtectedRoute>} />

          {/* ADMIN ROUTES (lazy loaded) */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Suspense fallback={<LazyFallback />}><AdminDashboard /></Suspense></ProtectedRoute>} />
          <Route path="/admin/meetings" element={<ProtectedRoute allowedRoles={['admin']}><Suspense fallback={<LazyFallback />}><ManageMeetings /></Suspense></ProtectedRoute>} />
          <Route path="/admin/rewards" element={<ProtectedRoute allowedRoles={['admin']}><Suspense fallback={<LazyFallback />}><ManageRewards /></Suspense></ProtectedRoute>} />
          <Route path="/admin/ambassadors" element={<ProtectedRoute allowedRoles={['admin']}><Suspense fallback={<LazyFallback />}><ManageAmbassadors /></Suspense></ProtectedRoute>} />
          <Route path="/admin/ambassadors/:id" element={<ProtectedRoute allowedRoles={['admin']}><Suspense fallback={<LazyFallback />}><AmbassadorDetail /></Suspense></ProtectedRoute>} />

          {/* FALLBACK */}
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
