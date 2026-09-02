import React, { useState } from 'react';
import { Form, Input, Button, Tabs, Select, message, Typography, Divider } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  IdcardOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../components/Login.css';

const { Text, Title } = Typography;
const { Option } = Select;

export const Register = () => {
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const user = await register({
        ...values,
        role,
      });

      message.success(`Account created! Welcome, ${user.name}`);

      if (role === 'doctor') navigate('/doctor/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'receptionist') navigate('/receptionist/dashboard');
      else navigate('/patient/dashboard');
    } catch {
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vibemed-auth-container">
      <div className="vibemed-auth-wrapper" style={{ gridTemplateColumns: '0.9fr 1.1fr' }}>
        {/* Left Side */}
        <div className="vibemed-hero-side">
          <div className="vibemed-logo-title">
            <div className="vibemed-logo-icon">
              <MedicineBoxOutlined />
            </div>
            <h1 className="vibemed-brand-name">VibeMed</h1>
          </div>

          <h2 className="vibemed-hero-heading">
            Join the future of <span>connected health.</span>
          </h2>

          <p className="vibemed-hero-desc">
            Sign up today to get instant access to our telemedicine network, digital prescriptions, and unified electronic health record system.
          </p>
        </div>

        {/* Right Side Register Card */}
        <div className="vibemed-auth-card">
          <div className="vibemed-auth-header">
            <Title level={3} className="vibemed-auth-title">
              Create an Account
            </Title>
            <Text className="vibemed-auth-subtitle">
              Choose your role and enter your details to get started
            </Text>
          </div>

          <Tabs
            activeKey={role}
            onChange={(k) => setRole(k)}
            centered
            items={[
              { key: 'patient', label: 'Patient' },
              { key: 'doctor', label: 'Doctor / Specialist' },
              { key: 'receptionist', label: 'Front Desk' },
              { key: 'admin', label: 'Administrator' },
            ]}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            size="large"
            style={{ marginTop: 16 }}
          >
            <Form.Item
              name="name"
              label="Full Legal Name"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                placeholder={role === 'doctor' ? 'Dr. John Doe' : 'Jane Smith'}
              />
            </Form.Item>

            {role === 'doctor' && (
              <>
                <Form.Item
                  name="specialty"
                  label="Medical Specialty"
                  rules={[{ required: true, message: 'Please select specialty' }]}
                >
                  <Select placeholder="Select primary specialty">
                    <Option value="Cardiology">Cardiology</Option>
                    <Option value="Neurology">Neurology</Option>
                    <Option value="Pediatrics">Pediatrics</Option>
                    <Option value="Orthopedics">Orthopedics</Option>
                    <Option value="Dermatology">Dermatology</Option>
                    <Option value="General Medicine">General Medicine</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="licenseNumber"
                  label="Medical License / NPI"
                  rules={[{ required: true, message: 'Enter your medical license ID' }]}
                >
                  <Input
                    prefix={<IdcardOutlined style={{ color: '#94a3b8' }} />}
                    placeholder="e.g. LIC-98124-NY"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="name@example.com" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter contact phone' }]}
            >
              <Input prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} placeholder="+1 (555) 000-0000" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Create Password"
              rules={[
                { required: true, message: 'Please create a password' },
                { min: 6, message: 'Must be at least 6 characters' },
              ]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••••••" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="vibemed-submit-btn"
                icon={<ArrowRightOutlined />}
              >
                Complete Registration
              </Button>
            </Form.Item>
          </Form>

          <div className="vibemed-auth-footer">
            <span>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#0d9488', fontWeight: 600 }}>
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
