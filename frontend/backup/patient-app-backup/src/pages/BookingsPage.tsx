import React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const BookingsPage: React.FC = () => {
  const bookings = [
    {
      id: 1,
      doctor: 'Доктор Иванов И.П.',
      date: '2025-07-31',
      time: '15:30',
      status: 'confirmed',
      address: 'ул. Ленина, 1',
    },
    {
      id: 2,
      doctor: 'Доктор Петрова А.С.',
      date: '2025-08-02',
      time: '10:00',
      status: 'pending',
      address: 'ул. Пушкина, 10',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Подтверждено';
      case 'pending':
        return 'Ожидает подтверждения';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Мои записи
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Управляйте своими записями к врачам
        </p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <User size={20} className="text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {booking.doctor}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={16} />
                    <span>{booking.date}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock size={16} />
                    <span>{booking.time}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={16} />
                    <span>{booking.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
                
                <div className="flex space-x-2">
                  <button className="btn btn-secondary text-sm">
                    Отменить
                  </button>
                  <button className="btn btn-primary text-sm">
                    Детали
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage; 