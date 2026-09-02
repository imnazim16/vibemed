import React from 'react';
import { Modal } from 'antd';
import { AppointmentForm } from '../forms/AppointmentForm';

export const BookAppointmentModal = ({ open, onCancel, onSuccess, patient, doctor }) => {
  return (
    <Modal
      title="Book Doctor Consultation"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <div style={{ paddingTop: 12 }}>
        <AppointmentForm
          onSuccess={() => {
            if (onSuccess) onSuccess();
            if (onCancel) onCancel();
          }}
          patientName={patient?.name}
          patientPhone={patient?.phone}
          initialValues={{
            doctorId: doctor?.id,
          }}
        />
      </div>
    </Modal>
  );
};
