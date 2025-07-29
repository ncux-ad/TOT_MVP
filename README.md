# 🏥 ТОТ – Твоя Точка Опоры (MVP)

## Описание проекта

Система вызова врачей на дом с поддержкой трех основных ролей:
- **Клиент (пациент)** - заказ вызова врача
- **Врач (специалист)** - прием и выполнение вызовов
- **Клиника/партнёр (B2B)** - управление услугами

## 🌍 Мультиплатформенность

Проект адаптирован для работы на различных платформах:

### Windows 11
```powershell
# Вариант 1: WSL2 (рекомендуется)
wsl --install -d Ubuntu
wsl
cd /mnt/c/Users/$USERNAME/OneDrive/Projects/TOT_MVP
./scripts/setup.sh

# Вариант 2: Локальный Python
.\scripts\setup.ps1 -LocalOnly

# Вариант 3: Docker
.\scripts\setup.ps1 -UseDocker
docker-compose up -d
```

### Linux/macOS
```bash
# Ubuntu/Debian
sudo apt install python3 python3-pip python3-venv nodejs npm docker.io docker-compose
chmod +x scripts/setup.sh
./scripts/setup.sh

# macOS
brew install python node docker docker-compose
chmod +x scripts/setup.sh
./scripts/setup.sh
```

📖 **Подробная документация:** [docs/MULTIPLATFORM.md](docs/MULTIPLATFORM.md)

## 🏗️ Архитектура

Микросервисная архитектура с возможностью эволюции из монолита в микросервисы.

### Backend сервисы
- **API Gateway** (8000) - единая точка входа
- **User Service** (8001) - авторизация и пользователи
- **Profile Service** (8002) - профили пользователей
- **Booking Service** (8003) - заказы вызовов
- **Geo Service** (8004) - геолокация и поиск
- **Payment Service** (8005) - платежи
- **Notification Service** (8006) - уведомления
- **Chat Service** (8007) - чат и звонки
- **Rating Service** (8008) - рейтинги
- **Event Service** (8009) - афиша мероприятий
- **Emergency Service** (8010) - экстренные вызовы
- **Security Service** (8011) - безопасность

### Frontend приложения
- **Patient App** (React Native) - для пациентов
- **Doctor App** (React Native) - для врачей
- **Clinic Web** (React) - для клиник
- **Admin Panel** (React) - административная панель

## 🚀 Быстрый старт

### 1. Клонирование репозитория
```bash
git clone https://github.com/your-org/tot-mvp.git
cd tot-mvp
```

### 2. Настройка окружения

#### Windows 11 (рекомендуется WSL2)
```powershell
# Установка WSL2
wsl --install -d Ubuntu

# Запуск в WSL
wsl
cd /mnt/c/Users/$USERNAME/OneDrive/Projects/TOT_MVP
chmod +x scripts/setup.sh
./scripts/setup.sh
```

#### Linux/macOS
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 3. Запуск сервисов

#### Локальный запуск
```bash
# Linux/macOS/WSL
./start.sh

# Windows PowerShell
.\start.ps1
```

#### Docker запуск
```bash
docker-compose up -d
```

### 4. Проверка работоспособности
```bash
# Проверка API Gateway
curl http://localhost:8000/health

# Проверка Swagger UI
open http://localhost:8000/docs
```

## 📁 Структура проекта

```
TOT_MVP/
├── backend/                 # Backend сервисы
│   ├── api-gateway/        # API Gateway
│   ├── user-service/       # Сервис пользователей
│   ├── profile-service/    # Сервис профилей
│   ├── booking-service/    # Сервис заказов
│   ├── geo-service/        # Сервис геолокации
│   ├── payment-service/    # Сервис платежей
│   └── notification-service/ # Сервис уведомлений
├── frontend/               # Frontend приложения
│   ├── patient-app/        # Приложение для пациентов
│   ├── doctor-app/         # Приложение для врачей
│   ├── clinic-web/         # Веб-интерфейс для клиник
│   └── admin-panel/        # Административная панель
├── docs/                   # Документация
├── scripts/                # Скрипты установки
├── docker-compose.yml      # Docker конфигурация
├── requirements.txt        # Python зависимости
├── package.json           # Node.js зависимости
└── README.md              # Документация
```

## 🛠️ Технологический стек

### Backend
- **Python 3.8+** - основной язык
- **FastAPI** - веб-фреймворк
- **SQLAlchemy** - ORM
- **PostgreSQL** - основная БД
- **Redis** - кэширование
- **JWT** - аутентификация

### Frontend
- **React Native** - мобильные приложения
- **React** - веб-приложения
- **TypeScript** - типизация
- **Expo** - разработка мобильных приложений

### DevOps
- **Docker** - контейнеризация
- **Docker Compose** - оркестрация
- **Prometheus** - мониторинг
- **Grafana** - визуализация

## 📊 Мониторинг

### Доступные порты
- **8000** - API Gateway
- **8001-8011** - Backend сервисы
- **3000-3003** - Frontend приложения
- **9090** - Prometheus
- **3004** - Grafana

### Проверка статуса
```bash
# Linux/macOS/WSL
./status.sh

# Windows PowerShell
.\status.ps1

# Docker
docker-compose ps
```

## 🔧 Разработка

### Добавление нового сервиса
1. Создайте директорию в `backend/`
2. Добавьте `main.py` и `requirements.txt`
3. Обновите `docker-compose.yml`
4. Добавьте маршруты в API Gateway

### Локальная разработка
```bash
# Активация виртуального окружения
source venv/bin/activate  # Linux/macOS/WSL
.\venv\Scripts\Activate.ps1  # Windows

# Запуск конкретного сервиса
python backend/api-gateway/main.py
```

## 📚 Документация

- [Архитектура системы](docs/ARCHITECTURE.md)
- [Инструкции по развертыванию](docs/DEPLOYMENT.md)
- [Мультиплатформенная настройка](docs/MULTIPLATFORM.md)

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 📞 Поддержка

- **Email:** support@tot-mvp.ru
- **Telegram:** @tot_support
- **Документация:** [docs/](docs/)

---

**ТОТ – Твоя Точка Опоры** - современная система вызова врачей на дом 🏥 