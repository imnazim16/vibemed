import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message, Typography } from "antd";
import {
  LockOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  VideoCameraOutlined,
  ArrowRightOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "../../components/Login.css";

const { Text, Title } = Typography;

export const Login = () => {
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
      });

      message.success(`Welcome back, ${user.name}!`);

      // Navigate to respective staff dashboard
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "receptionist":
          navigate("/receptionist/dashboard");
          break;
        case "patient":
          navigate("/patient/dashboard");
          break;
        default:
          navigate("/admin/dashboard");
          break;
      }
    } catch (err) {
      message.error(err?.message || "Failed to log in. Please check your credentials.");
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
            <HeartOutlined style={{ color: "#0d9488" }} />
            <span>CLINICAL & ADMINISTRATIVE PORTAL</span>
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
            Unified ecosystem connecting doctors, administrators, and front-desk
            teams with real-time EHR, telehealth, and multi-clinic automation.
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
              <div className="vibemed-feature-title">
                Multi-Clinic Schedules
              </div>
              <div className="vibemed-feature-subtitle">
                Cross-branch physician shifts, time slots, and doctor fees.
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
            <Title
              level={3}
              className="vibemed-auth-title"
              style={{ marginBottom: 6 }}
            >
              Staff & Provider Sign In
            </Title>
            <Text className="vibemed-auth-subtitle">
              Enter your clinical credentials to access your portal
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              email: "admin@demo-medical-center.test",
              password: "password",
              remember: true,
            }}
            onFinish={handleFinish}
            requiredMark={false}
            size="large"
            style={{ marginTop: 24 }}
          >
            <Form.Item
              name="email"
              label="Staff Email or ID"
              rules={[
                {
                  required: true,
                  message: "Please enter your staff email or ID",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#94a3b8" }} />}
                placeholder="admin@demo-medical-center.test"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                placeholder="••••••••••••"
              />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  message.info(
                    "Password reset instructions sent to your email.",
                  );
                }}
                style={{ color: "#0d9488", fontSize: 13, cursor: "pointer" }}
              >
                Forgot password?
              </a>
            </div>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="vibemed-submit-btn"
                icon={<ArrowRightOutlined />}
              >
                Sign In to Staff Portal
              </Button>
            </Form.Item>

            {/* Quick Demo Credentials */}
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: "#f0fdfa",
                borderRadius: 8,
                border: "1px solid #ccfbf1",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#0f766e",
                  marginBottom: 6,
                }}
              >
                Demo Quick Fill:
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Button
                  size="small"
                  style={{ fontSize: 12, borderRadius: 6 }}
                  onClick={() => {
                    form.setFieldsValue({
                      email: "admin@demo-medical-center.test",
                      password: "password",
                    });
                  }}
                >
                  Admin
                </Button>
                <Button
                  size="small"
                  style={{ fontSize: 12, borderRadius: 6 }}
                  onClick={() => {
                    form.setFieldsValue({
                      email: "dr.sarah@vibemed.health",
                      password: "password",
                    });
                  }}
                >
                  Doctor
                </Button>
                <Button
                  size="small"
                  style={{ fontSize: 12, borderRadius: 6 }}
                  onClick={() => {
                    form.setFieldsValue({
                      email: "jessica.reception@vibemed.health",
                      password: "password",
                    });
                  }}
                >
                  Receptionist
                </Button>
              </div>
            </div>
          </Form>

          <div
            className="vibemed-auth-footer"
            style={{
              marginTop: 24,
              textAlign: "center",
              paddingTop: 16,
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <span style={{ color: "#64748b", fontSize: 14 }}>
              Are you a patient looking for care?{" "}
              <Link
                to="/patient-login"
                style={{ color: "#0d9488", fontWeight: 600 }}
              >
                Go to Patient Portal &rarr;
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
