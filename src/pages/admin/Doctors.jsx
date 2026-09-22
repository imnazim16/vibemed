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
  Divider,
} from 'antd';
import {
  MedicineBoxOutlined,
  PlusOutlined,
  SearchOutlined,
  StarFilled,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { doctorService } from '../../services/doctorService';
import { DoctorDetailsModal } from '../../components/modals/DoctorDetailsModal';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const WEEKDAY_CONFIG = [
  { key: 'Mon', label: 'Monday', short: 'Mon' },
  { key: 'Tue', label: 'Tuesday', short: 'Tue' },
  { key: 'Wed', label: 'Wednesday', short: 'Wed' },
  { key: 'Thu', label: 'Thursday', short: 'Thu' },
  { key: 'Fri', label: 'Friday', short: 'Fri' },
  { key: 'Sat', label: 'Saturday', short: 'Sat' },
  { key: 'Sun', label: 'Sunday', short: 'Sun' },
];

const DEFAULT_SLOT_OPTIONS = [
  '08:00 AM - 11:00 AM (Morning)',
  '09:00 AM - 12:00 PM (Morning)',
  '12:00 PM - 03:00 PM (Midday)',
  '02:00 PM - 05:00 PM (Afternoon)',
  '05:00 PM - 08:00 PM (Evening)',
  '07:00 PM - 10:00 PM (Night)',
];

const INITIAL_SCHEDULE = {
  Mon: { enabled: true, slots: ['09:00 AM - 12:00 PM (Morning)', '02:00 PM - 05:00 PM (Afternoon)'] },
  Tue: { enabled: true, slots: ['09:00 AM - 12:00 PM (Morning)', '02:00 PM - 05:00 PM (Afternoon)'] },
  Wed: { enabled: true, slots: ['09:00 AM - 12:00 PM (Morning)', '02:00 PM - 05:00 PM (Afternoon)'] },
  Thu: { enabled: true, slots: ['09:00 AM - 12:00 PM (Morning)', '02:00 PM - 05:00 PM (Afternoon)'] },
  Fri: { enabled: true, slots: ['09:00 AM - 12:00 PM (Morning)', '02:00 PM - 05:00 PM (Afternoon)'] },
  Sat: { enabled: false, slots: ['09:00 AM - 12:00 PM (Morning)'] },
  Sun: { enabled: false, slots: [] },
};

export const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Weekday schedule state with time slot checkboxes per day
  const [weekdaySchedule, setWeekdaySchedule] = useState(INITIAL_SCHEDULE);
  const [slotOptions, setSlotOptions] = useState(DEFAULT_SLOT_OPTIONS);
  const [customSlotInput, setCustomSlotInput] = useState('');

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

  // Toggle enabling/disabling a day
  const toggleDayEnabled = (dayKey, checked) => {
    setWeekdaySchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: checked,
        slots: checked
          ? prev[dayKey].slots.length > 0
            ? prev[dayKey].slots
            : ['09:00 AM - 12:00 PM (Morning)', '02:00 PM - 05:00 PM (Afternoon)']
          : prev[dayKey].slots,
      },
    }));
  };

  // Update time slot checkboxes for a specific day
  const handleSlotChange = (dayKey, selectedSlots) => {
    setWeekdaySchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        slots: selectedSlots,
      },
    }));
  };

  // Quick preset: Mon - Fri
  const applyMonToFri = () => {
    setWeekdaySchedule((prev) => {
      const updated = { ...prev };
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach((d) => {
        updated[d] = {
          enabled: true,
          slots: ['09:00 AM - 12:00 PM (Morning)', '02:00 PM - 05:00 PM (Afternoon)'],
        };
      });
      ['Sat', 'Sun'].forEach((d) => {
        updated[d] = { enabled: false, slots: [] };
      });
      return updated;
    });
    message.success('Applied standard Mon-Fri schedule');
  };

  // Quick preset: All 7 days
  const applyAll7Days = () => {
    setWeekdaySchedule((prev) => {
      const updated = { ...prev };
      WEEKDAY_CONFIG.forEach(({ key }) => {
        updated[key] = {
          enabled: true,
          slots: ['09:00 AM - 12:00 PM (Morning)', '02:00 PM - 05:00 PM (Afternoon)'],
        };
      });
      return updated;
    });
    message.success('Enabled all 7 days with standard time slots');
  };

  // Quick action: Copy Monday slots to all enabled days
  const copyMondaySlotsToAll = () => {
    const mondaySlots = weekdaySchedule.Mon?.slots || [];
    if (mondaySlots.length === 0) {
      message.warning('Monday has no slots selected to copy');
      return;
    }
    setWeekdaySchedule((prev) => {
      const updated = { ...prev };
      WEEKDAY_CONFIG.forEach(({ key }) => {
        if (updated[key].enabled) {
          updated[key] = { ...updated[key], slots: [...mondaySlots] };
        }
      });
      return updated;
    });
    message.success('Replicated Monday time slots to all active weekdays');
  };

  // Add a new custom time slot option to the pool
  const handleAddCustomSlot = () => {
    const trimmed = customSlotInput.trim();
    if (!trimmed) return;
    if (slotOptions.includes(trimmed)) {
      message.info('This time slot is already in the options');
      return;
    }
    setSlotOptions([...slotOptions, trimmed]);
    setCustomSlotInput('');
    message.success(`Added slot option: "${trimmed}"`);
  };

  const handleAddDoctor = async (values) => {
    const enabledDays = Object.keys(weekdaySchedule).filter(
      (day) => weekdaySchedule[day].enabled && weekdaySchedule[day].slots.length > 0
    );

    if (enabledDays.length === 0) {
      message.error('Please check at least one weekday and select its time slots');
      return;
    }

    const allUniqueSlots = Array.from(
      new Set(enabledDays.flatMap((day) => weekdaySchedule[day].slots))
    );

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
        availability: enabledDays,
        timeSlots: allUniqueSlots,
        weekdaySchedule: weekdaySchedule,
      });
      message.success('Doctor registered with weekday time slot schedule!');
      setIsAddModalOpen(false);
      form.resetFields();
      setWeekdaySchedule(INITIAL_SCHEDULE);
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
                      <Tag key={slot} color="blue" style={{ fontSize: 11, marginInlineEnd: 3, padding: '1px 6px' }}>
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
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MedicineBoxOutlined style={{ color: '#0d9488', fontSize: 22 }} />
            <span style={{ fontSize: 18, fontWeight: 700 }}>Add New Doctor & Weekday Schedule</span>
          </div>
        }
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width="100%"
        style={{ maxWidth: 780 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDoctor}
          initialValues={{
            experience: 8,
            fee: 150,
          }}
          style={{ paddingTop: 10 }}
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

          {/* ========================================================
              WEEKDAY BOX: EACH WEEKDAY WITH ITS OWN TIME SLOT CHECKBOXES
             ======================================================== */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: 14,
              padding: '16px',
              marginTop: 8,
              marginBottom: 20,
            }}
          >
            {/* Box Header & Quick Batch Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 14,
                paddingBottom: 12,
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarOutlined style={{ color: '#0d9488', fontSize: 16 }} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                    Weekday Availability & Time Slot Checkboxes
                  </span>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Check weekdays the doctor practices and check each day's consultation hours.
                </Text>
              </div>

              {/* Quick Action Buttons */}
              <Space size={6} wrap>
                <Button size="small" onClick={applyMonToFri} style={{ fontSize: 12, borderRadius: 6 }}>
                  Mon - Fri
                </Button>
                <Button size="small" onClick={applyAll7Days} style={{ fontSize: 12, borderRadius: 6 }}>
                  All 7 Days
                </Button>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={copyMondaySlotsToAll}
                  style={{ fontSize: 12, borderRadius: 6, color: '#0d9488', borderColor: '#0d9488' }}
                >
                  Copy Mon Slots
                </Button>
              </Space>
            </div>

            {/* List of 7 Weekdays with Time Slot Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {WEEKDAY_CONFIG.map(({ key, label }) => {
                const dayData = weekdaySchedule[key] || { enabled: false, slots: [] };
                const isEnabled = dayData.enabled;

                return (
                  <div
                    key={key}
                    style={{
                      background: isEnabled ? '#ffffff' : '#f1f5f9',
                      border: isEnabled ? '1.5px solid #0d9488' : '1px dashed #cbd5e1',
                      borderRadius: 10,
                      padding: '12px 14px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Day Row Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 8,
                        marginBottom: isEnabled ? 10 : 0,
                      }}
                    >
                      <Checkbox
                        checked={isEnabled}
                        onChange={(e) => toggleDayEnabled(key, e.target.checked)}
                      >
                        <span style={{ fontWeight: 700, fontSize: 14, color: isEnabled ? '#0f172a' : '#64748b' }}>
                          {label}
                        </span>
                      </Checkbox>

                      {isEnabled ? (
                        <Tag color="cyan" style={{ margin: 0, fontWeight: 600, fontSize: 11 }}>
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {dayData.slots.length} Slots Selected
                        </Tag>
                      ) : (
                        <Tag color="default" style={{ margin: 0, color: '#94a3b8', fontSize: 11 }}>
                          Day Off (Click checkbox to enable)
                        </Tag>
                      )}
                    </div>

                    {/* Time Slot Checkboxes for this Day */}
                    {isEnabled && (
                      <div
                        style={{
                          background: '#f0fdfa',
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: '1px solid #ccfbf1',
                        }}
                      >
                        <Checkbox.Group
                          options={slotOptions.map((slot) => ({
                            label: <span style={{ fontSize: 12 }}>{slot}</span>,
                            value: slot,
                          }))}
                          value={dayData.slots}
                          onChange={(selected) => handleSlotChange(key, selected)}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 6,
                            width: '100%',
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom Time Slot Adder */}
            <div
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>
                Need a different time slot?
              </Text>
              <Input
                size="small"
                placeholder="e.g. 10:30 AM - 01:30 PM (Custom)"
                value={customSlotInput}
                onChange={(e) => setCustomSlotInput(e.target.value)}
                onPressEnter={handleAddCustomSlot}
                style={{ flex: 1, minWidth: 200, borderRadius: 6 }}
              />
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={handleAddCustomSlot}
                style={{ borderRadius: 6 }}
              >
                Add Slot Option
              </Button>
            </div>
          </div>

          <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{ backgroundColor: '#0d9488', borderRadius: 8, height: 44, fontSize: 15 }}
            >
              Save & Register Doctor Schedule
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
