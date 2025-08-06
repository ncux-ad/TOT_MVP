import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Stethoscope, 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  AlertTriangle,
  Clock,
  MapPin,
  Star
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Вызвать врача',
      description: 'Заказать вызов врача на дом',
      icon: Stethoscope,
      href: '/doctors',
      color: 'bg-blue-500',
    },
    {
      title: 'Мои записи',
      description: 'Просмотр активных записей',
      icon: Calendar,
      href: '/bookings',
      color: 'bg-green-500',
    },
    {
      title: 'Платежи',
      description: 'Управление платежами',
      icon: CreditCard,
      href: '/payments',
      color: 'bg-purple-500',
    },
    {
      title: 'Чат',
      description: 'Общение с врачами',
      icon: MessageCircle,
      href: '/chat',
      color: 'bg-orange-500',
    },
    {
      title: 'Экстренно',
      description: 'Экстренный вызов',
      icon: AlertTriangle,
      href: '/emergency',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Добро пожаловать, {user?.first_name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ТОТ - Твоя Точка Опоры. Мы здесь, чтобы помочь вам получить качественную медицинскую помощь.
        </p>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Быстрые действия
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Последняя активность
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Clock size={20} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Запись к врачу
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Запись на 15:30 сегодня
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MapPin size={20} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Врач в пути
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Доктор Иванов прибудет через 15 минут
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Star size={20} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Оценка приема
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Оцените качество приема у доктора Петрова
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">5</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Всего вызовов</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">3</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Активных записей</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">2</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Новых сообщений</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 