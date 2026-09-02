import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  VideoCameraOutlined,
  SearchOutlined,
  HistoryOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
          },
          {
            key: '/admin/doctors',
            icon: <MedicineBoxOutlined />,
            label: 'Doctors',
          },
          {
            key: '/admin/patients',
            icon: <TeamOutlined />,
            label: 'Patients',
          },
          {
            key: '/admin/appointments',
            icon: <CalendarOutlined />,
            label: 'Appointments',
          },
        ];

      case 'doctor':
        return [
          {
            key: '/doctor/dashboard',
            icon: <DashboardOutlined />,
            label: 'Overview',
          },
          {
            key: '/doctor/appointments',
            icon: <CalendarOutlined />,
            label: 'My Appointments',
          },
          {
            key: '/doctor/patients',
            icon: <UserOutlined />,
            label: 'Patient Records',
          },
          {
            key: '/doctor/consultation',
            icon: <VideoCameraOutlined />,
            label: 'Live Consultation',
          },
        ];

      case 'patient':
        return [
          {
            key: '/patient/dashboard',
            icon: <DashboardOutlined />,
            label: 'Health Portal',
          },
          {
            key: '/patient/find-doctor',
            icon: <SearchOutlined />,
            label: 'Find Doctors',
          },
          {
            key: '/patient/book-appointment',
            icon: <CalendarOutlined />,
            label: 'Book Visit',
          },
          {
            key: '/patient/medical-history',
            icon: <HistoryOutlined />,
            label: 'Medical History',
          },
        ];

      case 'receptionist':
        return [
          {
            key: '/receptionist/dashboard',
            icon: <DashboardOutlined />,
            label: 'Front Desk',
          },
          {
            key: '/receptionist/patients',
            icon: <UserOutlined />,
            label: 'Patient Intake',
          },
          {
            key: '/receptionist/queue',
            icon: <UnorderedListOutlined />,
            label: 'OPD Queue Board',
          },
        ];

      default:
        return [];
    }
  };

  return (
    <aside
      style={{
        width: 240,
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        minHeight: 'calc(100vh - 64px)',
        paddingTop: 12,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        items={getMenuItems()}
        style={{
          borderRight: 'none',
          fontWeight: 500,
        }}
      />
    </aside>
  );
};
