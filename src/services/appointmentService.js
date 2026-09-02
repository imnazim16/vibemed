// Mock Appointment & Queue Service

const INITIAL_APPOINTMENTS = [
  {
    id: 'apt_101',
    patientId: 'pat_1',
    patientName: 'Alex Morgan',
    patientPhone: '+1 (555) 901-2345',
    doctorId: 'doc_1',
    doctorName: 'Dr. Sarah Connor',
    specialty: 'Cardiology',
    date: '2026-09-02',
    time: '10:30 AM',
    type: 'Video Consultation',
    status: 'In-Progress',
    symptoms: 'Mild chest tightness after exercise, blood pressure monitoring.',
    tokenNumber: 'A-12',
    priority: 'Normal',
  },
  {
    id: 'apt_102',
    patientId: 'pat_2',
    patientName: 'David Miller',
    patientPhone: '+1 (555) 812-3456',
    doctorId: 'doc_1',
    doctorName: 'Dr. Sarah Connor',
    specialty: 'Cardiology',
    date: '2026-09-02',
    time: '11:15 AM',
    type: 'In-Clinic Checkup',
    status: 'Confirmed',
    symptoms: 'Routine diabetic checkup & ECG review.',
    tokenNumber: 'A-13',
    priority: 'High',
  },
  {
    id: 'apt_103',
    patientId: 'pat_3',
    patientName: 'Elena Rostova',
    patientPhone: '+1 (555) 723-4567',
    doctorId: 'doc_3',
    doctorName: 'Dr. Emily Chen',
    specialty: 'Pediatrics',
    date: '2026-09-02',
    time: '01:00 PM',
    type: 'Video Consultation',
    status: 'Scheduled',
    symptoms: 'Follow-up for seasonal asthma inhaler refill.',
    tokenNumber: 'P-05',
    priority: 'Normal',
  },
  {
    id: 'apt_104',
    patientId: 'pat_4',
    patientName: 'Robert Thorne',
    patientPhone: '+1 (555) 634-5678',
    doctorId: 'doc_4',
    doctorName: 'Dr. Marcus Reynolds',
    specialty: 'Orthopedics',
    date: '2026-09-03',
    time: '09:00 AM',
    type: 'In-Clinic Checkup',
    status: 'Scheduled',
    symptoms: 'Knee joint stiffness and MRI scan assessment.',
    tokenNumber: 'O-02',
    priority: 'Normal',
  },
];

let appointmentsCache = [...INITIAL_APPOINTMENTS];

export const appointmentService = {
  getAll: async () => {
    return [...appointmentsCache];
  },

  getByDoctor: async (doctorId) => {
    return appointmentsCache.filter((a) => a.doctorId === doctorId || !doctorId);
  },

  getByPatient: async (patientId) => {
    return appointmentsCache.filter((a) => a.patientId === patientId || a.patientName === 'Alex Morgan');
  },

  bookAppointment: async (appointment) => {
    const tokenPrefix = (appointment.specialty || 'GEN').charAt(0).toUpperCase();
    const tokenNum = Math.floor(Math.random() * 80) + 10;

    const newApt = {
      ...appointment,
      id: `apt_${Date.now()}`,
      status: 'Scheduled',
      tokenNumber: `${tokenPrefix}-${tokenNum}`,
      priority: appointment.priority || 'Normal',
    };
    appointmentsCache = [newApt, ...appointmentsCache];
    return newApt;
  },

  updateStatus: async (id, status) => {
    appointmentsCache = appointmentsCache.map((a) => (a.id === id ? { ...a, status } : a));
    return appointmentsCache.find((a) => a.id === id);
  },

  cancelAppointment: async (id) => {
    appointmentsCache = appointmentsCache.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a));
    return true;
  },

  getQueue: async () => {
    return appointmentsCache.filter((a) => a.date === '2026-09-02');
  },
};
