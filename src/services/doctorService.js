// VibeMed Doctor Service with Live Backend API & Graceful Fallback
import apiClient from './apiClient';
import { clinicService } from './clinicService';

const DAY_MAP_INDEX_TO_NAME = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_MAP_NAME_TO_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

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
    experience_years: 14,
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
    monthlyStats: {
      month: 'September 2026',
      totalPatientsTreated: 120,
      grossBilled: 18000,
      totalSittingCharges: 12200,
      netDoctorPayout: 5800,
      clinicsBreakdown: [
        {
          clinicId: 'clinic_1',
          clinicName: 'Downtown Medical Center',
          daysWorked: 14,
          sittingFeePerDay: 500,
          totalSittingFee: 7000,
          patientsTreated: 75,
          amountBilled: 11250,
          netPayout: 4250,
        },
        {
          clinicId: 'clinic_2',
          clinicName: 'Westside Family Care Clinic',
          daysWorked: 15,
          sittingFeePerDay: 350,
          totalSittingFee: 5200,
          patientsTreated: 45,
          amountBilled: 6750,
          netPayout: 1550,
        },
      ],
    },
  },
  {
    id: 'doc_2',
    name: 'Dr. James Wilson',
    specialty: 'Neurology',
    title: 'Consultant Neurologist',
    experience: '11 years',
    experience_years: 11,
    rating: 4.8,
    reviewsCount: 94,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    fee: 180,
    status: 'Available',
    department: 'Neurosciences',
    education: 'Harvard Medical School',
    availability: ['Mon', 'Wed', 'Fri'],
    timeSlots: ['08:30 AM - 12:30 PM @ Downtown', '03:00 PM - 07:00 PM @ Metro Pavilion'],
    weekdaySchedule: makeSchedule({
      days: ['Mon', 'Wed', 'Fri'],
      slots: [
        {
          id: 'shift_1',
          start: '08:30 AM',
          end: '12:30 PM',
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
    patientsCount: 380,
    monthlyStats: {
      month: 'September 2026',
      totalPatientsTreated: 95,
      grossBilled: 17100,
      totalSittingCharges: 10400,
      netDoctorPayout: 6700,
      clinicsBreakdown: [
        {
          clinicId: 'clinic_1',
          clinicName: 'Downtown Medical Center',
          daysWorked: 12,
          sittingFeePerDay: 500,
          totalSittingFee: 6000,
          patientsTreated: 55,
          amountBilled: 9900,
          netPayout: 3900,
        },
        {
          clinicId: 'clinic_3',
          clinicName: 'Metro Health Pavilion',
          daysWorked: 11,
          sittingFeePerDay: 400,
          totalSittingFee: 4400,
          patientsTreated: 40,
          amountBilled: 7200,
          netPayout: 2800,
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
    experience_years: 9,
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
      grossBilled: 13200,
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
    experience_years: 12,
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
    email: 'dr.reynolds@vibemed.health',
    patientsCount: 310,
    monthlyStats: {
      month: 'September 2026',
      totalPatientsTreated: 78,
      grossBilled: 12480,
      totalSittingCharges: 7400,
      netDoctorPayout: 5080,
      clinicsBreakdown: [
        {
          clinicId: 'clinic_2',
          clinicName: 'Westside Family Care Clinic',
          daysWorked: 12,
          sittingFeePerDay: 350,
          totalSittingFee: 4200,
          patientsTreated: 48,
          amountBilled: 7680,
          netPayout: 3480,
        },
        {
          clinicId: 'clinic_4',
          clinicName: 'Northside Urgent Care & Diagnostics',
          daysWorked: 13,
          sittingFeePerDay: 250,
          totalSittingFee: 3250,
          patientsTreated: 30,
          amountBilled: 4800,
          netPayout: 1550,
        },
      ],
    },
  },
  {
    id: 'doc_5',
    name: 'Dr. Priya Patel',
    specialty: 'Dermatology',
    title: 'Consultant Dermatologist',
    experience: '8 years',
    experience_years: 8,
    rating: 4.9,
    reviewsCount: 142,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    fee: 130,
    status: 'Available',
    department: 'Dermatology & Cosmetology',
    education: 'AIIMS & Oxford Fellowship',
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
let departmentsCache = [];
let specialtiesCache = [];

/**
 * Normalizes backend Doctor representation to frontend shape
 */
const mapBackendDoctorToUi = (doc) => {
  const fee = doc.consultation_fee
    ? Number(doc.consultation_fee)
    : doc.consultation_fee_cents
      ? Number(doc.consultation_fee_cents) / 100
      : 150;

  const matchedDept = departmentsCache.find((d) => d.id === doc.department_id);
  const matchedSpec = specialtiesCache.find((s) => s.id === doc.specialty_id);

  const specialtyName =
    doc.specialty?.name ||
    matchedSpec?.name ||
    doc.specialty ||
    'General Medicine';

  const departmentName =
    doc.department?.name ||
    matchedDept?.name ||
    doc.department ||
    'General Consultation';

  return {
    id: doc.id,
    userId: doc.user_id,
    name: doc.name,
    specialty: specialtyName,
    specialtyId: doc.specialty_id,
    title: doc.title || `${specialtyName} Specialist`,
    experience: doc.experience_years ? `${doc.experience_years} years` : '5+ years',
    experience_years: doc.experience_years || 5,
    rating: doc.rating || 4.9,
    reviewsCount: doc.reviews_count || 45,
    avatar:
      doc.profile_image_url ||
      doc.avatar ||
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    fee,
    status: doc.status === 'active' ? 'Available' : 'Unavailable',
    department: departmentName,
    departmentId: doc.department_id,
    education: doc.education || doc.bio || 'Medical University Degree',
    bio: doc.bio || '',
    licenseNumber: doc.license_number || '',
    phone: doc.phone || '+1 (555) 000-0000',
    email: doc.email || '',
    patientsCount: doc.patients_count || 120,
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM - 01:00 PM', '04:00 PM - 08:00 PM'],
    weekdaySchedule: makeSchedule({
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      slots: [
        {
          id: `shift_${doc.id}_1`,
          start: '09:00 AM',
          end: '01:00 PM',
          clinicId: 'clinic_1',
          clinicName: 'Downtown Medical Center',
        },
      ],
    }),
    monthlyStats: {
      month: 'September 2026',
      totalPatientsTreated: 45,
      grossBilled: 45 * fee,
      totalSittingCharges: 3000,
      netDoctorPayout: Math.max(0, 45 * fee - 3000),
      clinicsBreakdown: [],
    },
  };
};

/**
 * Convert frontend schedule objects into backend schedules payload:
 * [ { day_of_week: 1, start_time: "09:00:00", end_time: "13:00:00", location_id: 1, slot_duration: 30 } ]
 */
const convertWeekdayScheduleToBackend = (sched) => {
  const result = [];
  if (!sched || typeof sched !== 'object') return result;

  Object.entries(sched).forEach(([dayName, dayConfig]) => {
    if (!dayConfig?.enabled || !Array.isArray(dayConfig?.slots)) return;
    const dayOfWeek = DAY_MAP_NAME_TO_INDEX[dayName];
    if (dayOfWeek === undefined) return;

    dayConfig.slots.forEach((slot) => {
      const formatTime = (t) => {
        if (!t) return '09:00:00';
        // Convert "09:00 AM" to "09:00:00"
        if (t.includes('AM') || t.includes('PM')) {
          const [timePart, meridiem] = t.split(' ');
          let [hours, minutes] = timePart.split(':').map(Number);
          if (meridiem === 'PM' && hours < 12) hours += 12;
          if (meridiem === 'AM' && hours === 12) hours = 0;
          return `${String(hours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:00`;
        }
        return t.length === 5 ? `${t}:00` : t;
      };

      const locId = typeof slot.clinicId === 'number'
        ? slot.clinicId
        : parseInt(String(slot.clinicId).replace(/\D/g, ''), 10) || 1;

      result.push({
        day_of_week: dayOfWeek,
        start_time: formatTime(slot.start),
        end_time: formatTime(slot.end),
        break_start: null,
        break_end: null,
        location_id: locId,
        slot_duration: 30,
      });
    });
  });

  return result;
};

export const doctorService = {
  /**
   * Load departments from /admin/departments
   */
  getDepartments: async () => {
    try {
      const res = await apiClient.get('/admin/departments');
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      if (list.length > 0) {
        departmentsCache = list;
      }
    } catch (e) {
      console.warn('API /admin/departments failed:', e.message);
    }
    return departmentsCache;
  },

  /**
   * Load specialties from /admin/specialties
   */
  getSpecialtiesList: async () => {
    try {
      const res = await apiClient.get('/admin/specialties');
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      if (list.length > 0) {
        specialtiesCache = list;
      }
    } catch (e) {
      console.warn('API /admin/specialties failed:', e.message);
    }
    return specialtiesCache;
  },

  /**
   * Retrieve all doctors from /admin/doctors with fallback
   */
  getAll: async () => {
    try {
      await Promise.allSettled([
        doctorService.getDepartments(),
        doctorService.getSpecialtiesList(),
      ]);

      const res = await apiClient.get('/admin/doctors?per_page=100');
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];

      if (list.length > 0) {
        const liveDoctors = list.map(mapBackendDoctorToUi);
        doctorsCache = liveDoctors;
        return liveDoctors;
      }
    } catch (err) {
      console.warn('API /admin/doctors failed, using cached doctors:', err.message);
    }

    return [...doctorsCache];
  },

  getById: async (id) => {
    const isBackendId = typeof id === 'number' || (!isNaN(Number(id)) && !String(id).startsWith('doc_'));
    if (isBackendId) {
      try {
        const res = await apiClient.get(`/admin/doctors/${id}`);
        const docData = res?.data || res;
        if (docData && docData.id) {
          const mapped = mapBackendDoctorToUi(docData);
          // Try loading live availability slots
          try {
            const availRes = await apiClient.get(`/admin/doctors/${id}/availability`);
            const slots = Array.isArray(availRes?.data) ? availRes.data : [];
            if (slots.length > 0) {
              const activeDays = new Set();
              slots.forEach((s) => {
                const dayName = DAY_MAP_INDEX_TO_NAME[s.day_of_week];
                if (dayName) activeDays.add(dayName);
              });
              mapped.availability = Array.from(activeDays);
            }
          } catch {
            // keep default schedule
          }
          return mapped;
        }
      } catch (err) {
        console.warn(`API /admin/doctors/${id} failed:`, err.message);
      }
    }

    return doctorsCache.find((d) => String(d.id) === String(id)) || null;
  },

  getSpecialties: () => {
    return ['All', ...clinicService.getAllSpecialties()];
  },

  /**
   * Create doctor via POST /admin/doctors
   */
  addDoctor: async (doctor) => {
    const fee = Number(doctor.fee) || 150;
    const isNumericFee = !isNaN(fee);

    try {
      const schedulePayload = convertWeekdayScheduleToBackend(doctor.weekdaySchedule);
      // Ensure at least one default schedule if empty
      const validSchedules = schedulePayload.length > 0
        ? schedulePayload
        : [
            {
              day_of_week: 1,
              start_time: '09:00:00',
              end_time: '13:00:00',
              location_id: 1,
              slot_duration: 30,
            },
          ];

      const formData = new FormData();
      formData.append('name', doctor.name);
      formData.append('email', doctor.email || `doc.${Date.now()}@vibemed.health`);
      formData.append('phone', doctor.phone || '+1-555-0999');
      formData.append('password', 'DoctorPass123!');
      formData.append('experience_years', String(doctor.experience_years || 5));
      formData.append('consultation_fee', String(isNumericFee ? fee : 150));
      formData.append('schedules', JSON.stringify(validSchedules));

      if (doctor.departmentId) formData.append('department_id', String(doctor.departmentId));
      if (doctor.specialtyId) formData.append('specialty_id', String(doctor.specialtyId));
      if (doctor.licenseNumber) formData.append('license_number', doctor.licenseNumber);
      if (doctor.education || doctor.bio) formData.append('bio', doctor.education || doctor.bio);

      const res = await apiClient.post('/admin/doctors', formData, {
        headers: {}, // let browser set boundary
      });

      const created = res?.data || res;
      if (created && created.id) {
        const mapped = {
          ...mapBackendDoctorToUi(created),
          weekdaySchedule: doctor.weekdaySchedule,
          monthlyStats: {
            month: 'September 2026',
            totalPatientsTreated: 0,
            grossBilled: 0,
            totalSittingCharges: 0,
            netDoctorPayout: 0,
            clinicsBreakdown: [],
          },
        };
        doctorsCache = [mapped, ...doctorsCache];
        return mapped;
      }
    } catch (err) {
      console.warn('API POST /admin/doctors failed, falling back to local creation:', err.message);
    }

    // Local fallback
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

  /**
   * Update doctor via PUT/PATCH /admin/doctors/{id}
   */
  updateDoctor: async (id, updates) => {
    const isBackendId = typeof id === 'number' || (!isNaN(Number(id)) && !String(id).startsWith('doc_'));
    if (isBackendId) {
      try {
        const payload = {
          name: updates.name,
          phone: updates.phone,
          consultation_fee: updates.fee ? Number(updates.fee) : undefined,
          experience_years: updates.experience_years ? Number(updates.experience_years) : undefined,
          status: updates.status === 'Available' ? 'active' : 'inactive',
        };

        const res = await apiClient.patch(`/admin/doctors/${id}`, payload);
        const updated = res?.data || res;
        if (updated && updated.id) {
          const mapped = mapBackendDoctorToUi(updated);
          doctorsCache = doctorsCache.map((d) => (String(d.id) === String(id) ? { ...mapped, ...updates } : d));
          return mapped;
        }
      } catch (err) {
        console.warn(`API PATCH /admin/doctors/${id} failed, updating locally:`, err.message);
      }
    }

    doctorsCache = doctorsCache.map((d) => (String(d.id) === String(id) ? { ...d, ...updates } : d));
    return doctorsCache.find((d) => String(d.id) === String(id));
  },

  /**
   * Toggle doctor status via PATCH /admin/doctors/{id}/status
   */
  toggleStatus: async (id, newStatus) => {
    const backendStatus = newStatus === 'Available' || newStatus === 'active' ? 'active' : 'inactive';
    const isBackendId = typeof id === 'number' || (!isNaN(Number(id)) && !String(id).startsWith('doc_'));
    if (isBackendId) {
      try {
        await apiClient.patch(`/admin/doctors/${id}/status`, { status: backendStatus });
      } catch (err) {
        console.warn(`API /admin/doctors/${id}/status failed:`, err.message);
      }
    }

    doctorsCache = doctorsCache.map((d) =>
      String(d.id) === String(id) ? { ...d, status: newStatus } : d
    );
    return newStatus;
  },

  /**
   * Delete or deactivate doctor
   */
  deleteDoctor: async (id) => {
    const isBackendId = typeof id === 'number' || (!isNaN(Number(id)) && !String(id).startsWith('doc_'));
    if (isBackendId) {
      try {
        await apiClient.patch(`/admin/doctors/${id}/status`, { status: 'inactive' });
      } catch (err) {
        console.warn(`API deactivation /admin/doctors/${id} failed:`, err.message);
      }
    }

    doctorsCache = doctorsCache.filter((d) => String(d.id) !== String(id));
    return true;
  },

  /**
   * Save doctor availability via PUT /admin/doctors/{id}/availability
   */
  saveAvailability: async (id, weekdaySchedule) => {
    const isBackendId = typeof id === 'number' || (!isNaN(Number(id)) && !String(id).startsWith('doc_'));
    if (isBackendId) {
      try {
        const schedules = convertWeekdayScheduleToBackend(weekdaySchedule);
        await apiClient.put(`/admin/doctors/${id}/availability`, { schedules });
      } catch (err) {
        console.warn(`API PUT /admin/doctors/${id}/availability failed:`, err.message);
      }
    }

    doctorsCache = doctorsCache.map((d) =>
      String(d.id) === String(id) ? { ...d, weekdaySchedule } : d
    );
    return weekdaySchedule;
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
