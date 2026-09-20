import React from 'react';
import { Modal, Descriptions, Tag, Row, Col, Card, Typography, List, Divider } from 'antd';
import { HeartOutlined, MedicineBoxOutlined, HistoryOutlined, AlertOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const PatientDetailsModal = ({ open, onCancel, patient }) => {
  if (!patient) return null;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MedicineBoxOutlined style={{ color: '#0d9488' }} />
          <span>Electronic Health Record (EHR) — {patient.name}</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width="100%"
      style={{ maxWidth: 750 }}
    >
      <div style={{ padding: '8px 0' }}>
        <Descriptions bordered size="small" column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}>
          <Descriptions.Item label="Patient ID">{patient.id}</Descriptions.Item>
          <Descriptions.Item label="Age / Gender">{patient.age} yrs • {patient.gender}</Descriptions.Item>
          <Descriptions.Item label="Blood Group">
            <Tag color="red">{patient.bloodGroup}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">{patient.phone}</Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>{patient.email}</Descriptions.Item>
          <Descriptions.Item label="Address" span={3}>{patient.address}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="green">{patient.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Primary Diagnosis" span={2}>
            <strong>{patient.condition}</strong>
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left" style={{ margin: '16px 0 12px' }}>
          <HeartOutlined style={{ color: '#ef4444', marginRight: 6 }} />
          Latest Vital Signs
        </Divider>

        <Row gutter={[12, 12]}>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center', background: '#f0fdfa' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Blood Pressure</Text>
              <Title level={4} style={{ margin: '4px 0 0', color: '#0d9488' }}>
                {patient.vitals?.bloodPressure || '120/80'}
              </Title>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center', background: '#fef2f2' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Heart Rate</Text>
              <Title level={4} style={{ margin: '4px 0 0', color: '#ef4444' }}>
                {patient.vitals?.heartRate || '72 bpm'}
              </Title>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center', background: '#f0f9ff' }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Blood Oxygen (SpO2)</Text>
              <Title level={4} style={{ margin: '4px 0 0', color: '#0284c7' }}>
                {patient.vitals?.spo2 || '99%'}
              </Title>
            </Card>
          </Col>
        </Row>

        <Divider orientation="left" style={{ margin: '16px 0 12px' }}>
          <AlertOutlined style={{ color: '#f59e0b', marginRight: 6 }} />
          Known Allergies
        </Divider>
        <div>
          {patient.allergies?.length ? (
            patient.allergies.map((alg) => (
              <Tag color="error" key={alg} style={{ marginRight: 6 }}>
                {alg}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No known drug allergies reported.</Text>
          )}
        </div>

        <Divider orientation="left" style={{ margin: '16px 0 12px' }}>
          <MedicineBoxOutlined style={{ color: '#0d9488', marginRight: 6 }} />
          Active Prescriptions
        </Divider>
        <List
          size="small"
          bordered
          dataSource={patient.prescriptions || []}
          renderItem={(item) => (
            <List.Item>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>{item.medicine}</Text>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    {item.dosage} • Prescribed by {item.doctor} ({item.date})
                  </div>
                </div>
                <Tag color="cyan">{item.status || 'Active'}</Tag>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};
