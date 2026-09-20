import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Space, Table, Tag } from 'antd';
import {
  TeamOutlined,
  CalendarOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { appointmentService } from '../../services/appointmentService';
import { patientService } from '../../services/patientService';
import { BookAppointmentModal } from '../../components/modals/BookAppointmentModal';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const ReceptionistDashboard = () => {
  const [queue, setQueue] = useState([]);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    const data = await appointmentService.getQueue();
    setQueue(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const queueColumns = [
    {
      title: 'Token #',
      dataIndex: 'tokenNumber',
      key: 'tokenNumber',
      render: (tok) => <Tag color="cyan" style={{ fontWeight: 700 }}>{tok}</Tag>,
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Slot',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (p) => <Tag color={p === 'High' ? 'red' : 'blue'}>{p}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st) => <Tag color={st === 'In-Progress' ? 'processing' : 'default'}>{st}</Tag>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reception & OPD Front Desk Dashboard"
        subtitle="Manage daily walk-ins, patient check-ins, triage queues, and doctor scheduling"
        extra={[
          <Button
            key="walkin"
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            onClick={() => setIsBookModalOpen(true)}
          >
            Walk-in Check-in
          </Button>,
          <Button
            key="queue"
            icon={<UnorderedListOutlined />}
            onClick={() => navigate('/receptionist/queue')}
          >
            Open Live Queue Board
          </Button>,
        ]}
      />

      {/* KPI Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Today's Checked-in Patients"
            value={queue.length || 18}
            icon={<TeamOutlined />}
            trend={10}
            iconBg="#f0fdfa"
            iconColor="#0d9488"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="In Consultation Now"
            value={queue.filter((q) => q.status === 'In-Progress').length || 2}
            icon={<ClockCircleOutlined />}
            iconBg="#e0f2fe"
            iconColor="#0284c7"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Waiting in Lobby"
            value={queue.filter((q) => q.status === 'Scheduled' || q.status === 'Confirmed').length || 4}
            icon={<UnorderedListOutlined />}
            iconBg="#fef3c7"
            iconColor="#d97706"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Doctors on Active Duty"
            value={5}
            icon={<CheckCircleOutlined />}
            iconBg="#dcfce7"
            iconColor="#16a34a"
          />
        </Col>
      </Row>

      {/* Active OPD Queue Table */}
      <Card
        title="Live OPD Token Dispatch & Queue"
        extra={<a onClick={() => navigate('/receptionist/queue')}>Full Screen View</a>}
        style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
      >
        <Table
          dataSource={queue}
          columns={queueColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 650 }}
        />
      </Card>

      <BookAppointmentModal
        open={isBookModalOpen}
        onCancel={() => setIsBookModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default ReceptionistDashboard;
