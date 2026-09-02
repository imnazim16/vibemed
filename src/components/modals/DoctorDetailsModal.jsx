import React from 'react';
import { Modal, Avatar, Typography, Tag, Rate, Space, Divider, Descriptions, Button, Popconfirm } from 'antd';
import { MedicineBoxOutlined, CalendarOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const DoctorDetailsModal = ({ open, onCancel, doctor, onBook, onDelete }) => {
  if (!doctor) return null;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
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
      width={620}
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
        <Descriptions.Item label="Contact Email">{doctor.email}</Descriptions.Item>
        <Descriptions.Item label="Contact Phone">{doctor.phone}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DoctorDetailsModal;
