# API Endpoints Documentation

## Общая информация

**Base URL**: `http://localhost:8000` (API Gateway)
**User Service**: `http://localhost:8001`
**Profile Service**: `http://localhost:8002`
**Payment Service**: `http://localhost:8005`

## API Gateway (Порт 8000)

### Аутентификация
- `POST /auth/login` - Вход в систему
- `POST /auth/register` - Регистрация пользователя
- `GET /auth/me` - Получение информации о текущем пользователе

### Админ-панель API
- `GET /admin/users` - Список пользователей (только для админов)
- `GET /admin/users/{user_id}` - Информация о пользователе
- `PUT /admin/users/{user_id}` - Обновление пользователя
- `DELETE /admin/users/{user_id}` - Удаление пользователя
- `GET /admin/me` - Профиль админа

### Новые API эндпоинты для админ-панели
- `GET /api/users` - Список пользователей через API
- `GET /api/users/{user_id}` - Информация о пользователе через API
- `POST /api/users` - Создание пользователя через API
- `PUT /api/users/{user_id}` - Обновление пользователя через API
- `DELETE /api/users/{user_id}` - Удаление пользователя через API

- `GET /api/doctors` - Список врачей через API
- `GET /api/doctors/{doctor_id}` - Информация о враче через API
- `POST /api/doctors` - Создание врача через API
- `PUT /api/doctors/{doctor_id}` - Обновление врача через API
- `DELETE /api/doctors/{doctor_id}` - Удаление врача через API
- `GET /api/doctors/list` - Список врачей для форм

- `GET /api/clinics` - Список клиник через API
- `GET /api/clinics/{clinic_id}` - Информация о клинике через API
- `POST /api/clinics` - Создание клиники через API
- `PUT /api/clinics/{clinic_id}` - Обновление клиники через API
- `DELETE /api/clinics/{clinic_id}` - Удаление клиники через API
- `GET /api/clinics/list` - Список клиник для форм

- `GET /api/patients` - Список пациентов
- `GET /api/dashboard/stats` - Статистика для дашборда

### Профили
- `GET /profiles/{user_id}` - Получение профиля пользователя
- `PUT /profiles/{user_id}` - Обновление профиля пользователя

### Записи (Booking)
- `POST /bookings` - Создание заказа вызова врача
- `GET /bookings/{booking_id}` - Получение информации о заказе
- `PUT /bookings/{booking_id}/cancel` - Отмена заказа

### Геолокация
- `GET /geo/doctors/nearby` - Поиск врачей поблизости
- `POST /geo/track` - Отслеживание местоположения

### Платежи
- `POST /payments/create` - Создание платежа
- `GET /payments/{payment_id}` - Получение информации о платеже

### Чат
- `POST /chat/rooms` - Создание чат-комнаты
- `GET /chat/rooms/{room_id}/messages` - Получение сообщений чата
- `POST /chat/rooms/{room_id}/messages` - Отправка сообщения

### Рейтинги
- `POST /ratings` - Создание отзыва и рейтинга
- `GET /ratings/doctors/{doctor_id}` - Получение рейтингов врача

### Мероприятия
- `GET /events` - Получение списка мероприятий
- `POST /events` - Создание мероприятия

### Экстренные вызовы
- `POST /emergency/alert` - Создание экстренного вызова
- `PUT /emergency/{alert_id}/status` - Обновление статуса экстренного вызова

### Уведомления
- `POST /notifications/send` - Отправка уведомления
- `GET /notifications` - Получение уведомлений пользователя

### Health Check
- `GET /health` - Проверка состояния API Gateway

## User Service (Порт 8001)

### Аутентификация
- `POST /auth/login` - Вход в систему
- `POST /auth/register` - Регистрация пользователя
- `GET /auth/me` - Информация о текущем пользователе
- `PUT /auth/me` - Обновление текущего пользователя

### Пользователи
- `GET /users` - Список пользователей с пагинацией
- `GET /users/count` - Количество пользователей
- `GET /users/{user_id}` - Информация о пользователе по ID
- `PUT /users/{user_id}` - Обновление пользователя
- `DELETE /users/{user_id}` - Удаление пользователя

### Health Check
- `GET /health` - Проверка состояния User Service

## Profile Service (Порт 8002)

### Профили пользователей
- `POST /profiles/` - Создание профиля
- `GET /profiles/{user_id}` - Получение профиля пользователя
- `PUT /profiles/{user_id}` - Обновление профиля пользователя

### Профили врачей
- `POST /doctor-profiles/` - Создание профиля врача
- `GET /doctor-profiles/count` - Количество врачей
- `GET /doctor-profiles/` - Список всех врачей
- `GET /doctor-profiles/{user_id}` - Получение профиля врача
- `PUT /doctor-profiles/{user_id}` - Обновление профиля врача

### Профили клиник
- `POST /clinic-profiles/` - Создание профиля клиники
- `GET /clinic-profiles/count` - Количество клиник
- `GET /clinic-profiles/` - Список всех клиник
- `GET /clinic-profiles/{user_id}` - Получение профиля клиники
- `PUT /clinic-profiles/{user_id}` - Обновление профиля клиники

### Health Check
- `GET /health` - Проверка состояния Profile Service

## Payment Service (Порт 8005)

### Платежи
- `POST /payments/create` - Создание платежа
- `GET /payments/{payment_id}` - Получение информации о платеже

### Health Check
- `GET /health` - Проверка состояния Payment Service

## Проблемы и решения

### Проблема 1: Порядок маршрутов в FastAPI
**Проблема**: `/users/count` конфликтует с `/users/{user_id}`

**Решение**: 
```python
# Правильный порядок
@app.get("/users/count")
async def get_users_count():
    pass

@app.get("/users/{user_id}")
async def get_user(user_id: str):
    pass
```

### Проблема 2: Отсутствие документации
**Проблема**: Нет четкого списка всех эндпоинтов

**Решение**: 
- Создать этот документ
- Обновлять при добавлении новых эндпоинтов
- Использовать как чек-лист при разработке

### Проблема 3: Несогласованность между сервисами
**Проблема**: Разные форматы ответов в разных сервисах

**Решение**:
- Стандартизировать форматы ответов
- Использовать единые модели данных
- Создать общие схемы валидации

## Рекомендации

### Для разработки
1. **Всегда добавлять новые эндпоинты в этот документ**
2. **Проверять порядок маршрутов** - конкретные маршруты должны идти перед параметризованными
3. **Тестировать все эндпоинты** после изменений
4. **Использовать Swagger UI** для тестирования: `http://localhost:8000/docs`

### Для отладки
1. **Проверять логи сервисов** для выявления ошибок
2. **Использовать curl или Postman** для тестирования API
3. **Проверять статус сервисов** через health check эндпоинты

### Для поддержки
1. **Регулярно обновлять документацию**
2. **Версионировать API** при критических изменениях
3. **Вести changelog** всех изменений

## Статус эндпоинтов

### ✅ Работающие
- `GET /users/count` - возвращает количество пользователей
- `GET /doctor-profiles/count` - возвращает количество врачей
- `GET /clinic-profiles/count` - возвращает количество клиник
- `GET /bookings/count` - возвращает количество заказов
- `GET /admin/users` - список пользователей для админ-панели
- `POST /auth/login` - авторизация
- `GET /auth/me` - информация о пользователе
- `GET /api/dashboard/stats` - статистика для дашборда (включая заказы)

### 🔄 В разработке
- `GET /api/doctors` - список врачей для админ-панели
- `GET /api/clinics` - список клиник для админ-панели

### 📋 Планируется
- `POST /api/users` - создание пользователей
- `PUT /api/users/{user_id}` - обновление пользователей
- `DELETE /api/users/{user_id}` - удаление пользователей
- CRUD операции для врачей и клиник 