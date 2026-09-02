import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Avatar, Typography, Tag, Button, Input, Select, Rate, Space } from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  StarFilled,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { doctorService } from '../../services/doctorService';
import { BookAppointmentModal } from '../../components/modals/BookAppointmentModal';
import { DoctorDetailsModal } from '../../components/modals/DoctorDetailsModal';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [specialty, setSpecialty] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDoctorForDetails, setSelectedDoctorForDetails] = useState(null);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  useEffect(() => {
    doctorService.getAll().then((data) => {
      setDoctors(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    let result = doctors;
    if (specialty !== 'All') {
      result = result.filter((d) => d.specialty === specialty);
    }
    if (search) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.specialty.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [specialty, search, doctors]);

  return (
    <div>
      <PageHeader
        title="Find & Connect with Doctors"
        subtitle="Browse top certified medical specialists, check schedules, and book tele-visits or clinic appointments"
      />

      {/* Filter Bar */}
      <Card style={{ marginBottom: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search by doctor name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="large"
              allowClear
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
              value={specialty}
              onChange={(val) => setSpecialty(val)}
              style={{ width: '100%' }}
              size="large"
            >
              {doctorService.getSpecialties().map((s) => (
                <Option key={s} value={s}>
                  {s === 'All' ? 'All Specialties' : s}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Doctor Cards */}
      <Row gutter={[20, 20]}>
        {filtered.map((doc) => (
          <Col xs={24} sm={12} lg={8} key={doc.id}>
            <Card
              hoverable
              style={{ borderRadius: 16, border: '1px solid #e2e8f0', height: '100%' }}
              styles={{ body: { padding: 22 } }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Avatar size={68} src={doc.avatar} style={{ border: '2px solid #0d9488' }} />
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    {doc.name}
                  </Title>
                  <Tag color="geekblue" style={{ marginTop: 4 }}>
                    {doc.specialty}
                  </Tag>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <StarFilled style={{ color: '#f59e0b', fontSize: 13 }} />
                    <Text strong style={{ fontSize: 12 }}>
                      {doc.rating}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      ({doc.reviewsCount} reviews)
                    </Text>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14, fontSize: 13, color: '#64748b' }}>
                <div>🎓 {doc.education}</div>
                <div>💼 {doc.experience} Experience</div>
                <div style={{ marginTop: 6, fontWeight: 700, color: '#0d9488', fontSize: 15 }}>
                  ${doc.fee} <span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>/ consultation</span>
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <Button
                  style={{ flex: 1 }}
                  onClick={() => setSelectedDoctorForDetails(doc)}
                >
                  Profile
                </Button>
                <Button
                  type="primary"
                  icon={<CalendarOutlined />}
                  style={{ flex: 1.2, backgroundColor: '#0d9488', borderRadius: 8 }}
                  onClick={() => setSelectedDoctorForBooking(doc)}
                >
                  Book Visit
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <DoctorDetailsModal
        open={!!selectedDoctorForDetails}
        onCancel={() => setSelectedDoctorForDetails(null)}
        doctor={selectedDoctorForDetails}
        onBook={(doc) => setSelectedDoctorForBooking(doc)}
      />

      <BookAppointmentModal
        open={!!selectedDoctorForBooking}
        onCancel={() => setSelectedDoctorForBooking(null)}
        doctor={selectedDoctorForBooking}
        patient={{ name: 'Alex Morgan', phone: '+1 (555) 901-2345' }}
      />
    </div>
  );
};

export default FindDoctor;
