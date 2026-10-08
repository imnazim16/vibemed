import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Modal, Form, Select, message, Alert } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { PatientsTable } from '../../components/tables/PatientsTable';
import { PatientDetailsModal } from '../../components/modals/PatientDetailsModal';
import { BookAppointmentModal } from '../../components/modals/BookAppointmentModal';
import { patientService } from '../../services/patientService';

const { Option } = Select;

export const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [bookingPatient, setBookingPatient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [apiNotice, setApiNotice] = useState(null);
  const [form] = Form.useForm();

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAll();
      setPatients(data || []);
      setFilteredPatients(data || []);

      const status = patientService.getApiStatus();
      if (status.hasError) {
        setApiNotice({
          title: 'Live Patient Records Temporarily Offline',
          description:
            'The remote Patient API is currently unreachable. Showing local EHR directory. Note that all other modules (Doctors Roster, Clinics, Revenue, and Appointments) are working normally.',
          type: 'warning',
        });
      } else if (status.empty) {
        setApiNotice({
          title: 'No Patient Records Found on Server',
          description:
            'No patient records have been added to this tenant database yet. Use "Register Patient" to admit your first patient. Other system sections are fully active.',
          type: 'info',
        });
      } else {
        setApiNotice(null);
      }
    } catch (err) {
      console.error('Error fetching patient list:', err);
      setApiNotice({
        title: 'Patient Directory Service Notice',
        description: 'Unable to synchronize with live patient database. Using local cache. Other system modules remain fully functional.',
        type: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.phone.includes(search) ||
            p.condition?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, patients]);

  const handleAddPatient = async (values) => {
    try {
      await patientService.addPatient(values);
      message.success('Patient registered successfully!');
      setIsAddModalOpen(false);
      form.resetFields();
      loadPatients();
    } catch {
      message.error('Failed to register patient');
    }
  };

  return (
    <div>
      <PageHeader
        title="Patient Records & Electronic Health Files (EHR)"
        subtitle="Search and review medical histories, active treatments, and emergency vitals"
        extra={[
          <Button
            key="add"
            type="primary"
            icon={<UserAddOutlined />}
            style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            onClick={() => setIsAddModalOpen(true)}
          >
            Register Patient
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
          placeholder="Search by patient name, phone number or medical condition..."
          size="large"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </Card>

      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <PatientsTable
          patients={filteredPatients}
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
        onSuccess={loadPatients}
      />

      {/* Add Patient Modal */}
      <Modal
        title="Register New Patient"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPatient}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. John Doe" />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input type="number" placeholder="e.g. 45" />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select placeholder="Select gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="bloodGroup" label="Blood Group" rules={[{ required: true }]}>
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
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="+1 (555) 000-0000" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" placeholder="patient@example.com" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea placeholder="Enter residential address" />
          </Form.Item>
          <Form.Item name="condition" label="Initial Diagnosis / Medical Reason">
            <Input placeholder="e.g. Annual physical exam" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#0d9488' }}>
            Save Patient File
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPatients;
