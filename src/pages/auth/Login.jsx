import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Tabs, Divider, message, Space, Typography } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  VideoCameraOutlined,
  IdcardOutlined,
  GoogleOutlined,
  ArrowRightOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../components/Login.css';

const { Text, Title } = Typography;

const DEMO_ACCOUNTS = [
  {
    label: 'Doctor Demo',
    role: 'doctor',
    email: 'dr.sarah@vibemed.health',
    name: 'Dr. Sarah Connor',
  },
  {
    label: 'Patient Demo',
    role: 'patient',
    email: 'alex.morgan@vibemed.health',
    name: 'Alex Morgan',
  },
  {
    label: 'Admin Demo',
    role: 'admin',
    email: 'admin@vibemed.health',
    name: 'Eleanor Vance',
  },
  {
    label: 'Receptionist Demo',
    role: 'receptionist',
    email: 'jessica.reception@vibemed.health',
    name: 'Jessica Taylor',
  },
];

export const Login = () => {
  const [selectedRole, setSelectedRole] = useState('doctor');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoFill = (account) => {
    setSelectedRole(account.role);
    form.setFieldsValue({
      email: account.email,
      password: 'Password123!',
      remember: true,
    });
    message.info(`Loaded demo credentials for ${account.label}`);
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const user = await login({
        email: values.email,
        role: selectedRole,
      });

      message.success(`Welcome back, ${user.name}!`);

      // Navigate to respective dashboard
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'receptionist':
          navigate('/receptionist/dashboard');
          break;
        case 'patient':
        default:
          navigate('/patient/dashboard');
          break;
      }
    } catch {
      message.error('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vibemed-auth-container">
      <div className="vibemed-auth-wrapper">
        {/* Left Hero */}
        <div className="vibemed-hero-side">
          <div className="vibemed-brand-badge">
            <HeartOutlined style={{ color: '#0d9488' }} />
            <span>INTELLIGENT HEALTHCARE PLATFORM</span>
          </div>

          <div className="vibemed-logo-title">
            <div className="vibemed-logo-icon">
              <MedicineBoxOutlined />
            </div>
            <h1 className="vibemed-brand-name">VibeMed</h1>
          </div>

          <h2 className="vibemed-hero-heading">
            Smarter healthcare, <span>seamless connection.</span>
          </h2>

          <p className="vibemed-hero-desc">
            Unified ecosystem connecting patients, doctors, administrators, and front-desk teams with real-time EHR, telehealth, and clinic automation.
          </p>

          <div className="vibemed-features-list">
            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <VideoCameraOutlined />
              </div>
              <div className="vibemed-feature-title">Virtual Telehealth</div>
              <div className="vibemed-feature-subtitle">
                HD video consultations, notes, and digital e-prescriptions.
              </div>
            </div>

            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <SafetyCertificateOutlined />
              </div>
              <div className="vibemed-feature-title">HIPAA Compliant</div>
              <div className="vibemed-feature-subtitle">
                Enterprise security and role-guarded medical record vaults.
              </div>
            </div>

            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <HeartOutlined />
              </div>
              <div className="vibemed-feature-title">Vitals Tracking</div>
              <div className="vibemed-feature-subtitle">
                Real-time patient telemetry for BP, Glucose, and SpO2.
              </div>
            </div>

            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <TeamOutlined />
              </div>
              <div className="vibemed-feature-title">OPD Queue Board</div>
              <div className="vibemed-feature-subtitle">
                Smart token dispatch and instant triage management.
              </div>
            </div>
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="vibemed-auth-card">
          <div className="vibemed-auth-header">
            <Title level={3} className="vibemed-auth-title">
              Sign in to VibeMed
            </Title>
            <Text className="vibemed-auth-subtitle">
              Select your role and enter credentials to continue
            </Text>
          </div>

          {/* Quick Demo Logins */}
          <div className="vibemed-demo-section">
            <span className="vibemed-demo-label">Quick Demo Logins (Click to Autofill):</span>
            <div className="vibemed-demo-chips">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  className={`vibemed-demo-chip ${selectedRole === acc.role ? 'active' : ''}`}
                  onClick={() => handleDemoFill(acc)}
                >
                  {acc.role === 'doctor' && <MedicineBoxOutlined />}
                  {acc.role === 'patient' && <UserOutlined />}
                  {acc.role === 'admin' && <SafetyCertificateOutlined />}
                  {acc.role === 'receptionist' && <TeamOutlined />}
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Role Selection Tabs */}
          <Tabs
            activeKey={selectedRole}
            onChange={(key) => setSelectedRole(key)}
            centered
            items={[
              {
                key: 'doctor',
                label: (
                  <span>
                    <MedicineBoxOutlined /> Doctor
                  </span>
                ),
              },
              {
                key: 'patient',
                label: (
                  <span>
                    <UserOutlined /> Patient
                  </span>
                ),
              },
              {
                key: 'admin',
                label: (
                  <span>
                    <SafetyCertificateOutlined /> Admin
                  </span>
                ),
              },
              {
                key: 'receptionist',
                label: (
                  <span>
                    <TeamOutlined /> Reception
                  </span>
                ),
              },
            ]}
          />

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              email: 'dr.sarah@vibemed.health',
              password: 'Password123!',
              remember: true,
            }}
            onFinish={handleFinish}
            requiredMark={false}
            size="large"
            style={{ marginTop: 16 }}
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="name@vibemed.health" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••••••" />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  message.info('Reset instructions sent to your email.');
                }}
                style={{ color: '#0d9488', fontSize: 13 }}
              >
                Forgot password?
              </a>
            </div>

            <Form.Item style={{ marginBottom: 14 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="vibemed-submit-btn"
                icon={<ArrowRightOutlined />}
              >
                Sign In as {selectedRole.toUpperCase()}
              </Button>
            </Form.Item>
          </Form>

          <Divider plain style={{ margin: '14px 0', color: '#94a3b8', fontSize: 12 }}>
            or continue with
          </Divider>

          <Button
            block
            size="large"
            icon={<GoogleOutlined />}
            style={{ borderRadius: 10, borderColor: '#cbd5e1' }}
            onClick={() => message.info('Google SSO authentication active')}
          >
            Google Workspace / Health SSO
          </Button>

          <div className="vibemed-auth-footer">
            <span>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#0d9488', fontWeight: 600 }}>
                Register here
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
