import React, { createContext, useState, useEffect } from 'react';
import { authService, DEMO_USERS } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage session on mount
    const current = authService.getCurrentUser();
    if (current) {
      setUser(current);
    } else {
      // Default to doctor demo or null
      setUser(DEMO_USERS.doctor);
    }
    setLoading(false);
  }, []);

  const login = async ({ email, role }) => {
    setLoading(true);
    try {
      const session = await authService.login({ email, role });
      setUser(session.user);
      return session.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const session = await authService.register(userData);
      setUser(session.user);
      return session.user;
    } finally {
      setLoading(false);
    }
  };

  const switchDemoRole = (roleKey) => {
    const demoUser = DEMO_USERS[roleKey];
    if (demoUser) {
      setUser(demoUser);
      authService.login({ email: demoUser.email, role: demoUser.role });
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
