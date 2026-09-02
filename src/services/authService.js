// Mock Authentication Service with localStorage persistence

export const DEMO_USERS = {
  admin: {
    id: 'usr_admin',
    name: 'Eleanor Vance (Admin)',
    email: 'admin@vibemed.health',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Hospital Administration',
  },
  doctor: {
    id: 'usr_doc1',
    name: 'Dr. Sarah Connor, MD',
    email: 'dr.sarah@vibemed.health',
    role: 'doctor',
    specialty: 'Cardiology',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    department: 'Cardiovascular Care',
    license: 'MED-89401-NY',
  },
  patient: {
    id: 'usr_pat1',
    name: 'Alex Morgan',
    email: 'alex.morgan@vibemed.health',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'O+',
    age: 32,
    gender: 'Male',
  },
  receptionist: {
    id: 'usr_rec1',
    name: 'Jessica Taylor',
    email: 'jessica.reception@vibemed.health',
    role: 'receptionist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Front Desk & Triage',
  },
};

const STORAGE_KEY = 'vibemed_auth_session';

export const authService = {
  login: async ({ email, role }) => {
    // Artificial delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Check if demo user matches role or email
    let user = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === email?.toLowerCase() || u.role === role
    );

    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0] || 'VibeMed User',
        email,
        role: role || 'patient',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      };
    }

    const session = {
      user,
      token: `jwt_token_${Date.now()}`,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  register: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = {
      id: `usr_${Date.now()}`,
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      role: userData.role || 'patient',
      phone: userData.phone || '',
      specialty: userData.specialty || '',
      license: userData.licenseNumber || '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    const session = {
      user,
      token: `jwt_token_${Date.now()}`,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  getCurrentUser: () => {
    try {
      const sessionStr = localStorage.getItem(STORAGE_KEY);
      if (!sessionStr) return null;
      const session = JSON.parse(sessionStr);
      return session?.user || null;
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
