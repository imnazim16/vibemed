import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Space, Select, message, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, FileDoneOutlined } from '@ant-design/icons';
import { patientService } from '../../services/patientService';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

export const PrescriptionForm = ({ patientId, doctorName, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const rxItem = {
        medicine: `${values.medicine} (${values.dosage})`,
        dosage: `${values.frequency} for ${values.duration}`,
        doctor: doctorName || 'Dr. Sarah Connor',
        notes: values.instructions,
      };

      await patientService.addPrescription(patientId || 'pat_1', rxItem);
      message.success('Prescription issued and added to patient medical record!');
      form.resetFields();
      if (onSuccess) onSuccess();
    } catch {
      message.error('Failed to issue prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={16}>
        <Col span={14}>
          <Form.Item
            name="medicine"
            label="Medicine / Brand Name"
            rules={[{ required: true, message: 'Enter medicine name' }]}
          >
            <Input placeholder="e.g. Amoxicillin, Lisinopril, Paracetamol" />
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item
            name="dosage"
            label="Dosage Strength"
            rules={[{ required: true, message: 'Enter dosage' }]}
          >
            <Input placeholder="e.g. 500mg, 10mg, 5ml" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="frequency"
            label="Frequency"
            rules={[{ required: true, message: 'Select frequency' }]}
          >
            <Select placeholder="How often">
              <Option value="Once daily (morning)">Once daily (morning)</Option>
              <Option value="Once daily (night)">Once daily (night)</Option>
              <Option value="Twice daily (after meals)">Twice daily (after meals)</Option>
              <Option value="3 times a day">3 times a day</Option>
              <Option value="As needed (SOS)">As needed (SOS)</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true, message: 'Select duration' }]}
          >
            <Select placeholder="Treatment duration">
              <Option value="3 days">3 Days</Option>
              <Option value="5 days">5 Days</Option>
              <Option value="7 days">7 Days</Option>
              <Option value="14 days">14 Days</Option>
              <Option value="1 month">1 Month (Chronic)</Option>
              <Option value="3 months">3 Months</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="instructions" label="Special Instructions / Dietary Advice">
        <TextArea rows={2} placeholder="e.g. Take with plenty of water. Avoid alcohol. Low sodium diet." />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<FileDoneOutlined />}
          style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
          block
        >
          Sign & Issue e-Prescription
        </Button>
      </Form.Item>
    </Form>
  );
};
