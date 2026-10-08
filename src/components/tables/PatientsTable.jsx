import React, { useState } from 'react';
import { Table, Tag, Button, Space, Avatar, Typography, Card, Pagination, Empty, Spin } from 'antd';
import {
  UserOutlined,
  EyeOutlined,
  CalendarOutlined,
  HeartOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export const PatientsTable = ({ patients = [], loading, onViewDetails, onBookAppointment }) => {
  const [mobilePage, setMobilePage] = useState(1);
  const pageSize = 5;

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Space>
          <Avatar
            style={{ backgroundColor: '#0d9488' }}
            icon={<UserOutlined />}
          >
            {record.name?.charAt(0)}
          </Avatar>
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

  // Mobile Paginated Slice
  const mobileStart = (mobilePage - 1) * pageSize;
  const mobilePatients = patients.slice(mobileStart, mobileStart + pageSize);

  return (
    <div className="vibemed-table-container">
      {/* Desktop Table View */}
      <div className="vibemed-desktop-table">
        <Table
          columns={columns}
          dataSource={patients}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 800 }}
          style={{ borderRadius: 12 }}
          locale={{
            emptyText: (
              <Empty
                description="No patient records found on server. You can register a new patient; Doctors, Clinics, and Appointments are fully active."
                style={{ padding: '24px 0' }}
              />
            ),
          }}
        />
      </div>

      {/* Mobile Card List View */}
      <div className="vibemed-mobile-cards">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <Spin size="large" />
          </div>
        ) : patients.length === 0 ? (
          <Empty
            description="No patient records found on server. You can register a new patient; Doctors, Clinics, and Appointments are fully active."
            style={{ padding: '24px 0' }}
          />
        ) : (
          <div>
            {mobilePatients.map((record) => (
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
                {/* Header: Avatar, Name & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar
                      size={40}
                      style={{ backgroundColor: '#0d9488', flexShrink: 0 }}
                      icon={<UserOutlined />}
                    >
                      {record.name?.charAt(0)}
                    </Avatar>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                        {record.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        {record.age} yrs • {record.gender} • Blood: <strong style={{ color: '#ef4444' }}>{record.bloodGroup}</strong>
                      </div>
                    </div>
                  </div>
                  <Tag
                    color={
                      record.status === 'Monitoring'
                        ? 'gold'
                        : record.status === 'Under Treatment'
                        ? 'blue'
                        : 'green'
                    }
                    style={{ margin: 0, borderRadius: 4 }}
                  >
                    {record.status}
                  </Tag>
                </div>

                {/* Contact Strip */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    fontSize: 12,
                    background: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                    <PhoneOutlined style={{ color: '#0d9488', fontSize: 11 }} />
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{record.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                    <MailOutlined style={{ color: '#0d9488', fontSize: 11 }} />
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{record.email}</span>
                  </div>
                </div>

                {/* Diagnosis & Last Visit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 12 }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Diagnosis: </span>
                    <Tag color="orange" style={{ margin: 0 }}>
                      {record.condition || 'General Checkup'}
                    </Tag>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    Last Visit: <strong>{record.lastVisit || 'First Visit'}</strong>
                  </div>
                </div>

                {/* Vitals Summary Strip */}
                {record.vitals && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      background: '#f0fdfa',
                      border: '1px solid #ccfbf1',
                      borderRadius: 8,
                      padding: '6px 8px',
                      marginBottom: 12,
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <HeartOutlined style={{ color: '#ef4444', marginRight: 4 }} />
                      <span>BP: <strong>{record.vitals.bloodPressure}</strong></span>
                    </div>
                    <div>HR: <strong>{record.vitals.heartRate}</strong></div>
                    <div>SpO2: <strong>{record.vitals.spo2}</strong></div>
                  </div>
                )}

                {/* Mobile Action Buttons */}
                <div className="vibemed-card-actions-row">
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => onViewDetails && onViewDetails(record)}
                    style={{ borderRadius: 8, flex: 1, minHeight: 36 }}
                  >
                    View EHR
                  </Button>

                  {onBookAppointment && (
                    <Button
                      type="primary"
                      icon={<CalendarOutlined />}
                      onClick={() => onBookAppointment(record)}
                      style={{ backgroundColor: '#0d9488', borderRadius: 8, flex: 1, minHeight: 36 }}
                    >
                      Book Appt
                    </Button>
                  )}
                </div>
              </Card>
            ))}

            {/* Mobile Pagination */}
            {patients.length > pageSize && (
              <div style={{ textAlign: 'center', marginTop: 12, marginBottom: 8 }}>
                <Pagination
                  size="small"
                  current={mobilePage}
                  pageSize={pageSize}
                  total={patients.length}
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

export default PatientsTable;
