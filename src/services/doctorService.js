// Mock Doctor Service with Multi-Clinic Shift Timing & Revenue Calculations
import { clinicService } from './clinicService';

const makeSchedule = (shiftsConfig) => {
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const sched = {};
  allDays.forEach((day) => {
    const isAvailable = shiftsConfig.days.includes(day);
    sched[day] = {
      enabled: isAvailable,
      slots: isAvailable ? [...shiftsConfig.slots] : [],
    };
  });
  return sched;
};

const INITIAL_DOCTORS = [
  {
    id: 'doc_1',
    name: 'Dr. Sarah Connor',
    specialty: 'Cardiology',
    title: 'Senior Cardiologist & Surgeon',
    experience: '14 years',
    rating: 4.9,
    reviewsCount: 128,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    fee: 150,
    status: 'Available',
    department: 'Cardiovascular Care',
    education: 'Johns Hopkins School of Medicine',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM - 01:00 PM @ Downtown', '04:00 PM - 08:00 PM @ Westside'],
    weekdaySchedule: makeSchedule({
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      slots: [
        {
          id: 'shift_1',
          start: '09:00 AM',
          end: '01:00 PM',
          clinicId: 'clinic_1',
          clinicName: 'Downtown Medical Center',
        },
        {
          id: 'shift_2',
          start: '04:00 PM',
          end: '08:00 PM',
          clinicId: 'clinic_2',
          clinicName: 'Westside Family Care Clinic',
        },
      ],
    }),
    phone: '+1 (555) 234-5678',
    email: 'dr.sarah@vibemed.health',
    patientsCount: 420,
    // Monthly Financial & Patient Performance Data
    monthlyStats: {
      month: 'September 2026',
      totalPatientsTreated: 120,
      grossBilled: 18000, // 120 * $150
      totalSittingCharges: 12200,
      netDoctorPayout: 5800,
      clinicsBreakdown: [
        {
          clinicId: 'clinic_1',
          clinicName: 'Downtown Medical Center',
          daysWorked: 16,
          sittingFeePerDay: 500,
          totalSittingFee: 8000,
          patientsTreated: 72,
          amountBilled: 10800,
          netPayout: 2800,
        },
        {
          clinicId: 'clinic_2',
          clinicName: 'Westside Family Care Clinic',
          daysWorked: 12,
          sittingFeePerDay: 350,
          totalSittingFee: 4200,
          patientsTreated: 48,
          amountBilled: 7200,
          netPayout: 3000,
        },
      ],
    },
  },
  {
    id: 'doc_2',
    name: 'Dr. James Wilson',
    specialty: 'Neurology',
    title: 'Head of Neurology',
    experience: '18 years',
    rating: 4.8,
    reviewsCount: 94,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    fee: 175,
    status: 'In Consultation',
    department: 'Neurology Department',
    education: 'Harvard Medical School',
    availability: ['Mon', 'Wed', 'Fri'],
    timeSlots: ['10:00 AM - 01:00 PM @ Downtown', '03:00 PM - 07:00 PM @ Metro Pavilion'],
    weekdaySchedule: makeSchedule({
      days: ['Mon', 'Wed', 'Fri'],
      slots: [
        {
          id: 'shift_1',
          start: '10:00 AM',
          end: '01:00 PM',
          clinicId: 'clinic_1',
          clinicName: 'Downtown Medical Center',
        },
        {
          id: 'shift_2',
          start: '03:00 PM',
          end: '07:00 PM',
          clinicId: 'clinic_3',
          clinicName: 'Metro Health Pavilion',
        },
      ],
    }),
    phone: '+1 (555) 345-6789',
    email: 'dr.wilson@vibemed.health',
    patientsCount: 310,
    monthlyStats: {
      month: 'September 2026',
      totalPatientsTreated: 76,
      grossBilled: 13300, // 76 * $175
      totalSittingCharges: 9800,
      netDoctorPayout: 3500,
      clinicsBreakdown: [
        {
          clinicId: 'clinic_1',
          clinicName: 'Downtown Medical Center',
          daysWorked: 10,
          sittingFeePerDay: 500,
          totalSittingFee: 5000,
          patientsTreated: 46,
          amountBilled: 8050,
          netPayout: 3050,
        },
        {
          clinicId: 'clinic_3',
          clinicName: 'Metro Health Pavilion',
          daysWorked: 12,
          sittingFeePerDay: 400,
          totalSittingFee: 4800,
          patientsTreated: 30,
          amountBilled: 5250,
          netPayout: 450,
        },
      ],
    },
  },
  {
    id: 'doc_3',
    name: 'Dr. Emily Chen',
    specialty: 'Pediatrics',
    title: 'Pediatric Specialist',
    experience: '9 years',
    rating: 5.0,
    reviewsCount: 180,
    avatar: 'https://images.unsplash.com/photo-1594824813572-c5dfbfd27d7f?w=150&auto=format&fit=crop&q=80',
    fee: 120,
    status: 'Available',
    department: 'Pediatrics Wing',
    education: 'Stanford University Medical Center',
    availability: ['Tue', 'Thu', 'Sat'],
    timeSlots: ['09:00 AM - 01:00 PM @ Westside', '04:00 PM - 08:00 PM @ Northside Urgent'],
    weekdaySchedule: makeSchedule({
      days: ['Tue', 'Thu', 'Sat'],
      slots: [
        {
          id: 'shift_1',
          start: '09:00 AM',
          end: '01:00 PM',
          clinicId: 'clinic_2',
          clinicName: 'Westside Family Care Clinic',
        },
        {
          id: 'shift_2',
          start: '04:00 PM',
          end: '08:00 PM',
          clinicId: 'clinic_4',
          clinicName: 'Northside Urgent Care & Diagnostics',
        },
      ],
    }),
    phone: '+1 (555) 456-7890',
    email: 'dr.emily@vibemed.health',
    patientsCount: 560,
    monthlyStats: {
      month: 'September 2026',
      totalPatientsTreated: 110,
      grossBilled: 13200, // 110 * $120
      totalSittingCharges: 6850,
      netDoctorPayout: 6350,
      clinicsBreakdown: [
        {
          clinicId: 'clinic_2',
          clinicName: 'Westside Family Care Clinic',
          daysWorked: 11,
          sittingFeePerDay: 350,
          totalSittingFee: 3850,
          patientsTreated: 65,
          amountBilled: 7800,
          netPayout: 3950,
        },
        {
          clinicId: 'clinic_4',
          clinicName: 'Northside Urgent Care & Diagnostics',
          daysWorked: 12,
          sittingFeePerDay: 250,
          totalSittingFee: 3000,
          patientsTreated: 45,
          amountBilled: 5400,
          netPayout: 2400,
        },
      ],
    },
  },
  {
    id: 'doc_4',
    name: 'Dr. Marcus Reynolds',
    specialty: 'Orthopedics',
    title: 'Orthopedic & Spine Surgeon',
    experience: '12 years',
    rating: 4.7,
    reviewsCount: 76,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    fee: 160,
    status: 'Available',
    department: 'Orthopedics Clinic',
    education: 'Columbia University Vagelos',
    availability: ['Mon', 'Tue', 'Thu', 'Fri'],
    timeSlots: ['08:30 AM - 12:30 PM @ Westside', '02:30 PM - 06:30 PM @ Northside Urgent'],
    weekdaySchedule: makeSchedule({
      days: ['Mon', 'Tue', 'Thu', 'Fri'],
      slots: [
        {
          id: 'shift_1',
          start: '08:30 AM',
          end: '12:30 PM',
          clinicId: 'clinic_2',
          clinicName: 'Westside Family Care Clinic',
        },
        {
          id: 'shift_2',
          start: '02:30 PM',
          end: '06:30 PM',
          clinicId: 'clinic_4',
          clinicName: 'Northside Urgent Care & Diagnostics',
        },
      ],
    }),
    phone: '+1 (555) 567-8901',
    email: 'dr.marcus@vibemed.health',
    patientsCount: 280,
    monthlyStats: {
      month: 'September 2026',
      totalPatientsTreated: 54,
      grossBilled: 8640,
      totalSittingCharges: 6100,
      netDoctorPayout: 2540,
      clinicsBreakdown: [
        {
          clinicId: 'clinic_2',
          clinicName: 'Westside Family Care Clinic',
          daysWorked: 10,
          sittingFeePerDay: 350,
          totalSittingFee: 3500,
          patientsTreated: 32,
          amountBilled: 5120,
          netPayout: 1620,
        },
        {
          clinicId: 'clinic_4',
          clinicName: 'Northside Urgent Care & Diagnostics',
          daysWorked: 10,
          sittingFeePerDay: 260,
          totalSittingFee: 2600,
          patientsTreated: 22,
          amountBilled: 3520,
          netPayout: 920,
        },
      ],
    },
  },
  {
    id: 'doc_5',
    name: 'Dr. Lisa Patel',
    specialty: 'Dermatology',
    title: 'Consultant Dermatologist',
    experience: '11 years',
    rating: 4.9,
    reviewsCount: 145,
    avatar: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=150&auto=format&fit=crop&q=80',
    fee: 130,
    status: 'Available',
    department: 'Dermatology & Skin Care',
    education: 'UCLA David Geffen School',
    availability: ['Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['11:00 AM - 02:30 PM @ Downtown', '04:30 PM - 08:30 PM @ Westside'],
    weekdaySchedule: makeSchedule({
      days: ['Wed', 'Thu', 'Fri', 'Sat'],
      slots: [
        {
          id: 'shift_1',
          start: '11:00 AM',
          end: '02:30 PM',
          clinicId: 'clinic_1',
          clinicName: 'Downtown Medical Center',
        },
        {
          id: 'shift_2',
          start: '04:30 PM',
          end: '08:30 PM',
          clinicId: 'clinic_2',
          clinicName: 'Westside Family Care Clinic',
        },
      ],
    }),
    phone: '+1 (555) 678-9012',
    email: 'dr.patel@vibemed.health',
    patientsCount: 490,
    monthlyStats: {
      month: 'September 2026',
      totalPatientsTreated: 82,
      grossBilled: 10660,
      totalSittingCharges: 7850,
      netDoctorPayout: 2810,
      clinicsBreakdown: [
        {
          clinicId: 'clinic_1',
          clinicName: 'Downtown Medical Center',
          daysWorked: 8,
          sittingFeePerDay: 500,
          totalSittingFee: 4000,
          patientsTreated: 44,
          amountBilled: 5720,
          netPayout: 1720,
        },
        {
          clinicId: 'clinic_2',
          clinicName: 'Westside Family Care Clinic',
          daysWorked: 11,
          sittingFeePerDay: 350,
          totalSittingFee: 3850,
          patientsTreated: 38,
          amountBilled: 4940,
          netPayout: 1090,
        },
      ],
    },
  },
];

let doctorsCache = [...INITIAL_DOCTORS];

export const doctorService = {
  getAll: async () => {
    return [...doctorsCache];
  },

  getById: async (id) => {
    return doctorsCache.find((d) => d.id === id) || null;
  },

  getSpecialties: () => {
    return ['All', ...clinicService.getAllSpecialties()];
  },

  addDoctor: async (doctor) => {
    const fee = Number(doctor.fee) || 150;
    const newDoc = {
      ...doctor,
      id: `doc_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      patientsCount: 0,
      avatar:
        doctor.avatar ||
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      status: 'Available',
      timeSlots: doctor.timeSlots || ['09:00 AM - 01:00 PM @ Downtown'],
      weekdaySchedule: doctor.weekdaySchedule || {},
      monthlyStats: doctor.monthlyStats || {
        month: 'September 2026',
        totalPatientsTreated: 0,
        grossBilled: 0,
        totalSittingCharges: 0,
        netDoctorPayout: 0,
        clinicsBreakdown: [],
      },
    };
    doctorsCache = [newDoc, ...doctorsCache];
    return newDoc;
  },

  updateDoctor: async (id, updates) => {
    doctorsCache = doctorsCache.map((d) => (d.id === id ? { ...d, ...updates } : d));
    return doctorsCache.find((d) => d.id === id);
  },

  deleteDoctor: async (id) => {
    doctorsCache = doctorsCache.filter((d) => d.id !== id);
    return true;
  },

  // Revenue aggregations across all doctors
  getMonthlyRevenueReport: (month = 'September 2026', clinicId = 'All') => {
    let filteredDocs = doctorsCache;
    let totalGross = 0;
    let totalSitting = 0;
    let totalNet = 0;
    let totalPatients = 0;

    const doctorReports = filteredDocs.map((doc) => {
      const stats = doc.monthlyStats || {
        month,
        totalPatientsTreated: 0,
        grossBilled: 0,
        totalSittingCharges: 0,
        netDoctorPayout: 0,
        clinicsBreakdown: [],
      };

      let docBreakdown = stats.clinicsBreakdown || [];
      if (clinicId !== 'All') {
        docBreakdown = docBreakdown.filter((cb) => cb.clinicId === clinicId);
      }

      const docPatients = docBreakdown.reduce((sum, b) => sum + b.patientsTreated, 0);
      const docGross = docBreakdown.reduce((sum, b) => sum + b.amountBilled, 0);
      const docSitting = docBreakdown.reduce((sum, b) => sum + b.totalSittingFee, 0);
      const docNet = docGross - docSitting;

      totalGross += docGross;
      totalSitting += docSitting;
      totalNet += docNet;
      totalPatients += docPatients;

      return {
        doctorId: doc.id,
        doctorName: doc.name,
        specialty: doc.specialty,
        avatar: doc.avatar,
        fee: doc.fee,
        patientsTreated: docPatients,
        grossBilled: docGross,
        totalSittingFee: docSitting,
        netPayout: docNet,
        clinicsBreakdown: docBreakdown,
      };
    });

    return {
      month,
      clinicId,
      totalGross,
      totalSitting,
      totalNet,
      totalPatients,
      doctorReports: doctorReports.filter((r) => r.patientsTreated > 0 || clinicId === 'All'),
    };
  },
};

export default doctorService;
