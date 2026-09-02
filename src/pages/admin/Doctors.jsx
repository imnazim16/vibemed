import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Tag,
  Button,
  Input,
  Select,
  Modal,
  Form,
  message,
  Rate,
  Space,
  Checkbox,
  Popconfirm,
  Tooltip,
} from 'antd';
import {
  MedicineBoxOutlined,
  PlusOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  StarFilled,
  DeleteOutlined,
  CalendarOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { doctorService } from '../../services/doctorService';
import { DoctorDetailsModal } from '../../components/modals/DoctorDetailsModal';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const WEEKDAYS = [
  { label: 'Monday (Mon)', value: 'Mon' },
  { label: 'Tuesday (Tue)', value: 'Tue' },
  { label: 'Wednesday (Wed)', value: 'Wed' },
  { label: 'Thursday (Thu)', value: 'Thu' },
  { label: 'Friday (Fri)', value: 'Fri' },
  { label: 'Saturday (Sat)', value: 'Sat' },
  { label: 'Sunday (Sun)', value: 'Sun' },
];

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
        fee: Number(values.fee) || 120,
        department: `${values.specialty} Department`,
        education: values.education || 'Top Medical University',
        phone: values.phone || '+1 (555) 000-0000',
        email: values.email || 'doctor@vibemed.health',
        availability: values.availability && values.availability.length > 0
          ? values.availability
          : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      });
      message.success('Doctor registered successfully!');
      setIsAddModalOpen(false);
      form.resetFields();
      loadDoctors();
    } catch {
      message.error('Failed to add doctor');
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await doctorService.deleteDoctor(id);
      message.success('Doctor profile removed from directory');
      if (selectedDoctor?.id === id) {
        setSelectedDoctor(null);
      }
      loadDoctors();
    } catch {
      message.error('Failed to delete doctor');
    }
  };

  return (
    <div>
      <PageHeader
        title="Doctor & Specialist Roster"
        subtitle="Manage hospital physicians, clinical credentials, weekly availability, and department assignments"
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
                <div style={{ flex: 1 }}>
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

              <div style={{ marginTop: 14, fontSize: 13, color: '#64748b', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div>🏥 {doc.department}</div>
                <div>💼 {doc.experience} Experience</div>
                <div>💵 ${doc.fee} Consultation Fee</div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
                    <CalendarOutlined style={{ marginRight: 4, color: '#0d9488' }} />
                    Available:
                  </span>{' '}
                  <Space size={2} wrap style={{ marginTop: 4 }}>
                    {doc.availability?.map((day) => (
                      <Tag key={day} color="cyan" style={{ fontSize: 10, marginInlineEnd: 4, padding: '0 4px' }}>
                        {day}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Tag color={doc.status === 'Available' ? 'green' : 'gold'}>{doc.status}</Tag>

                <Space size="small">
                  <Button
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => setSelectedDoctor(doc)}
                  >
                    View
                  </Button>

                  <Popconfirm
                    title="Delete Doctor Profile"
                    description={`Are you sure you want to remove ${doc.name}?`}
                    onConfirm={() => handleDeleteDoctor(doc.id)}
                    okText="Yes, Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Tooltip title="Delete Profile">
                      <Button size="small" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                  </Popconfirm>
                </Space>
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
        width={650}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDoctor}
          initialValues={{
            availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            experience: 8,
            fee: 150,
          }}
          style={{ paddingTop: 12 }}
        >
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="name" label="Doctor's Full Name" rules={[{ required: true, message: 'Please enter doctor name' }]}>
                <Input placeholder="Dr. John Smith, MD" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="specialty" label="Medical Specialty" rules={[{ required: true, message: 'Please select specialty' }]}>
                <Select placeholder="Select specialty">
                  <Option value="Cardiology">Cardiology</Option>
                  <Option value="Neurology">Neurology</Option>
                  <Option value="Pediatrics">Pediatrics</Option>
                  <Option value="Orthopedics">Orthopedics</Option>
                  <Option value="Dermatology">Dermatology</Option>
                  <Option value="General Medicine">General Medicine</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="experience" label="Years of Experience" rules={[{ required: true }]}>
                <Input placeholder="e.g. 10" type="number" suffix="Years" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="fee" label="Consultation Fee ($)" rules={[{ required: true }]}>
                <Input placeholder="150" type="number" prefix="$" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Contact Email">
                <Input placeholder="doctor@vibemed.health" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Contact Phone">
                <Input placeholder="+1 (555) 000-0000" />
              </Form.Item>
            </Col>
          </Row>

          {/* Weekday Availability Days */}
          <Form.Item
            name="availability"
            label="Doctor Availability (Days of the Week)"
            rules={[{ required: true, message: 'Please select at least one available day' }]}
            tooltip="Select the days this physician is available for appointments and consultations"
          >
            <Checkbox.Group options={WEEKDAYS} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }} />
          </Form.Item>

          <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            >
              Save & Register Doctor
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <DoctorDetailsModal
        open={!!selectedDoctor}
        onCancel={() => setSelectedDoctor(null)}
        doctor={selectedDoctor}
        onDelete={(doc) => handleDeleteDoctor(doc.id)}
      />
    </div>
  );
};

export default AdminDoctors;
