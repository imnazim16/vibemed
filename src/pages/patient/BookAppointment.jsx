import React from 'react';
import { Card, Typography } from 'antd';
import { PageHeader } from '../../components/common/PageHeader';
import { AppointmentForm } from '../../components/forms/AppointmentForm';
import { useNavigate } from 'react-router-dom';

const { Paragraph } = Typography;

export const BookAppointment = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <PageHeader
        title="Schedule a Medical Consultation"
        subtitle="Choose your preferred doctor, time slot, and consultation mode"
      />

      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0', padding: 12 }}>
        <AppointmentForm
          patientName="Alex Morgan"
          patientPhone="+1 (555) 901-2345"
          onSuccess={() => {
            navigate('/patient/dashboard');
          }}
        />
      </Card>
    </div>
  );
};

export default BookAppointment;
