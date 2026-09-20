import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Tag, Space, Avatar, Alert, List } from 'antd';
import {
  CalendarOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    patientService.getById('pat_1').then(setPatientData);
    appointmentService.getByPatient('pat_1').then(setAppointments);
  }, []);

  const nextAppointment = appointments[0] || null;

  return (
    <div>
      <PageHeader
        title={`Hello, ${user?.name || 'Alex Morgan'} 👋`}
        subtitle="Manage your personal health records, upcoming doctor visits, and daily vitals"
        extra={[
          <Button
            key="book"
            type="primary"
            icon={<CalendarOutlined />}
            style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            onClick={() => navigate('/patient/book-appointment')}
          >
            Book Appointment
          </Button>,
          <Button
            key="find"
            icon={<SearchOutlined />}
            onClick={() => navigate('/patient/find-doctor')}
          >
            Find Doctor
          </Button>,
        ]}
      />

      {/* Vitals Summary */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Blood Pressure"
            value={patientData?.vitals?.bloodPressure || '128/84'}
            icon={<HeartOutlined />}
            iconBg="#f0fdfa"
            iconColor="#0d9488"
            trendLabel="Optimal range"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Heart Rate"
            value={patientData?.vitals?.heartRate || '72'}
            suffix="BPM"
            icon={<HeartOutlined />}
            iconBg="#fef2f2"
            iconColor="#ef4444"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Prescriptions"
            value={patientData?.prescriptions?.length || 2}
            icon={<MedicineBoxOutlined />}
            iconBg="#e0f2fe"
            iconColor="#0284c7"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Blood Oxygen (SpO2)"
            value={patientData?.vitals?.spo2 || '99%'}
            icon={<HeartOutlined />}
            iconBg="#f0fdf4"
            iconColor="#16a34a"
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {/* Next Visit Banner */}
        <Col xs={24} lg={14}>
          <Card
            title="Upcoming Consultation"
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 20 }}
          >
            {nextAppointment ? (
              <div
                style={{
                  background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
                  padding: 'clamp(16px, 3.5vw, 24px)',
                  borderRadius: 12,
                  border: '1px solid rgba(13, 148, 136, 0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <Space size="middle">
                    <Avatar
                      size={52}
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
                    />
                    <div>
                      <Title level={4} style={{ margin: 0, fontSize: 'clamp(15px, 3vw, 18px)' }}>
                        {nextAppointment.doctorName}
                      </Title>
                      <Tag color="geekblue" style={{ marginTop: 2 }}>{nextAppointment.specialty}</Tag>
                    </div>
                  </Space>
                  <Tag color="green" style={{ fontSize: 13, padding: '3px 8px' }}>
                    {nextAppointment.status}
                  </Tag>
                </div>

                <div style={{ marginTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap', color: '#475569', fontSize: 13 }}>
                  <div>📅 <strong>Date:</strong> {nextAppointment.date}</div>
                  <div>⏰ <strong>Time:</strong> {nextAppointment.time}</div>
                  <div>🎟️ <strong>Token:</strong> {nextAppointment.tokenNumber}</div>
                </div>

                <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button
                    type="primary"
                    icon={<VideoCameraOutlined />}
                    style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
                    onClick={() => navigate('/doctor/consultation')}
                  >
                    Join Video Room
                  </Button>
                  <Button onClick={() => navigate('/patient/medical-history')}>
                    View Medical History
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <Paragraph>No upcoming visits scheduled.</Paragraph>
                <Button
                  type="primary"
                  onClick={() => navigate('/patient/book-appointment')}
                  style={{ backgroundColor: '#0d9488' }}
                >
                  Schedule Appointment
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Current Medications */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <MedicineBoxOutlined style={{ color: '#0d9488' }} />
                <span>My Active Medications</span>
              </Space>
            }
            extra={<a onClick={() => navigate('/patient/medical-history')}>View all</a>}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
          >
            <List
              dataSource={patientData?.prescriptions || []}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>{item.medicine}</Text>
                      <Tag color="cyan">Active</Tag>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                      {item.dosage}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PatientDashboard;
