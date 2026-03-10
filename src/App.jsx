import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout / Components
import Header from './components/Header';
import Footer from './components/Footer';

// Public
import Login from './pages/public/Login';

// Ambassador
import Dashboard from './pages/ambassador/Dashboard';
import Onboard from './pages/ambassador/Onboard';
import Meetings from './pages/ambassador/Meetings';
import Profile from './pages/ambassador/Profile';
import StepDetail from './pages/ambassador/onboard/StepDetail';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMeetings from './pages/admin/ManageMeetings';
import ManageRewards from './pages/admin/ManageRewards';
import ManageAmbassadors from './pages/admin/ManageAmbassadors';

/**
 * Basic Route Guard
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role } = useAuth();
  if (role === 'guest') return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    // If Admin enters ambassador link, or vice-versa
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

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/meetings" element={<ProtectedRoute allowedRoles={['admin']}><ManageMeetings /></ProtectedRoute>} />
          <Route path="/admin/rewards" element={<ProtectedRoute allowedRoles={['admin']}><ManageRewards /></ProtectedRoute>} />
          <Route path="/admin/ambassadors" element={<ProtectedRoute allowedRoles={['admin']}><ManageAmbassadors /></ProtectedRoute>} />

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
