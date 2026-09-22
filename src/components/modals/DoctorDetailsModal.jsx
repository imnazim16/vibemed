import React from 'react';
import { Modal, Avatar, Typography, Tag, Rate, Space, Divider, Descriptions, Button, Popconfirm } from 'antd';
import { MedicineBoxOutlined, CalendarOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const DoctorDetailsModal = ({ open, onCancel, doctor, onBook, onDelete }) => {
  if (!doctor) return null;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width="100%"
      style={{ maxWidth: 620 }}
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

      <Divider style={{ margin: '16px 0' }} />

      <Descriptions size="small" column={1} bordered>
        <Descriptions.Item label="Specialty">
          <Tag color="geekblue">{doctor.specialty}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Department">{doctor.department}</Descriptions.Item>
        <Descriptions.Item label="Experience">{doctor.experience}</Descriptions.Item>
        <Descriptions.Item label="Education / Medical School">{doctor.education}</Descriptions.Item>
        <Descriptions.Item label="Consultation Fee">
          <strong style={{ color: '#0d9488', fontSize: 15 }}>${doctor.fee} / visit</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Available Schedule (Days)">
          <Space size={4} wrap>
            {doctor.availability?.map((day) => (
              <Tag key={day} color="cyan">{day}</Tag>
            ))}
          </Space>
        </Descriptions.Item>
        {doctor.weekdaySchedule ? (
          <Descriptions.Item label="Weekday Time Slots Schedule">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 0' }}>
              {Object.entries(doctor.weekdaySchedule).map(([day, data]) => (
                <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <span style={{ fontWeight: 700, width: 40, color: '#334155' }}>{day}:</span>
                  {data?.enabled && data?.slots?.length > 0 ? (
                    <Space size={3} wrap>
                      {data.slots.map((slot) => (
                        <Tag key={slot} color="blue" icon={<ClockCircleOutlined />} style={{ fontSize: 10, margin: 0 }}>
                          {slot}
                        </Tag>
                      ))}
                    </Space>
                  ) : (
                    <Tag color="default" style={{ fontSize: 10, margin: 0, color: '#94a3b8' }}>
                      Off / Not Available
                    </Tag>
                  )}
                </div>
              ))}
            </div>
          </Descriptions.Item>
        ) : (
          <Descriptions.Item label="Consultation Time Slots">
            <Space size={4} wrap>
              {(doctor.timeSlots || ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM']).map((slot) => (
                <Tag key={slot} color="blue" icon={<ClockCircleOutlined />}>
                  {slot}
                </Tag>
              ))}
            </Space>
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Contact Email">{doctor.email}</Descriptions.Item>
        <Descriptions.Item label="Contact Phone">{doctor.phone}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DoctorDetailsModal;
