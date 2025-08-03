import axios from 'axios';

export const api = axios.create({
  baseURL: '',  // Используем относительные пути
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API методы
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
    api.get('/profiles/doctor-profiles/', { params }),
  
  getDoctor: (id: string) => 
    api.get(`/profiles/doctor-profiles/${id}`),
  
  getNearbyDoctors: (lat: number, lon: number, radius: number = 5) => 
    api.get('/geo/doctors/nearby', { params: { lat, lon, radius } }),
};

export const bookingsAPI = {
  createBooking: (bookingData: any) => 
    api.post('/bookings', bookingData),
  
  getBookings: () => 
    api.get('/bookings'),
  
  getBooking: (id: string) => 
    api.get(`/bookings/${id}`),
  
  cancelBooking: (id: string) => 
    api.put(`/bookings/${id}/cancel`),
};

export const paymentsAPI = {
  createPayment: (paymentData: any) => 
    api.post('/payments/create', paymentData),
  
  getPayments: () => 
    api.get('/payments'),
  
  getPayment: (id: string) => 
    api.get(`/payments/${id}`),
  
  getWallet: () => 
    api.get('/payments/wallets/me'),
};

export const chatAPI = {
  getChats: () => 
    api.get('/chat/rooms'),
  
  getMessages: (roomId: string) => 
    api.get(`/chat/rooms/${roomId}/messages`),
  
  sendMessage: (roomId: string, message: string) => 
    api.post(`/chat/rooms/${roomId}/messages`, { message }),
};

export const emergencyAPI = {
  createAlert: (alertData: any) => 
    api.post('/emergency/alert', alertData),
  
  updateAlertStatus: (alertId: string, status: string) => 
    api.put(`/emergency/${alertId}/status`, { status }),
}; 