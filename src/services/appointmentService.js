// VibeMed Appointment & Queue Service with Live Backend API & Graceful Fallback
import apiClient from './apiClient';

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
    type: 'In-Clinic Checkup',
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
    type: 'In-Clinic Checkup',
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

const mapBackendAppointmentToUi = (apt) => {
  const patient = apt.patient || {};
  const doctor = apt.doctor || {};
  const patientName =
    patient.name ||
    [patient.first_name, patient.last_name].filter(Boolean).join(' ') ||
    apt.patient_name ||
    'Patient';
  const doctorName = doctor.name || apt.doctor_name || 'Doctor';

  // Format 24h to 12h AM/PM
  let timeStr = apt.appointment_time || '10:00 AM';
  if (timeStr && timeStr.length === 5 && timeStr.includes(':')) {
    const [h, m] = timeStr.split(':').map(Number);
    const meridiem = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    timeStr = `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${meridiem}`;
  }

  const statusMap = {
    pending: 'Scheduled',
    scheduled: 'Scheduled',
    confirmed: 'Confirmed',
    in_progress: 'In-Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  const uiStatus = statusMap[apt.status?.toLowerCase()] || apt.status || 'Scheduled';

  return {
    id: apt.id,
    patientId: apt.patient_id || patient.id,
    patientName,
    patientPhone: patient.phone || apt.patient_phone || '+1 (555) 000-0000',
    doctorId: apt.doctor_id || doctor.id,
    doctorName,
    specialty: doctor.specialty?.name || apt.specialty || 'General Medicine',
    date: apt.appointment_date || apt.date || new Date().toISOString().split('T')[0],
    time: timeStr,
    type: apt.mode === 'telehealth' ? 'Video Telehealth' : 'In-Clinic Checkup',
    status: uiStatus,
    symptoms: apt.symptoms || 'Routine Consultation',
    tokenNumber: apt.token_number || apt.queue_token || `A-${((typeof apt.id === 'number' ? apt.id : 12) % 90) + 10}`,
    priority: apt.urgency ? apt.urgency.charAt(0).toUpperCase() + apt.urgency.slice(1) : 'Normal',
  };
};

export const appointmentService = {
  /**
   * Fetch appointments from /admin/appointments with fallback
   */
  getAll: async () => {
    try {
      const res = await apiClient.get('/admin/appointments');
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];

      if (list && list.length > 0) {
        appointmentsCache = list.map(mapBackendAppointmentToUi);
      }
    } catch (err) {
      console.warn('API /admin/appointments failed, using cached appointments:', err.message);
    }
    return [...appointmentsCache];
  },

  /**
   * Get appointments assigned to a specific doctor
   */
  getByDoctor: async (doctorId) => {
    const isBackendId = typeof doctorId === 'number' || (!isNaN(Number(doctorId)) && !String(doctorId).startsWith('doc_'));
    if (isBackendId) {
      try {
        const res = await apiClient.get(`/doctor/appointments`);
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
            ? res.data
            : [];
        if (list.length > 0) {
          return list.map(mapBackendAppointmentToUi);
        }
      } catch (err) {
        console.warn('API /doctor/appointments failed:', err.message);
      }
    }

    return appointmentsCache.filter((a) => String(a.doctorId) === String(doctorId) || !doctorId);
  },

  /**
   * Get appointments for logged in patient
   */
  getByPatient: async (patientId) => {
    try {
      const res = await apiClient.get(`/patient/appointments`);
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : [];
      if (list.length > 0) {
        return list.map(mapBackendAppointmentToUi);
      }
    } catch (err) {
      console.warn('API /patient/appointments failed:', err.message);
    }

    return appointmentsCache.filter(
      (a) => String(a.patientId) === String(patientId) || a.patientName === 'Alex Morgan'
    );
  },

  /**
   * Book appointment via POST /patient/appointments
   */
  bookAppointment: async (appointment) => {
    try {
      // Convert 12h time string (e.g. "10:30 AM") to 24h ("10:30")
      let time24 = appointment.time || '10:00';
      if (time24.includes('AM') || time24.includes('PM')) {
        const [timePart, meridiem] = time24.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        time24 = `${String(hours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}`;
      }

      const docId = typeof appointment.doctorId === 'number'
        ? appointment.doctorId
        : parseInt(String(appointment.doctorId).replace(/\D/g, ''), 10) || 1;

      const payload = {
        doctor_id: docId,
        appointment_date: appointment.date || new Date().toISOString().split('T')[0],
        appointment_time: time24,
        mode: (appointment.type || '').toLowerCase().includes('video') ? 'telehealth' : 'in_person',
        urgency: (appointment.priority || 'normal').toLowerCase(),
        symptoms: appointment.symptoms || 'Routine Checkup',
      };

      const res = await apiClient.post('/patient/appointments', payload);
      const created = res?.data || res;
      if (created && created.id) {
        const mapped = mapBackendAppointmentToUi(created);
        appointmentsCache = [mapped, ...appointmentsCache];
        return mapped;
      }
    } catch (err) {
      console.warn('API POST /patient/appointments failed, saving locally:', err.message);
    }

    // Local fallback
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

  /**
   * Update appointment status with transition endpoints
   */
  updateStatus: async (id, status) => {
    const isBackendId = typeof id === 'number' || (!isNaN(Number(id)) && !String(id).startsWith('apt_'));
    if (isBackendId) {
      try {
        if (status === 'In-Progress') {
          await apiClient.post(`/doctor/appointments/${id}/start`);
        } else if (status === 'Completed') {
          await apiClient.post(`/doctor/appointments/${id}/complete`);
        } else if (status === 'Checked-In') {
          await apiClient.post(`/reception/appointments/${id}/check-in`);
        }
      } catch (err) {
        console.warn(`API appointment status transition for ${id} failed:`, err.message);
      }
    }

    appointmentsCache = appointmentsCache.map((a) =>
      String(a.id) === String(id) ? { ...a, status } : a
    );
    return appointmentsCache.find((a) => String(a.id) === String(id));
  },

  cancelAppointment: async (id) => {
    appointmentsCache = appointmentsCache.map((a) =>
      String(a.id) === String(id) ? { ...a, status: 'Cancelled' } : a
    );
    return true;
  },

  /**
   * Get live OPD queue from /reception/opd-queue or /doctor/opd-queue
   */
  getQueue: async () => {
    try {
      const res = await apiClient.get('/reception/opd-queue');
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      if (list.length > 0) {
        return list.map(mapBackendAppointmentToUi);
      }
    } catch {
      // Fallback
    }
    const today = new Date().toISOString().split('T')[0];
    return appointmentsCache.filter((a) => a.date === today || a.date === '2026-09-02');
  },

  /**
   * Analytics and Reports from /admin/reports/*
   */
  getAppointmentReports: async (startDate, endDate) => {
    try {
      const query = startDate && endDate ? `?start_date=${startDate}&end_date=${endDate}` : '';
      const res = await apiClient.get(`/admin/reports/appointments${query}`);
      return res?.data || res;
    } catch (err) {
      console.warn('API /admin/reports/appointments failed:', err.message);
      return null;
    }
  },

  getRevenueReports: async () => {
    try {
      const res = await apiClient.get(`/admin/reports/revenue`);
      return res?.data || res;
    } catch (err) {
      console.warn('API /admin/reports/revenue failed:', err.message);
      return null;
    }
  },
};

export default appointmentService;
