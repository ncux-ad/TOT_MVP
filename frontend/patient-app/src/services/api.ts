import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Базовый URL API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

// Создание экземпляра axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@TOT:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Очищаем токен
        await AsyncStorage.removeItem('@TOT:token');
        await AsyncStorage.removeItem('@TOT:user');

        // Показываем сообщение о необходимости повторной авторизации
        Alert.alert(
          'Сессия истекла',
          'Пожалуйста, войдите в систему снова',
          [
            {
              text: 'OK',
              onPress: () => {
                // Здесь можно добавить навигацию к экрану авторизации
                // navigation.navigate('Auth');
              },
            },
          ]
        );
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }

    return Promise.reject(error);
  }
);

// API методы для работы с авторизацией
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role?: string;
  }) => api.post('/auth/register', userData),

  getCurrentUser: () => api.get('/auth/me'),

  updateUser: (userData: any) => api.put('/auth/me', userData),
};

// API методы для работы с заказами
export const bookingAPI = {
  createBooking: (bookingData: {
    call_type: string;
    symptoms?: string;
    address: string;
    latitude?: number;
    longitude?: number;
    scheduled_time?: string;
    priority?: string;
    notes?: string;
    estimated_duration?: number;
    estimated_price?: number;
  }) => api.post('/bookings', bookingData),

  getBooking: (bookingId: string) => api.get(`/bookings/${bookingId}`),

  getUserBookings: (params?: {
    status_filter?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/bookings', { params }),

  cancelBooking: (bookingId: string, reason?: string) =>
    api.put(`/bookings/${bookingId}/cancel`, { reason }),

  startBooking: (bookingId: string) =>
    api.put(`/bookings/${bookingId}/start`),

  completeBooking: (bookingId: string, data: {
    actual_duration?: number;
    final_price?: number;
    notes?: string;
  }) => api.put(`/bookings/${bookingId}/complete`, data),
};

// API методы для работы с геолокацией
export const geoAPI = {
  trackLocation: (locationData: {
    latitude: number;
    longitude: number;
    address?: string;
    accuracy?: number;
  }) => api.post('/geo/track', locationData),

  getNearbyDoctors: (params: {
    lat: number;
    lon: number;
    radius?: number;
    specialization?: string;
    limit?: number;
  }) => api.get('/geo/doctors/nearby', { params }),

  getUserLocation: (userId: string) => api.get(`/geo/location/${userId}`),

  updateDoctorAvailability: (data: {
    is_available: boolean;
    specialization?: string;
    rating?: number;
    experience_years?: number;
  }) => api.put('/geo/availability', data),

  getDoctorLocation: (doctorId: string) =>
    api.get(`/geo/doctors/${doctorId}/location`),

  getLocationHistory: (userId: string, params?: {
    limit?: number;
    offset?: number;
  }) => api.get(`/geo/history/${userId}`, { params }),

  geocodeAddress: (address: string) =>
    api.post('/geo/geocode', { address }),
};

// API методы для работы с чатом
export const chatAPI = {
  createChatRoom: (data: {
    booking_id: string;
    participants: string[];
  }) => api.post('/chat/rooms', data),

  getChatMessages: (roomId: string, params?: {
    limit?: number;
    offset?: number;
  }) => api.get(`/chat/rooms/${roomId}/messages`, { params }),

  sendMessage: (roomId: string, data: {
    content: string;
    message_type?: string;
  }) => api.post(`/chat/rooms/${roomId}/messages`, data),
};

// API методы для работы с рейтингами
export const ratingAPI = {
  createRating: (data: {
    booking_id: string;
    doctor_id: string;
    rating: number;
    review?: string;
  }) => api.post('/ratings', data),

  getDoctorRatings: (doctorId: string) =>
    api.get(`/ratings/doctors/${doctorId}`),
};

// API методы для работы с платежами
export const paymentAPI = {
  createPayment: (data: {
    booking_id: string;
    amount: number;
    currency?: string;
    payment_method?: string;
  }) => api.post('/payments/create', data),

  getPayment: (paymentId: string) => api.get(`/payments/${paymentId}`),
};

// API методы для работы с уведомлениями
export const notificationAPI = {
  sendNotification: (data: {
    user_id: string;
    title: string;
    message: string;
    type?: string;
  }) => api.post('/notifications/send', data),

  getUserNotifications: () => api.get('/notifications'),
};

// API методы для работы с мероприятиями
export const eventAPI = {
  getEvents: (params?: {
    limit?: number;
    offset?: number;
    category?: string;
  }) => api.get('/events', { params }),

  createEvent: (data: {
    title: string;
    description: string;
    date: string;
    location?: string;
    max_participants?: number;
  }) => api.post('/events', data),
};

// API методы для работы с экстренными вызовами
export const emergencyAPI = {
  createEmergencyAlert: (data: {
    booking_id: string;
    emergency_type: string;
    description?: string;
  }) => api.post('/emergency/alert', data),

  updateEmergencyStatus: (alertId: string, data: {
    status: string;
    notes?: string;
  }) => api.put(`/emergency/${alertId}/status`, data),
};

// API методы для работы с профилями
export const profileAPI = {
  getUserProfile: (userId: string) => api.get(`/profiles/${userId}`),

  updateUserProfile: (userId: string, data: any) =>
    api.put(`/profiles/${userId}`, data),
};

export default api; 