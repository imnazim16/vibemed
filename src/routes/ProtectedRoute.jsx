import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spin } from 'antd';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to the user's primary dashboard
    switch (role) {
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
