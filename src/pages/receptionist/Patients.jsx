import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Modal, Form, Select, message } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { PatientsTable } from '../../components/tables/PatientsTable';
import { PatientDetailsModal } from '../../components/modals/PatientDetailsModal';
import { BookAppointmentModal } from '../../components/modals/BookAppointmentModal';
import { patientService } from '../../services/patientService';

const { Option } = Select;

export const ReceptionistPatients = () => {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [bookingPatient, setBookingPatient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    const data = await patientService.getAll();
    setPatients(data);
    setFiltered(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!search) setFiltered(patients);
    else {
      setFiltered(
        patients.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.phone.includes(search)
        )
      );
    }
  }, [search, patients]);

  const handleAddPatient = async (values) => {
    try {
      await patientService.addPatient(values);
      message.success('Patient admitted to clinic records!');
      setIsAddModalOpen(false);
      form.resetFields();
      loadData();
    } catch {
      message.error('Failed to register patient');
    }
  };

  return (
    <div>
      <PageHeader
        title="Front Desk Patient Directory & Intake"
        subtitle="Search patient records, register walk-in patients, and book same-day appointments"
        extra={[
          <Button
            key="intake"
            type="primary"
            icon={<UserAddOutlined />}
            style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            onClick={() => setIsAddModalOpen(true)}
          >
            New Patient Intake
          </Button>,
        ]}
      />

      <Card style={{ marginBottom: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          placeholder="Lookup patient by name or phone number..."
          size="large"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </Card>

      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <PatientsTable
          patients={filtered}
          loading={loading}
          onViewDetails={(pat) => setSelectedPatient(pat)}
          onBookAppointment={(pat) => setBookingPatient(pat)}
        />
      </Card>

      <PatientDetailsModal
        open={!!selectedPatient}
        onCancel={() => setSelectedPatient(null)}
        patient={selectedPatient}
      />

      <BookAppointmentModal
        open={!!bookingPatient}
        onCancel={() => setBookingPatient(null)}
        patient={bookingPatient}
        onSuccess={loadData}
      />

      <Modal
        title="Front Desk Patient Intake"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPatient} style={{ paddingTop: 12 }}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Patient Name" />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
            <Input placeholder="+1 (555) 000-0000" />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input type="number" placeholder="28" />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select placeholder="Select Gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="bloodGroup" label="Blood Group">
            <Select placeholder="Select Blood Group">
              <Option value="O+">O+</Option>
              <Option value="A+">A+</Option>
              <Option value="B+">B+</Option>
              <Option value="AB+">AB+</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            >
              Admit & Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReceptionistPatients;
