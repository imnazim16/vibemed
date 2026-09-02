import React from 'react';
import { Dropdown, Badge, Avatar, Space, Typography, Button, Tag } from 'antd';
import {
  MedicineBoxOutlined,
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const Header = () => {
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
    <header
      style={{
        height: 64,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 20,
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.3)',
          }}
        >
          <MedicineBoxOutlined />
        </div>
        <div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: -0.5,
              background: 'linear-gradient(135deg, #0f766e 0%, #0369a1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            VibeMed
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#94a3b8',
              marginLeft: 8,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Healthcare OS
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Quick Demo Switcher */}
        <Dropdown menu={roleMenu} placement="bottomRight">
          <Button
            size="small"
            icon={<SwapOutlined />}
            style={{
              borderRadius: 6,
              borderColor: '#cbd5e1',
              color: '#475569',
              fontSize: 12,
            }}
          >
            Switch Role
          </Button>
        </Dropdown>

        <Tag
          color={getRoleColor(user?.role)}
          style={{
            textTransform: 'uppercase',
            fontWeight: 700,
            fontSize: 11,
            borderRadius: 6,
            padding: '2px 8px',
          }}
        >
          {user?.role} Portal
        </Tag>

        <Badge count={2} size="small">
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined style={{ fontSize: 18, color: '#64748b' }} />}
          />
        </Badge>

        <Dropdown menu={userMenu} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              src={user?.avatar}
              style={{
                backgroundColor: '#0d9488',
                border: '2px solid #e0f2fe',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
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
