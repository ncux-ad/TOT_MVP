import React, { useState, useEffect } from 'react';
import { Stethoscope, Star, MapPin, Clock } from 'lucide-react';

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialization: string;
  experience_years: number;
  email: string;
  phone: string;
  is_active: boolean;
  is_verified: boolean;
}

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/doctors');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setDoctors(data.doctors || []);
      } catch (err: any) {
        console.error('Ошибка загрузки врачей:', err);
        setError('Не удалось загрузить список врачей');
        // Fallback к демо данным
        setDoctors([
          {
            id: '1',
            first_name: 'Иван',
            last_name: 'Петров',
            specialization: 'Терапевт',
            experience_years: 15,
            email: 'doctor1@tot.ru',
            phone: '+7 (495) 123-45-67',
            is_active: true,
            is_verified: true
          },
          {
            id: '2',
            first_name: 'Анна',
            last_name: 'Козлова',
            specialization: 'Кардиолог',
            experience_years: 12,
            email: 'doctor2@tot.ru',
            phone: '+7 (495) 234-56-78',
            is_active: true,
            is_verified: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
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
          Врачи
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Выберите врача для записи на прием
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg">
          <p className="font-medium">⚠️ Демо данные</p>
          <p className="text-sm">{error}</p>
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
                    {doctor.first_name} {doctor.last_name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {doctor.specialization}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">
                    {'⭐'.repeat(Math.floor(4.5))}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    4.5 ({doctor.experience_years} лет опыта)
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin size={16} />
                  <span>Москва</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock size={16} />
                  <span>{doctor.experience_years} лет опыта</span>
                </div>

                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Записаться на прием
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Врачи не найдены
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Попробуйте позже или обратитесь в поддержку
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage; 