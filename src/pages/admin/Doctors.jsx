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
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { doctorService } from '../../services/doctorService';
import { DoctorDetailsModal } from '../../components/modals/DoctorDetailsModal';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const WEEKDAYS = [
  { label: 'Mon', value: 'Mon' },
  { label: 'Tue', value: 'Tue' },
  { label: 'Wed', value: 'Wed' },
  { label: 'Thu', value: 'Thu' },
  { label: 'Fri', value: 'Fri' },
  { label: 'Sat', value: 'Sat' },
  { label: 'Sun', value: 'Sun' },
];

const AVAILABLE_TIME_SLOTS = [
  { label: 'Morning: 08:00 AM - 11:00 AM', value: '08:00 AM - 11:00 AM' },
  { label: 'Morning: 09:00 AM - 12:00 PM', value: '09:00 AM - 12:00 PM' },
  { label: 'Midday: 12:00 PM - 03:00 PM', value: '12:00 PM - 03:00 PM' },
  { label: 'Afternoon: 02:00 PM - 05:00 PM', value: '02:00 PM - 05:00 PM' },
  { label: 'Evening: 05:00 PM - 08:00 PM', value: '05:00 PM - 08:00 PM' },
  { label: 'Night: 07:00 PM - 10:00 PM', value: '07:00 PM - 10:00 PM' },
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
        timeSlots: values.timeSlots && values.timeSlots.length > 0
          ? values.timeSlots
          : ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'],
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
        subtitle="Manage hospital physicians, weekly availability, consultation time slots, and credentials"
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
      <Card style={{ marginBottom: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={14} md={12}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search doctors by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
              allowClear
            />
          </Col>
          <Col xs={24} sm={10} md={12}>
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
      <Row gutter={[16, 16]}>
        {filteredDoctors.map((doc) => (
          <Col xs={24} sm={12} lg={8} key={doc.id}>
            <Card
              hoverable
              style={{ borderRadius: 16, border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}
              styles={{ body: { padding: 18, flex: 1, display: 'flex', flexDirection: 'column' } }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Avatar size={58} src={doc.avatar} style={{ border: '2px solid #0d9488', flexShrink: 0 }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Title level={5} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.name}
                  </Title>
                  <Tag color="geekblue" style={{ marginTop: 4 }}>
                    {doc.specialty}
                  </Tag>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <StarFilled style={{ color: '#f59e0b', fontSize: 12 }} />
                    <Text strong style={{ fontSize: 12 }}>
                      {doc.rating}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      ({doc.reviewsCount} reviews)
                    </Text>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14, fontSize: 13, color: '#64748b', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <div>🏥 {doc.department}</div>
                <div>💼 {doc.experience} Experience</div>
                <div>💵 <strong style={{ color: '#0d9488' }}>${doc.fee}</strong> Consultation Fee</div>

                {/* Available Days */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 2 }}>
                    <CalendarOutlined style={{ marginRight: 4, color: '#0d9488' }} />
                    Available Days:
                  </div>
                  <Space size={3} wrap>
                    {doc.availability?.map((day) => (
                      <Tag key={day} color="cyan" style={{ fontSize: 11, marginInlineEnd: 3, padding: '0 5px' }}>
                        {day}
                      </Tag>
                    ))}
                  </Space>
                </div>

                {/* Available Time Slots */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 2 }}>
                    <ClockCircleOutlined style={{ marginRight: 4, color: '#0284c7' }} />
                    Time Slots:
                  </div>
                  <Space size={3} wrap>
                    {(doc.timeSlots || ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM']).map((slot) => (
                      <Tag key={slot} color="blue" style={{ fontSize: 10, marginInlineEnd: 3, padding: '0 4px' }}>
                        {slot}
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
        title="Add New Doctor & Availability"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width="100%"
        style={{ maxWidth: 660 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDoctor}
          initialValues={{
            availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            timeSlots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'],
            experience: 8,
            fee: 150,
          }}
          style={{ paddingTop: 12 }}
        >
          <Row gutter={[12, 0]}>
            <Col xs={24} sm={14}>
              <Form.Item name="name" label="Doctor's Full Name" rules={[{ required: true, message: 'Please enter doctor name' }]}>
                <Input placeholder="Dr. John Smith, MD" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
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

          <Row gutter={[12, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item name="experience" label="Years of Experience" rules={[{ required: true }]}>
                <Input placeholder="e.g. 10" type="number" suffix="Years" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="fee" label="Consultation Fee ($)" rules={[{ required: true }]}>
                <Input placeholder="150" type="number" prefix="$" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[12, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item name="email" label="Contact Email">
                <Input placeholder="doctor@vibemed.health" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="Contact Phone">
                <Input placeholder="+1 (555) 000-0000" />
              </Form.Item>
            </Col>
          </Row>

          {/* Weekday Availability Days */}
          <Form.Item
            name="availability"
            label="Available Days (Week Schedule)"
            rules={[{ required: true, message: 'Please select at least one available day' }]}
            tooltip="Select days when the doctor is available for consultations"
          >
            <Checkbox.Group options={WEEKDAYS} style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }} />
          </Form.Item>

          {/* Time Slots */}
          <Form.Item
            name="timeSlots"
            label="Daily Consultation Time Slots"
            rules={[{ required: true, message: 'Please select at least one consultation time slot' }]}
            tooltip="Select one or multiple consultation hours / slots for each day"
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select available time slots"
              options={AVAILABLE_TIME_SLOTS}
              style={{ width: '100%' }}
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
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
