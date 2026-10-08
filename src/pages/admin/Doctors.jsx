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
  InputNumber,
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
  Empty,
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
  ShopOutlined,
  DollarOutlined,
  TeamOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { doctorService } from '../../services/doctorService';
import { clinicService } from '../../services/clinicService';
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

const TIME_OPTIONS = [
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
  '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM',
];

const createInitialSlots = () => ({
  Mon: {
    enabled: true,
    slots: [
      { id: 'mon_1', start: '09:00 AM', end: '01:00 PM', clinicId: 'clinic_1', clinicName: 'Downtown Medical Center', sittingFee: 500 },
      { id: 'mon_2', start: '04:00 PM', end: '08:00 PM', clinicId: 'clinic_2', clinicName: 'Westside Family Care Clinic', sittingFee: 350 },
    ],
  },
  Tue: {
    enabled: true,
    slots: [
      { id: 'tue_1', start: '09:00 AM', end: '01:00 PM', clinicId: 'clinic_1', clinicName: 'Downtown Medical Center', sittingFee: 500 },
      { id: 'tue_2', start: '04:00 PM', end: '08:00 PM', clinicId: 'clinic_2', clinicName: 'Westside Family Care Clinic', sittingFee: 350 },
    ],
  },
  Wed: {
    enabled: true,
    slots: [
      { id: 'wed_1', start: '09:00 AM', end: '01:00 PM', clinicId: 'clinic_1', clinicName: 'Downtown Medical Center', sittingFee: 500 },
      { id: 'wed_2', start: '04:00 PM', end: '08:00 PM', clinicId: 'clinic_2', clinicName: 'Westside Family Care Clinic', sittingFee: 350 },
    ],
  },
  Thu: {
    enabled: true,
    slots: [
      { id: 'thu_1', start: '09:00 AM', end: '01:00 PM', clinicId: 'clinic_1', clinicName: 'Downtown Medical Center', sittingFee: 500 },
      { id: 'thu_2', start: '04:00 PM', end: '08:00 PM', clinicId: 'clinic_2', clinicName: 'Westside Family Care Clinic', sittingFee: 350 },
    ],
  },
  Fri: {
    enabled: true,
    slots: [
      { id: 'fri_1', start: '09:00 AM', end: '01:00 PM', clinicId: 'clinic_1', clinicName: 'Downtown Medical Center', sittingFee: 500 },
      { id: 'fri_2', start: '04:00 PM', end: '08:00 PM', clinicId: 'clinic_2', clinicName: 'Westside Family Care Clinic', sittingFee: 350 },
    ],
  },
  Sat: {
    enabled: false,
    slots: [{ id: 'sat_1', start: '09:00 AM', end: '01:00 PM', clinicId: 'clinic_2', clinicName: 'Westside Family Care Clinic', sittingFee: 350 }],
  },
  Sun: {
    enabled: false,
    slots: [],
  },
});

export const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  // Filters
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedClinic, setSelectedClinic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNewSpecialtyModalOpen, setIsNewSpecialtyModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Weekday schedule state: Each slot has { id, start, end, clinicId, clinicName }
  const [weekdaySchedule, setWeekdaySchedule] = useState(createInitialSlots);

  const [form] = Form.useForm();
  const [specialtyQuickForm] = Form.useForm();

  // Helper to test if a doctor has Available status
  const isDoctorAvailable = (d) => {
    const s = String(d?.status || '').toLowerCase().trim();
    return s === 'available' || s === 'active';
  };

  const loadData = async () => {
    const docs = await doctorService.getAll();
    const clinList = await clinicService.getAll();
    const specList = clinicService.getAllSpecialties();

    // Show only Available doctors
    const availableDocs = (docs || []).filter(isDoctorAvailable);

    setDoctors(availableDocs);
    setFilteredDoctors(availableDocs);
    setClinics(clinList);
    setSpecialties(specList);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter effect
  useEffect(() => {
    // Show only Available doctors
    let result = (doctors || []).filter(isDoctorAvailable);

    if (selectedSpecialty !== 'All') {
      result = result.filter((d) => d.specialty === selectedSpecialty);
    }

    if (selectedClinic !== 'All') {
      result = result.filter((d) => {
        const schedule = d?.weekdaySchedule;
        if (!schedule || typeof schedule !== 'object') return false;
        return Object.values(schedule).some(
          (day) =>
            day &&
            day.enabled &&
            Array.isArray(day.slots) &&
            day.slots.some((slot) => String(slot.clinicId) === String(selectedClinic))
        );
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          String(d.name || '').toLowerCase().includes(q) ||
          String(d.specialty || '').toLowerCase().includes(q)
      );
    }

    setFilteredDoctors(result);
  }, [selectedSpecialty, selectedClinic, searchQuery, doctors]);

  // Toggle enabling/disabling a day
  const toggleDayEnabled = (dayKey, checked) => {
    setWeekdaySchedule((prev) => {
      const defaultClinic = clinics[0] || { id: 'clinic_1', name: 'Downtown Medical Center' };
      return {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          enabled: checked,
          slots:
            checked && prev[dayKey].slots.length === 0
              ? [
                  {
                    id: `${dayKey}_${Date.now()}`,
                    start: '09:00 AM',
                    end: '01:00 PM',
                    clinicId: defaultClinic.id,
                    clinicName: defaultClinic.name,
                  },
                ]
              : prev[dayKey].slots,
        },
      };
    });
  };

  // Add a new slot to a day with clinic location
  const handleAddSlotToDay = (dayKey) => {
    setWeekdaySchedule((prev) => {
      const currentSlots = prev[dayKey]?.slots || [];
      let newStart = '02:00 PM';
      let newEnd = '05:00 PM';
      let newClinic = clinics[1] || clinics[0] || { id: 'clinic_2', name: 'Westside Family Care Clinic' };

      if (currentSlots.length > 0) {
        const lastSlot = currentSlots[currentSlots.length - 1];
        newStart = lastSlot.end || '02:00 PM';
        const idx = TIME_OPTIONS.indexOf(newStart);
        newEnd = idx !== -1 && idx + 6 < TIME_OPTIONS.length ? TIME_OPTIONS[idx + 6] : '06:00 PM';

        // Alternate clinic for next shift if available
        const otherClinic = clinics.find((c) => c.id !== lastSlot.clinicId);
        if (otherClinic) {
          newClinic = otherClinic;
        }
      }

      const newSlot = {
        id: `${dayKey}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        start: newStart,
        end: newEnd,
        clinicId: newClinic.id,
        clinicName: newClinic.name,
        sittingFee: newClinic.sittingCharge || 400,
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

  // Update a field in a slot (start, end, clinicId, sittingFee)
  const handleUpdateSlotField = (dayKey, slotId, field, value) => {
    setWeekdaySchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        slots: prev[dayKey].slots.map((s) => {
          if (s.id !== slotId) return s;
          if (field === 'clinicId') {
            const foundClinic = clinics.find((c) => c.id === value);
            return {
              ...s,
              clinicId: value,
              clinicName: foundClinic ? foundClinic.name : s.clinicName,
              sittingFee: s.sittingFee !== undefined ? s.sittingFee : (foundClinic ? foundClinic.sittingCharge : 400),
            };
          }
          return { ...s, [field]: value };
        }),
      },
    }));
  };

  // Quick preset: Mon - Fri standard shifts
  const applyMonToFri = () => {
    const c1 = clinics[0] || { id: 'clinic_1', name: 'Downtown Medical Center', sittingCharge: 500 };
    const c2 = clinics[1] || clinics[0] || { id: 'clinic_2', name: 'Westside Family Care Clinic', sittingCharge: 350 };

    setWeekdaySchedule((prev) => {
      const updated = { ...prev };
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach((d) => {
        updated[d] = {
          enabled: true,
          slots: [
            { id: `${d}_1`, start: '09:00 AM', end: '01:00 PM', clinicId: c1.id, clinicName: c1.name, sittingFee: c1.sittingCharge || 500 },
            { id: `${d}_2`, start: '04:00 PM', end: '08:00 PM', clinicId: c2.id, clinicName: c2.name, sittingFee: c2.sittingCharge || 350 },
          ],
        };
      });
      ['Sat', 'Sun'].forEach((d) => {
        updated[d] = { enabled: false, slots: [] };
      });
      return updated;
    });
    message.success('Applied Mon-Fri schedule with cross-clinic shifts');
  };

  // Copy Monday slots to all active days
  const copyMondaySlotsToAll = () => {
    const mondaySlots = weekdaySchedule.Mon?.slots || [];
    if (mondaySlots.length === 0) {
      message.warning('Monday has no configured shifts to copy');
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
    message.success('Replicated Monday shifts and clinic locations to all active weekdays');
  };

  // Quick add new dynamic specialty
  const handleQuickAddSpecialty = async (values) => {
    const name = values.newSpecialtyName?.trim();
    if (!name) return;
    await clinicService.addSpecialty(name, values.clinicIds || []);
    message.success(`Specialty "${name}" registered and available in dropdowns!`);
    setIsNewSpecialtyModalOpen(false);
    specialtyQuickForm.resetFields();
    // Select this newly created specialty in the doctor form
    form.setFieldsValue({ specialty: name });
    loadData();
  };

  const handleAddDoctor = async (values) => {
    const enabledDays = Object.keys(weekdaySchedule).filter(
      (day) => weekdaySchedule[day].enabled && weekdaySchedule[day].slots.length > 0
    );

    if (enabledDays.length === 0) {
      message.error('Please configure at least one active weekday shift with start, end time and clinic branch');
      return;
    }

    const fee = Number(values.fee) || 150;
    const clinicsVisitedMap = {};

    enabledDays.forEach((day) => {
      weekdaySchedule[day].slots.forEach((s) => {
        if (!clinicsVisitedMap[s.clinicId]) {
          const feeForClinic = s.sittingFee !== undefined ? Number(s.sittingFee) : (found ? found.sittingCharge : 400);
          clinicsVisitedMap[s.clinicId] = {
            clinicId: s.clinicId,
            clinicName: s.clinicName,
            sittingFeePerDay: feeForClinic,
            daysWorked: 0,
            patientsTreated: 0,
            amountBilled: 0,
            totalSittingFee: 0,
            netPayout: 0,
          };
        }
        clinicsVisitedMap[s.clinicId].daysWorked += 2; // initial estimate
      });
    });

    const clinicsBreakdown = Object.values(clinicsVisitedMap).map((cb) => {
      const estimatedPatients = cb.daysWorked * 4;
      const billed = estimatedPatients * fee;
      const sitting = cb.daysWorked * cb.sittingFeePerDay;
      return {
        ...cb,
        patientsTreated: estimatedPatients,
        amountBilled: billed,
        totalSittingFee: sitting,
        netPayout: billed - sitting,
      };
    });

    const totalPatients = clinicsBreakdown.reduce((sum, c) => sum + c.patientsTreated, 0);
    const totalBilled = clinicsBreakdown.reduce((sum, c) => sum + c.amountBilled, 0);
    const totalSitting = clinicsBreakdown.reduce((sum, c) => sum + c.totalSittingFee, 0);

    const summarySlots = [];
    enabledDays.forEach((d) => {
      weekdaySchedule[d].slots.forEach((s) => {
        const shortName = s.clinicName.split(' ')[0];
        summarySlots.push(`${s.start} - ${s.end} @ ${shortName}`);
      });
    });

    try {
      await doctorService.addDoctor({
        name: values.name,
        specialty: values.specialty,
        title: values.title || 'Consultant Specialist',
        experience: `${values.experience || 5} years`,
        fee,
        department: `${values.specialty} Department`,
        education: values.education || 'Top Medical University',
        phone: values.phone || '+1 (555) 000-0000',
        email: values.email || 'doctor@vibemed.health',
        availability: enabledDays,
        timeSlots: Array.from(new Set(summarySlots)),
        weekdaySchedule,
        monthlyStats: {
          month: 'September 2026',
          totalPatientsTreated: totalPatients,
          grossBilled: totalBilled,
          totalSittingCharges: totalSitting,
          netDoctorPayout: totalBilled - totalSitting,
          clinicsBreakdown,
        },
      });

      message.success('Doctor registered with multi-clinic shifts and revenue tracking!');
      setIsAddModalOpen(false);
      form.resetFields();
      setWeekdaySchedule(createInitialSlots());
      loadData();
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
      loadData();
    } catch {
      message.error('Failed to delete doctor');
    }
  };

  return (
    <div>
      <PageHeader
        title="Physician Directory & Cross-Clinic Shifts"
        subtitle="Manage available hospital specialists, multi-location shift schedules, daily sitting charges, and patient billing"
        extra={[
          <Button
            key="addSpecialty"
            icon={<AppstoreOutlined />}
            onClick={() => setIsNewSpecialtyModalOpen(true)}
            style={{ borderRadius: 8 }}
          >
            + Add Specialty
          </Button>,
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

      {/* Filter Bar with Specialty AND Clinic Location filters */}
      <Card style={{ marginBottom: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={9}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search available doctors by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={selectedSpecialty}
              onChange={(val) => setSelectedSpecialty(val)}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="All">All Medical Specialties ({specialties.length})</Option>
              {specialties.map((spec) => (
                <Option key={spec} value={spec}>
                  {spec}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              value={selectedClinic}
              onChange={(val) => setSelectedClinic(val)}
              style={{ width: '100%' }}
              size="large"
            >
              <Option value="All">All Clinic Locations ({clinics.length})</Option>
              {clinics.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tag
              color="success"
              style={{
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                border: '1px solid #bbf7d0',
                backgroundColor: '#f0fdf4',
                color: '#166534',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                margin: 0,
              }}
            >
              <CheckCircleOutlined style={{ color: '#16a34a' }} />
              {filteredDoctors.length} Available
            </Tag>
          </Col>
        </Row>
      </Card>

      {/* Doctor Grid */}
      {filteredDoctors.length === 0 ? (
        <Card
          style={{
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            padding: '48px 24px',
            background: '#ffffff',
          }}
        >
          <Empty
            description={
              <div>
                <strong style={{ fontSize: 16, color: '#0f172a' }}>No Available Doctors Found</strong>
                <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                  No doctors currently marked Available match your selected filters. Try clearing search filters or add a new doctor.
                </div>
              </div>
            }
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredDoctors.map((doc) => {
          const stats = doc.monthlyStats || {};
          const clinicsPracticed = stats.clinicsBreakdown || [];

          return (
            <Col xs={24} sm={12} lg={8} key={doc.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  border: '1.5px solid #e2e8f0',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                styles={{ body: { padding: 18, flex: 1, display: 'flex', flexDirection: 'column' } }}
              >
                {/* Doctor Header */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <Avatar size={58} src={doc.avatar} style={{ border: '2px solid #0d9488', flexShrink: 0 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Title
                      level={5}
                      style={{
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: '#0f172a',
                        fontWeight: 700,
                      }}
                      title={doc.name || 'Doctor'}
                    >
                      {doc.name || `Dr. ${doc.specialty || 'Physician'}`}
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
                  <div>💼 {doc.experience} Experience • 💵 <strong style={{ color: '#0d9488' }}>${doc.fee}</strong> / visit</div>

                  {/* Practicing Clinics Badges */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 2 }}>
                      <ShopOutlined style={{ marginRight: 4, color: '#0d9488' }} />
                      Practicing Clinic Locations:
                    </div>
                    <Space size={3} wrap>
                      {clinicsPracticed.length > 0 ? (
                        clinicsPracticed.map((cb) => {
                          const cName = cb.clinicName ? String(cb.clinicName).split(' ')[0] : 'Clinic';
                          return (
                            <Tag key={cb.clinicId || Math.random()} color="purple" style={{ fontSize: 10, margin: 0, padding: '1px 5px' }}>
                              {cName} ({cb.daysWorked || 0}d)
                            </Tag>
                          );
                        })
                      ) : (
                        <Tag color="default" style={{ fontSize: 10 }}>Downtown Clinic</Tag>
                      )}
                    </Space>
                  </div>

                  {/* Multi-Clinic Shift Timing Summary */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 2 }}>
                      <ClockCircleOutlined style={{ marginRight: 4, color: '#0284c7' }} />
                      Shift Timings & Locations:
                    </div>
                    <Space size={3} wrap>
                      {(doc.timeSlots || []).map((slot) => (
                        <Tag key={slot} color="blue" style={{ fontSize: 10, marginInlineEnd: 3, padding: '1px 5px' }}>
                          {slot}
                        </Tag>
                      ))}
                    </Space>
                  </div>

                  {/* 1-Month Billing & Sitting Charges Performance Card */}
                  <div
                    style={{
                      marginTop: 8,
                      background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%)',
                      border: '1px solid #ccfbf1',
                      borderRadius: 10,
                      padding: '8px 10px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                      <span style={{ color: '#475569' }}>👥 Treated this month:</span>
                      <strong>{stats.totalPatientsTreated || 0} Patients</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                      <span style={{ color: '#475569' }}>💵 Gross Patient Billing:</span>
                      <strong style={{ color: '#0d9488' }}>${(stats.grossBilled || 0).toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                      <span style={{ color: '#475569' }}>🏥 Clinic Sitting Fees:</span>
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>-${(stats.totalSittingCharges || 0).toLocaleString()}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        paddingTop: 4,
                        borderTop: '1px dashed #cbd5e1',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: '#0f766e' }}>Net Doctor Payout:</span>
                      <span style={{ fontWeight: 800, color: '#0f766e' }}>
                        ${(stats.netDoctorPayout || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 10,
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
                      View Chart
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
          );
        })}
      </Row>
    )}

      {/* ========================================================
          ADD DOCTOR MODAL WITH MULTI-LOCATION CROSS-CLINIC SHIFTS
         ======================================================== */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MedicineBoxOutlined style={{ color: '#0d9488', fontSize: 22 }} />
            <span style={{ fontSize: 18, fontWeight: 700 }}>Add New Doctor & Multi-Clinic Schedule</span>
          </div>
        }
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width="100%"
        style={{ maxWidth: 860 }}
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
              <Form.Item
                name="specialty"
                label={
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span>Medical Specialty</span>
                    <a
                      onClick={() => setIsNewSpecialtyModalOpen(true)}
                      style={{ fontSize: 11, fontWeight: 600, color: '#0d9488' }}
                    >
                      + Add New
                    </a>
                  </div>
                }
                rules={[{ required: true, message: 'Please select specialty' }]}
              >
                <Select placeholder="Select specialty">
                  {specialties.map((spec) => (
                    <Option key={spec} value={spec}>
                      {spec}
                    </Option>
                  ))}
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
              <Form.Item name="fee" label="Patient Consultation Fee ($)" rules={[{ required: true }]}>
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
              WEEKDAY BOX: START & END TIME + CLINIC LOCATION PER SHIFT
             ======================================================== */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: 14,
              padding: '16px',
              marginTop: 6,
              marginBottom: 20,
            }}
          >
            {/* Header with Quick Presets */}
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
                    Multi-Clinic Weekday Shift Timings
                  </span>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Set Shift Start Time, End Time & select which Clinic Branch the doctor sits in.
                </Text>
              </div>

              <Space size={6} wrap>
                <Button size="small" onClick={applyMonToFri} style={{ fontSize: 12, borderRadius: 6 }}>
                  Mon - Fri (2 Shifts)
                </Button>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={copyMondaySlotsToAll}
                  style={{ fontSize: 12, borderRadius: 6, color: '#0d9488', borderColor: '#0d9488' }}
                >
                  Copy Mon Shifts to All
                </Button>
              </Space>
            </div>

            {/* Weekdays List */}
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
                            {dayData.slots.length} {dayData.slots.length === 1 ? 'Shift' : 'Shifts'} Scheduled
                          </Tag>
                        ) : (
                          <Tag color="default" style={{ margin: 0, color: '#94a3b8', fontSize: 11 }}>
                            Day Off
                          </Tag>
                        )}
                      </div>

                      {/* Add Shift Button */}
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
                        + Add Shift / Clinic
                      </Button>
                    </div>

                    {/* Shifts with Start Time, End Time & Clinic Branch Selection */}
                    {isEnabled && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                        {dayData.slots.length === 0 ? (
                          <div style={{ padding: '8px 12px', background: '#fef3c7', borderRadius: 8, fontSize: 12, color: '#b45309' }}>
                            No shifts configured for this day. Click "+ Add Shift / Clinic" above.
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
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#0f766e', minWidth: 50 }}>
                                Shift {index + 1}:
                              </span>

                              {/* Start Time */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>From:</Text>
                                <Select
                                  size="small"
                                  value={slot.start}
                                  onChange={(val) => handleUpdateSlotField(key, slot.id, 'start', val)}
                                  style={{ width: 110 }}
                                  options={TIME_OPTIONS.map((t) => ({ label: t, value: t }))}
                                />
                              </div>

                              <span style={{ color: '#0d9488', fontSize: 12, fontWeight: 700 }}>to</span>

                              {/* End Time */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>To:</Text>
                                <Select
                                  size="small"
                                  value={slot.end}
                                  onChange={(val) => handleUpdateSlotField(key, slot.id, 'end', val)}
                                  style={{ width: 110 }}
                                  options={TIME_OPTIONS.map((t) => ({ label: t, value: t }))}
                                />
                              </div>

                              {/* Clinic Location Selectbox */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <ShopOutlined style={{ color: '#0d9488' }} />
                                <Text type="secondary" style={{ fontSize: 11 }}>At Clinic:</Text>
                                <Select
                                  size="small"
                                  value={slot.clinicId}
                                  onChange={(val) => handleUpdateSlotField(key, slot.id, 'clinicId', val)}
                                  style={{ width: 200 }}
                                  options={clinics.map((c) => ({
                                    label: `${c.name} (Base $${c.sittingCharge}/d)`,
                                    value: c.id,
                                  }))}
                                />
                              </div>

                              {/* Doctor Custom Sitting Fee for this Clinic */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <DollarOutlined style={{ color: '#0d9488' }} />
                                <Text type="secondary" style={{ fontSize: 11 }}>Doctor Sitting Fee:</Text>
                                <InputNumber
                                  size="small"
                                  min={0}
                                  max={10000}
                                  prefix="$"
                                  value={
                                    slot.sittingFee !== undefined
                                      ? slot.sittingFee
                                      : clinics.find((c) => c.id === slot.clinicId)?.sittingCharge || 400
                                  }
                                  onChange={(val) => handleUpdateSlotField(key, slot.id, 'sittingFee', val)}
                                  style={{ width: 115 }}
                                />
                                <Text type="secondary" style={{ fontSize: 10 }}>/day</Text>
                              </div>

                              {/* Remove Shift */}
                              <Tooltip title="Delete this shift">
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

      {/* Quick Add Specialty Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AppstoreOutlined style={{ color: '#0d9488', fontSize: 18 }} />
            <span>Add New Medical Specialty</span>
          </div>
        }
        open={isNewSpecialtyModalOpen}
        onCancel={() => setIsNewSpecialtyModalOpen(false)}
        footer={null}
        width="100%"
        style={{ maxWidth: 500 }}
      >
        <Form form={specialtyQuickForm} layout="vertical" onFinish={handleQuickAddSpecialty} style={{ paddingTop: 10 }}>
          <Form.Item
            name="newSpecialtyName"
            label="Specialty Name"
            rules={[{ required: true, message: 'Please enter specialty name' }]}
          >
            <Input placeholder="e.g. Gynecology & Obstetrics, Oncology, Urology" />
          </Form.Item>

          <Form.Item name="clinicIds" label="Associate with Clinics (Optional)">
            <Select
              mode="multiple"
              placeholder="Select clinics offering this specialty"
              options={clinics.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ backgroundColor: '#0d9488', borderRadius: 8, marginTop: 10 }}
          >
            Save Specialty
          </Button>
        </Form>
      </Modal>

      {/* Doctor Details Modal */}
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
