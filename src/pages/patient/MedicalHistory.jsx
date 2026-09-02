import React, { useState, useEffect } from 'react';
import { Card, Tabs, List, Tag, Typography, Descriptions, Row, Col, Button, message } from 'antd';
import {
  FilePdfOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  CalendarOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { patientService } from '../../services/patientService';

const { Title, Text, Paragraph } = Typography;

export const MedicalHistory = () => {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    patientService.getById('pat_1').then(setPatient);
  }, []);

  return (
    <div>
      <PageHeader
        title="My Medical Records & Electronic Health File"
        subtitle="Complete timeline of clinical consultations, diagnoses, vital histories, and digital prescriptions"
        extra={[
          <Button
            key="export"
            icon={<FilePdfOutlined />}
            onClick={() => message.success('Health summary report downloaded as PDF')}
          >
            Export Health Summary (PDF)
          </Button>,
        ]}
      />

      {/* Patient Profile Card */}
      <Card style={{ marginBottom: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Descriptions title="Personal Health Profile" bordered size="small">
          <Descriptions.Item label="Full Name">{patient?.name}</Descriptions.Item>
          <Descriptions.Item label="Age / Gender">{patient?.age} yrs • {patient?.gender}</Descriptions.Item>
          <Descriptions.Item label="Blood Type">
            <Tag color="red">{patient?.bloodGroup}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Allergies" span={2}>
            {patient?.allergies?.map((a) => (
              <Tag color="error" key={a}>{a}</Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="Primary Condition">
            <Tag color="orange">{patient?.condition}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Tabs
          defaultActiveKey="prescriptions"
          items={[
            {
              key: 'prescriptions',
              label: (
                <span>
                  <MedicineBoxOutlined /> e-Prescriptions
                </span>
              ),
              children: (
                <List
                  itemLayout="horizontal"
                  dataSource={patient?.prescriptions || []}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button
                          size="small"
                          icon={<FilePdfOutlined />}
                          onClick={() => message.info(`Downloading Rx for ${item.medicine}`)}
                        >
                          Rx PDF
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<MedicineBoxOutlined style={{ fontSize: 28, color: '#0d9488' }} />}
                        title={<Text strong>{item.medicine}</Text>}
                        description={
                          <div>
                            <div>Dosage: {item.dosage}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>
                              Prescribed by {item.doctor} on {item.date}
                            </div>
                          </div>
                        }
                      />
                      <Tag color="green">{item.status}</Tag>
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'history',
              label: (
                <span>
                  <HistoryOutlined /> Consultation History
                </span>
              ),
              children: (
                <List
                  itemLayout="vertical"
                  dataSource={patient?.history || []}
                  renderItem={(item) => (
                    <List.Item>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={5} style={{ margin: 0 }}>
                          {item.diagnosis}
                        </Title>
                        <Tag color="blue">{item.date}</Tag>
                      </div>
                      <div style={{ color: '#0d9488', fontSize: 13, marginTop: 4 }}>
                        Attending: {item.doctor}
                      </div>
                      <Paragraph style={{ margin: '8px 0 0', color: '#475569' }}>
                        {item.notes}
                      </Paragraph>
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'vitals',
              label: (
                <span>
                  <HeartOutlined /> Vital Logs
                </span>
              ),
              children: (
                <Row gutter={[16, 16]} style={{ paddingTop: 8 }}>
                  <Col span={8}>
                    <Card size="small" style={{ background: '#f0fdfa', borderRadius: 10 }}>
                      <Text type="secondary">Blood Pressure</Text>
                      <Title level={4} style={{ margin: '4px 0 0', color: '#0d9488' }}>
                        {patient?.vitals?.bloodPressure}
                      </Title>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" style={{ background: '#fef2f2', borderRadius: 10 }}>
                      <Text type="secondary">Heart Rate</Text>
                      <Title level={4} style={{ margin: '4px 0 0', color: '#ef4444' }}>
                        {patient?.vitals?.heartRate}
                      </Title>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" style={{ background: '#f0f9ff', borderRadius: 10 }}>
                      <Text type="secondary">Blood Glucose</Text>
                      <Title level={4} style={{ margin: '4px 0 0', color: '#0284c7' }}>
                        {patient?.vitals?.glucose}
                      </Title>
                    </Card>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default MedicalHistory;
