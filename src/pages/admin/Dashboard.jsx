import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Table, Tag, Space, Button, Progress, Avatar, Spin, Alert } from 'antd';
import {
  MedicineBoxOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  PlusOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

// Helper to safely format string values from backend
const safeStr = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val.name || val.title || val.label || fallback;
  return String(val);
};

export const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientNotice, setPatientNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [docsRes, patsRes, aptsRes] = await Promise.allSettled([
          doctorService.getAll(),
          patientService.getAll(),
          appointmentService.getAll(),
        ]);

        if (isMounted) {
          const docs = docsRes.status === 'fulfilled' && Array.isArray(docsRes.value) ? docsRes.value : [];
          const pats = patsRes.status === 'fulfilled' && Array.isArray(patsRes.value) ? patsRes.value : [];
          const apts = aptsRes.status === 'fulfilled' && Array.isArray(aptsRes.value) ? aptsRes.value : [];

          setDoctors(docs);
          setPatients(pats);
          setAppointments(apts);

          // Check patient service status safely
          try {
            const patStatus = patientService.getApiStatus();
            if (patStatus.hasError) {
              setPatientNotice({
                title: 'Patients API Offline Notice',
                message: 'Live patient API is currently unreachable. Local profiles are active, and Doctors, Clinics, and Appointments are operating normally.',
                type: 'warning',
              });
            } else if (patStatus.empty) {
              setPatientNotice({
                title: 'No Patient Records Found',
                message: 'The remote server has zero registered patients. You can register new patients; Doctors, Clinics, and Appointments are operating normally.',
                type: 'info',
              });
            } else {
              setPatientNotice(null);
            }
          } catch {
            setPatientNotice(null);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const recentColumns = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text) => <Text strong>{safeStr(text, 'Patient')}</Text>,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (text) => safeStr(text, 'Staff Doctor'),
    },
    {
      title: 'Specialty',
      dataIndex: 'specialty',
      key: 'specialty',
      render: (spec) => <Tag color="cyan">{safeStr(spec, 'General')}</Tag>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => safeStr(type, 'In-Clinic Checkup'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const s = safeStr(status, 'Scheduled');
        let color = 'green';
        if (s === 'In-Progress') color = 'processing';
        if (s === 'Scheduled') color = 'warning';
        return <Tag color={color}>{s}</Tag>;
      },
    },
  ];

  const recentAppointments = Array.isArray(appointments) ? appointments.slice(0, 5) : [];

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

      {/* Patient API Notice Banner if API not working or empty */}
      {patientNotice && (
        <Alert
          message={patientNotice.title}
          description={patientNotice.message}
          type={patientNotice.type}
          showIcon
          closable
          style={{
            marginBottom: 20,
            borderRadius: 12,
            border: patientNotice.type === 'warning' ? '1px solid #fed7aa' : '1px solid #bae6fd',
          }}
        />
      )}

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
              value={patients.length || 0}
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
            extra={<a onClick={() => navigate('/admin/appointments')} style={{ color: '#0d9488', fontWeight: 600, cursor: 'pointer' }}>View all</a>}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
          >
            {/* Desktop Table View */}
            <div className="vibemed-desktop-table">
              <Table
                dataSource={recentAppointments}
                columns={recentColumns}
                rowKey={(record, index) => record?.id ? String(record.id) : `apt_${index}`}
                loading={loading}
                pagination={false}
                scroll={{ x: 650 }}
              />
            </div>

            {/* Mobile Card View */}
            <div className="vibemed-mobile-cards">
              {recentAppointments.map((app, index) => {
                const patName = safeStr(app?.patientName, 'Patient');
                const docName = safeStr(app?.doctorName, 'Doctor');
                const spec = safeStr(app?.specialty, 'General');
                const timeSlot = safeStr(app?.time, '10:00 AM');
                const aptType = safeStr(app?.type, 'In-Clinic Checkup');
                const aptStatus = safeStr(app?.status, 'Scheduled');

                return (
                  <div
                    key={app?.id ? String(app.id) : `card_${index}`}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      padding: '12px 14px',
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: 14, color: '#0f172a' }}>{patName}</strong>
                      <Tag
                        color={
                          aptStatus === 'In-Progress'
                            ? 'processing'
                            : aptStatus === 'Scheduled'
                            ? 'warning'
                            : 'green'
                        }
                        style={{ margin: 0 }}
                      >
                        {aptStatus}
                      </Tag>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                      Doctor: <strong style={{ color: '#334155' }}>{docName}</strong> ({spec})
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#64748b' }}>
                      <span>Slot: <strong>{timeSlot}</strong></span>
                      <Tag color={aptType.includes('Video') ? 'purple' : 'blue'} style={{ margin: 0, fontSize: 11 }}>
                        {aptType}
                      </Tag>
                    </div>
                  </div>
                );
              })}
            </div>
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
