import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Modal, Form, Select, message, Alert } from 'antd';
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
  const [apiNotice, setApiNotice] = useState(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAll();
      setPatients(data || []);
      setFiltered(data || []);

      const status = patientService.getApiStatus();
      if (status.hasError) {
        setApiNotice({
          title: 'Patient Directory Service Notice',
          description:
            'Remote patient service is currently unreachable. Operating from local cache. Queue and front-desk check-ins continue working normally.',
          type: 'warning',
        });
      } else if (status.empty) {
        setApiNotice({
          title: 'No Patient Records on Server',
          description: 'No patient records currently found on the server. You can intake walk-in patients using "Admit Walk-in Patient".',
          type: 'info',
        });
      } else {
        setApiNotice(null);
      }
    } catch (err) {
      console.error('Error fetching patient list:', err);
      setApiNotice({
        title: 'Service Notice',
        description: 'Using local patient directory. Other clinic operations remain active.',
        type: 'warning',
      });
    } finally {
      setLoading(false);
    }
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
            Admit Walk-in Patient
          </Button>,
        ]}
      />

      {/* Patient API Notice */}
      {apiNotice && (
        <Alert
          message={apiNotice.title}
          description={apiNotice.description}
          type={apiNotice.type}
          showIcon
          closable
          style={{
            marginBottom: 20,
            borderRadius: 12,
            border: apiNotice.type === 'warning' ? '1px solid #fed7aa' : '1px solid #bae6fd',
          }}
        />
      )}

      <Card style={{ marginBottom: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          placeholder="Search by patient name or phone number..."
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

      {/* Patient Details Modal */}
      <PatientDetailsModal
        open={!!selectedPatient}
        onCancel={() => setSelectedPatient(null)}
        patient={selectedPatient}
      />

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        open={!!bookingPatient}
        onCancel={() => setBookingPatient(null)}
        patient={bookingPatient}
        onSuccess={loadData}
      />

      {/* Add Patient Modal */}
      <Modal
        title="Admit Walk-in / New Patient"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPatient}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. David Miller" />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
            <Input placeholder="+1 (555) 000-0000" />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input type="number" placeholder="e.g. 35" />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select placeholder="Select gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="bloodGroup" label="Blood Group">
            <Select placeholder="Select blood group">
              <Option value="A+">A+</Option>
              <Option value="A-">A-</Option>
              <Option value="B+">B+</Option>
              <Option value="B-">B-</Option>
              <Option value="AB+">AB+</Option>
              <Option value="AB-">AB-</Option>
              <Option value="O+">O+</Option>
              <Option value="O-">O-</Option>
            </Select>
          </Form.Item>
          <Form.Item name="condition" label="Reason for Visit / Symptoms">
            <Input placeholder="e.g. Flu symptoms, routine check" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#0d9488' }}>
            Admit Patient
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ReceptionistPatients;
