// VibeMed Patient Service with Live Backend API, Isolated Error Boundaries & Graceful Fallback
import apiClient from './apiClient';

const INITIAL_PATIENTS = [
  {
    id: 'pat_1',
    name: 'Alex Morgan',
    firstName: 'Alex',
    lastName: 'Morgan',
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
    firstName: 'David',
    lastName: 'Miller',
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
    firstName: 'Elena',
    lastName: 'Rostova',
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
    firstName: 'Robert',
    lastName: 'Thorne',
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

let lastApiStatus = {
  tested: false,
  isLive: false,
  hasError: false,
  errorMessage: null,
  empty: false,
  count: INITIAL_PATIENTS.length,
};

const mapBackendPatientToUi = (p) => {
  const fullName = p.name || [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Patient';
  let age = p.age || 30;
  if (p.date_of_birth) {
    const birthYear = new Date(p.date_of_birth).getFullYear();
    if (!isNaN(birthYear)) {
      age = new Date().getFullYear() - birthYear;
    }
  }

  return {
    id: p.id,
    name: fullName,
    firstName: p.first_name || fullName.split(' ')[0],
    lastName: p.last_name || fullName.split(' ').slice(1).join(' '),
    age,
    gender: p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1).toLowerCase() : 'Male',
    bloodGroup: p.blood_group || p.bloodGroup || 'O+',
    phone: p.phone || '',
    email: p.email || (p.user?.email || ''),
    address: p.address || (p.city ? `${p.city}, ${p.state || ''}` : 'Main City'),
    lastVisit: p.last_visit_at ? p.last_visit_at.split('T')[0] : '2026-09-01',
    status: p.status || 'Stable',
    condition: p.condition || p.notes || 'Under Care',
    vitals: p.vitals || {
      bloodPressure: '120/80 mmHg',
      heartRate: '72 bpm',
      glucose: '90 mg/dL',
      temperature: '98.6 °F',
      spo2: '99%',
      bmi: '22.5',
    },
    allergies: Array.isArray(p.allergies) ? p.allergies : ['None'],
    prescriptions: Array.isArray(p.prescriptions) ? p.prescriptions : [],
    history: Array.isArray(p.history) ? p.history : [],
  };
};

export const patientService = {
  /**
   * Fetch all patients with error isolation
   * If API is unreachable or returns 0 records, tracks status and falls back gracefully
   */
  getAll: async () => {
    lastApiStatus.tested = true;
    try {
      const res = await apiClient.get('/reception/patients');
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];

      if (list && list.length > 0) {
        patientsCache = list.map(mapBackendPatientToUi);
        lastApiStatus.isLive = true;
        lastApiStatus.hasError = false;
        lastApiStatus.errorMessage = null;
        lastApiStatus.empty = false;
        lastApiStatus.count = patientsCache.length;
      } else {
        // Live server returned 200 OK but empty patient array
        lastApiStatus.isLive = true;
        lastApiStatus.hasError = false;
        lastApiStatus.errorMessage = null;
        lastApiStatus.empty = true;
        lastApiStatus.count = 0;
      }
    } catch (err) {
      console.warn('API /reception/patients call failed, isolating error to preserve other services:', err.message);
      lastApiStatus.isLive = false;
      lastApiStatus.hasError = true;
      lastApiStatus.errorMessage = err.message || 'Patient API endpoint temporarily unreachable';
      lastApiStatus.empty = false;
      lastApiStatus.count = patientsCache.length;
    }
    return [...patientsCache];
  },

  /**
   * Get latest live status and error state of the patient API
   */
  getApiStatus: () => ({ ...lastApiStatus }),

  getById: async (id) => {
    const isBackendId = typeof id === 'number' || (!isNaN(Number(id)) && !String(id).startsWith('pat_'));
    if (isBackendId) {
      try {
        const res = await apiClient.get(`/reception/patients?search=${id}`);
        const found = res?.data?.data?.[0] || res?.data?.[0];
        if (found) {
          const mapped = mapBackendPatientToUi(found);
          try {
            const rxRes = await apiClient.get(`/doctor/patients/${id}/prescriptions`);
            const rxs = Array.isArray(rxRes?.data) ? rxRes.data : [];
            if (rxs.length > 0) mapped.prescriptions = rxs;
          } catch {
            // Keep default
          }
          return mapped;
        }
      } catch (err) {
        console.warn(`API lookup for patient ${id} failed:`, err.message);
      }
    }

    return patientsCache.find((p) => String(p.id) === String(id)) || null;
  },

  /**
   * Register patient via POST /reception/patients
   */
  addPatient: async (patient) => {
    try {
      const nameParts = (patient.name || '').trim().split(' ');
      const firstName = patient.firstName || nameParts[0] || 'Patient';
      const lastName = patient.lastName || nameParts.slice(1).join(' ') || 'User';

      let dob = patient.date_of_birth;
      if (!dob && patient.age) {
        const birthYear = new Date().getFullYear() - Number(patient.age);
        dob = `${birthYear}-01-01`;
      }

      const payload = {
        first_name: firstName,
        last_name: lastName,
        phone: patient.phone || '+1-555-0300',
        gender: (patient.gender || 'male').toLowerCase(),
        date_of_birth: dob || '1990-01-01',
      };

      const res = await apiClient.post('/reception/patients', payload);
      const created = res?.data || res;
      if (created && created.id) {
        const mapped = mapBackendPatientToUi(created);
        patientsCache = [mapped, ...patientsCache];
        lastApiStatus.count = patientsCache.length;
        lastApiStatus.empty = false;
        return mapped;
      }
    } catch (err) {
      console.warn('API POST /reception/patients failed, registering locally:', err.message);
    }

    // Local fallback
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
      allergies: patient.allergies || ['None'],
      prescriptions: [],
      history: [],
    };
    patientsCache = [newPat, ...patientsCache];
    lastApiStatus.count = patientsCache.length;
    return newPat;
  },

  updatePatient: async (id, updates) => {
    patientsCache = patientsCache.map((p) => (String(p.id) === String(id) ? { ...p, ...updates } : p));
    return patientsCache.find((p) => String(p.id) === String(id));
  },

  /**
   * Create prescription via POST /doctor/patients/{id}/prescriptions
   */
  addPrescription: async (patientId, rx) => {
    const isBackendId = typeof patientId === 'number' || (!isNaN(Number(patientId)) && !String(patientId).startsWith('pat_'));
    if (isBackendId) {
      try {
        await apiClient.post(`/doctor/patients/${patientId}/prescriptions`, {
          notes: rx.instructions || rx.dosage || 'Take as directed',
          items: [
            {
              medicine_name: rx.medicine || rx.medicine_name,
              dosage: rx.dosage || '1 unit',
              frequency: rx.frequency || 'Daily',
              duration: rx.duration || '7 days',
              instructions: rx.instructions || 'Complete the course',
            },
          ],
        });
      } catch (err) {
        console.warn(`API prescription creation failed:`, err.message);
      }
    }

    const newRx = {
      ...rx,
      id: `rx_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    patientsCache = patientsCache.map((p) => {
      if (String(p.id) === String(patientId)) {
        return {
          ...p,
          prescriptions: [newRx, ...p.prescriptions],
        };
      }
      return p;
    });

    return newRx;
  },

  addMedicalHistory: async (patientId, record) => {
    const newRecord = {
      ...record,
      id: `hist_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    patientsCache = patientsCache.map((p) => {
      if (String(p.id) === String(patientId)) {
        return {
          ...p,
          lastVisit: newRecord.date,
          history: [newRecord, ...p.history],
        };
      }
      return p;
    });

    return newRecord;
  },
};

export default patientService;
