import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  Popconfirm,
  message,
  Avatar,
  Badge,
  Divider,
} from 'antd';
import {
  ShopOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  DollarOutlined,
  TeamOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { clinicService } from '../../services/clinicService';
import { doctorService } from '../../services/doctorService';

const { Title, Text, Paragraph } = Typography;

export const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState(null);

  const [clinicForm] = Form.useForm();
  const [specialtyForm] = Form.useForm();

  const loadData = async () => {
    const clinicsList = await clinicService.getAll();
    const doctorsList = await doctorService.getAll();
    const specsList = clinicService.getAllSpecialties();

    setClinics(clinicsList);
    setDoctors(doctorsList);
    setSpecialties(specsList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddClinic = () => {
    setEditingClinic(null);
    clinicForm.resetFields();
    clinicForm.setFieldsValue({
      sittingCharge: 400,
      operatingHours: '08:00 AM - 08:00 PM',
      specialties: ['General Medicine'],
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditClinic = (clinic) => {
    setEditingClinic(clinic);
    clinicForm.setFieldsValue({
      name: clinic.name,
      branchCode: clinic.branchCode,
      address: clinic.address,
      phone: clinic.phone,
      email: clinic.email,
      sittingCharge: clinic.sittingCharge,
      operatingHours: clinic.operatingHours,
      specialties: clinic.specialties,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveClinic = async (values) => {
    try {
      if (editingClinic) {
        await clinicService.updateClinic(editingClinic.id, values);
        message.success('Clinic branch updated successfully');
      } else {
        await clinicService.addClinic(values);
        message.success('New clinic location registered');
      }
      setIsAddModalOpen(false);
      loadData();
    } catch (err) {
      message.error(err.message || 'Failed to save clinic');
    }
  };

  const handleDeleteClinic = async (id) => {
    try {
      await clinicService.deleteClinic(id);
      message.success('Clinic branch removed');
      loadData();
    } catch (err) {
      message.error(err.message || 'Cannot delete clinic');
    }
  };

  const handleAddSpecialty = async (values) => {
    const trimmed = values.specialtyName?.trim();
    if (!trimmed) return;
    await clinicService.addSpecialty(trimmed, values.clinicIds || []);
    message.success(`Specialty "${trimmed}" added and linked to selected branches!`);
    specialtyForm.resetFields();
    loadData();
  };

  const handleDeleteSpecialty = async (name) => {
    await clinicService.deleteSpecialty(name);
    message.success(`Specialty "${name}" removed from clinical directory`);
    loadData();
  };

  // Doctors assigned to this clinic
  const getDoctorsForClinic = (clinicId) => {
    return doctors.filter((doc) => {
      const schedule = doc.weekdaySchedule || {};
      return Object.values(schedule).some(
        (day) =>
          day.enabled &&
          day.slots?.some((slot) => slot.clinicId === clinicId)
      );
    });
  };

  return (
    <div>
      <PageHeader
        title="Multi-Location Clinic & Branch Management"
        subtitle="Manage hospital clinic locations, branch-specific medical specialties, and doctor daily sitting charges"
        extra={[
          <Button
            key="specialties"
            icon={<AppstoreOutlined />}
            onClick={() => setIsSpecialtyModalOpen(true)}
            style={{ borderRadius: 8 }}
          >
            Manage Specialties ({specialties.length})
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            onClick={handleOpenAddClinic}
          >
            Add New Clinic Branch
          </Button>,
        ]}
      />

      {/* KPI Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 14, border: '1px solid #e2e8f0', background: '#f0fdfa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: '#0d9488',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                <ShopOutlined />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Total Clinic Branches</Text>
                <Title level={3} style={{ margin: 0, color: '#0f766e' }}>
                  {clinics.length}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 14, border: '1px solid #e2e8f0', background: '#f0f9ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: '#0284c7',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                <AppstoreOutlined />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Clinical Specialties</Text>
                <Title level={3} style={{ margin: 0, color: '#0369a1' }}>
                  {specialties.length}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 14, border: '1px solid #e2e8f0', background: '#fefce8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: '#ca8a04',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                <DollarOutlined />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Avg Daily Sitting Fee</Text>
                <Title level={3} style={{ margin: 0, color: '#a16207' }}>
                  $
                  {clinics.length > 0
                    ? Math.round(
                        clinics.reduce((sum, c) => sum + (c.sittingCharge || 0), 0) / clinics.length
                      )
                    : 350}
                  <span style={{ fontSize: 12, fontWeight: 400, color: '#713f12' }}> /day</span>
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 14, border: '1px solid #e2e8f0', background: '#fdf2f8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: '#db2777',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                <TeamOutlined />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Active Doctors On Roster</Text>
                <Title level={3} style={{ margin: 0, color: '#be185d' }}>
                  {doctors.length}
                </Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Clinics Grid */}
      <Row gutter={[18, 18]}>
        {clinics.map((clinic) => {
          const assignedDocs = getDoctorsForClinic(clinic.id);

          return (
            <Col xs={24} md={12} key={clinic.id}>
              <Card
                style={{
                  borderRadius: 16,
                  border: '1.5px solid #e2e8f0',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                styles={{ body: { padding: 22, flex: 1, display: 'flex', flexDirection: 'column' } }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: clinic.color || '#0d9488',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      }}
                    >
                      <ShopOutlined />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Title level={4} style={{ margin: 0 }}>
                          {clinic.name}
                        </Title>
                        <Tag color="cyan">{clinic.branchCode}</Tag>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12, marginTop: 4 }}>
                        <EnvironmentOutlined />
                        <span>{clinic.address}</span>
                      </div>
                    </div>
                  </div>

                  <Space size="small">
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleOpenEditClinic(clinic)}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Delete Clinic Branch"
                      description={`Remove ${clinic.name}?`}
                      onConfirm={() => handleDeleteClinic(clinic.id)}
                      okText="Yes, Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                </div>

                <Divider style={{ margin: '16px 0 14px' }} />

                {/* Details & Sitting Fee Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {/* Doctor Daily Sitting Charge Badge */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
                      border: '1px solid #ccfbf1',
                      borderRadius: 10,
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <Text style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', textTransform: 'uppercase' }}>
                        Doctor Daily Sitting Charge
                      </Text>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        Facility charge applied per shift sitting
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#0d9488' }}>
                        ${clinic.sittingCharge}
                      </span>
                      <span style={{ fontSize: 11, color: '#64748b' }}> /day</span>
                    </div>
                  </div>

                  {/* Hours and Contact */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, fontSize: 12, color: '#475569' }}>
                    <div>
                      <ClockCircleOutlined style={{ marginRight: 6, color: '#0284c7' }} />
                      <strong>Hours:</strong> {clinic.operatingHours || '08:00 AM - 08:00 PM'}
                    </div>
                    <div>
                      <PhoneOutlined style={{ marginRight: 6, color: '#0d9488' }} />
                      <strong>Phone:</strong> {clinic.phone}
                    </div>
                  </div>

                  {/* Supported Specialties */}
                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      🏥 Clinic Specialties Handled:
                    </div>
                    <Space size={4} wrap>
                      {clinic.specialties?.map((spec) => (
                        <Tag key={spec} color="geekblue" style={{ fontSize: 11, marginInlineEnd: 4 }}>
                          {spec}
                        </Tag>
                      ))}
                    </Space>
                  </div>

                  {/* Doctors Practicing at this Clinic */}
                  <div style={{ marginTop: 8, paddingTop: 10, borderTop: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      👨‍⚕️ Physicians On Active Shifts ({assignedDocs.length}):
                    </div>
                    {assignedDocs.length > 0 ? (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {assignedDocs.map((doc) => (
                          <div
                            key={doc.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              padding: '3px 8px',
                              borderRadius: 8,
                              fontSize: 11,
                            }}
                          >
                            <Avatar size={20} src={doc.avatar} />
                            <span>{doc.name}</span>
                            <Tag color="cyan" style={{ fontSize: 9, margin: 0, padding: '0 4px' }}>
                              {doc.specialty}
                            </Tag>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Text type="secondary" style={{ fontSize: 11, fontStyle: 'italic' }}>
                        No physicians currently scheduled for this location.
                      </Text>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Add / Edit Clinic Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShopOutlined style={{ color: '#0d9488', fontSize: 20 }} />
            <span>{editingClinic ? 'Edit Clinic Location' : 'Register New Clinic Branch'}</span>
          </div>
        }
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width="100%"
        style={{ maxWidth: 640 }}
      >
        <Form form={clinicForm} layout="vertical" onFinish={handleSaveClinic} style={{ paddingTop: 12 }}>
          <Row gutter={16}>
            <Col xs={24} sm={15}>
              <Form.Item name="name" label="Clinic Branch Name" rules={[{ required: true, message: 'Please enter clinic name' }]}>
                <Input placeholder="e.g. Downtown Medical Center" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={9}>
              <Form.Item name="branchCode" label="Branch Code" rules={[{ required: true, message: 'Enter code' }]}>
                <Input placeholder="e.g. DMC-01" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={14}>
              <Form.Item name="address" label="Physical Location / Street Address" rules={[{ required: true }]}>
                <Input placeholder="e.g. 742 Evergreen Blvd, Downtown" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item
                name="sittingCharge"
                label="Daily Doctor Sitting Charge ($)"
                rules={[{ required: true }]}
                tooltip="Facility sitting charge deducted per doctor per active day"
              >
                <InputNumber min={0} max={2000} prefix="$" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="Contact Phone">
                <Input placeholder="+1 (555) 000-0000" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="operatingHours" label="Operating Shift Hours">
                <Input placeholder="08:00 AM - 08:00 PM" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="specialties"
            label="Medical Specialties Handled at this Location"
            rules={[{ required: true, message: 'Select at least one specialty' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select specialties for this clinic"
              options={specialties.map((s) => ({ label: s, value: s }))}
              style={{ width: '100%' }}
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            >
              {editingClinic ? 'Update Clinic Location' : 'Save & Register Clinic'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Manage Specialties Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AppstoreOutlined style={{ color: '#0d9488', fontSize: 20 }} />
            <span>Manage Dynamic Medical Specialties</span>
          </div>
        }
        open={isSpecialtyModalOpen}
        onCancel={() => setIsSpecialtyModalOpen(false)}
        footer={null}
        width="100%"
        style={{ maxWidth: 650 }}
      >
        <div style={{ paddingTop: 8 }}>
          <Paragraph type="secondary" style={{ fontSize: 13 }}>
            Add and manage dynamic clinical specialties (e.g. Gynecologist, Neurologist, Dermatologist).
            Newly added specialties will immediately appear in doctor registration and filter dropdowns.
          </Paragraph>

          {/* Add Specialty Form */}
          <Form
            form={specialtyForm}
            layout="vertical"
            onFinish={handleAddSpecialty}
            style={{
              background: '#f8fafc',
              padding: 16,
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              marginBottom: 20,
            }}
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={14}>
                <Form.Item
                  name="specialtyName"
                  label="New Medical Specialty Title"
                  rules={[{ required: true, message: 'Enter specialty name' }]}
                  style={{ margin: 0 }}
                >
                  <Input placeholder="e.g. Gynecology & Obstetrics, Oncology, Urology" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={10}>
                <Form.Item
                  name="clinicIds"
                  label="Assign to Clinic Locations"
                  style={{ margin: 0 }}
                >
                  <Select
                    mode="multiple"
                    placeholder="All or specific branches"
                    options={clinics.map((c) => ({ label: c.name, value: c.id }))}
                    maxTagCount={1}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              style={{ backgroundColor: '#0d9488', marginTop: 14, borderRadius: 6 }}
            >
              Add Specialty to Directory
            </Button>
          </Form>

          {/* Current Specialties List */}
          <div style={{ fontWeight: 700, fontSize: 13, color: '#334155', marginBottom: 10 }}>
            Active Specialties ({specialties.length}):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {specialties.map((spec) => (
              <Tag
                key={spec}
                color="blue"
                closable
                onClose={(e) => {
                  e.preventDefault();
                  handleDeleteSpecialty(spec);
                }}
                style={{ padding: '4px 10px', fontSize: 13, borderRadius: 6 }}
              >
                {spec}
              </Tag>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Clinics;
