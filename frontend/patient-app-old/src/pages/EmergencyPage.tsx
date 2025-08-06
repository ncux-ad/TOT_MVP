import React, { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, User } from 'lucide-react';

const EmergencyPage: React.FC = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const emergencyTypes = [
    { id: 'cardiac', name: 'Сердечный приступ', icon: '❤️' },
    { id: 'stroke', name: 'Инсульт', icon: '🧠' },
    { id: 'injury', name: 'Травма', icon: '🩹' },
    { id: 'breathing', name: 'Проблемы с дыханием', icon: '🫁' },
    { id: 'other', name: 'Другое', icon: '🚨' },
  ];

  const handleEmergencyCall = () => {
    if (emergencyType && location) {
      // Здесь будет логика экстренного вызова
      alert('Экстренный вызов отправлен! Врач прибудет в ближайшее время.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle size={24} className="text-red-600" />
          <h1 className="text-2xl font-bold text-red-900 dark:text-red-100">
            Экстренный вызов
          </h1>
        </div>
        <p className="text-red-700 dark:text-red-300">
          Используйте эту функцию только в случае реальной экстренной ситуации
        </p>
      </div>

      {/* Emergency type selection */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Тип экстренной ситуации
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => setEmergencyType(type.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                emergencyType === type.id
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{type.icon}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {type.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location input */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Местоположение
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Адрес или координаты</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Введите адрес или разрешите доступ к геолокации"
                className="input pl-10"
              />
            </div>
          </div>
          
          <button className="btn btn-secondary w-full">
            <MapPin size={16} className="mr-2" />
            Определить местоположение автоматически
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Описание ситуации
        </h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опишите симптомы и состояние пациента..."
          className="input h-32 resize-none"
        />
      </div>

      {/* Emergency call button */}
      <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">
            Экстренный вызов
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-6">
            Нажмите кнопку ниже для отправки экстренного вызова
          </p>
          
          <button
            onClick={handleEmergencyCall}
            disabled={!emergencyType || !location}
            className="btn btn-danger text-lg px-8 py-4 flex items-center space-x-3 mx-auto"
          >
            <Phone size={24} />
            <span>ЭКСТРЕННЫЙ ВЫЗОВ</span>
          </button>
          
          <p className="text-sm text-red-600 dark:text-red-400 mt-4">
            Время ожидания: 5-10 минут
          </p>
        </div>
      </div>

      {/* Emergency contacts */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Экстренные контакты
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-red-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Скорая помощь</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">103</p>
              </div>
            </div>
            <button className="btn btn-primary text-sm">Позвонить</button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <User size={20} className="text-blue-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Ваш врач</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Доктор Иванов</p>
              </div>
            </div>
            <button className="btn btn-primary text-sm">Позвонить</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage; 