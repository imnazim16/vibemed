import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Tag, Space, message, Badge, List } from 'antd';
import {
  SoundOutlined,
  ForwardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { appointmentService } from '../../services/appointmentService';

const { Title, Text, Paragraph } = Typography;

export const Queue = () => {
  const [queue, setQueue] = useState([]);
  const [currentCalling, setCurrentCalling] = useState('A-12');

  const loadData = async () => {
    const data = await appointmentService.getQueue();
    setQueue(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCallNext = () => {
    const nextToken = 'A-' + (Math.floor(Math.random() * 20) + 14);
    setCurrentCalling(nextToken);
    message.success(`Calling Token ${nextToken} to Room 104`);
  };

  const inConsultation = queue.filter((q) => q.status === 'In-Progress');
  const waiting = queue.filter((q) => q.status === 'Scheduled' || q.status === 'Confirmed');

  return (
    <div>
      <PageHeader
        title="Live OPD Token Board & Queue Dispatch"
        subtitle="Real-time lobby display, patient token management, and doctor room routing"
        extra={[
          <Button
            key="callNext"
            type="primary"
            size="large"
            icon={<SoundOutlined />}
            style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            onClick={handleCallNext}
          >
            Call Next Patient (Announcement)
          </Button>,
        ]}
      />

      {/* Main Calling Banner */}
      <Card
        style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg, #0d9488 0%, #0369a1 100%)',
          color: '#ffffff',
          marginBottom: 24,
          boxShadow: '0 10px 25px rgba(13, 148, 136, 0.25)',
        }}
        styles={{ body: { padding: 32 } }}
      >
        <Row align="middle" justify="space-between">
          <Col xs={24} md={14}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, fontSize: 13 }}>
              🔊 NOW CALLING / ACTIVE CONSULTATION
            </Text>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 8 }}>
              <Title level={1} style={{ color: '#ffffff', margin: 0, fontSize: 56, fontWeight: 800 }}>
                Token {currentCalling}
              </Title>
              <Tag color="cyan" style={{ fontSize: 16, padding: '6px 14px', borderRadius: 8 }}>
                Room 104 • Dr. Sarah Connor
              </Tag>
            </div>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: '8px 0 0', fontSize: 15 }}>
              Patient: <strong>Alex Morgan</strong> (Cardiovascular Care)
            </Paragraph>
          </Col>

          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Button
              size="large"
              icon={<ForwardOutlined />}
              onClick={handleCallNext}
              style={{
                backgroundColor: '#ffffff',
                color: '#0d9488',
                fontWeight: 700,
                borderRadius: 10,
                border: 'none',
              }}
            >
              Advance Queue
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Queue Split View */}
      <Row gutter={[20, 20]}>
        {/* In Consultation Rooms */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <Badge status="processing" />
                <span>Currently In Consultation Rooms</span>
              </Space>
            }
            style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
          >
            <List
              dataSource={inConsultation}
              renderItem={(item, index) => (
                <List.Item>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="middle">
                      <Tag color="cyan" style={{ fontSize: 14, fontWeight: 700, padding: '4px 10px' }}>
                        {item.tokenNumber}
                      </Tag>
                      <div>
                        <Text strong>{item.patientName}</Text>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          With {item.doctorName} (Room {101 + index})
                        </div>
                      </div>
                    </Space>
                    <Tag color="processing">Inside Room</Tag>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Waiting in Lobby */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#d97706' }} />
                <span>Waiting in Lobby Queue</span>
              </Space>
            }
            style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}
          >
            <List
              dataSource={waiting}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="middle">
                      <Tag color="orange" style={{ fontSize: 14, fontWeight: 700, padding: '4px 10px' }}>
                        {item.tokenNumber}
                      </Tag>
                      <div>
                        <Text strong>{item.patientName}</Text>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          Scheduled Slot: {item.time} ({item.specialty})
                        </div>
                      </div>
                    </Space>
                    <Button
                      size="small"
                      type="dashed"
                      icon={<ArrowRightOutlined />}
                      onClick={() => message.info(`Token ${item.tokenNumber} notified to prepare`)}
                    >
                      Notify
                    </Button>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Queue;
