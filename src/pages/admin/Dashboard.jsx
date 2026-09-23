import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Table, Tag, Space, Button, Progress, Avatar } from 'antd';
import {
  MedicineBoxOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  PlusOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      doctorService.getAll(),
      patientService.getAll(),
      appointmentService.getAll(),
    ]).then(([docs, pats, apts]) => {
      setDoctors(docs);
      setPatients(pats);
      setAppointments(apts);
      setLoading(false);
    });
  }, []);

  const recentColumns = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Specialty',
      dataIndex: 'specialty',
      key: 'specialty',
      render: (spec) => <Tag color="cyan">{spec}</Tag>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'In-Progress') color = 'processing';
        if (status === 'Scheduled') color = 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Hospital Administration & Analytics"
        subtitle="Real-time clinic operations, provider rosters, and appointment throughput"
        extra={[
          <Button
            key="clinics"
            icon={<ShopOutlined />}
            style={{ borderRadius: 8 }}
            onClick={() => navigate('/admin/clinics')}
          >
            Clinics (4 Branches)
          </Button>,
          <Button
            key="revenue"
            icon={<DollarCircleOutlined />}
            style={{ borderRadius: 8 }}
            onClick={() => navigate('/admin/revenue')}
          >
            Revenue Suite
          </Button>,
          <Button
            key="addDoc"
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            onClick={() => navigate('/admin/doctors')}
          >
            Add Doctor
          </Button>,
        ]}
      />

      {/* KPI Stats */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <div onClick={() => navigate('/admin/doctors')} style={{ cursor: 'pointer' }}>
            <StatCard
              title="Total Registered Doctors"
              value={doctors.length || 5}
              icon={<MedicineBoxOutlined />}
              trend={12}
              iconBg="#f0fdfa"
              iconColor="#0d9488"
            />
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div onClick={() => navigate('/admin/patients')} style={{ cursor: 'pointer' }}>
            <StatCard
              title="Active Patients"
              value={patients.length || 148}
              icon={<TeamOutlined />}
              trend={8.4}
              iconBg="#e0f2fe"
              iconColor="#0284c7"
            />
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div onClick={() => navigate('/admin/appointments')} style={{ cursor: 'pointer' }}>
            <StatCard
              title="Today's Appointments"
              value={appointments.length || 24}
              icon={<CalendarOutlined />}
              trend={15.2}
              iconBg="#fef3c7"
              iconColor="#d97706"
            />
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div onClick={() => navigate('/admin/revenue')} style={{ cursor: 'pointer' }}>
            <StatCard
              title="1-Month Gross Billing"
              value="63,800"
              prefix="$"
              icon={<DollarCircleOutlined />}
              trend={19.5}
              iconBg="#dcfce7"
              iconColor="#16a34a"
            />
          </div>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {/* Recent Appointments */}
        <Col xs={24} lg={16}>
          <Card
            title="Live Consultations & Queue"
            extra={<a onClick={() => navigate('/admin/appointments')}>View all</a>}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
          >
            <Table
              dataSource={appointments.slice(0, 5)}
              columns={recentColumns}
              rowKey="id"
              loading={loading}
              pagination={false}
              scroll={{ x: 650 }}
            />
          </Card>
        </Col>

        {/* Department Capacity */}
        <Col xs={24} lg={8}>
          <Card
            title="Department Capacity"
            style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong>Cardiovascular Care</Text>
                  <Text type="secondary">85% Occupied</Text>
                </div>
                <Progress percent={85} strokeColor="#0d9488" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong>Neurology Wing</Text>
                  <Text type="secondary">62% Occupied</Text>
                </div>
                <Progress percent={62} strokeColor="#0284c7" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong>Pediatrics Clinic</Text>
                  <Text type="secondary">94% Occupied</Text>
                </div>
                <Progress percent={94} strokeColor="#f59e0b" status="active" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong>Orthopedics & Surgery</Text>
                  <Text type="secondary">48% Occupied</Text>
                </div>
                <Progress percent={48} strokeColor="#8b5cf6" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
