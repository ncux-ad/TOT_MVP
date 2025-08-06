import React from 'react';
import { Stethoscope, Star, MapPin, Clock } from 'lucide-react';

const DoctorsPage: React.FC = () => {
  const doctors = [
    {
      id: 1,
      name: 'Доктор Иванов И.П.',
      specialization: 'Терапевт',
      rating: 4.8,
      experience: 15,
      location: 'Москва',
      available: true,
      price: 2000,
    },
    {
      id: 2,
      name: 'Доктор Петрова А.С.',
      specialization: 'Кардиолог',
      rating: 4.9,
      experience: 12,
      location: 'Москва',
      available: true,
      price: 3000,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Врачи
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Выберите врача для записи на прием
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Stethoscope size={24} className="text-blue-600" />
              </div>
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{doctor.rating}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {doctor.name}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {doctor.specialization}
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin size={16} />
                <span>{doctor.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock size={16} />
                <span>{doctor.experience} лет опыта</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {doctor.price} ₽
              </span>
              <button className="btn btn-primary">
                Записаться
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage; 