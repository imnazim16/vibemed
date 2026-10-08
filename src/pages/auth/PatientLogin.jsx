import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, message, Typography } from 'antd';
import {
  LockOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  CalendarOutlined,
  FileProtectOutlined,
  VideoCameraOutlined,
  GoogleOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../components/Login.css';

const { Text, Title } = Typography;

export const PatientLogin = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const user = await login({
        email: values.email,
        password: values.password,
        role: 'patient',
      });

      message.success(`Welcome back, ${user.name}!`);
      navigate('/patient/dashboard');
    } catch {
      message.error('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSSO = () => {
    message.loading({ content: 'Connecting to Google Health SSO...', key: 'sso' });
    setTimeout(async () => {
      try {
        const user = await login({
          email: 'alex.morgan@vibemed.health',
          role: 'patient',
        });
        message.success({ content: `Authenticated via Google SSO as ${user.name}!`, key: 'sso' });
        navigate('/patient/dashboard');
      } catch {
        message.error({ content: 'Google SSO authentication failed.', key: 'sso' });
      }
    }, 800);
  };

  return (
    <div className="vibemed-auth-container">
      <div className="vibemed-auth-wrapper">
        {/* Left Hero tailored for patients */}
        <div className="vibemed-hero-side">
          <div className="vibemed-brand-badge">
            <HeartOutlined style={{ color: '#0d9488' }} />
            <span>PATIENT CARE & WELLNESS PORTAL</span>
          </div>

          <div className="vibemed-logo-title">
            <div className="vibemed-logo-icon">
              <MedicineBoxOutlined />
            </div>
            <h1 className="vibemed-brand-name">VibeMed</h1>
          </div>

          <h2 className="vibemed-hero-heading">
            Your healthcare journey, <span>simplified.</span>
          </h2>

          <p className="vibemed-hero-desc">
            Book appointments across multi-location clinics, consult via HD telehealth, and access your digital medical records and prescriptions securely.
          </p>

          <div className="vibemed-features-list">
            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <CalendarOutlined />
              </div>
              <div className="vibemed-feature-title">Instant Doctor Booking</div>
              <div className="vibemed-feature-subtitle">
                Select your preferred clinic branch, specialty, and live time slot.
              </div>
            </div>

            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <FileProtectOutlined />
              </div>
              <div className="vibemed-feature-title">Digital Health Records</div>
              <div className="vibemed-feature-subtitle">
                Immediate access to lab diagnostics, vitals, and e-prescriptions.
              </div>
            </div>

            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <VideoCameraOutlined />
              </div>
              <div className="vibemed-feature-title">Telehealth Video Visits</div>
              <div className="vibemed-feature-subtitle">
                Connect with board-certified physicians directly from home.
              </div>
            </div>

            <div className="vibemed-feature-item">
              <div className="vibemed-feature-icon">
                <UserOutlined />
              </div>
              <div className="vibemed-feature-title">Family Health Vault</div>
              <div className="vibemed-feature-subtitle">
                Securely manage appointments and health history for your loved ones.
              </div>
            </div>
          </div>
        </div>

        {/* Right Auth Card for Patients */}
        <div className="vibemed-auth-card">
          <div className="vibemed-auth-header">
            <Title level={3} className="vibemed-auth-title" style={{ marginBottom: 6 }}>
              Patient Sign In
            </Title>
            <Text className="vibemed-auth-subtitle">
              Sign in to manage your appointments and health records
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              email: 'alex.morgan@vibemed.health',
              password: 'Password123!',
              remember: true,
            }}
            onFinish={handleFinish}
            requiredMark={false}
            size="large"
            style={{ marginTop: 24 }}
          >
            <Form.Item
              name="email"
              label="Email Address or Patient ID"
              rules={[
                { required: true, message: 'Please enter your email or patient ID' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
                placeholder="patient@example.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••••••" />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  message.info('Password reset instructions sent to your email.');
                }}
                style={{ color: '#0d9488', fontSize: 13, cursor: 'pointer' }}
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
                Sign In to Patient Portal
              </Button>
            </Form.Item>
          </Form>

          <Divider plain style={{ margin: '18px 0', color: '#94a3b8', fontSize: 13 }}>
            or continue with
          </Divider>

          {/* Google SSO Button */}
          <Button
            block
            size="large"
            icon={<GoogleOutlined style={{ color: '#ea4335' }} />}
            style={{
              borderRadius: 10,
              borderColor: '#cbd5e1',
              fontWeight: 500,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onClick={handleGoogleSSO}
          >
            Continue with Google SSO
          </Button>

          {/* Register Button Link */}
          <div className="vibemed-auth-footer" style={{ marginTop: 20, textAlign: 'center' }}>
            <span style={{ fontSize: 14, color: '#64748b' }}>
              Don't have a patient account?{' '}
              <Link to="/register" style={{ color: '#0d9488', fontWeight: 600 }}>
                Register here
              </Link>
            </span>
          </div>

          {/* Staff Switcher Link */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>
              Are you a doctor or clinic staff member?{' '}
              <Link to="/login" style={{ color: '#0f766e', fontWeight: 500 }}>
                Staff Login &rarr;
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
