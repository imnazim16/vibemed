// VibeMed Clinic & Location Service with Live Backend API & Graceful Fallback
import apiClient from './apiClient';

const INITIAL_CLINICS = [
  {
    id: 'clinic_1',
    name: 'Downtown Medical Center',
    branchCode: 'DMC-01',
    address: '742 Evergreen Blvd, Suite 400, Downtown',
    phone: '+1 (555) 100-2001',
    email: 'downtown@vibemed.health',
    sittingCharge: 500,
    color: '#0d9488',
    specialties: ['Cardiology', 'Neurology', 'General Medicine', 'Dermatology'],
    operatingHours: '08:00 AM - 08:00 PM',
    status: 'active',
  },
  {
    id: 'clinic_2',
    name: 'Westside Family Care Clinic',
    branchCode: 'WFC-02',
    address: '1204 Sunset Ave, Westside Medical Park',
    phone: '+1 (555) 100-2002',
    email: 'westside@vibemed.health',
    sittingCharge: 350,
    color: '#0284c7',
    specialties: ['Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine'],
    operatingHours: '09:00 AM - 09:00 PM',
    status: 'active',
  },
  {
    id: 'clinic_3',
    name: 'Metro Health Pavilion',
    branchCode: 'MHP-03',
    address: '890 Central Plaza, 3rd Floor, Metro District',
    phone: '+1 (555) 100-2003',
    email: 'metro@vibemed.health',
    sittingCharge: 400,
    color: '#7c3aed',
    specialties: ['Gynecology & Obstetrics', 'Cardiology', 'General Medicine'],
    operatingHours: '08:30 AM - 07:30 PM',
    status: 'active',
  },
  {
    id: 'clinic_4',
    name: 'Northside Urgent Care & Diagnostics',
    branchCode: 'NUC-04',
    address: '455 Northway Rd, North Hills Crossing',
    phone: '+1 (555) 100-2004',
    email: 'northside@vibemed.health',
    sittingCharge: 250,
    color: '#ea580c',
    specialties: ['General Medicine', 'Pediatrics', 'Orthopedics'],
    operatingHours: '08:00 AM - 10:00 PM',
    status: 'active',
  },
];

const INITIAL_SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'General Medicine',
  'Gynecology & Obstetrics',
  'Psychiatry',
  'Ophthalmology',
  'ENT (Otolaryngology)',
];

const PRESET_COLORS = ['#0d9488', '#0284c7', '#7c3aed', '#ea580c', '#059669', '#d97706'];

let clinicsCache = [...INITIAL_CLINICS];
let specialtiesCache = [...INITIAL_SPECIALTIES];
let specialtyMetaMap = {}; // name -> { id, code, department_id }

/**
 * Normalizes backend Location object to UI clinic format
 */
const mapLocationToClinic = (loc, index = 0) => {
  const addressParts = [loc.address_line_1, loc.address_line_2, loc.city, loc.state].filter(Boolean);
  const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Main Clinic Facility';

  return {
    id: loc.id,
    name: loc.name,
    branchCode: loc.code || `LOC-${loc.id}`,
    address: fullAddress,
    address_line_1: loc.address_line_1 || fullAddress,
    address_line_2: loc.address_line_2 || '',
    city: loc.city || 'City',
    state: loc.state || '',
    country: loc.country || 'India',
    postalCode: loc.postal_code || '',
    phone: loc.phone || '+1 (555) 000-0000',
    email: loc.email || 'clinic@vibemed.health',
    status: loc.status || 'active',
    sittingCharge: loc.sitting_charge || 400,
    color: loc.color || PRESET_COLORS[index % PRESET_COLORS.length],
    specialties: Array.isArray(loc.specialties) && loc.specialties.length > 0
      ? loc.specialties.map((s) => (typeof s === 'string' ? s : s.name))
      : ['General Medicine', 'Cardiology'],
    operatingHours: loc.operating_hours || '08:00 AM - 08:00 PM',
    doctorsCount: loc.doctors_count || 0,
    receptionistsCount: loc.receptionists_count || 0,
    patientsCount: loc.patients_count || 0,
    appointmentsCount: loc.appointments_count || 0,
  };
};

/**
 * Normalizes UI clinic form input to backend Location POST/PUT payload
 */
const mapClinicToPayload = (clinic) => {
  const rawAddr = clinic.address || '';
  const parts = rawAddr.split(',').map((s) => s.trim()).filter(Boolean);
  const address_line_1 = clinic.address_line_1 || parts[0] || rawAddr || 'Medical Suite 100';
  const city = clinic.city || (parts.length > 1 ? parts[parts.length - 1] : 'Downtown');

  const generatedCode = (
    clinic.branchCode ||
    clinic.code ||
    clinic.name?.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4) ||
    'LOC'
  ).toUpperCase();

  return {
    name: clinic.name,
    code: generatedCode,
    address_line_1,
    address_line_2: clinic.address_line_2 || null,
    city: city || 'Downtown',
    state: clinic.state || 'State',
    country: clinic.country || 'India',
    postal_code: clinic.postalCode || clinic.postal_code || '10001',
    phone: clinic.phone || null,
    email: clinic.email || null,
    status: clinic.status || 'active',
  };
};

export const clinicService = {
  /**
   * Fetch all locations/clinics from live API (/locations)
   * Falls back gracefully to cache if offline or in mock demo mode
   */
  getAll: async () => {
    try {
      const res = await apiClient.get('/locations?per_page=100');
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];

      if (list && list.length > 0) {
        clinicsCache = list.map((loc, idx) => mapLocationToClinic(loc, idx));
      }
    } catch (err) {
      console.warn('Live API /locations request failed, using cached clinics:', err.message);
    }

    // Refresh specialties asynchronously
    clinicService.loadSpecialties().catch(() => {});

    return [...clinicsCache];
  },

  getById: (id) => {
    return clinicsCache.find((c) => String(c.id) === String(id)) || clinicsCache[0];
  },

  /**
   * Create new location via POST /locations
   */
  addClinic: async (clinic) => {
    try {
      const payload = mapClinicToPayload(clinic);
      const res = await apiClient.post('/locations', payload);
      const created = res?.data || res;
      if (created && created.id) {
        const mapped = {
          ...mapLocationToClinic(created, clinicsCache.length),
          sittingCharge: Number(clinic.sittingCharge) || 400,
          specialties: clinic.specialties || ['General Medicine'],
          operatingHours: clinic.operatingHours || '08:00 AM - 08:00 PM',
          color: clinic.color || PRESET_COLORS[clinicsCache.length % PRESET_COLORS.length],
        };
        clinicsCache = [mapped, ...clinicsCache];
        return mapped;
      }
    } catch (err) {
      console.warn('API POST /locations failed, creating locally:', err.message);
    }

    // Local fallback
    const newClinic = {
      ...clinic,
      id: `clinic_${Date.now()}`,
      sittingCharge: Number(clinic.sittingCharge) || 300,
      specialties: clinic.specialties || ['General Medicine'],
      color: clinic.color || PRESET_COLORS[clinicsCache.length % PRESET_COLORS.length],
      status: clinic.status || 'active',
    };
    clinicsCache = [newClinic, ...clinicsCache];
    return newClinic;
  },

  /**
   * Update location via PUT /locations/{id}
   */
  updateClinic: async (id, updates) => {
    const isBackendId = typeof id === 'number' || (!isNaN(Number(id)) && !String(id).startsWith('clinic_'));
    if (isBackendId) {
      try {
        const payload = mapClinicToPayload({ ...updates, id });
        const res = await apiClient.put(`/locations/${id}`, payload);
        const updated = res?.data || res;
        if (updated && updated.id) {
          const mapped = {
            ...mapLocationToClinic(updated),
            sittingCharge: Number(updates.sittingCharge ?? 400),
            specialties: updates.specialties || ['General Medicine'],
            operatingHours: updates.operatingHours || '08:00 AM - 08:00 PM',
          };
          clinicsCache = clinicsCache.map((c) => (String(c.id) === String(id) ? mapped : c));
          return mapped;
        }
      } catch (err) {
        console.warn(`API PUT /locations/${id} failed, updating locally:`, err.message);
      }
    }

    // Local fallback
    clinicsCache = clinicsCache.map((c) =>
      String(c.id) === String(id)
        ? {
            ...c,
            ...updates,
            sittingCharge: Number(updates.sittingCharge ?? c.sittingCharge),
          }
        : c
    );
    return clinicsCache.find((c) => String(c.id) === String(id));
  },

  /**
   * Delete location via DELETE /locations/{id}
   */
  deleteClinic: async (id) => {
    if (clinicsCache.length <= 1) {
      throw new Error('At least one clinic branch must be maintained.');
    }

    const isBackendId = typeof id === 'number' || (!isNaN(Number(id)) && !String(id).startsWith('clinic_'));
    if (isBackendId) {
      try {
        await apiClient.delete(`/locations/${id}`);
      } catch (err) {
        console.warn(`API DELETE /locations/${id} failed:`, err.message);
        if (err.message && err.message.toLowerCase().includes('appointment')) {
          throw err;
        }
      }
    }

    clinicsCache = clinicsCache.filter((c) => String(c.id) !== String(id));
    return true;
  },

  /**
   * Toggle location status via PATCH /locations/{id}/status
   */
  toggleStatus: async (id, newStatus) => {
    const isBackendId = typeof id === 'number' || (!isNaN(Number(id)) && !String(id).startsWith('clinic_'));
    if (isBackendId) {
      try {
        const res = await apiClient.patch(`/locations/${id}/status`, { status: newStatus });
        const updated = res?.data || res;
        if (updated && updated.id) {
          clinicsCache = clinicsCache.map((c) =>
            String(c.id) === String(id) ? { ...c, status: updated.status } : c
          );
          return updated.status;
        }
      } catch (err) {
        console.warn(`API PATCH /locations/${id}/status failed:`, err.message);
      }
    }

    clinicsCache = clinicsCache.map((c) =>
      String(c.id) === String(id) ? { ...c, status: newStatus } : c
    );
    return newStatus;
  },

  /**
   * Asynchronously loads specialties from backend (/admin/specialties or /specialties)
   */
  loadSpecialties: async () => {
    try {
      let res;
      try {
        res = await apiClient.get('/admin/specialties');
      } catch {
        res = await apiClient.get('/specialties');
      }

      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];

      if (list.length > 0) {
        const names = [];
        list.forEach((item) => {
          if (typeof item === 'string') {
            names.push(item);
          } else if (item?.name) {
            names.push(item.name);
            specialtyMetaMap[item.name] = {
              id: item.id,
              code: item.code,
              department_id: item.department_id,
            };
          }
        });

        if (names.length > 0) {
          specialtiesCache = Array.from(new Set([...names, ...specialtiesCache]));
        }
      }
    } catch (err) {
      console.warn('API /specialties call failed, using default specialties:', err.message);
    }
    return [...specialtiesCache];
  },

  /**
   * Synchronously or asynchronously returns specialties
   */
  getAllSpecialties: () => {
    return [...specialtiesCache];
  },

  /**
   * Create specialty via POST /admin/specialties
   */
  addSpecialty: async (name, clinicIds = [], departmentId = null) => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    try {
      const code = trimmed.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toUpperCase();
      const res = await apiClient.post('/admin/specialties', {
        name: trimmed,
        code,
        department_id: departmentId || null,
        active: true,
      });
      const created = res?.data || res;
      if (created?.id) {
        specialtyMetaMap[trimmed] = {
          id: created.id,
          code: created.code,
          department_id: created.department_id,
        };
      }
    } catch (err) {
      console.warn('API POST /admin/specialties failed, persisting locally:', err.message);
    }

    if (!specialtiesCache.includes(trimmed)) {
      specialtiesCache = [...specialtiesCache, trimmed];
    }

    if (clinicIds.length > 0) {
      clinicsCache = clinicsCache.map((c) => {
        if (clinicIds.includes(c.id) && !c.specialties.includes(trimmed)) {
          return { ...c, specialties: [...c.specialties, trimmed] };
        }
        return c;
      });
    }

    return trimmed;
  },

  /**
   * Delete specialty via DELETE /admin/specialties/{id}
   */
  deleteSpecialty: async (name) => {
    const meta = specialtyMetaMap[name];
    if (meta?.id) {
      try {
        await apiClient.delete(`/admin/specialties/${meta.id}`);
      } catch (err) {
        console.warn(`API DELETE /admin/specialties/${meta.id} failed:`, err.message);
      }
    }

    specialtiesCache = specialtiesCache.filter((s) => s !== name);
    delete specialtyMetaMap[name];

    clinicsCache = clinicsCache.map((c) => ({
      ...c,
      specialties: c.specialties.filter((s) => s !== name),
    }));
    return true;
  },

  getSpecialtiesByClinic: (clinicId) => {
    const clinic = clinicsCache.find((c) => String(c.id) === String(clinicId));
    return clinic ? clinic.specialties : specialtiesCache;
  },
};

export default clinicService;
