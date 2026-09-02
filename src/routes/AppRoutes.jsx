import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import DoctorLayout from '../layouts/DoctorLayout';
import PatientLayout from '../layouts/PatientLayout';
import ReceptionistLayout from '../layouts/ReceptionistLayout';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminDoctors from '../pages/admin/Doctors';
import AdminPatients from '../pages/admin/Patients';
import AdminAppointments from '../pages/admin/Appointments';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/Dashboard';
import DoctorAppointments from '../pages/doctor/Appointments';
import DoctorPatients from '../pages/doctor/Patients';
import Consultation from '../pages/doctor/Consultation';

// Patient Pages
import PatientDashboard from '../pages/patient/Dashboard';
import FindDoctor from '../pages/patient/FindDoctor';
import BookAppointment from '../pages/patient/BookAppointment';
import MedicalHistory from '../pages/patient/MedicalHistory';

// Receptionist Pages
import ReceptionistDashboard from '../pages/receptionist/Dashboard';
import ReceptionistPatients from '../pages/receptionist/Patients';
import Queue from '../pages/receptionist/Queue';

export const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  const getDefaultRedirect = () => {
    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
    switch (user.role) {
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
  };

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="appointments" element={<AdminAppointments />} />
      </Route>

      {/* Doctor Protected Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="consultation" element={<Consultation />} />
      </Route>

      {/* Patient Protected Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="find-doctor" element={<FindDoctor />} />
        <Route path="book-appointment" element={<BookAppointment />} />
        <Route path="medical-history" element={<MedicalHistory />} />
      </Route>

      {/* Receptionist Protected Routes */}
      <Route
        path="/receptionist"
        element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <ReceptionistLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ReceptionistDashboard />} />
        <Route path="patients" element={<ReceptionistPatients />} />
        <Route path="queue" element={<Queue />} />
      </Route>

      {/* Root & Catch All */}
      <Route path="/" element={getDefaultRedirect()} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
