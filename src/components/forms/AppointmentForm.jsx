import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, TimePicker, Button, Radio, Row, Col, message } from 'antd';
import { CalendarOutlined, UserOutlined, PhoneOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';

const { Option } = Select;
const { TextArea } = Input;

export const AppointmentForm = ({ onSuccess, initialValues, patientName, patientPhone }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    doctorService.getAll().then(setDoctors);
    if (patientName) {
      form.setFieldsValue({
        patientName,
        patientPhone,
      });
    }
  }, [patientName, patientPhone, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const selectedDoc = doctors.find((d) => d.id === values.doctorId);
      const newAppointment = {
        patientName: values.patientName,
        patientPhone: values.patientPhone,
        doctorId: values.doctorId,
        doctorName: selectedDoc ? selectedDoc.name : 'Dr. Specialist',
        specialty: selectedDoc ? selectedDoc.specialty : 'General Medicine',
        date: values.date ? values.date.format('YYYY-MM-DD') : '2026-09-03',
        time: values.time ? values.time.format('hh:mm A') : '10:00 AM',
        type: values.type,
        symptoms: values.symptoms,
        priority: values.priority || 'Normal',
      };

      await appointmentService.bookAppointment(newAppointment);
      message.success('Appointment booked successfully!');
      form.resetFields();
      if (onSuccess) onSuccess();
    } catch {
      message.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        type: 'Video Consultation',
        priority: 'Normal',
        ...initialValues,
      }}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="patientName"
            label="Patient Name"
            rules={[{ required: true, message: 'Please enter patient name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="patientPhone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter contact number' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="+1 (555) 000-0000" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="doctorId"
        label="Select Doctor / Specialist"
        rules={[{ required: true, message: 'Please select a doctor' }]}
      >
        <Select placeholder="Choose specialist" size="large">
          {doctors.map((doc) => (
            <Option key={doc.id} value={doc.id}>
              {doc.name} — {doc.specialty} (${doc.fee})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="date"
            label="Appointment Date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker style={{ width: '100%' }} size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="time"
            label="Preferred Time Slot"
            rules={[{ required: true, message: 'Please select a time' }]}
          >
            <TimePicker use12Hours format="h:mm a" style={{ width: '100%' }} size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <Form.Item name="type" label="Consultation Mode">
            <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
              <Radio.Button value="Video Consultation">Virtual (Video)</Radio.Button>
              <Radio.Button value="In-Clinic Checkup">In-Person Clinic</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name="priority" label="Urgency Priority">
            <Radio.Group>
              <Radio value="Normal">Normal</Radio>
              <Radio value="High">Urgent</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="symptoms" label="Chief Complaints / Symptoms">
        <TextArea rows={3} placeholder="Describe medical symptoms, recent conditions or reason for visit..." />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          icon={<CalendarOutlined />}
          style={{
            backgroundColor: '#0d9488',
            borderRadius: 8,
          }}
        >
          Confirm & Schedule Appointment
        </Button>
      </Form.Item>
    </Form>
  );
};
