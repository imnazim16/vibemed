import React, { useState } from 'react';
import { Table, Tag, Button, Space, Badge, Typography, Tooltip, Card, Pagination, Empty, Spin } from 'antd';
import {
  VideoCameraOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const AppointmentsTable = ({
  appointments = [],
  loading,
  onStatusChange,
  showDoctor = true,
  showPatient = true,
}) => {
  const navigate = useNavigate();
  const [mobilePage, setMobilePage] = useState(1);
  const pageSize = 5;

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

  // Mobile Paginated Slice
  const mobileStart = (mobilePage - 1) * pageSize;
  const mobileAppointments = appointments.slice(mobileStart, mobileStart + pageSize);

  return (
    <div className="vibemed-table-container">
      {/* Desktop Table View */}
      <div className="vibemed-desktop-table">
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 750 }}
          style={{ borderRadius: 12 }}
        />
      </div>

      {/* Mobile Card List View */}
      <div className="vibemed-mobile-cards">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <Spin size="large" />
          </div>
        ) : appointments.length === 0 ? (
          <Empty description="No appointments found" style={{ padding: '24px 0' }} />
        ) : (
          <div>
            {mobileAppointments.map((record) => (
              <Card
                key={record.id}
                className="vibemed-mobile-item-card"
                style={{
                  borderRadius: 14,
                  marginBottom: 12,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                }}
                styles={{ body: { padding: '14px 16px' } }}
              >
                {/* Header: Token, Mode & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 4, margin: 0 }}>
                      {record.tokenNumber || record.id?.slice(-4)}
                    </Tag>
                    <Tag
                      color={record.type?.includes('Video') ? 'purple' : 'blue'}
                      style={{ margin: 0, fontSize: 11 }}
                    >
                      {record.type?.includes('Video') ? <VideoCameraOutlined /> : <UserOutlined />} {record.type}
                    </Tag>
                  </div>
                  <div>{getStatusBadge(record.status)}</div>
                </div>

                {/* Patient / Doctor Details */}
                <div style={{ marginBottom: 10 }}>
                  {showPatient && (
                    <div style={{ marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                        {record.patientName}
                      </div>
                      {record.patientPhone && (
                        <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <PhoneOutlined style={{ fontSize: 11, color: '#0d9488' }} />
                          <span>{record.patientPhone}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {showDoctor && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <MedicineBoxOutlined style={{ color: '#0d9488' }} />
                      <span style={{ fontWeight: 600 }}>{record.doctorName}</span>
                      <Tag color="geekblue" style={{ fontSize: 10, margin: 0 }}>
                        {record.specialty}
                      </Tag>
                    </div>
                  )}
                </div>

                {/* Date & Time Slot Strip */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: 8,
                    marginBottom: 10,
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarOutlined style={{ color: '#0d9488' }} />
                    <strong style={{ color: '#334155' }}>{record.date}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
                    <ClockCircleOutlined style={{ color: '#0d9488' }} />
                    <span>{record.time}</span>
                  </div>
                </div>

                {/* Symptoms / Notes */}
                {record.symptoms && (
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                    <strong>Note:</strong> {record.symptoms}
                  </div>
                )}

                {/* Mobile Touch Action Buttons */}
                <div className="vibemed-card-actions-row">
                  {record.type?.includes('Video') && record.status !== 'Completed' && (
                    <Button
                      type="primary"
                      icon={<VideoCameraOutlined />}
                      onClick={() => navigate('/doctor/consultation')}
                      style={{ backgroundColor: '#0d9488', borderRadius: 8, flex: 1, minHeight: 36 }}
                    >
                      Start Telehealth
                    </Button>
                  )}

                  {onStatusChange && record.status === 'Scheduled' && (
                    <Button
                      type="default"
                      icon={<CheckCircleOutlined style={{ color: '#10b981' }} />}
                      onClick={() => onStatusChange(record.id, 'Confirmed')}
                      style={{ borderRadius: 8, flex: 1, minHeight: 36 }}
                    >
                      Confirm
                    </Button>
                  )}

                  {onStatusChange && record.status !== 'Completed' && record.status !== 'Cancelled' && (
                    <Button
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => onStatusChange(record.id, 'Cancelled')}
                      style={{ borderRadius: 8, flex: 1, minHeight: 36 }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            ))}

            {/* Mobile Pagination */}
            {appointments.length > pageSize && (
              <div style={{ textAlign: 'center', marginTop: 12, marginBottom: 8 }}>
                <Pagination
                  size="small"
                  current={mobilePage}
                  pageSize={pageSize}
                  total={appointments.length}
                  onChange={(p) => setMobilePage(p)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsTable;
