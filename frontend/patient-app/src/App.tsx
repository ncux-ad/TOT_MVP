import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authAPI, doctorsAPI, bookingsAPI, paymentsAPI, chatAPI, emergencyAPI } from './services/api.ts';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Простые компоненты страниц
const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        const localUser = localStorage.getItem('user');
        if (localUser) {
          setUser(JSON.parse(localUser));
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Добро пожаловать в ТОТ!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Твоя Точка Опоры - ваш надежный помощник в вопросах здоровья
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>Пользователь:</strong> {user?.name || user?.email || 'Гость'}
            </p>
            <p className="text-blue-600 dark:text-blue-300 text-sm">
              Время: {new Date().toLocaleString('ru-RU')}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Быстрые действия
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a 
            href="/doctors" 
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow-md transition-colors text-center"
          >
            <div className="text-3xl mb-2">👨‍⚕️</div>
            <h3 className="font-semibold">Найти врача</h3>
            <p className="text-sm opacity-90">Записаться на прием</p>
          </a>
          
          <a 
            href="/bookings" 
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow-md transition-colors text-center"
          >
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-semibold">Мои записи</h3>
            <p className="text-sm opacity-90">Управление записями</p>
          </a>
          
          <a 
            href="/payments" 
            className="bg-yellow-600 hover:bg-yellow-700 text-white p-6 rounded-lg shadow-md transition-colors text-center"
          >
            <div className="text-3xl mb-2">💳</div>
            <h3 className="font-semibold">Платежи</h3>
            <p className="text-sm opacity-90">Управление финансами</p>
          </a>
          
          <a 
            href="/emergency" 
            className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-lg shadow-md transition-colors text-center"
          >
            <div className="text-3xl mb-2">🚨</div>
            <h3 className="font-semibold">Экстренный вызов</h3>
            <p className="text-sm opacity-90">Скорая помощь</p>
          </a>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Статистика
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">3</div>
            <div className="text-gray-600 dark:text-gray-300">Активных записей</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">2,500</div>
            <div className="text-gray-600 dark:text-gray-300">Баланс (₽)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">5</div>
            <div className="text-gray-600 dark:text-gray-300">Сообщений в чате</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        const localUser = localStorage.getItem('user');
        if (localUser) {
          setUser(JSON.parse(localUser));
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Профиль</h2>
      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
        <p><strong>Имя:</strong> {user?.name || 'Не указано'}</p>
        <p><strong>Email:</strong> {user?.email || 'Не указано'}</p>
        <p><strong>Телефон:</strong> {user?.phone || 'Не указано'}</p>
        <p><strong>Роль:</strong> {user?.role || 'Пациент'}</p>
        <p><strong>Дата регистрации:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Не указано'}</p>
      </div>
    </div>
  );
};

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await doctorsAPI.getDoctors();
        setDoctors(response.data);
      } catch (err: any) {
        console.error('Ошибка загрузки врачей:', err);
        setError('Не удалось загрузить список врачей');
        // Fallback к демо данным
        setDoctors([
          {
            id: 1,
            name: 'Доктор Иванов И.П.',
            specialization: 'Кардиолог',
            rating: 4.8,
            experience_years: 15,
            bio: 'Опытный кардиолог с 15-летним стажем'
          },
          {
            id: 2,
            name: 'Доктор Петрова А.С.',
            specialization: 'Терапевт',
            rating: 4.5,
            experience_years: 12,
            bio: 'Врач-терапевт высшей категории'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const handleBookAppointment = async (doctorId: number) => {
    try {
      await bookingsAPI.createBooking({
        doctor_id: doctorId,
        appointment_date: new Date().toISOString(),
        notes: 'Запись через приложение'
      });
      alert('Запись успешно создана!');
    } catch (err: any) {
      alert('Ошибка создания записи: ' + (err.response?.data?.detail || 'Неизвестная ошибка'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Наши врачи
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Выберите специалиста для записи на прием
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">👨‍⚕️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {doctor.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {doctor.specialization}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">
                    {'⭐'.repeat(Math.floor(doctor.rating))}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {doctor.rating} ({doctor.experience_years} лет опыта)
                  </span>
                </div>

                {doctor.bio && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {doctor.bio}
                  </p>
                )}

                <button 
                  onClick={() => handleBookAppointment(doctor.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Записаться на прием
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await bookingsAPI.getBookings();
        setBookings(response.data);
      } catch (err: any) {
        console.error('Ошибка загрузки записей:', err);
        setError('Не удалось загрузить записи');
        // Fallback к демо данным
        setBookings([
          {
            id: 1,
            doctor_name: 'Доктор Иванов И.П.',
            appointment_date: '2024-01-15T14:00:00',
            status: 'confirmed',
            notes: 'Консультация кардиолога'
          },
          {
            id: 2,
            doctor_name: 'Доктор Петрова А.С.',
            appointment_date: '2024-01-20T10:30:00',
            status: 'pending',
            notes: 'Общий осмотр'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await bookingsAPI.cancelBooking(bookingId.toString());
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      alert('Запись отменена!');
    } catch (err: any) {
      alert('Ошибка отмены записи: ' + (err.response?.data?.detail || 'Неизвестная ошибка'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает подтверждения';
      case 'cancelled': return 'Отменено';
      default: return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Мои записи
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Управляйте своими записями к врачам
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg">
          <p className="font-medium">⚠️ Демо данные</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              У вас пока нет записей
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Запишитесь к врачу, чтобы увидеть их здесь
            </p>
            <a 
              href="/doctors" 
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Найти врача
            </a>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 dark:text-blue-400">👨‍⚕️</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {booking.notes || 'Запись к врачу'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {booking.doctor_name}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Дата и время</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(booking.appointment_date).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Статус</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <button 
                    onClick={() => handleCancelBooking(booking.id)}
                    className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Отменить
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const PaymentsPage: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        const [walletResponse, paymentsResponse] = await Promise.all([
          paymentsAPI.getWallet(),
          paymentsAPI.getPayments()
        ]);
        setWallet(walletResponse.data);
        setPayments(paymentsResponse.data);
      } catch (err: any) {
        console.error('Ошибка загрузки платежей:', err);
        setError('Не удалось загрузить данные о платежах');
        // Fallback к демо данным
        setWallet({ balance: 2500 });
        setPayments([
          {
            id: 1,
            description: 'Консультация кардиолога',
            amount: -1500,
            status: 'completed',
            created_at: '2024-01-15T14:00:00'
          },
          {
            id: 2,
            description: 'Пополнение кошелька',
            amount: 3000,
            status: 'completed',
            created_at: '2024-01-10T10:00:00'
          },
          {
            id: 3,
            description: 'Экстренный вызов',
            amount: -800,
            status: 'completed',
            created_at: '2024-01-08T20:30:00'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Платежи
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Управляйте своими финансами
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg">
          <p className="font-medium">⚠️ Демо данные</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Wallet Balance */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Баланс кошелька</h2>
          <div className="text-4xl font-bold mb-2">
            {wallet?.balance?.toLocaleString() || '0'} ₽
          </div>
          <p className="text-blue-100">Доступно для оплаты услуг</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Последние транзакции
        </h3>
        
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💳</div>
              <p className="text-gray-600 dark:text-gray-300">
                Транзакций пока нет
              </p>
            </div>
          ) : (
            payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    payment.amount > 0 
                      ? 'bg-green-100 dark:bg-green-900' 
                      : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    <span className={`text-lg ${
                      payment.amount > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {payment.amount > 0 ? '📈' : '📉'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {payment.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payment.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-lg ${
                    payment.amount > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {payment.amount > 0 ? '+' : ''}{payment.amount.toLocaleString()} ₽
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {payment.status === 'completed' ? 'Выполнено' : 'В обработке'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadChats = async () => {
      try {
        const response = await chatAPI.getChats();
        setChats(response.data);
      } catch (err: any) {
        console.error('Ошибка загрузки чатов:', err);
        setError('Не удалось загрузить чаты');
        // Fallback к демо данным
        setChats([
          {
            id: 1,
            doctor_name: 'Доктор Иванов И.П.',
            last_message: 'Здравствуйте! Как ваше самочувствие?',
            last_message_time: '2024-01-15T14:30:00',
            unread_count: 1
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Загрузка чатов...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Чат</h2>
      {error && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          color: '#ef4444', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px' 
        }}>
          {error}
        </div>
      )}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {chats.length === 0 ? (
          <p>У вас пока нет активных чатов</p>
        ) : (
          chats.map((chat) => (
            <div key={chat.id} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
              <h3>{chat.doctor_name}</h3>
              <p><strong>Последнее сообщение:</strong> {chat.last_message}</p>
              <p><strong>Время:</strong> {new Date(chat.last_message_time).toLocaleTimeString('ru-RU')}</p>
              {chat.unread_count > 0 && (
                <span style={{ 
                  backgroundColor: '#ef4444', 
                  color: 'white', 
                  padding: '2px 6px', 
                  borderRadius: '10px', 
                  fontSize: '12px' 
                }}>
                  {chat.unread_count} новых
                </span>
              )}
              <button style={{ 
                padding: '8px 16px', 
                backgroundColor: '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                marginTop: '10px'
              }}>
                Открыть чат
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const EmergencyPage: React.FC = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmergencyCall = async () => {
    if (!emergencyType || !location || !description) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    try {
      await emergencyAPI.createAlert({
        emergency_type: emergencyType,
        location: location,
        description: description,
        priority: 'high'
      });
      setSuccess(true);
    } catch (err: any) {
      alert('Ошибка отправки экстренного вызова: ' + (err.response?.data?.detail || 'Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Экстренный вызов отправлен!</h2>
        <p>Спасательная служба уведомлена. Оставайтесь на месте.</p>
        <button 
          onClick={() => setSuccess(false)}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Новый вызов
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Экстренные вызовы</h2>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#fef2f2', border: '2px solid #ef4444', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#ef4444' }}>🚨 Экстренный вызов</h3>
          <p>Используйте эту функцию только в случае реальной экстренной ситуации</p>
          
          <div style={{ textAlign: 'left', marginTop: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Тип экстренной ситуации:</label>
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                disabled={loading}
              >
                <option value="">Выберите тип</option>
                <option value="medical">Медицинская помощь</option>
                <option value="accident">Несчастный случай</option>
                <option value="cardiac">Сердечный приступ</option>
                <option value="stroke">Инсульт</option>
                <option value="other">Другое</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Местоположение:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="Адрес или координаты"
                disabled={loading}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Описание:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minHeight: '80px'
                }}
                placeholder="Опишите ситуацию"
                disabled={loading}
              />
            </div>
          </div>
          
          <button 
            onClick={handleEmergencyCall}
            disabled={loading}
            style={{ 
              padding: '15px 30px', 
              backgroundColor: loading ? '#9ca3af' : '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Отправка...' : 'ЭКСТРЕННЫЙ ВЫЗОВ'}
          </button>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
          <h3>Экстренные контакты</h3>
          <p><strong>Скорая помощь:</strong> 103</p>
          <p><strong>Пожарная служба:</strong> 101</p>
          <p><strong>Полиция:</strong> 102</p>
          <p><strong>Ваш врач:</strong> Доктор Иванов И.П.</p>
        </div>
      </div>
    </div>
  );
};

// Простой Layout компонент
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">Т</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                ТОТ - Твоя Точка Опоры
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="/" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Главная
              </a>
              <a 
                href="/doctors" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Врачи
              </a>
              <a 
                href="/bookings" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Мои записи
              </a>
              <a 
                href="/payments" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Платежи
              </a>
              <a 
                href="/chat" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Чат
              </a>
              <a 
                href="/emergency" 
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Экстренно
              </a>
            </div>

            {/* Logout Button */}
            <div className="flex items-center">
              <button 
                onClick={handleLogout}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a 
              href="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
            >
              Главная
            </a>
            <a 
              href="/doctors" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
            >
              Врачи
            </a>
            <a 
              href="/bookings" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
            >
              Мои записи
            </a>
            <a 
              href="/payments" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
            >
              Платежи
            </a>
            <a 
              href="/chat" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
            >
              Чат
            </a>
            <a 
              href="/emergency" 
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 block px-3 py-2 rounded-md text-base font-medium"
            >
              Экстренно
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/" replace /> : <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />


            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <DoctorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <PaymentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emergency"
              element={
                <ProtectedRoute>
                  <EmergencyPage />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 