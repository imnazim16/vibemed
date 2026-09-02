import React from 'react';
import { Dropdown, Badge, Avatar, Space, Typography, Button, Tag } from 'antd';
import {
  MedicineBoxOutlined,
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
  SwapOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const Header = ({ onToggleMobileMenu }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleMenu = {
    items: [
      {
        key: 'doctor',
        label: 'Switch to Doctor (Dr. Sarah)',
        onClick: () => {
          switchDemoRole('doctor');
          navigate('/doctor/dashboard');
        },
      },
      {
        key: 'patient',
        label: 'Switch to Patient (Alex)',
        onClick: () => {
          switchDemoRole('patient');
          navigate('/patient/dashboard');
        },
      },
      {
        key: 'admin',
        label: 'Switch to Admin (Eleanor)',
        onClick: () => {
          switchDemoRole('admin');
          navigate('/admin/dashboard');
        },
      },
      {
        key: 'receptionist',
        label: 'Switch to Receptionist (Jessica)',
        onClick: () => {
          switchDemoRole('receptionist');
          navigate('/receptionist/dashboard');
        },
      },
    ],
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: `${user?.name || 'User'} (${user?.role})`,
        disabled: true,
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        danger: true,
        label: 'Sign Out',
        onClick: handleLogout,
      },
    ],
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'purple';
      case 'doctor':
        return 'teal';
      case 'receptionist':
        return 'orange';
      case 'patient':
      default:
        return 'blue';
    }
  };

  return (
    <header className="vibemed-header">
      {/* Brand & Mobile Hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: 18, color: '#334155' }} />}
          className="vibemed-mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Open Navigation Menu"
        />

        <div className="vibemed-brand-logo-box">
          <MedicineBoxOutlined />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span className="vibemed-header-brand-title">
            VibeMed
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Quick Demo Switcher */}
        <Dropdown menu={roleMenu} placement="bottomRight" trigger={['click']}>
          <Button
            size="small"
            icon={<SwapOutlined />}
            className="vibemed-switch-role-btn"
          >
            <span className="vibemed-btn-label">Switch Role</span>
          </Button>
        </Dropdown>

        <Tag
          color={getRoleColor(user?.role)}
          className="vibemed-header-role-tag"
        >
          {user?.role}
        </Tag>

        <Badge count={2} size="small" className="vibemed-bell-badge">
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined style={{ fontSize: 17, color: '#64748b' }} />}
          />
        </Badge>

        <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              src={user?.avatar}
              size={36}
              style={{
                backgroundColor: '#0d9488',
                border: '2px solid #e0f2fe',
                flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <div className="vibemed-header-user-text">
              <Text strong style={{ fontSize: 13, lineHeight: 1.2 }}>
                {user?.name || 'User'}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {user?.specialty || user?.email}
              </Text>
            </div>
          </Space>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
