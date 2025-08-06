import axios from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
export const api = axios.create({
  baseURL: '', // Используем прокси через Vite
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('patientToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('patientToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API методы для patient-app
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) => 
    api.post('/auth/register', userData),
  
  getProfile: () => 
    api.get('/auth/me'),
  
  updateProfile: (userData: any) => 
    api.put('/auth/me', userData),
};

export const doctorsAPI = {
  getDoctors: (params?: any) => 
    api.get('/api/v1/users', { params: { ...params, role: 'doctor' } }),
  
  getDoctor: (id: string) => 
    api.get(`/api/v1/users/${id}`),
};

export const clinicsAPI = {
  getClinics: (params?: any) => 
    api.get('/api/v1/users', { params: { ...params, role: 'clinic' } }),
  
  getClinic: (id: string) => 
    api.get(`/api/v1/users/${id}`),
};

export const appointmentsAPI = {
  getAppointments: (params?: any) => 
    api.get('/appointments', { params }),
  
  createAppointment: (appointmentData: any) => 
    api.post('/appointments', appointmentData),
  
  cancelAppointment: (id: string) => 
    api.put(`/appointments/${id}/cancel`),
}; 