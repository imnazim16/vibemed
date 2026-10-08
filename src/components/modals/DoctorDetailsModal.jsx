import React from 'react';
import {
  Modal,
  Avatar,
  Typography,
  Tag,
  Rate,
  Space,
  Divider,
  Descriptions,
  Button,
  Popconfirm,
  Table,
} from 'antd';
import {
  MedicineBoxOutlined,
  CalendarOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const DoctorDetailsModal = ({ open, onCancel, doctor, onBook, onDelete }) => {
  if (!doctor) return null;

  const stats = doctor.monthlyStats || {};
  const clinicsBreakdown = stats.clinicsBreakdown || [];

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width="100%"
      style={{ maxWidth: 740 }}
      footer={[
        onDelete && (
          <Popconfirm
            key="delete"
            title="Delete Doctor Profile"
            description={`Are you sure you want to delete ${doctor.name}? This cannot be undone.`}
            onConfirm={() => {
              onCancel();
              onDelete(doctor);
            }}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} style={{ float: 'left' }}>
              Delete Doctor
            </Button>
          </Popconfirm>
        ),
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
        onBook && (
          <Button
            key="book"
            type="primary"
            icon={<CalendarOutlined />}
            style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
            onClick={() => {
              onCancel();
              onBook(doctor);
            }}
          >
            Book Consultation (${doctor.fee})
          </Button>
        ),
      ].filter(Boolean)}
    >
      <div style={{ textAlign: 'center', paddingTop: 16 }}>
        <Avatar
          size={84}
          src={doctor.avatar}
          style={{ border: '3px solid #0d9488', marginBottom: 12 }}
        />
        <Title level={4} style={{ margin: 0 }}>
          {doctor.name}
        </Title>
        <Text type="secondary">{doctor.title}</Text>

        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <Rate disabled defaultValue={doctor.rating} allowHalf style={{ fontSize: 14 }} />
          <Text strong style={{ fontSize: 13 }}>
            {doctor.rating} ({doctor.reviewsCount} reviews)
          </Text>
        </div>
      </div>

      <Divider style={{ margin: '16px 0 12px' }} />

      {/* Monthly Financial Performance Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
          border: '1.5px solid #ccfbf1',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <DollarOutlined style={{ color: '#0d9488', fontSize: 16 }} />
            <strong style={{ color: '#0f766e', fontSize: 14 }}>
              Monthly Billing & Sitting Charges ({stats.month || 'Current Month'})
            </strong>
          </div>
          <Tag color="cyan">
            <TeamOutlined style={{ marginRight: 4 }} />
            {stats.totalPatientsTreated || 0} Patients Seen
          </Tag>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center' }}>
          <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Gross Patient Billing</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0d9488' }}>
              ${(stats.grossBilled || 0).toLocaleString()}
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Clinic Sitting Fees</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#dc2626' }}>
              -${(stats.totalSittingCharges || 0).toLocaleString()}
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Net Doctor Payout</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0369a1' }}>
              ${(stats.netDoctorPayout || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Per-Clinic Breakdown List */}
        {clinicsBreakdown.length > 0 && (
          <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px dashed #cbd5e1' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              Billing Breakdown by Clinic Location:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {clinicsBreakdown.map((cb) => (
                <div
                  key={cb.clinicId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    background: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: 6,
                  }}
                >
                  <span>
                    <ShopOutlined style={{ marginRight: 4, color: '#0d9488' }} />
                    <strong>{cb.clinicName}</strong> ({cb.daysWorked || 0} days):
                  </span>
                  <span>
                    {cb.patientsTreated || 0} patients • Billed: <strong>${(Number(cb.amountBilled) || 0).toLocaleString()}</strong> •
                    Sitting Fee: <span style={{ color: '#dc2626' }}>-${(Number(cb.totalSittingFee) || 0).toLocaleString()} {cb.sittingFeePerDay ? `($${cb.sittingFeePerDay}/d)` : ''}</span> •
                    Net: <strong style={{ color: '#0d9488' }}>${(Number(cb.netPayout) || 0).toLocaleString()}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Descriptions size="small" column={1} bordered>
        <Descriptions.Item label="Medical Specialty">
          <Tag color="geekblue">{doctor.specialty}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Clinical Department">{doctor.department}</Descriptions.Item>
        <Descriptions.Item label="Experience">{doctor.experience}</Descriptions.Item>
        <Descriptions.Item label="Consultation Fee">
          <strong style={{ color: '#0d9488', fontSize: 15 }}>${doctor.fee} / consultation</strong>
        </Descriptions.Item>

        {/* Multi-Clinic Shift Timetable */}
        <Descriptions.Item label="Multi-Clinic Weekly Timetable">
          {doctor.weekdaySchedule ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 0' }}>
              {Object.entries(doctor.weekdaySchedule).map(([day, data]) => {
                const isEnabled = data?.enabled && data?.slots?.length > 0;

                return (
                  <div key={day} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                    <span style={{ fontWeight: 700, width: 40, color: '#334155', marginTop: 2 }}>{day}:</span>
                    {isEnabled ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {data.slots.map((slot, idx) => {
                          const sittingText = slot.sittingFee ? ` (Fee: $${slot.sittingFee}/d)` : '';
                          const slotText =
                            typeof slot === 'string'
                              ? slot
                              : `${slot.start} - ${slot.end} @ ${slot.clinicName || 'Downtown Clinic'}${sittingText}`;

                          return (
                            <Tag
                              key={idx}
                              color="blue"
                              icon={<ClockCircleOutlined />}
                              style={{ fontSize: 11, margin: 0, padding: '2px 8px' }}
                            >
                              {slotText}
                            </Tag>
                          );
                        })}
                      </div>
                    ) : (
                      <Tag color="default" style={{ fontSize: 10, margin: 0, color: '#94a3b8' }}>
                        Day Off
                      </Tag>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <Space size={4} wrap>
              {(doctor.timeSlots || []).map((slot) => (
                <Tag key={slot} color="blue" icon={<ClockCircleOutlined />}>
                  {slot}
                </Tag>
              ))}
            </Space>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Contact Email">{doctor.email}</Descriptions.Item>
        <Descriptions.Item label="Contact Phone">{doctor.phone}</Descriptions.Item>
        <Descriptions.Item label="Education / School">{doctor.education}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DoctorDetailsModal;
