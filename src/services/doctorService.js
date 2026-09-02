// Mock Doctor Service

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
    phone: '+1 (555) 234-5678',
    email: 'dr.sarah@vibemed.health',
    patientsCount: 420,
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
    phone: '+1 (555) 345-6789',
    email: 'dr.wilson@vibemed.health',
    patientsCount: 310,
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
    phone: '+1 (555) 456-7890',
    email: 'dr.emily@vibemed.health',
    patientsCount: 560,
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
    phone: '+1 (555) 567-8901',
    email: 'dr.marcus@vibemed.health',
    patientsCount: 280,
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
    phone: '+1 (555) 678-9012',
    email: 'dr.patel@vibemed.health',
    patientsCount: 490,
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
    return ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine'];
  },

  addDoctor: async (doctor) => {
    const newDoc = {
      ...doctor,
      id: `doc_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      patientsCount: 0,
      avatar: doctor.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      status: 'Available',
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
};
