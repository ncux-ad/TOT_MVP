// Mock API для админ-панели
export const mockAPI = {
  // Пользователи
  users: [
    {
      id: '1',
      email: 'patient@example.com',
      firstName: 'Иван',
      lastName: 'Иванов',
      role: 'patient',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      email: 'doctor@example.com',
      firstName: 'Петр',
      lastName: 'Петров',
      role: 'doctor',
      status: 'pending',
      createdAt: '2024-01-16'
    }
  ],

  // Врачи
  doctors: [
    {
      id: '1',
      name: 'Доктор Иванов И.П.',
      specialization: 'Кардиолог',
      rating: 4.8,
      experience: 15,
      status: 'approved',
      email: 'ivanov@clinic.ru'
    },
    {
      id: '2',
      name: 'Доктор Петрова А.С.',
      specialization: 'Терапевт',
      rating: 4.5,
      experience: 12,
      status: 'pending',
      email: 'petrova@clinic.ru'
    }
  ],

  // Клиники
  clinics: [
    {
      id: '1',
      name: 'Медицинский центр "Здоровье"',
      address: 'ул. Ленина, 1',
      phone: '+7 (999) 123-45-67',
      status: 'approved',
      doctorsCount: 15
    },
    {
      id: '2',
      name: 'Клиника "Добрый доктор"',
      address: 'ул. Пушкина, 10',
      phone: '+7 (999) 987-65-43',
      status: 'pending',
      doctorsCount: 8
    }
  ],

  // Записи
  appointments: [
    {
      id: '1',
      patientName: 'Иван Иванов',
      doctorName: 'Доктор Иванов И.П.',
      date: '2024-01-20',
      time: '14:00',
      status: 'confirmed'
    },
    {
      id: '2',
      patientName: 'Мария Сидорова',
      doctorName: 'Доктор Петрова А.С.',
      date: '2024-01-21',
      time: '10:30',
      status: 'pending'
    }
  ]
};

export default mockAPI;
