import React from 'react';
import { Table, Tag, Button, Space, Badge, Typography, Tooltip } from 'antd';
import {
  VideoCameraOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const AppointmentsTable = ({
  appointments,
  loading,
  onStatusChange,
  showDoctor = true,
  showPatient = true,
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In-Progress':
        return <Badge status="processing" text="In Progress" />;
      case 'Confirmed':
        return <Badge status="success" text="Confirmed" />;
      case 'Scheduled':
        return <Badge status="warning" text="Scheduled" />;
      case 'Completed':
        return <Badge status="default" text="Completed" />;
      case 'Cancelled':
        return <Badge status="error" text="Cancelled" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const columns = [
    {
      title: 'Token / ID',
      dataIndex: 'tokenNumber',
      key: 'tokenNumber',
      width: 100,
      render: (token, record) => (
        <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 4 }}>
          {token || record.id?.slice(-4)}
        </Tag>
      ),
    },
    ...(showPatient
      ? [
          {
            title: 'Patient',
            dataIndex: 'patientName',
            key: 'patientName',
            render: (name, record) => (
              <div>
                <Text strong style={{ display: 'block' }}>
                  {name}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {record.patientPhone}
                </Text>
              </div>
            ),
          },
        ]
      : []),
    ...(showDoctor
      ? [
          {
            title: 'Doctor & Department',
            dataIndex: 'doctorName',
            key: 'doctorName',
            render: (name, record) => (
              <div>
                <Text strong style={{ display: 'block' }}>
                  {name}
                </Text>
                <Tag color="geekblue" style={{ fontSize: 11, borderRadius: 4 }}>
                  {record.specialty}
                </Tag>
              </div>
            ),
          },
        ]
      : []),
    {
      title: 'Date & Slot',
      key: 'schedule',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CalendarOutlined style={{ color: '#0d9488', fontSize: 12 }} />
            <span>{record.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
            <ClockCircleOutlined style={{ fontSize: 11 }} />
            <span>{record.time}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Mode',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type.includes('Video') ? 'purple' : 'blue'}>
          {type.includes('Video') ? <VideoCameraOutlined /> : <UserOutlined />} {type}
        </Tag>
      ),
    },
    {
      title: 'Symptoms / Notes',
      dataIndex: 'symptoms',
      key: 'symptoms',
      ellipsis: true,
      render: (symptoms) => symptoms || 'Routine consultation',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusBadge(status),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.type.includes('Video') && record.status !== 'Completed' && (
            <Button
              type="primary"
              size="small"
              icon={<VideoCameraOutlined />}
              onClick={() => navigate('/doctor/consultation')}
              style={{ backgroundColor: '#0d9488', borderRadius: 6 }}
            >
              Consult
            </Button>
          )}

          {onStatusChange && record.status === 'Scheduled' && (
            <Tooltip title="Mark Confirmed">
              <Button
                size="small"
                icon={<CheckCircleOutlined style={{ color: '#10b981' }} />}
                onClick={() => onStatusChange(record.id, 'Confirmed')}
              />
            </Tooltip>
          )}

          {onStatusChange && record.status !== 'Completed' && record.status !== 'Cancelled' && (
            <Tooltip title="Cancel">
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => onStatusChange(record.id, 'Cancelled')}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={appointments}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 6 }}
      scroll={{ x: 750 }}
      style={{ borderRadius: 12 }}
    />
  );
};
