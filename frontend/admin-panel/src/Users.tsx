/**
 * @file: Users.tsx
 * @description: Компонент списка пользователей
 * @dependencies: React, axios
 * @created: 2024-01-28
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
}

const Users: React.FC = () => {
  console.log('👥 Компонент Users загружен');
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      console.log('🔍 Запрос списка пользователей...');
      
      const response = await axios.get('/admin/users?page=1&limit=10');
      
      console.log('✅ Получен ответ:', response.data);
      
      // Извлекаем пользователей из ответа
      const userData = response.data.data || response.data;
      const usersList = userData.users || userData;
      
      console.log('👥 Список пользователей:', usersList);
      
      if (Array.isArray(usersList)) {
        setUsers(usersList);
        console.log(`✅ Загружено ${usersList.length} пользователей`);
      } else {
        console.warn('⚠️ Неожиданный формат данных:', userData);
        setError('Неверный формат данных от сервера');
      }
      
    } catch (err: any) {
      console.error('❌ Ошибка загрузки пользователей:', err);
      setError(`Ошибка: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect: загружаем пользователей');
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Загрузка пользователей...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Ошибка</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={fetchUsers} style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Список пользователей ({users.length})</h2>
      
      {users.length === 0 ? (
        <p>Пользователи не найдены</p>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Имя</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Фамилия</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Роль</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Активен</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {user.id.substring(0, 8)}...
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.first_name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.last_name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: user.role === 'admin' ? '#dc3545' : '#28a745',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span style={{
                    color: user.is_active ? 'green' : 'red'
                  }}>
                    {user.is_active ? '✅ Да' : '❌ Нет'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={fetchUsers} style={{ 
          padding: '10px 20px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Обновить список
        </button>
      </div>
    </div>
  );
};

export default Users;