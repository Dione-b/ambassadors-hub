import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

// Mock user data matching the specification
const MOCK_AMBASSADOR = {
  id: 1,
  name: 'Ana Silva',
  email: 'ana@example.com',
  city: 'São Paulo',
  points: 120,
  badges: ['Meetup Organizer', 'Content Creator'],
  stellar_wallet: 'GABC123XXX',
};

const MOCK_ADMIN = {
  id: 99,
  name: 'Admin User',
  email: 'admin@stellarhub.br',
};

export const AuthProvider = ({ children }) => {
  // State tracks the active user and their role
  const [role, setRole] = useState('guest');
  const [user, setUser] = useState(null);

  /**
   * Simulates login by setting a predetermined mock user
   * based on the selected role ('ambassador' | 'admin').
   */
  const login = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'ambassador') {
      // Spread so mutations on user.points don't affect the original constant
      setUser({ ...MOCK_AMBASSADOR });
    } else if (selectedRole === 'admin') {
      setUser({ ...MOCK_ADMIN });
    }
  };

  const logout = () => {
    setRole('guest');
    setUser(null);
  };

  /**
   * Updates a specific field on the current user in context.
   * Used after attendance registration to reflect new point total.
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
