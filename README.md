# ТОТ – Твоя Точка Опоры (MVP)

## Описание проекта
Система вызова врачей на дом с поддержкой трех основных ролей:
- **Клиент (пациент)** - заказ вызова врача
- **Врач (специалист)** - прием и выполнение вызовов
- **Клиника/партнёр (B2B)** - управление услугами

## Архитектура
Микросервисная архитектура с возможностью эволюции из монолита в микросервисы.

### Основные компоненты
- **Mobile Apps**: React Native / Flutter
- **Web Interface**: React (ТОТ Бизнес)
- **Admin Panel**: React (модерация, поддержка)
- **Backend**: Python (FastAPI) + Node.js (NestJS)
- **Database**: PostgreSQL + Redis
- **Geo**: YandexMaps / 2GIS
- **Communication**: Firebase, Twilio/Agora

## Структура проекта
```
TOT_MVP/
├── backend/                 # Backend сервисы
│   ├── user-service/       # Регистрация, авторизация
│   ├── profile-service/    # Профили врачей
│   ├── booking-service/    # Заказы и вызовы
│   ├── geo-service/        # Геолокация
│   ├── payment-service/    # Платежи
│   ├── notification-service/ # Уведомления
│   ├── rating-service/     # Рейтинги
│   ├── chat-service/       # Чат и звонки
│   ├── security-service/   # Безопасность
│   ├── event-service/      # Афиша мероприятий
│   └── emergency-service/  # Экстренные вызовы
├── frontend/               # Frontend приложения
│   ├── patient-app/        # Мобильное приложение пациента
│   ├── doctor-app/         # Мобильное приложение врача
│   ├── clinic-web/         # Web-интерфейс клиники
│   └── admin-panel/        # Админ панель
├── shared/                 # Общие компоненты
│   ├── types/             # TypeScript типы
│   ├── utils/             # Утилиты
│   └── constants/         # Константы
├── docs/                  # Документация
├── docker/                # Docker конфигурации
└── scripts/               # Скрипты развертывания
```

## Этапы разработки

### Этап 1 (1-2 месяца)
- [ ] Авторизация и личные кабинеты
- [ ] Система вызовов врачей
- [ ] Геопозиционирование
- [ ] Чат между пациентом и врачом
- [ ] Платежная система
- [ ] Система отзывов

### Этап 2 (3-4 месяца)
- [ ] Экстренные вызовы ("Сложный вызов", "Опасность")
- [ ] Балансы врачей и клиник
- [ ] Афиша мероприятий
- [ ] Система рейтингов
- [ ] Уведомления

### Этап 3 (5+ месяцев)
- [ ] Сложные маршруты
- [ ] Аналитика
- [ ] Премиум тарифы
- [ ] Масштабирование на новые города

## Быстрый старт

### Требования
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Установка
```bash
# Клонирование репозитория
git clone <repository-url>
cd TOT_MVP

# Установка зависимостей
npm install
pip install -r requirements.txt

# Настройка окружения
cp .env.example .env
# Отредактируйте .env файл

# Запуск базы данных
docker-compose up -d postgres redis

# Запуск сервисов
npm run dev:backend
npm run dev:frontend
```

## Лицензия
MIT License 