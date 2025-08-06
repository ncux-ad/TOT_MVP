import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, Sun, Moon, Building, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'clinic';
  // Поля для врачей
  specialization?: string;
  license_number?: string;
  experience_years?: number;
  // Поля для клиник
  clinic_name?: string;
  clinic_address?: string;
  clinic_license?: string;
}

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      role: 'patient'
    }
  });

  const password = watch('password');
  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      // Подготавливаем данные для отправки
      const userData: any = {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        phone: data.phone,
      };

      // Добавляем поля в зависимости от роли
      if (data.role === 'doctor') {
        userData.specialization = data.specialization;
        userData.license_number = data.license_number;
        userData.experience_years = data.experience_years;
      } else if (data.role === 'clinic') {
        userData.clinic_name = data.clinic_name;
        userData.clinic_address = data.clinic_address;
        userData.clinic_license = data.clinic_license;
      }

      await registerUser(userData);
      toast.success('Регистрация успешна!');
      navigate('/');
    } catch (error: any) {
      console.error('Ошибка регистрации:', error);
      toast.error(error.message || 'Ошибка регистрации. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Т</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Регистрация
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Создайте новую учетную запись
          </p>
        </div>

        {/* Theme toggle */}
        <div className="flex justify-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Register form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Тип аккаунта</label>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    value="patient"
                    {...register('role')}
                    className="mr-2"
                  />
                  <User size={16} className="mr-1" />
                  <span className="text-sm">Пациент</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    value="doctor"
                    {...register('role')}
                    className="mr-2"
                  />
                  <Stethoscope size={16} className="mr-1" />
                  <span className="text-sm">Врач</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    value="clinic"
                    {...register('role')}
                    className="mr-2"
                  />
                  <Building size={16} className="mr-1" />
                  <span className="text-sm">Клиника</span>
                </label>
              </div>
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Имя
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="first_name"
                    type="text"
                    {...register('first_name', {
                      required: 'Имя обязательно',
                      minLength: {
                        value: 2,
                        message: 'Имя должно содержать минимум 2 символа',
                      },
                      maxLength: {
                        value: 50,
                        message: 'Имя должно содержать максимум 50 символов',
                      },
                    })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Имя"
                  />
                </div>
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Фамилия
                </label>
                <input
                  id="last_name"
                  type="text"
                  {...register('last_name', {
                    required: 'Фамилия обязательна',
                    minLength: {
                      value: 2,
                      message: 'Фамилия должна содержать минимум 2 символа',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Фамилия должна содержать максимум 50 символов',
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Фамилия"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email обязателен',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Неверный формат email',
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Введите ваш email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Телефон (необязательно)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={20} className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', {
                    pattern: {
                      value: /^(\+7|8)[0-9]{10,}$/,
                      message: 'Телефон должен начинаться с +7 или 8 и содержать минимум 10 цифр',
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Doctor-specific fields */}
            {selectedRole === 'doctor' && (
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100">Информация о враче</h3>
                
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Специализация
                  </label>
                  <input
                    id="specialization"
                    type="text"
                    {...register('specialization', {
                      required: 'Специализация обязательна для врачей',
                      maxLength: {
                        value: 100,
                        message: 'Специализация должна содержать максимум 100 символов',
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Например: Терапевт"
                  />
                  {errors.specialization && (
                    <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Номер лицензии
                  </label>
                  <input
                    id="license_number"
                    type="text"
                    {...register('license_number', {
                      required: 'Номер лицензии обязателен для врачей',
                      maxLength: {
                        value: 50,
                        message: 'Номер лицензии должен содержать максимум 50 символов',
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Например: DOC123456"
                  />
                  {errors.license_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.license_number.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Опыт работы (лет)
                  </label>
                  <input
                    id="experience_years"
                    type="number"
                    {...register('experience_years', {
                      required: 'Опыт работы обязателен для врачей',
                      min: {
                        value: 0,
                        message: 'Опыт работы не может быть отрицательным',
                      },
                      max: {
                        value: 50,
                        message: 'Опыт работы не может превышать 50 лет',
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Например: 5"
                  />
                  {errors.experience_years && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience_years.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Clinic-specific fields */}
            {selectedRole === 'clinic' && (
              <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-medium text-green-900 dark:text-green-100">Информация о клинике</h3>
                
                <div>
                  <label htmlFor="clinic_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Название клиники
                  </label>
                  <input
                    id="clinic_name"
                    type="text"
                    {...register('clinic_name', {
                      required: 'Название клиники обязательно',
                      maxLength: {
                        value: 200,
                        message: 'Название клиники должно содержать максимум 200 символов',
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Например: Медицинский центр 'Здоровье'"
                  />
                  {errors.clinic_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.clinic_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="clinic_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Адрес клиники
                  </label>
                  <textarea
                    id="clinic_address"
                    {...register('clinic_address', {
                      required: 'Адрес клиники обязателен',
                      maxLength: {
                        value: 500,
                        message: 'Адрес клиники должен содержать максимум 500 символов',
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                    rows={3}
                    placeholder="Полный адрес клиники"
                  />
                  {errors.clinic_address && (
                    <p className="mt-1 text-sm text-red-600">{errors.clinic_address.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="clinic_license" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Лицензия клиники
                  </label>
                  <input
                    id="clinic_license"
                    type="text"
                    {...register('clinic_license', {
                      required: 'Лицензия клиники обязательна',
                      maxLength: {
                        value: 50,
                        message: 'Лицензия клиники должна содержать максимум 50 символов',
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Например: CLINIC123456"
                  />
                  {errors.clinic_license && (
                    <p className="mt-1 text-sm text-red-600">{errors.clinic_license.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Пароль обязателен',
                    minLength: {
                      value: 6,
                      message: 'Пароль должен содержать минимум 6 символов',
                    },
                  })}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Подтвердите пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Подтверждение пароля обязательно',
                    validate: (value) =>
                      value === password || 'Пароли не совпадают',
                  })}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Подтвердите пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </div>

          {/* Login link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Уже есть аккаунт?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Войти
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 