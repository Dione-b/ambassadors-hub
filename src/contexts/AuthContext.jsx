import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

// Mocks the authenticated state, matching the API's standard structure
const MOCK_AMBASSADOR = {
  id: 1,
  name: 'Alice Chen',
  email: 'alice@example.com',
  city: 'Singapore',
  country: 'Singapore',
  points: 0,
  badges: [],
  stellar_wallet: 'GABC123...',
  onboarded: false,
};

const MOCK_ADMIN = {
  id: 99,
  name: 'Admin User',
  email: 'admin@stellar.org',
};

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('guest'); // 'guest' | 'ambassador' | 'admin'
  const [user, setUser] = useState(null);

  /**
   * Logs in a user by their selected role
   */
  const login = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'ambassador') {
      setUser({ ...MOCK_AMBASSADOR });
    } else if (selectedRole === 'admin') {
      setUser({ ...MOCK_ADMIN });
    }
  };

  /**
   * Clears the active session
   */
  const logout = () => {
    setRole('guest');
    setUser(null);
  };

  /**
   * Updates fields on the logged-in user in context memory
   */
  const updateUser = (fields) => {
    setUser((prev) => (prev ? { ...prev, ...fields } : prev));
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
