import React from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Avatar,
  Table,
  Badge,
  Space,
  Statistic,
} from 'antd';
import {
  MedicineBoxOutlined,
  LogoutOutlined,
  CalendarOutlined,
  HeartOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { UserSession } from './Login';
import './Dashboard.css';

const { Title, Text, Paragraph } = Typography;

interface DashboardProps {
  user: UserSession;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const isDoctor = user.role === 'doctor';
  const isAdmin = user.role === 'admin';

  const appointmentData = [
    {
      key: '1',
      patientOrDoctor: isDoctor ? 'Alex Morgan (Patient)' : 'Dr. Sarah Connor (Cardiology)',
      time: 'Today, 10:30 AM',
      type: 'Video Consultation',
      status: 'Ready',
      condition: 'Hypertension Follow-up',
    },
    {
      key: '2',
      patientOrDoctor: isDoctor ? 'David Miller (Patient)' : 'Dr. James Wilson (Neurology)',
      time: 'Today, 02:00 PM',
      type: 'In-Clinic Checkup',
      status: 'Confirmed',
      condition: 'Routine Health Screening',
    },
    {
      key: '3',
      patientOrDoctor: isDoctor ? 'Elena Rostova (Patient)' : 'Dr. Emily Chen (Pediatrics)',
      time: 'Tomorrow, 09:15 AM',
      type: 'Video Consultation',
      status: 'Scheduled',
      condition: 'Lab Results Review',
    },
  ];

  const columns = [
    {
      title: isDoctor ? 'Patient Name' : 'Doctor / Specialist',
      dataIndex: 'patientOrDoctor',
      key: 'patientOrDoctor',
      render: (text: string) => (
        <Space>
          <Avatar
            style={{
              backgroundColor: isDoctor ? '#0d9488' : '#0284c7',
            }}
            icon={<UserOutlined />}
          />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Time & Date',
      dataIndex: 'time',
      key: 'time',
      render: (time: string) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#64748b' }} />
          <span>{time}</span>
        </Space>
      ),
    },
    {
      title: 'Consultation Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type.includes('Video') ? 'cyan' : 'blue'}>{type}</Tag>
      ),
    },
    {
      title: 'Reason / Notes',
      dataIndex: 'condition',
      key: 'condition',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Ready') color = 'processing';
        if (status === 'Confirmed') color = 'success';
        return <Badge status={color as any} text={status} />;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          size="small"
          icon={<VideoCameraOutlined />}
          style={{
            backgroundColor: '#0d9488',
            borderColor: '#0d9488',
            borderRadius: 6,
          }}
        >
          {record.type.includes('Video') ? 'Join Call' : 'View Details'}
        </Button>
      ),
    },
  ];

  return (
    <div className="vibemed-dashboard">
      {/* Top Navbar */}
      <nav className="vibemed-navbar">
        <div className="vibemed-nav-brand">
          <div className="vibemed-nav-logo">
            <MedicineBoxOutlined />
          </div>
          <h2 className="vibemed-nav-title">VibeMed</h2>
        </div>

        <div className="vibemed-nav-user">
          <Tag
            color={
              user.role === 'doctor'
                ? 'geekblue'
                : user.role === 'admin'
                ? 'purple'
                : 'teal'
            }
            style={{
              textTransform: 'uppercase',
              fontWeight: 600,
              padding: '2px 8px',
            }}
          >
            {user.role} Portal
          </Tag>

          <Space size="middle">
            <Avatar
              style={{
                backgroundColor: '#0d9488',
                cursor: 'pointer',
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <div>
              <Text strong style={{ display: 'block', fontSize: 14 }}>
                {user.name}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {user.email}
              </Text>
            </div>
          </Space>

          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={onLogout}
            danger
            style={{ marginLeft: 16 }}
          >
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="vibemed-content">
        {/* Welcome Header */}
        <div className="vibemed-welcome-banner">
          <div>
            <Title level={2} style={{ color: '#ffffff', margin: 0 }}>
              Welcome back, {user.name}! 👋
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.85)', margin: '8px 0 0 0', fontSize: 15 }}>
              {isDoctor
                ? 'You have 3 patient consultations scheduled for today. Your virtual clinic is active.'
                : isAdmin
                ? 'System health is optimal. 42 active clinic providers connected.'
                : 'Your next follow-up consultation is ready. Vital signals are in the healthy range.'}
            </Paragraph>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            style={{
              backgroundColor: '#ffffff',
              color: '#0d9488',
              fontWeight: 600,
              border: 'none',
              borderRadius: 10,
            }}
          >
            {isDoctor ? 'Add Patient' : 'Book Consultation'}
          </Button>
        </div>

        {/* Stats Section */}
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="vibemed-stat-card">
              <Statistic
                title={isDoctor ? "Today's Appointments" : 'Upcoming Appointments'}
                value={isDoctor ? 8 : 2}
                prefix={<CalendarOutlined style={{ color: '#0d9488' }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="vibemed-stat-card">
              <Statistic
                title={isDoctor ? 'Total Active Patients' : 'Heart Rate / Vitals'}
                value={isDoctor ? 142 : 72}
                suffix={isDoctor ? '' : 'BPM'}
                prefix={<HeartOutlined style={{ color: '#ef4444' }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="vibemed-stat-card">
              <Statistic
                title={isDoctor ? 'Pending Lab Reviews' : 'Active Prescriptions'}
                value={isDoctor ? 5 : 3}
                prefix={<FileTextOutlined style={{ color: '#0284c7' }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="vibemed-stat-card">
              <Statistic
                title="System Status"
                value="Online"
                valueStyle={{ color: '#10b981', fontSize: 20 }}
                prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Upcoming Appointments Table */}
        <Card
          title={
            <Space>
              <CalendarOutlined style={{ color: '#0d9488' }} />
              <span>{isDoctor ? 'Patient Queue & Schedule' : 'Your Scheduled Consultations'}</span>
            </Space>
          }
          style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
        >
          <Table
            dataSource={appointmentData}
            columns={columns}
            pagination={false}
            responsive
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
