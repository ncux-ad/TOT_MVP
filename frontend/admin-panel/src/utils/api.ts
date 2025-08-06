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
    const token = localStorage.getItem('adminToken');
    console.log('🔑 Интерцептор: токен из localStorage:', token ? token.substring(0, 20) + '...' : 'НЕТ');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Интерцептор: добавлен заголовок Authorization');
    } else {
      console.log('⚠️ Интерцептор: токен не найден в localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => {
    console.log('✅ Интерцептор ответа: успешный ответ', response.status);
    return response;
  },
  (error) => {
    console.log('❌ Интерцептор ответа: ошибка', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log('🚪 Интерцептор: 401 ошибка, перенаправляем на логин');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API методы для админ-панели
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  getProfile: () => 
    api.get('/auth/me'),
};

export const usersAPI = {
  getUsers: (params?: any) => 
    api.get('/admin/users', { params }),
  
  getUser: (id: string) => 
    api.get(`/admin/users/${id}`),
  
  createUser: (userData: any) => 
    api.post('/admin/users', userData),
  
  updateUser: (id: string, userData: any) => 
    api.put(`/admin/users/${id}`, userData),
  
  deleteUser: (id: string) => 
    api.delete(`/admin/users/${id}`),
};

export const doctorsAPI = {
  getDoctors: (params?: any) => 
    api.get('/doctors', { params }),
  
  getDoctor: (id: string) => 
    api.get(`/doctors/${id}`),
  
  createDoctor: (doctorData: any) => 
    api.post('/doctors', doctorData),
  
  updateDoctor: (id: string, doctorData: any) => 
    api.put(`/doctors/${id}`, doctorData),
  
  deleteDoctor: (id: string) => 
    api.delete(`/doctors/${id}`),
};

export const clinicsAPI = {
  getClinics: (params?: any) => 
    api.get('/clinics', { params }),
  
  getClinic: (id: string) => 
    api.get(`/clinics/${id}`),
  
  createClinic: (clinicData: any) => 
    api.post('/clinics', clinicData),
  
  updateClinic: (id: string, clinicData: any) => 
    api.put(`/clinics/${id}`, clinicData),
  
  deleteClinic: (id: string) => 
    api.delete(`/clinics/${id}`),
};

export const appointmentsAPI = {
  getAppointments: (params?: any) => 
    api.get('/appointments', { params }),
  
  getAppointment: (id: string) => 
    api.get(`/appointments/${id}`),
  
  createAppointment: (appointmentData: any) => 
    api.post('/appointments', appointmentData),
  
  updateAppointment: (id: string, appointmentData: any) => 
    api.put(`/appointments/${id}`, appointmentData),
  
  deleteAppointment: (id: string) => 
    api.delete(`/appointments/${id}`),
};

export const dashboardAPI = {
  getStats: () => 
    api.get('/dashboard/stats'),
}; 