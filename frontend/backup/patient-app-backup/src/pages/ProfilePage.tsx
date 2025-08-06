import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Calendar } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Мой профиль
        </h1>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User size={20} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Имя</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user?.first_name} {user?.last_name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Mail size={20} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>
          </div>
          
          {user?.phone && (
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Телефон</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.phone}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Calendar size={20} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Роль</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 