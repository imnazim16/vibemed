// Mock Clinic & Location Service

const INITIAL_CLINICS = [
  {
    id: 'clinic_1',
    name: 'Downtown Medical Center',
    branchCode: 'DMC-01',
    address: '742 Evergreen Blvd, Suite 400, Downtown',
    phone: '+1 (555) 100-2001',
    email: 'downtown@vibemed.health',
    sittingCharge: 500, // Daily facility sitting fee charged to doctors practicing here
    color: '#0d9488',
    specialties: ['Cardiology', 'Neurology', 'General Medicine', 'Dermatology'],
    operatingHours: '08:00 AM - 08:00 PM',
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

let clinicsCache = [...INITIAL_CLINICS];
let specialtiesCache = [...INITIAL_SPECIALTIES];

export const clinicService = {
  getAll: async () => {
    return [...clinicsCache];
  },

  getById: (id) => {
    return clinicsCache.find((c) => c.id === id) || clinicsCache[0];
  },

  addClinic: async (clinic) => {
    const newClinic = {
      ...clinic,
      id: `clinic_${Date.now()}`,
      sittingCharge: Number(clinic.sittingCharge) || 300,
      specialties: clinic.specialties || ['General Medicine'],
      color: clinic.color || '#0d9488',
    };
    clinicsCache = [...clinicsCache, newClinic];
    return newClinic;
  },

  updateClinic: async (id, updates) => {
    clinicsCache = clinicsCache.map((c) =>
      c.id === id ? { ...c, ...updates, sittingCharge: Number(updates.sittingCharge ?? c.sittingCharge) } : c
    );
    return clinicsCache.find((c) => c.id === id);
  },

  deleteClinic: async (id) => {
    if (clinicsCache.length <= 1) {
      throw new Error('At least one clinic branch must be maintained.');
    }
    clinicsCache = clinicsCache.filter((c) => c.id !== id);
    return true;
  },

  // Dynamic Specialties Management
  getAllSpecialties: () => {
    return [...specialtiesCache];
  },

  addSpecialty: async (name, clinicIds = []) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (!specialtiesCache.includes(trimmed)) {
      specialtiesCache = [...specialtiesCache, trimmed];
    }
    // If clinicIds provided, associate specialty with those clinics
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

  deleteSpecialty: async (name) => {
    specialtiesCache = specialtiesCache.filter((s) => s !== name);
    // Remove from clinics
    clinicsCache = clinicsCache.map((c) => ({
      ...c,
      specialties: c.specialties.filter((s) => s !== name),
    }));
    return true;
  },

  getSpecialtiesByClinic: (clinicId) => {
    const clinic = clinicsCache.find((c) => c.id === clinicId);
    return clinic ? clinic.specialties : specialtiesCache;
  },
};

export default clinicService;
