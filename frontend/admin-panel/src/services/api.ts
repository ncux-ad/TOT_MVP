import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const adminAPI = {
  // Auth
  login: (email: string, password: string) => 
    api.post('/admin/login', { email, password }),
  
  getProfile: () => 
    api.get('/admin/me'),

  // Users
  getUsers: (params?: any) => 
    api.get('/admin/users', { params }),
  
  updateUser: (userId: string, data: any) => 
    api.put(`/admin/users/${userId}`, data),
  
  deleteUser: (userId: string) => 
    api.delete(`/admin/users/${userId}`),

  // Doctors
  getDoctors: (params?: any) => 
    api.get('/admin/doctors', { params }),
  
  approveDoctor: (doctorId: string) => 
    api.post(`/admin/doctors/${doctorId}/approve`),
  
  rejectDoctor: (doctorId: string) => 
    api.post(`/admin/doctors/${doctorId}/reject`),

  // Clinics
  getClinics: (params?: any) => 
    api.get('/admin/clinics', { params }),
  
  approveClinic: (clinicId: string) => 
    api.post(`/admin/clinics/${clinicId}/approve`),
  
  rejectClinic: (clinicId: string) => 
    api.post(`/admin/clinics/${clinicId}/reject`),

  // Appointments
  getAppointments: (params?: any) => 
    api.get('/admin/appointments', { params }),

  // Reports
  getReports: (params?: any) => 
    api.get('/admin/reports', { params }),
  
  generateReport: (type: string, params?: any) => 
    api.post(`/admin/reports/${type}`, params),

  // Settings
  getSettings: () => 
    api.get('/admin/settings'),
  
  updateSettings: (data: any) => 
    api.put('/admin/settings', data),
};
