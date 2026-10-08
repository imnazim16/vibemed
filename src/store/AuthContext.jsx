import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

const normalizeRole = (role) => {
  const r = (role || '').toLowerCase();
  if (r.includes('admin')) return 'admin';
  if (r.includes('doc')) return 'doctor';
  if (r.includes('recept')) return 'receptionist';
  if (r.includes('pat')) return 'patient';
  return r || 'admin';
};

export const AuthProvider = ({ children }) => {
  // Synchronous initialization prevents unauthenticated flash and redirect loops on page refresh
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Re-verify localStorage session on mount
    const current = authService.getCurrentUser();
    if (current && (!user || user.id !== current.id)) {
      setUser(current);
    }
  }, []);

  const login = async ({ email, password, role }) => {
    setLoading(true);
    try {
      const session = await authService.login({ email, password, role });
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

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const normalizedRole = user ? normalizeRole(user.role) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: normalizedRole,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
