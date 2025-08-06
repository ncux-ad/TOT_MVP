# 📝 Руководство по регистрации пользователей

## 🎯 Обзор

Система ТОТ поддерживает регистрацию четырех типов пользователей:
- **Пациенты** (patient) - обычные пользователи
- **Врачи** (doctor) - медицинские специалисты
- **Клиники** (clinic) - медицинские учреждения
- **Администраторы** (admin) - управляющие системой

## 🔗 API Endpoints

### Регистрация
```
POST /auth/register
```

### Авторизация
```
POST /auth/login
```

## 📋 Поля регистрации

### Обязательные поля для всех пользователей

| Поле | Тип | Описание | Валидация |
|------|-----|----------|-----------|
| `email` | string | Email пользователя | Валидный email формат |
| `password` | string | Пароль | Минимум 6 символов |
| `first_name` | string | Имя | 2-50 символов |
| `last_name` | string | Фамилия | 2-50 символов |
| `role` | string | Роль пользователя | patient, doctor, clinic, admin |

### Опциональные поля

| Поле | Тип | Описание | Валидация |
|------|-----|----------|-----------|
| `phone` | string | Телефон | +7 или 8, минимум 10 цифр |

### Специальные поля для врачей

| Поле | Тип | Описание | Валидация |
|------|-----|----------|-----------|
| `specialization` | string | Специализация | До 100 символов |
| `license_number` | string | Номер лицензии | До 50 символов |
| `experience_years` | integer | Опыт работы | 0-50 лет |

### Специальные поля для клиник

| Поле | Тип | Описание | Валидация |
|------|-----|----------|-----------|
| `clinic_name` | string | Название клиники | До 200 символов |
| `clinic_address` | string | Адрес клиники | До 500 символов |
| `clinic_license` | string | Лицензия клиники | До 50 символов |

## 📝 Примеры запросов

### Регистрация пациента

```json
{
  "email": "patient@example.com",
  "password": "securepass123",
  "first_name": "Иван",
  "last_name": "Иванов",
  "role": "patient",
  "phone": "+7 (999) 123-45-67"
}
```

### Регистрация врача

```json
{
  "email": "doctor@example.com",
  "password": "doctorpass123",
  "first_name": "Доктор",
  "last_name": "Петров",
  "role": "doctor",
  "specialization": "Терапевт",
  "license_number": "DOC123456",
  "experience_years": 5
}
```

### Регистрация клиники

```json
{
  "email": "clinic@example.com",
  "password": "clinicpass123",
  "first_name": "Клиника",
  "last_name": "Здоровье",
  "role": "clinic",
  "clinic_name": "Медицинский центр 'Здоровье'",
  "clinic_address": "ул. Ленина, 1",
  "clinic_license": "CLINIC123456"
}
```

## ✅ Успешный ответ

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "phone": "+7 (999) 123-45-67",
    "first_name": "Иван",
    "last_name": "Иванов",
    "role": "patient",
    "is_active": true,
    "is_verified": false,
    "specialization": null,
    "license_number": null,
    "experience_years": null,
    "clinic_name": null,
    "clinic_address": null,
    "clinic_license": null,
    "created_at": "2025-08-06T20:58:40.600197",
    "updated_at": "2025-08-06T20:58:40.600197"
  }
}
```

## ❌ Ошибки валидации

### Неверный email
```json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "email"],
      "msg": "value is not a valid email address: An email address must have an @-sign.",
      "input": "invalid-email"
    }
  ]
}
```

### Короткий пароль
```json
{
  "detail": [
    {
      "type": "string_too_short",
      "loc": ["body", "password"],
      "msg": "String should have at least 6 characters",
      "input": "123",
      "ctx": {"min_length": 6}
    }
  ]
}
```

### Неверная роль
```json
{
  "detail": [
    {
      "type": "string_pattern_mismatch",
      "loc": ["body", "role"],
      "msg": "String should match pattern '^(patient|doctor|clinic|admin)$'",
      "input": "invalid"
    }
  ]
}
```

### Дубликат email
```json
{
  "detail": "User with this email or phone already exists"
}
```

## 🔧 Frontend интеграция

### React компонент

```typescript
const registerUser = async (userData: RegisterData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { access_token, user } = response.data;
    
    // Сохраняем токен
    localStorage.setItem('token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    return user;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Ошибка регистрации');
  }
};
```

### Валидация на клиенте

```typescript
const validateRegistration = (data: RegisterForm) => {
  const errors: any = {};
  
  // Email
  if (!data.email) {
    errors.email = 'Email обязателен';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
    errors.email = 'Неверный формат email';
  }
  
  // Пароль
  if (!data.password) {
    errors.password = 'Пароль обязателен';
  } else if (data.password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов';
  }
  
  // Имя
  if (!data.first_name) {
    errors.first_name = 'Имя обязательно';
  } else if (data.first_name.length < 2) {
    errors.first_name = 'Имя должно содержать минимум 2 символа';
  }
  
  // Фамилия
  if (!data.last_name) {
    errors.last_name = 'Фамилия обязательна';
  } else if (data.last_name.length < 2) {
    errors.last_name = 'Фамилия должна содержать минимум 2 символа';
  }
  
  // Телефон
  if (data.phone && !data.phone.match(/^(\+7|8)/)) {
    errors.phone = 'Телефон должен начинаться с +7 или 8';
  }
  
  return errors;
};
```

## 🧪 Тестирование

### Запуск тестов регистрации

```bash
python test_registration_improved.py
```

### Тестовые сценарии

1. **Успешная регистрация** всех типов пользователей
2. **Валидация полей** - проверка всех ограничений
3. **Дубликаты** - проверка уникальности email
4. **Вход после регистрации** - проверка авторизации

## 🔒 Безопасность

### Хеширование паролей
- Пароли хешируются с помощью bcrypt
- Соль добавляется автоматически
- Необратимое хеширование

### JWT токены
- Токены генерируются при успешной регистрации
- Срок действия: 24 часа
- Алгоритм: HS256

### Валидация данных
- Все входные данные валидируются
- Защита от SQL-инъекций через ORM
- Проверка уникальности email и телефона

## 📊 Статистика

- **Поддерживаемые роли**: 4 (patient, doctor, clinic, admin)
- **Обязательных полей**: 5 (email, password, first_name, last_name, role)
- **Опциональных полей**: 8 (phone, specialization, license_number, etc.)
- **Валидаторов**: 6 (email, password, name, role, phone, experience)

---

**Дата создания:** 06.08.2025  
**Версия:** 1.0.0  
**Статус:** Активно используется
