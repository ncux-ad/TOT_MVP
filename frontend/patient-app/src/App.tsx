import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authAPI, doctorsAPI, bookingsAPI, paymentsAPI, chatAPI, emergencyAPI } from './services/api.ts';

// Простые компоненты страниц
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка входа в систему');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      maxWidth: '400px',
      margin: '50px auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2>Вход в систему</h2>
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
      <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="patient@example.com"
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="password123"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        Демо данные: patient@example.com / password123
      </p>
    </div>
  );
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.register(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Регистрация успешна!</h2>
        <p>Теперь вы можете войти в систему</p>
        <button onClick={() => navigate('/login')} style={{ 
          padding: '10px 20px', 
          backgroundColor: '#2563eb', 
          color: 'white', 
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Войти
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Регистрация</h2>
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
      <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Имя:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="Иван Иванов"
            disabled={loading}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="patient@example.com"
            disabled={loading}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Пароль:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="password123"
            disabled={loading}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Телефон:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="+7 (999) 123-45-67"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};

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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Главная страница</h2>
      <p>Добро пожаловать в ТОТ - Твоя Точка Опоры!</p>
      <p>Пользователь: {user?.name || user?.email || 'Гость'}</p>
      <p>Время: {new Date().toLocaleString('ru-RU')}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Быстрые действия:</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/doctors" style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Найти врача
          </a>
          <a href="/bookings" style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Мои записи
          </a>
          <a href="/payments" style={{ padding: '10px 20px', backgroundColor: '#f59e0b', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Платежи
          </a>
          <a href="/emergency" style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Экстренный вызов
          </a>
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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Загрузка списка врачей...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Врачи</h2>
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
        {doctors.map((doctor) => (
          <div key={doctor.id} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
            <h3>{doctor.name}</h3>
            <p><strong>Специализация:</strong> {doctor.specialization}</p>
            <p><strong>Рейтинг:</strong> {'⭐'.repeat(Math.floor(doctor.rating))} ({doctor.rating})</p>
            <p><strong>Опыт:</strong> {doctor.experience_years} лет</p>
            {doctor.bio && <p><strong>О враче:</strong> {doctor.bio}</p>}
            <button 
              onClick={() => handleBookAppointment(doctor.id)}
              style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Записаться
            </button>
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
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Загрузка записей...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Записи</h2>
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
        {bookings.length === 0 ? (
          <p>У вас пока нет записей к врачам</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
              <h3>{booking.notes || 'Запись к врачу'}</h3>
              <p><strong>Врач:</strong> {booking.doctor_name}</p>
              <p><strong>Дата:</strong> {new Date(booking.appointment_date).toLocaleString('ru-RU')}</p>
              <p><strong>Статус:</strong> <span style={{ color: getStatusColor(booking.status) }}>{getStatusText(booking.status)}</span></p>
              {booking.status === 'pending' && (
                <button 
                  onClick={() => handleCancelBooking(booking.id)}
                  style={{ 
                    padding: '5px 10px', 
                    backgroundColor: '#ef4444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Отменить
                </button>
              )}
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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Загрузка данных о платежах...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Платежи</h2>
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
        <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Баланс кошелька</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
            {wallet?.balance?.toLocaleString() || '0'} ₽
          </p>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
          <h3>Последние транзакции</h3>
          <div style={{ textAlign: 'left' }}>
            {payments.length === 0 ? (
              <p>Транзакций пока нет</p>
            ) : (
              payments.map((payment) => (
                <div key={payment.id} style={{ 
                  padding: '10px 0', 
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                      {payment.description}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      {new Date(payment.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <span style={{ 
                    color: payment.amount > 0 ? '#10b981' : '#ef4444',
                    fontWeight: 'bold'
                  }}>
                    {payment.amount > 0 ? '+' : ''}{payment.amount.toLocaleString()} ₽
                  </span>
                </div>
              ))
            )}
          </div>
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{ backgroundColor: '#2563eb', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>ТОТ - Твоя Точка Опоры</h1>
        <div>
          <a href="/" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Главная</a>
          <a href="/doctors" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Врачи</a>
          <a href="/bookings" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Записи</a>
          <a href="/payments" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Платежи</a>
          <a href="/chat" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Чат</a>
          <a href="/emergency" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Экстренно</a>
          <button 
            onClick={handleLogout}
            style={{ 
              backgroundColor: 'transparent', 
              color: 'white', 
              border: '1px solid white', 
              padding: '5px 10px', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Выйти
          </button>
        </div>
      </nav>
      <main>{children}</main>
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
  );
};

export default App; 