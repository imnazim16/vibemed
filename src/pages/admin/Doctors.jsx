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
  StarFilled,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { doctorService } from '../../services/doctorService';
import { DoctorDetailsModal } from '../../components/modals/DoctorDetailsModal';

const { Title, Text } = Typography;
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

const TIME_OPTIONS = [
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
  '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM'
];

const createInitialSlots = () => ({
  Mon: {
    enabled: true,
    slots: [
      { id: 'mon_1', start: '09:00 AM', end: '01:00 PM' },
      { id: 'mon_2', start: '02:00 PM', end: '05:00 PM' },
    ],
  },
  Tue: {
    enabled: true,
    slots: [
      { id: 'tue_1', start: '09:00 AM', end: '01:00 PM' },
      { id: 'tue_2', start: '02:00 PM', end: '05:00 PM' },
    ],
  },
  Wed: {
    enabled: true,
    slots: [
      { id: 'wed_1', start: '09:00 AM', end: '01:00 PM' },
      { id: 'wed_2', start: '02:00 PM', end: '05:00 PM' },
    ],
  },
  Thu: {
    enabled: true,
    slots: [
      { id: 'thu_1', start: '09:00 AM', end: '01:00 PM' },
      { id: 'thu_2', start: '02:00 PM', end: '05:00 PM' },
    ],
  },
  Fri: {
    enabled: true,
    slots: [
      { id: 'fri_1', start: '09:00 AM', end: '01:00 PM' },
      { id: 'fri_2', start: '02:00 PM', end: '05:00 PM' },
    ],
  },
  Sat: {
    enabled: false,
    slots: [
      { id: 'sat_1', start: '09:00 AM', end: '01:00 PM' },
    ],
  },
  Sun: {
    enabled: false,
    slots: [],
  },
});

export const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Weekday schedule state: Each day has its own array of { id, start, end } slots
  const [weekdaySchedule, setWeekdaySchedule] = useState(createInitialSlots);

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
        slots: checked && prev[dayKey].slots.length === 0
          ? [{ id: `${dayKey}_${Date.now()}`, start: '09:00 AM', end: '01:00 PM' }]
          : prev[dayKey].slots,
      },
    }));
  };

  // Add a new slot to a specific day
  const handleAddSlotToDay = (dayKey) => {
    setWeekdaySchedule((prev) => {
      const currentSlots = prev[dayKey]?.slots || [];
      let newStart = '02:00 PM';
      let newEnd = '05:00 PM';

      if (currentSlots.length > 0) {
        const lastSlot = currentSlots[currentSlots.length - 1];
        newStart = lastSlot.end || '02:00 PM';
        const idx = TIME_OPTIONS.indexOf(newStart);
        newEnd = idx !== -1 && idx + 6 < TIME_OPTIONS.length ? TIME_OPTIONS[idx + 6] : '06:00 PM';
      }

      const newSlot = {
        id: `${dayKey}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        start: newStart,
        end: newEnd,
      };

      return {
        ...prev,
        [dayKey]: {
          enabled: true,
          slots: [...currentSlots, newSlot],
        },
      };
    });
  };

  // Remove a slot from a specific day
  const handleRemoveSlotFromDay = (dayKey, slotId) => {
    setWeekdaySchedule((prev) => {
      const updatedSlots = prev[dayKey].slots.filter((s) => s.id !== slotId);
      return {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: updatedSlots,
          enabled: updatedSlots.length > 0 ? prev[dayKey].enabled : false,
        },
      };
    });
  };

  // Update start or end time for a specific slot
  const handleUpdateSlotTime = (dayKey, slotId, field, value) => {
    setWeekdaySchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        slots: prev[dayKey].slots.map((s) => (s.id === slotId ? { ...s, [field]: value } : s)),
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
          slots: [
            { id: `${d}_1`, start: '09:00 AM', end: '01:00 PM' },
            { id: `${d}_2`, start: '02:00 PM', end: '05:00 PM' },
          ],
        };
      });
      ['Sat', 'Sun'].forEach((d) => {
        updated[d] = { enabled: false, slots: [] };
      });
      return updated;
    });
    message.success('Applied standard Mon-Fri schedule');
  };

  // Quick action: Copy Monday slots to all active days
  const copyMondaySlotsToAll = () => {
    const mondaySlots = weekdaySchedule.Mon?.slots || [];
    if (mondaySlots.length === 0) {
      message.warning('Monday has no slots configured to copy');
      return;
    }
    setWeekdaySchedule((prev) => {
      const updated = { ...prev };
      WEEKDAY_CONFIG.forEach(({ key }) => {
        if (updated[key].enabled && key !== 'Mon') {
          updated[key] = {
            ...updated[key],
            slots: mondaySlots.map((s) => ({
              ...s,
              id: `${key}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            })),
          };
        }
      });
      return updated;
    });
    message.success('Replicated Monday time slots to all active weekdays');
  };

  const handleAddDoctor = async (values) => {
    const enabledDays = Object.keys(weekdaySchedule).filter(
      (day) => weekdaySchedule[day].enabled && weekdaySchedule[day].slots.length > 0
    );

    if (enabledDays.length === 0) {
      message.error('Please configure at least one active weekday with start and end time slots');
      return;
    }

    // Format slots as string array e.g. "09:00 AM - 01:00 PM"
    const formattedSchedule = {};
    const allFormattedSlots = [];

    enabledDays.forEach((day) => {
      const daySlots = weekdaySchedule[day].slots.map((s) => `${s.start} - ${s.end}`);
      formattedSchedule[day] = {
        enabled: true,
        slots: daySlots,
      };
      allFormattedSlots.push(...daySlots);
    });

    const uniqueSlots = Array.from(new Set(allFormattedSlots));

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
        timeSlots: uniqueSlots,
        weekdaySchedule: formattedSchedule,
      });
      message.success('Doctor registered with custom weekday time slots!');
      setIsAddModalOpen(false);
      form.resetFields();
      setWeekdaySchedule(createInitialSlots());
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
        style={{ maxWidth: 800 }}
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
              WEEKDAY BOX: START TIME & END TIME SELECTBOXES WITH "+ ADD SLOT"
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
            {/* Box Header & Batch Actions */}
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
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                    Weekday Time Slots (Start Time & End Time Selectboxes)
                  </span>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Set start & end time for each slot. Click "+ Add Slot" to add multiple consultation slots in a day.
                </Text>
              </div>

              {/* Quick Preset Buttons */}
              <Space size={6} wrap>
                <Button size="small" onClick={applyMonToFri} style={{ fontSize: 12, borderRadius: 6 }}>
                  Mon - Fri Standard
                </Button>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={copyMondaySlotsToAll}
                  style={{ fontSize: 12, borderRadius: 6, color: '#0d9488', borderColor: '#0d9488' }}
                >
                  Copy Mon Slots to All
                </Button>
              </Space>
            </div>

            {/* List of 7 Weekdays */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {WEEKDAY_CONFIG.map(({ key, label }) => {
                const dayData = weekdaySchedule[key] || { enabled: false, slots: [] };
                const isEnabled = dayData.enabled;

                return (
                  <div
                    key={key}
                    style={{
                      background: isEnabled ? '#ffffff' : '#f8fafc',
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
                        marginBottom: isEnabled && dayData.slots.length > 0 ? 10 : 0,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                            {dayData.slots.length} {dayData.slots.length === 1 ? 'Slot' : 'Slots'} Configured
                          </Tag>
                        ) : (
                          <Tag color="default" style={{ margin: 0, color: '#94a3b8', fontSize: 11 }}>
                            Day Off
                          </Tag>
                        )}
                      </div>

                      {/* Add Slot Button for this specific day */}
                      <Button
                        size="small"
                        type={isEnabled ? 'dashed' : 'default'}
                        icon={<PlusOutlined />}
                        onClick={() => handleAddSlotToDay(key)}
                        style={{
                          fontSize: 12,
                          borderRadius: 6,
                          borderColor: '#0d9488',
                          color: '#0d9488',
                          fontWeight: 600,
                        }}
                      >
                        + Add Slot
                      </Button>
                    </div>

                    {/* Time Slot Rows with Start & End Time Selectboxes */}
                    {isEnabled && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                        {dayData.slots.length === 0 ? (
                          <div style={{ padding: '8px 12px', background: '#fef3c7', borderRadius: 8, fontSize: 12, color: '#b45309' }}>
                            No slots configured for this day. Click "+ Add Slot" above to set consultation hours.
                          </div>
                        ) : (
                          dayData.slots.map((slot, index) => (
                            <div
                              key={slot.id || index}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                flexWrap: 'wrap',
                                background: '#f0fdfa',
                                padding: '8px 12px',
                                borderRadius: 8,
                                border: '1px solid #ccfbf1',
                              }}
                            >
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#0f766e', minWidth: 48 }}>
                                Slot {index + 1}:
                              </span>

                              {/* Start Time Selectbox */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>Start Time:</Text>
                                <Select
                                  size="small"
                                  value={slot.start}
                                  onChange={(val) => handleUpdateSlotTime(key, slot.id, 'start', val)}
                                  style={{ width: 115 }}
                                  options={TIME_OPTIONS.map((t) => ({ label: t, value: t }))}
                                />
                              </div>

                              <span style={{ color: '#0d9488', fontSize: 12, fontWeight: 700 }}>to</span>

                              {/* End Time Selectbox */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>End Time:</Text>
                                <Select
                                  size="small"
                                  value={slot.end}
                                  onChange={(val) => handleUpdateSlotTime(key, slot.id, 'end', val)}
                                  style={{ width: 115 }}
                                  options={TIME_OPTIONS.map((t) => ({ label: t, value: t }))}
                                />
                              </div>

                              {/* Remove Slot Button */}
                              <Tooltip title="Delete this slot">
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleRemoveSlotFromDay(key, slot.id)}
                                  style={{ marginLeft: 'auto' }}
                                />
                              </Tooltip>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
