import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Tabs,
  Divider,
  message,
  Space,
  Typography,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  VideoCameraOutlined,
  IdcardOutlined,
  PhoneOutlined,
  GoogleOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import './Login.css';

const { Text, Title, Link } = Typography;

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface UserSession {
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

interface LoginProps {
  onLoginSuccess?: (user: UserSession) => void;
}

interface DemoAccount {
  label: string;
  role: UserRole;
  email: string;
  password: string;
  name: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Doctor Demo',
    role: 'doctor',
    email: 'dr.sarah@vibemed.health',
    password: 'DoctorPassword123!',
    name: 'Dr. Sarah Connor, MD',
  },
  {
    label: 'Patient Demo',
    role: 'patient',
    email: 'alex.morgan@vibemed.health',
    password: 'PatientPassword123!',
    name: 'Alex Morgan',
  },
  {
    label: 'Clinic Admin',
    role: 'admin',
    email: 'admin@vibemed.health',
    password: 'AdminPassword123!',
    name: 'Clinic Administrator',
  },
];

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleRoleChange = (roleKey: string) => {
    const role = roleKey as UserRole;
    setSelectedRole(role);
  };

  const handleDemoFill = (account: DemoAccount) => {
    setSelectedRole(account.role);
    form.setFieldsValue({
      email: account.email,
      password: account.password,
      remember: true,
      name: account.name,
    });
    message.info(`Loaded demo credentials for ${account.label}`);
  };

  const handleFinish = async (values: any) => {
    setLoading(true);

    // Simulate authentication API delay
    setTimeout(() => {
      setLoading(false);

      const userName =
        values.name ||
        (selectedRole === 'doctor'
          ? 'Dr. ' + (values.email.split('@')[0] || 'Provider')
          : values.email.split('@')[0] || 'User');

      const userSession: UserSession = {
        name: userName,
        email: values.email,
        role: selectedRole,
        token: 'mock-jwt-token-' + Date.now(),
      };

      if (activeTab === 'signin') {
        message.success({
          content: `Welcome back, ${userSession.name}!`,
          icon: <CheckCircleFilled style={{ color: '#0d9488' }} />,
        });
      } else {
        message.success({
          content: `Account created successfully! Welcome to VibeMed.`,
          icon: <CheckCircleFilled style={{ color: '#0d9488' }} />,
        });
      }

      if (onLoginSuccess) {
        onLoginSuccess(userSession);
      }
    }, 800);
  };

  return (
    <div className="vibemed-auth-container">
      <div className="vibemed-auth-wrapper">
        {/* Left Side: Brand Hero */}
        <div className="vibemed-hero-side">
          <div className="vibemed-brand-badge">
            <HeartOutlined style={{ color: '#0d9488' }} />
            <span>NEXT-GEN HEALTHCARE PLATFORM</span>
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
            Empowering patients, doctors, and clinics with real-time health metrics,
            telemedicine consultations, and secure medical record management.
          </p>

          <div className="vibemed-features-list">
            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <VideoCameraOutlined />
              </div>
              <div className="vibemed-feature-title">HD Telehealth</div>
              <div className="vibemed-feature-subtitle">
                Virtual doctor visits and instant prescriptions anywhere.
              </div>
            </div>

            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <SafetyCertificateOutlined />
              </div>
              <div className="vibemed-feature-title">HIPAA Compliant</div>
              <div className="vibemed-feature-subtitle">
                End-to-end encrypted medical data and diagnostic results.
              </div>
            </div>

            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <HeartOutlined />
              </div>
              <div className="vibemed-feature-title">Vital Tracking</div>
              <div className="vibemed-feature-subtitle">
                Real-time monitoring of blood pressure, glucose, and heart rate.
              </div>
            </div>

            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <IdcardOutlined />
              </div>
              <div className="vibemed-feature-title">Unified EHR</div>
              <div className="vibemed-feature-subtitle">
                Instant access to electronic health records and lab tests.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="vibemed-auth-card">
          <div className="vibemed-auth-header">
            <Title level={3} className="vibemed-auth-title">
              {activeTab === 'signin' ? 'Sign in to VibeMed' : 'Create an Account'}
            </Title>
            <Text className="vibemed-auth-subtitle">
              {activeTab === 'signin'
                ? 'Select your role and enter your credentials to continue'
                : 'Join VibeMed to access world-class healthcare tools'}
            </Text>
          </div>

          {/* Quick Demo Credentials */}
          {activeTab === 'signin' && (
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
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Role Tabs */}
          <Tabs
            activeKey={selectedRole}
            onChange={handleRoleChange}
            centered
            items={[
              {
                key: 'patient',
                label: (
                  <span>
                    <UserOutlined /> Patient
                  </span>
                ),
              },
              {
                key: 'doctor',
                label: (
                  <span>
                    <MedicineBoxOutlined /> Doctor
                  </span>
                ),
              },
              {
                key: 'admin',
                label: (
                  <span>
                    <SafetyCertificateOutlined /> Clinic Admin
                  </span>
                ),
              },
            ]}
          />

          {/* Form */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={handleFinish}
            requiredMark={false}
            size="large"
            style={{ marginTop: 12 }}
          >
            {activeTab === 'signup' && (
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                  placeholder={
                    selectedRole === 'doctor' ? 'Dr. Sarah Connor' : 'Alex Morgan'
                  }
                />
              </Form.Item>
            )}

            {activeTab === 'signup' && selectedRole === 'doctor' && (
              <Form.Item
                name="licenseNumber"
                label="Medical License / NPI Number"
                rules={[{ required: true, message: 'Please enter your medical license ID' }]}
              >
                <Input
                  prefix={<IdcardOutlined style={{ color: '#94a3b8' }} />}
                  placeholder="e.g. MED-89401-NY"
                />
              </Form.Item>
            )}

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email address' },
                { type: 'email', message: 'Please enter a valid email address' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
                placeholder="name@example.com"
              />
            </Form.Item>

            {activeTab === 'signup' && (
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />}
                  placeholder="+1 (555) 000-0000"
                />
              </Form.Item>
            )}

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                placeholder="••••••••••••"
              />
            </Form.Item>

            {activeTab === 'signin' && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    message.info('Password reset instructions sent to your email.');
                  }}
                  style={{ color: '#0d9488', fontSize: 13 }}
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="vibemed-submit-btn"
                icon={<ArrowRightOutlined />}
              >
                {activeTab === 'signin'
                  ? `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`
                  : 'Create Account'}
              </Button>
            </Form.Item>
          </Form>

          <Divider plain style={{ margin: '16px 0', color: '#94a3b8', fontSize: 12 }}>
            or continue with
          </Divider>

          <Button
            block
            size="large"
            icon={<GoogleOutlined />}
            style={{ borderRadius: 10, borderColor: '#cbd5e1' }}
            onClick={() => message.info('Google SSO login initiated')}
          >
            Google Workspace / SSO
          </Button>

          <div className="vibemed-auth-footer">
            {activeTab === 'signin' ? (
              <span>
                Don't have an account?{' '}
                <a
                  onClick={() => {
                    setActiveTab('signup');
                    form.resetFields();
                  }}
                >
                  Sign up now
                </a>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <a
                  onClick={() => {
                    setActiveTab('signin');
                    form.resetFields();
                  }}
                >
                  Sign in
                </a>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
