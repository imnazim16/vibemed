import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Avatar, Typography, Tag, Button, Input, Select, Modal, Form, message, Rate, Space } from 'antd';
import {
  MedicineBoxOutlined,
  PlusOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  StarFilled,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { doctorService } from '../../services/doctorService';
import { DoctorDetailsModal } from '../../components/modals/DoctorDetailsModal';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form] = Form.useForm();

  const loadDoctors = async () => {
    const data = await doctorService.getAll();
    setDoctors(data);
    setFilteredDoctors(data);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    let result = doctors;
    if (selectedSpecialty !== 'All') {
      result = result.filter((d) => d.specialty === selectedSpecialty);
    }
    if (searchQuery) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredDoctors(result);
  }, [selectedSpecialty, searchQuery, doctors]);

  const handleAddDoctor = async (values) => {
    try {
      await doctorService.addDoctor({
        name: values.name,
        specialty: values.specialty,
        title: values.title || 'Consultant Specialist',
        experience: `${values.experience || 5} years`,
        fee: values.fee || 120,
        department: `${values.specialty} Department`,
        education: values.education || 'Top Medical University',
        phone: values.phone || '+1 (555) 000-0000',
        email: values.email || 'doctor@vibemed.health',
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      });
      message.success('Doctor registered successfully!');
      setIsAddModalOpen(false);
      form.resetFields();
      loadDoctors();
    } catch {
      message.error('Failed to add doctor');
    }
  };

  return (
    <div>
      <PageHeader
        title="Doctor & Specialist Roster"
        subtitle="Manage hospital physicians, clinical credentials, and department assignments"
        extra={[
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Doctor
          </Button>,
        ]}
      />

      {/* Filter Bar */}
      <Card style={{ marginBottom: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search doctors by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
              allowClear
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
              value={selectedSpecialty}
              onChange={(val) => setSelectedSpecialty(val)}
              style={{ width: '100%' }}
              size="large"
            >
              {doctorService.getSpecialties().map((spec) => (
                <Option key={spec} value={spec}>
                  {spec === 'All' ? 'All Specialties' : spec}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Doctor Grid */}
      <Row gutter={[20, 20]}>
        {filteredDoctors.map((doc) => (
          <Col xs={24} sm={12} lg={8} key={doc.id}>
            <Card
              hoverable
              style={{ borderRadius: 16, border: '1px solid #e2e8f0', height: '100%' }}
              styles={{ body: { padding: 20 } }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Avatar size={64} src={doc.avatar} style={{ border: '2px solid #0d9488' }} />
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    {doc.name}
                  </Title>
                  <Tag color="geekblue" style={{ marginTop: 4 }}>
                    {doc.specialty}
                  </Tag>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <StarFilled style={{ color: '#f59e0b', fontSize: 13 }} />
                    <Text strong style={{ fontSize: 12 }}>
                      {doc.rating}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      ({doc.reviewsCount} reviews)
                    </Text>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16, fontSize: 13, color: '#64748b' }}>
                <div>🏥 {doc.department}</div>
                <div>💼 {doc.experience} Experience</div>
                <div>💵 ${doc.fee} Consultation Fee</div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tag color={doc.status === 'Available' ? 'green' : 'gold'}>{doc.status}</Tag>
                <Button size="small" onClick={() => setSelectedDoctor(doc)}>
                  View Profile
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Doctor Modal */}
      <Modal
        title="Add New Doctor"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddDoctor} style={{ paddingTop: 12 }}>
          <Form.Item name="name" label="Doctor's Full Name" rules={[{ required: true }]}>
            <Input placeholder="Dr. John Smith, MD" />
          </Form.Item>
          <Form.Item name="specialty" label="Medical Specialty" rules={[{ required: true }]}>
            <Select placeholder="Select specialty">
              <Option value="Cardiology">Cardiology</Option>
              <Option value="Neurology">Neurology</Option>
              <Option value="Pediatrics">Pediatrics</Option>
              <Option value="Orthopedics">Orthopedics</Option>
              <Option value="Dermatology">Dermatology</Option>
            </Select>
          </Form.Item>
          <Form.Item name="experience" label="Years of Experience">
            <Input placeholder="e.g. 10" type="number" />
          </Form.Item>
          <Form.Item name="fee" label="Consultation Fee ($)">
            <Input placeholder="150" type="number" />
          </Form.Item>
          <Form.Item name="email" label="Contact Email">
            <Input placeholder="doctor@vibemed.health" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            >
              Save Doctor
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <DoctorDetailsModal
        open={!!selectedDoctor}
        onCancel={() => setSelectedDoctor(null)}
        doctor={selectedDoctor}
      />
    </div>
  );
};

export default AdminDoctors;
