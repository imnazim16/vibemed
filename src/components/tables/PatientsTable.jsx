import React from 'react';
import { Table, Tag, Button, Space, Avatar, Typography } from 'antd';
import { UserOutlined, EyeOutlined, CalendarOutlined, HeartOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const PatientsTable = ({ patients, loading, onViewDetails, onBookAppointment }) => {
  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Space>
          <Avatar
            style={{ backgroundColor: '#0d9488' }}
            icon={<UserOutlined />}
          />
          <div>
            <Text strong style={{ display: 'block' }}>
              {record.name}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.age} yrs • {record.gender} • Blood: {record.bloodGroup}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div>{record.phone}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.email}
          </Text>
        </div>
      ),
    },
    {
      title: 'Primary Diagnosis / Condition',
      dataIndex: 'condition',
      key: 'condition',
      render: (cond) => <Tag color="orange">{cond || 'General Checkup'}</Tag>,
    },
    {
      title: 'Key Vitals',
      key: 'vitals',
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>
            <HeartOutlined style={{ color: '#ef4444', marginRight: 4 }} />
            <span>BP: <strong>{record.vitals?.bloodPressure}</strong></span>
          </div>
          <div style={{ color: '#64748b' }}>
            HR: {record.vitals?.heartRate} • SpO2: {record.vitals?.spo2}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'Monitoring') color = 'gold';
        if (status === 'Under Treatment') color = 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      render: (date) => (
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {date || 'First Visit'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails && onViewDetails(record)}
          >
            EHR
          </Button>

          {onBookAppointment && (
            <Button
              size="small"
              type="primary"
              icon={<CalendarOutlined />}
              style={{ backgroundColor: '#0d9488', borderRadius: 6 }}
              onClick={() => onBookAppointment(record)}
            >
              Book
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={patients}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 6 }}
      style={{ borderRadius: 12 }}
    />
  );
};
