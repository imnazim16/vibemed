import React, { useState, useEffect } from 'react';
import { Card, Button, Tabs, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { AppointmentsTable } from '../../components/tables/AppointmentsTable';
import { BookAppointmentModal } from '../../components/modals/BookAppointmentModal';
import { appointmentService } from '../../services/appointmentService';

export const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    const data = await appointmentService.getAll();
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    await appointmentService.updateStatus(id, status);
    message.success(`Appointment status updated to ${status}`);
    loadAppointments();
  };

  const getFilteredAppointments = () => {
    if (activeTab === 'all') return appointments;
    return appointments.filter((a) => a.status.toLowerCase() === activeTab.toLowerCase());
  };

  return (
    <div>
      <PageHeader
        title="Hospital Master Appointments"
        subtitle="Full calendar schedule across all clinical departments"
        extra={[
          <Button
            key="book"
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
            onClick={() => setIsBookModalOpen(true)}
          >
            New Appointment
          </Button>,
        ]}
      />

      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k)}
          items={[
            { key: 'all', label: `All (${appointments.length})` },
            { key: 'Scheduled', label: 'Scheduled' },
            { key: 'In-Progress', label: 'In-Progress' },
            { key: 'Confirmed', label: 'Confirmed' },
            { key: 'Cancelled', label: 'Cancelled' },
          ]}
        />

        <AppointmentsTable
          appointments={getFilteredAppointments()}
          loading={loading}
          onStatusChange={handleStatusChange}
          showDoctor={true}
          showPatient={true}
        />
      </Card>

      <BookAppointmentModal
        open={isBookModalOpen}
        onCancel={() => setIsBookModalOpen(false)}
        onSuccess={loadAppointments}
      />
    </div>
  );
};

export default AdminAppointments;
