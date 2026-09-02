import React, { useState, useEffect } from 'react';
import { Card, Tabs, message } from 'antd';
import { PageHeader } from '../../components/common/PageHeader';
import { AppointmentsTable } from '../../components/tables/AppointmentsTable';
import { appointmentService } from '../../services/appointmentService';

export const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const loadAppointments = async () => {
    setLoading(true);
    const data = await appointmentService.getByDoctor();
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    await appointmentService.updateStatus(id, status);
    message.success(`Status updated to ${status}`);
    loadAppointments();
  };

  const getFiltered = () => {
    if (activeTab === 'all') return appointments;
    return appointments.filter((a) => a.status.toLowerCase() === activeTab.toLowerCase());
  };

  return (
    <div>
      <PageHeader
        title="My Clinical Appointments"
        subtitle="Manage patient consultations, schedule changes, and tele-visit links"
      />

      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `All Consultations (${appointments.length})` },
            { key: 'In-Progress', label: 'In-Progress' },
            { key: 'Confirmed', label: 'Confirmed' },
            { key: 'Scheduled', label: 'Scheduled' },
          ]}
        />

        <AppointmentsTable
          appointments={getFiltered()}
          loading={loading}
          onStatusChange={handleStatusChange}
          showDoctor={false}
          showPatient={true}
        />
      </Card>
    </div>
  );
};

export default DoctorAppointments;
