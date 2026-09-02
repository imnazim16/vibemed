import React from 'react';
import { Menu, Drawer } from 'antd';
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

export const Sidebar = ({ mobileOpen, onClose }) => {
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

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (onClose) {
      onClose();
    }
  };

  const menuContent = (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={handleMenuClick}
      items={getMenuItems()}
      style={{
        borderRight: 'none',
        fontWeight: 500,
        fontSize: 14,
      }}
    />
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="vibemed-desktop-sidebar">
        {menuContent}
      </aside>

      {/* Mobile / Tablet Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 16,
              }}
            >
              <MedicineBoxOutlined />
            </div>
            <span style={{ fontWeight: 800, color: '#0f766e', fontSize: 18 }}>
              VibeMed
            </span>
          </div>
        }
        placement="left"
        onClose={onClose}
        open={mobileOpen}
        styles={{ body: { padding: '12px 0' } }}
        width={260}
      >
        {menuContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
