/**
 * API Service
 * Handles HTTP communications with the FastAPI backend.
 * Provides JWT token attachment and error interception.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercept requests to attach JWT authorization header if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pca_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for global 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired or invalid
      console.warn('API returned 401 Unauthorized');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  verifyMfa: async (code) => {
    const response = await apiClient.post('/auth/mfa/verify', { code });
    return response.data;
  },
  setupMfa: async () => {
    const response = await apiClient.get('/auth/mfa/setup');
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export const telemetryApi = {
  sendFeatureBatch: async (featureVector) => {
    const response = await apiClient.post('/telemetry/evaluate', featureVector);
    return response.data;
  },
  calibrateBaseline: async (baselineData) => {
    const response = await apiClient.post('/telemetry/calibrate', baselineData);
    return response.data;
  },
  getBaselineProfile: async () => {
    const response = await apiClient.get('/telemetry/baseline');
    return response.data;
  },
  getAuditLogs: async () => {
    const response = await apiClient.get('/telemetry/audit-logs');
    return response.data;
  },
};

export default apiClient;
