/**
 * VibeMed Secure API Client
 * 
 * Features:
 * - Centralized Base URL resolution from environment (VITE_API_BASE_URL)
 * - Automatic Authorization Header injection (Bearer token)
 * - Anti-CSRF / API identification header (X-Requested-With)
 * - Standardized JSON Content-Type and Accept headers
 * - Safe error propagation without destructive session wiping
 */

import { authService } from './authService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const TENANT = import.meta.env.VITE_API_TENANT || 'demo.just4madam.com';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL.replace(/\/$/, ''); // strip trailing slash
  }

  /**
   * Build default secure headers with current Bearer token and X-Tenant
   */
  getSecureHeaders(customHeaders = {}) {
    const token = authService.getToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Tenant': TENANT,
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Build full URL safely
   */
  buildUrl(endpoint) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${cleanEndpoint}`;
  }

  /**
   * Internal request wrapper with safe error propagation
   */
  async request(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    const headers = this.getSecureHeaders(options.headers);

    // If options.body is FormData, remove Content-Type so browser can set boundary
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      const rawText = await response.text();
      let responseData = null;
      if (rawText && rawText.trim().length > 0) {
        try {
          responseData = JSON.parse(rawText);
        } catch {
          // Response body was not valid JSON
        }
      }

      // Handle non-2xx responses
      if (!response.ok) {
        const errorMessage =
          responseData?.message ||
          responseData?.error ||
          (rawText && rawText.length < 200 ? rawText : `Request failed with status ${response.status}`);
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = responseData;
        throw error;
      }

      // Handle empty body responses (e.g. 204 No Content)
      if (response.status === 204 || !responseData) {
        return responseData || null;
      }

      return responseData;
    } catch (err) {
      // Re-throw formatted error for calling service to handle or fallback
      throw err;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data = null, options = {}) {
    const isFormData = data instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  put(endpoint, data = null, options = {}) {
    const isFormData = data instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  patch(endpoint, data = null, options = {}) {
    const isFormData = data instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(BASE_URL);
export default apiClient;
