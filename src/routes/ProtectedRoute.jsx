import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spin } from 'antd';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Not authenticated: strictly redirect to appropriate login portal
  if (!isAuthenticated || !user) {
    const isPatientPath =
      location.pathname.startsWith('/patient') ||
      (allowedRoles && allowedRoles.includes('patient') && allowedRoles.length === 1);
    return <Navigate to={isPatientPath ? '/patient-login' : '/login'} state={{ from: location }} replace />;
  }

  // Normalize role casing and common aliases
  const rawRole = (role || user?.role || '').toLowerCase();
  let normalizedRole = rawRole;
  if (rawRole.includes('admin')) normalizedRole = 'admin';
  else if (rawRole.includes('doc')) normalizedRole = 'doctor';
  else if (rawRole.includes('recept')) normalizedRole = 'receptionist';
  else if (rawRole.includes('pat')) normalizedRole = 'patient';

  const normalizedAllowedRoles = (allowedRoles || []).map((r) => r.toLowerCase());

  // Check if role is authorized for this route
  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(normalizedRole)) {
    switch (normalizedRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'doctor':
        return <Navigate to="/doctor/dashboard" replace />;
      case 'receptionist':
        return <Navigate to="/receptionist/dashboard" replace />;
      case 'patient':
      default:
        return <Navigate to="/patient/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
