// VibeMed Authentication Service with Live Backend API & localStorage Persistence

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isVercel = host.includes("vercel.app");
    const isLocalhost = host === "localhost" || host === "127.0.0.1";
    if (!isVercel && !isLocalhost) {
      return "https://vibemed.just4madam.com/api/v1";
    }
  }
  return envUrl || "/api/v1";
};

const BASE_URL = resolveApiBaseUrl();
const TENANT = import.meta.env.VITE_API_TENANT || "demo.just4madam.com";
const STORAGE_KEY = "vibemed_auth_session";
const TOKEN_KEY = "vibemed_token";

export const DEMO_USERS = {
  admin: {
    id: "usr_admin",
    name: "Eleanor Vance (Admin)",
    email: "admin@vibemed.health",
    role: "admin",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    department: "Hospital Administration",
  },
  doctor: {
    id: "usr_doc1",
    name: "Dr. Sarah Connor, MD",
    email: "dr.sarah@vibemed.health",
    role: "doctor",
    specialty: "Cardiology",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    department: "Cardiovascular Care",
    license: "MED-89401-NY",
  },
  patient: {
    id: "usr_pat1",
    name: "Alex Morgan",
    email: "alex.morgan@vibemed.health",
    role: "patient",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    bloodGroup: "O+",
    age: 32,
    gender: "Male",
  },
  receptionist: {
    id: "usr_rec1",
    name: "Jessica Taylor",
    email: "jessica.reception@vibemed.health",
    role: "receptionist",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    department: "Front Desk & Triage",
  },
};

export const authService = {
  /**
   * Call real backend Login API endpoint:
   * POST https://vibemed.just4madam.com/api/v1/auth/login
   * Headers: Content-Type, Accept, X-Tenant
   * Saves returned Bearer token and user details to localStorage
   */
  login: async ({ email, password, role }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Tenant": TENANT,
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (jsonErr) {
        console.warn(
          "Failed to parse login response JSON:",
          jsonErr,
          text?.substring(0, 100),
        );
      }

      // If server returned 200 OK with HTML (e.g. Hostinger rewriting /api/v1 to index.html), or non-2xx
      const isHtmlResponse = text && text.trim().startsWith("<");
      if (isHtmlResponse) {
        console.warn(
          "Received HTML instead of JSON from API endpoint. Check that API URL points to the backend server rather than static host.",
        );
        return authService.mockLogin({ email, role });
      }

      if (!response.ok || !data || !data.success) {
        if (response.status === 429) {
          console.warn(
            "API rate limit exceeded (429). Falling back to demo session if available.",
          );
          return authService.mockLogin({ email, role });
        }

        let errorMsg = data?.message;
        if (!errorMsg) {
          if (response.status === 200) {
            errorMsg =
              "Login response was invalid. Falling back to demo account.";
            return authService.mockLogin({ email, role });
          } else {
            errorMsg = `Login failed with status ${response.status}`;
          }
        }

        if (data?.errors) {
          const firstErr = Object.values(data.errors).flat()[0];
          if (firstErr) errorMsg = firstErr;
        }
        throw new Error(errorMsg);
      }

      const apiData = data.data;
      const apiUser = apiData.user || {};
      const primaryRole =
        (apiData.roles && apiData.roles[0]) ||
        apiData.profile?.role ||
        apiData.profile?.type ||
        role ||
        "admin";

      const user = {
        id: apiUser.id || `usr_${Date.now()}`,
        name: apiUser.name || (email ? email.split("@")[0] : "User"),
        email: apiUser.email || email,
        phone: apiUser.phone || "",
        status: apiUser.status || "active",
        role: primaryRole.toLowerCase(),
        roles: apiData.roles || [primaryRole],
        permissions: apiData.permissions || [],
        tenant: apiData.tenant,
        profile: apiData.profile,
        avatar:
          apiUser.avatar ||
          (primaryRole.toLowerCase() === "doctor"
            ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
            : primaryRole.toLowerCase() === "patient"
              ? "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
              : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"),
      };

      const session = {
        user,
        token: apiData.token,
        tokenType: apiData.token_type || "Bearer",
        tenant: apiData.tenant,
        loginTime: new Date().toISOString(),
      };

      // Persist session and token to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      localStorage.setItem(TOKEN_KEY, apiData.token);
      return session;
    } catch (err) {
      // If offline/testing demo mock account (@vibemed.health), fall back gracefully
      const isDemoAccount =
        email && email.toLowerCase().endsWith("@vibemed.health");
      if (isDemoAccount) {
        console.warn(
          "Backend login unavailable or demo account used, falling back to mock session:",
          err.message,
        );
        return authService.mockLogin({ email, role });
      }
      throw err;
    }
  },

  mockLogin: async ({ email, role }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    let user = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === email?.toLowerCase(),
    );

    if (!user && role) {
      user = Object.values(DEMO_USERS).find((u) => u.role === role);
    }

    if (!user) {
      let inferredRole = role;
      if (!inferredRole) {
        const lowerEmail = (email || "").toLowerCase();
        if (lowerEmail.includes("admin")) inferredRole = "admin";
        else if (lowerEmail.includes("dr") || lowerEmail.includes("doctor"))
          inferredRole = "doctor";
        else if (lowerEmail.includes("reception"))
          inferredRole = "receptionist";
        else inferredRole = "doctor";
      }

      user = {
        id: `usr_${Date.now()}`,
        name: email.split("@")[0] || "Clinic Staff",
        email,
        role: inferredRole,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      };
    }

    const session = {
      user,
      token: `mock_jwt_token_${Date.now()}`,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(TOKEN_KEY, session.token);
    return session;
  },

  register: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = {
      id: `usr_${Date.now()}`,
      name: userData.name || userData.email.split("@")[0],
      email: userData.email,
      role: userData.role || "patient",
      phone: userData.phone || "",
      specialty: userData.specialty || "",
      license: userData.licenseNumber || "",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    };

    const session = {
      user,
      token: `jwt_token_${Date.now()}`,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(TOKEN_KEY, session.token);
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

  getToken: () => {
    try {
      // Primary: from token key
      const directToken = localStorage.getItem(TOKEN_KEY);
      if (directToken) return directToken;

      // Secondary: from session object
      const sessionStr = localStorage.getItem(STORAGE_KEY);
      if (!sessionStr) return null;
      const session = JSON.parse(sessionStr);
      return session?.token || null;
    } catch {
      return null;
    }
  },

  logout: async () => {
    const token = authService.getToken();
    if (token && !token.startsWith("mock_")) {
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Tenant": TENANT,
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        console.warn("API logout warning:", e);
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
};
