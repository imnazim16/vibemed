import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { PatientsTable } from '../../components/tables/PatientsTable';
import { PatientDetailsModal } from '../../components/modals/PatientDetailsModal';
import { patientService } from '../../services/patientService';

export const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    patientService.getAll().then((data) => {
      setPatients(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(patients);
    } else {
      setFiltered(
        patients.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.condition?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, patients]);

  return (
    <div>
      <PageHeader
        title="Assigned Patients & Health Charts"
        subtitle="Review medical records, vital histories, allergies and active treatments"
      />

      <Card style={{ marginBottom: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          placeholder="Search patient by name or diagnosis..."
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
        />
      </Card>

      <PatientDetailsModal
        open={!!selectedPatient}
        onCancel={() => setSelectedPatient(null)}
        patient={selectedPatient}
      />
    </div>
  );
};

export default DoctorPatients;
