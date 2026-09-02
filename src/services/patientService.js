// Mock Patient Service

const INITIAL_PATIENTS = [
  {
    id: 'pat_1',
    name: 'Alex Morgan',
    age: 32,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 (555) 901-2345',
    email: 'alex.morgan@vibemed.health',
    address: '742 Evergreen Terrace, Springfield',
    lastVisit: '2026-08-28',
    status: 'Stable',
    condition: 'Hypertension Stage 1',
    vitals: {
      bloodPressure: '128/84 mmHg',
      heartRate: '72 bpm',
      glucose: '95 mg/dL',
      temperature: '98.6 °F',
      spo2: '99%',
      bmi: '23.4',
    },
    allergies: ['Penicillin', 'Peanuts'],
    prescriptions: [
      { id: 'rx_1', medicine: 'Lisinopril 10mg', dosage: 'Once daily (morning)', doctor: 'Dr. Sarah Connor', date: '2026-08-28', status: 'Active' },
      { id: 'rx_2', medicine: 'Omega-3 Fish Oil 1000mg', dosage: 'Twice daily', doctor: 'Dr. Sarah Connor', date: '2026-08-28', status: 'Active' },
    ],
    history: [
      { id: 'hist_1', date: '2026-08-28', doctor: 'Dr. Sarah Connor', diagnosis: 'Blood pressure follow-up', notes: 'Patient reports improved sleep and lower stress.' },
      { id: 'hist_2', date: '2026-06-15', doctor: 'Dr. James Wilson', diagnosis: 'Migraine evaluation', notes: 'Prescribed hydration plan and light sensitivity care.' },
    ],
  },
  {
    id: 'pat_2',
    name: 'David Miller',
    age: 48,
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+1 (555) 812-3456',
    email: 'david.miller@example.com',
    address: '104 Ocean Drive, Miami',
    lastVisit: '2026-08-30',
    status: 'Monitoring',
    condition: 'Type 2 Diabetes',
    vitals: {
      bloodPressure: '135/88 mmHg',
      heartRate: '78 bpm',
      glucose: '138 mg/dL',
      temperature: '98.4 °F',
      spo2: '98%',
      bmi: '27.1',
    },
    allergies: ['Sulfa drugs'],
    prescriptions: [
      { id: 'rx_3', medicine: 'Metformin 500mg', dosage: 'Twice daily with meals', doctor: 'Dr. Sarah Connor', date: '2026-08-30', status: 'Active' },
    ],
    history: [
      { id: 'hist_3', date: '2026-08-30', doctor: 'Dr. Sarah Connor', diagnosis: 'Routine Diabetic Screening', notes: 'HbA1c levels slightly elevated, diet plan revised.' },
    ],
  },
  {
    id: 'pat_3',
    name: 'Elena Rostova',
    age: 26,
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '+1 (555) 723-4567',
    email: 'elena.rostova@example.com',
    address: '52 Park Ave, New York',
    lastVisit: '2026-09-01',
    status: 'Recovered',
    condition: 'Seasonal Bronchitis',
    vitals: {
      bloodPressure: '118/75 mmHg',
      heartRate: '68 bpm',
      glucose: '88 mg/dL',
      temperature: '98.2 °F',
      spo2: '100%',
      bmi: '21.0',
    },
    allergies: ['None'],
    prescriptions: [
      { id: 'rx_4', medicine: 'Albuterol Inhaler', dosage: 'As needed for wheezing', doctor: 'Dr. Emily Chen', date: '2026-09-01', status: 'Completed' },
    ],
    history: [
      { id: 'hist_4', date: '2026-09-01', doctor: 'Dr. Emily Chen', diagnosis: 'Respiratory checkup', notes: 'Lungs clear, symptom free.' },
    ],
  },
  {
    id: 'pat_4',
    name: 'Robert Thorne',
    age: 61,
    gender: 'Male',
    bloodGroup: 'AB-',
    phone: '+1 (555) 634-5678',
    email: 'robert.thorne@example.com',
    address: '88 River Road, Seattle',
    lastVisit: '2026-08-20',
    status: 'Under Treatment',
    condition: 'Osteoarthritis (Right Knee)',
    vitals: {
      bloodPressure: '130/82 mmHg',
      heartRate: '70 bpm',
      glucose: '92 mg/dL',
      temperature: '98.6 °F',
      spo2: '99%',
      bmi: '25.3',
    },
    allergies: ['Aspirin'],
    prescriptions: [
      { id: 'rx_5', medicine: 'Celecoxib 200mg', dosage: 'Once daily after breakfast', doctor: 'Dr. Marcus Reynolds', date: '2026-08-20', status: 'Active' },
    ],
    history: [
      { id: 'hist_5', date: '2026-08-20', doctor: 'Dr. Marcus Reynolds', diagnosis: 'Knee Joint Therapy', notes: 'Recommended 6 physical therapy sessions.' },
    ],
  },
];

let patientsCache = [...INITIAL_PATIENTS];

export const patientService = {
  getAll: async () => {
    return [...patientsCache];
  },

  getById: async (id) => {
    return patientsCache.find((p) => p.id === id) || null;
  },

  addPatient: async (patient) => {
    const newPat = {
      ...patient,
      id: `pat_${Date.now()}`,
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Stable',
      vitals: patient.vitals || {
        bloodPressure: '120/80 mmHg',
        heartRate: '72 bpm',
        glucose: '90 mg/dL',
        temperature: '98.6 °F',
        spo2: '99%',
        bmi: '22.5',
      },
      allergies: patient.allergies || [],
      prescriptions: [],
      history: [],
    };
    patientsCache = [newPat, ...patientsCache];
    return newPat;
  },

  updatePatient: async (id, updates) => {
    patientsCache = patientsCache.map((p) => (p.id === id ? { ...p, ...updates } : p));
    return patientsCache.find((p) => p.id === id);
  },

  addPrescription: async (patientId, rx) => {
    const newRx = {
      ...rx,
      id: `rx_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    patientsCache = patientsCache.map((p) =>
      p.id === patientId ? { ...p, prescriptions: [newRx, ...(p.prescriptions || [])] } : p
    );
    return newRx;
  },
};
