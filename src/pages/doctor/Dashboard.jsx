import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Space, Avatar, Badge, Tag, Alert } from 'antd';
import {
  CalendarOutlined,
  HeartOutlined,
  VideoCameraOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { useAuth } from '../../hooks/useAuth';
import { appointmentService } from '../../services/appointmentService';
import { patientService } from '../../services/patientService';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    appointmentService.getByDoctor().then(setAppointments);
    patientService.getAll().then(setPatients);
  }, []);

  const todayAppointments = appointments.filter((a) => a.date === '2026-09-02');

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name || 'Dr. Sarah Connor'}! 🩺`}
        subtitle="Here is your clinical schedule and active telehealth queue for today."
        extra={[
          <Button
            key="startCall"
            type="primary"
            size="large"
            icon={<VideoCameraOutlined />}
            style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            onClick={() => navigate('/doctor/consultation')}
          >
            Launch Telehealth Suite
          </Button>,
        ]}
      />

      {/* KPI Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Today's Consultations"
            value={todayAppointments.length || 3}
            icon={<CalendarOutlined />}
            trend={14}
            iconBg="#f0fdfa"
            iconColor="#0d9488"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Assigned Patients"
            value={patients.length || 42}
            icon={<UserOutlined />}
            trend={5.2}
            iconBg="#e0f2fe"
            iconColor="#0284c7"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Lab Reviews"
            value={4}
            icon={<FileTextOutlined />}
            iconBg="#fef3c7"
            iconColor="#d97706"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Clinical Satisfaction"
            value="4.9 / 5"
            icon={<HeartOutlined />}
            iconBg="#fce7f3"
            iconColor="#ec4899"
          />
        </Col>
      </Row>

      {/* Main Grid */}
      <Row gutter={[20, 20]}>
        {/* Next Patient in Queue */}
        <Col xs={24} lg={14}>
          <Card
            title="Current / Upcoming Patient in Queue"
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 20 }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
                padding: 24,
                borderRadius: 12,
                border: '1px solid rgba(13, 148, 136, 0.2)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Space size="middle">
                  <Avatar size={54} icon={<UserOutlined />} style={{ backgroundColor: '#0d9488' }} />
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      Alex Morgan (32 yrs • Male)
                    </Title>
                    <Text type="secondary">Token: <strong>A-12</strong> • Blood: <strong>O+</strong></Text>
                  </div>
                </Space>
                <Tag color="cyan" style={{ fontSize: 13, padding: '4px 10px' }}>
                  In Progress (Video Call)
                </Tag>
              </div>

              <div style={{ marginTop: 16, background: '#ffffff', padding: 14, borderRadius: 8 }}>
                <Text strong>Chief Complaint:</Text>
                <div style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>
                  Mild chest tightness after exercise. BP monitoring follow-up (Current BP: 128/84 mmHg).
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                <Button
                  type="primary"
                  icon={<VideoCameraOutlined />}
                  style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
                  onClick={() => navigate('/doctor/consultation')}
                >
                  Join Telehealth Video
                </Button>
                <Button onClick={() => navigate('/doctor/patients')}>
                  Open Full EHR Chart
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        {/* Schedule List */}
        <Col xs={24} lg={10}>
          <Card
            title="Today's Schedule"
            extra={<a onClick={() => navigate('/doctor/appointments')}>View all</a>}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 12,
                    border: '1px solid #f1f5f9',
                    borderRadius: 10,
                    background: '#f8fafc',
                  }}
                >
                  <div>
                    <Text strong style={{ display: 'block' }}>
                      {apt.patientName}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {apt.time} • {apt.type}
                    </Text>
                  </div>
                  <Tag color={apt.status === 'In-Progress' ? 'processing' : 'default'}>
                    {apt.status}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDashboard;
