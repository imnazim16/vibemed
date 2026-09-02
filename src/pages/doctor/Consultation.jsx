import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Space, Tag, Avatar, Tabs, Input, message, Divider } from 'antd';
import {
  VideoCameraOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  PhoneOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { PrescriptionForm } from '../../components/forms/PrescriptionForm';
import { patientService } from '../../services/patientService';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const Consultation = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState(
    'Patient reports mild exercise-induced palpitations over the past 2 weeks. Blood pressure measured at 128/84. Advised 30 mins daily walking and hydration.'
  );

  useEffect(() => {
    patientService.getById('pat_1').then(setPatient);
  }, []);

  const handleSaveNotes = () => {
    message.success('Clinical consultation notes saved to EHR!');
  };

  return (
    <div>
      <PageHeader
        title="Live Telehealth & Clinical Consultation Room"
        subtitle="End-to-end encrypted HD video consultation and EHR documentation suite"
        extra={[
          <Tag color="green" key="status" style={{ padding: '4px 12px', fontSize: 13, borderRadius: 6 }}>
            ● Encrypted Session Live
          </Tag>,
        ]}
      />

      <Row gutter={[20, 20]}>
        {/* Left Column: Video Room */}
        <Col xs={24} lg={14}>
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              background: '#0f172a',
            }}
            styles={{ body: { padding: 0 } }}
          >
            {/* Main Video Stream Simulator */}
            <div
              style={{
                minHeight: 260,
                height: 'clamp(260px, 42vw, 380px)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                padding: 16,
              }}
            >
              {!isVideoOff ? (
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <Avatar
                    size={80}
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
                    style={{ border: '3px solid #0d9488', marginBottom: 12 }}
                  />
                  <Title level={4} style={{ color: '#fff', margin: 0, fontSize: 'clamp(16px, 3.5vw, 20px)' }}>
                    Alex Morgan (Patient)
                  </Title>
                  <Tag color="cyan" style={{ marginTop: 6 }}>
                    HD Audio/Video Connected
                  </Tag>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <VideoCameraOutlined style={{ fontSize: 44, marginBottom: 8 }} />
                  <div>Video is currently muted</div>
                </div>
              )}

              {/* Doctor Pip preview */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 14,
                  right: 14,
                  width: 'clamp(90px, 20vw, 130px)',
                  height: 'clamp(65px, 14vw, 90px)',
                  background: '#334155',
                  borderRadius: 10,
                  border: '2px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              >
                <Avatar size={30} src={user?.avatar} />
                <span style={{ fontSize: 9, marginTop: 2 }}>Dr. Sarah (You)</span>
              </div>
            </div>

            {/* Video Call Controls Bar */}
            <div
              style={{
                padding: '14px 16px',
                background: '#1e293b',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <Button
                shape="circle"
                size="large"
                type={isMuted ? 'primary' : 'default'}
                danger={isMuted}
                icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
                onClick={() => {
                  setIsMuted(!isMuted);
                  message.info(isMuted ? 'Microphone unmuted' : 'Microphone muted');
                }}
              />

              <Button
                shape="circle"
                size="large"
                type={isVideoOff ? 'primary' : 'default'}
                danger={isVideoOff}
                icon={<VideoCameraOutlined />}
                onClick={() => {
                  setIsVideoOff(!isVideoOff);
                  message.info(isVideoOff ? 'Camera turned on' : 'Camera turned off');
                }}
              />

              <Button
                type="primary"
                danger
                size="large"
                shape="round"
                icon={<PhoneOutlined rotate={225} />}
                onClick={() => message.warning('Consultation ended. Record saved.')}
                style={{ padding: '0 20px' }}
              >
                End Consultation
              </Button>
            </div>
          </Card>

          {/* Real-time Patient Telemetry Card */}
          <Card
            title={
              <Space>
                <HeartOutlined style={{ color: '#ef4444' }} />
                <span>Live Vitals Stream (Alex Morgan)</span>
              </Space>
            }
            style={{ marginTop: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}
          >
            <Row gutter={[12, 12]}>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: 'center', padding: 10, background: '#f0fdfa', borderRadius: 10 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Blood Pressure</Text>
                  <Title level={4} style={{ margin: '4px 0 0', color: '#0d9488' }}>
                    128/84
                  </Title>
                  <Text style={{ fontSize: 10, color: '#64748b' }}>mmHg</Text>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: 'center', padding: 10, background: '#fef2f2', borderRadius: 10 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Heart Rate</Text>
                  <Title level={4} style={{ margin: '4px 0 0', color: '#ef4444' }}>
                    72
                  </Title>
                  <Text style={{ fontSize: 10, color: '#64748b' }}>bpm</Text>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: 'center', padding: 10, background: '#f0f9ff', borderRadius: 10 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Blood Oxygen</Text>
                  <Title level={4} style={{ margin: '4px 0 0', color: '#0284c7' }}>
                    99%
                  </Title>
                  <Text style={{ fontSize: 10, color: '#64748b' }}>SpO2</Text>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: 'center', padding: 10, background: '#fefce8', borderRadius: 10 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Blood Glucose</Text>
                  <Title level={4} style={{ margin: '4px 0 0', color: '#ca8a04' }}>
                    95
                  </Title>
                  <Text style={{ fontSize: 10, color: '#64748b' }}>mg/dL</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right Column: Clinical Notes & e-Prescription */}
        <Col xs={24} lg={10}>
          <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0', height: '100%' }}>
            <Tabs
              defaultActiveKey="prescription"
              items={[
                {
                  key: 'prescription',
                  label: (
                    <span>
                      <MedicineBoxOutlined /> Issue e-Prescription
                    </span>
                  ),
                  children: (
                    <div style={{ paddingTop: 8 }}>
                      <PrescriptionForm
                        patientId="pat_1"
                        doctorName={user?.name || 'Dr. Sarah Connor'}
                        onSuccess={() => {
                          patientService.getById('pat_1').then(setPatient);
                        }}
                      />
                    </div>
                  ),
                },
                {
                  key: 'notes',
                  label: (
                    <span>
                      <FileTextOutlined /> Clinical Notes
                    </span>
                  ),
                  children: (
                    <div style={{ paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        Document physical exam findings, diagnoses, and follow-up guidance:
                      </Text>
                      <TextArea
                        rows={10}
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        placeholder="Write clinical observations..."
                      />
                      <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={handleSaveNotes}
                        style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
                      >
                        Save Notes to Health Record
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Consultation;
