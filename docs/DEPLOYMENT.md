# Руководство по развертыванию ТОТ MVP

## Обзор

Данное руководство описывает процесс развертывания системы "ТОТ – Твоя Точка Опоры" в различных средах: разработка, тестирование и продакшн.

## Требования к системе

### Минимальные требования
- **CPU**: 4 ядра
- **RAM**: 8 GB
- **Storage**: 100 GB SSD
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- **Network**: 100 Mbps

### Рекомендуемые требования
- **CPU**: 8 ядер
- **RAM**: 16 GB
- **Storage**: 500 GB SSD
- **OS**: Ubuntu 22.04 LTS
- **Network**: 1 Gbps

## Предварительная настройка

### 1. Установка Docker и Docker Compose

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Установка Node.js и npm

```bash
# Установка Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка версий
node --version
npm --version
```

### 3. Установка Python 3.11+

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3.11 python3.11-pip python3.11-venv

# Создание виртуального окружения
python3.11 -m venv tot-env
source tot-env/bin/activate
```

## Развертывание в среде разработки

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-org/tot-mvp.git
cd tot-mvp
```

### 2. Настройка переменных окружения

```bash
# Копирование примера конфигурации
cp env.example .env

# Редактирование конфигурации
nano .env
```

Основные настройки для разработки:
```env
ENVIRONMENT=development
DEBUG=true
DATABASE_URL=postgresql://tot_user:tot_password@localhost:5432/tot_mvp
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-development-secret-key
```

### 3. Запуск сервисов

```bash
# Установка зависимостей
npm install

# Запуск базы данных и Redis
docker-compose up -d postgres redis

# Ожидание готовности базы данных
sleep 10

# Применение миграций
cd backend
alembic upgrade head

# Запуск всех сервисов
docker-compose up -d

# Проверка статуса
docker-compose ps
```

### 4. Проверка работоспособности

```bash
# Проверка API Gateway
curl http://localhost:8000/health

# Проверка User Service
curl http://localhost:8001/health

# Проверка базы данных
docker-compose exec postgres psql -U tot_user -d tot_mvp -c "SELECT version();"
```

## Развертывание в продакшн

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# Настройка файрвола
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Настройка SSL сертификата

```bash
# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавить строку: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Настройка Nginx

```nginx
# /etc/nginx/sites-available/tot-mvp
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # API Gateway
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend приложения
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket для чата
    location /ws/ {
        proxy_pass http://localhost:8007/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### 4. Настройка продакшн переменных

```env
ENVIRONMENT=production
DEBUG=false
DATABASE_URL=postgresql://tot_user:tot_password@localhost:5432/tot_mvp
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secure-production-secret-key
JWT_EXPIRATION=24

# Геолокация
YANDEX_MAPS_API_KEY=your-yandex-maps-api-key

# Платежи
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Уведомления
FIREBASE_SERVER_KEY=your-firebase-server-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token

# Безопасность
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900
```

### 5. Запуск в продакшн

```bash
# Сборка образов
docker-compose -f docker-compose.prod.yml build

# Запуск сервисов
docker-compose -f docker-compose.prod.yml up -d

# Проверка логов
docker-compose -f docker-compose.prod.yml logs -f
```

## Мониторинг и логирование

### 1. Настройка Prometheus

```yaml
# docker/prometheus/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'api-gateway'
    static_configs:
      - targets: ['api-gateway:8000']

  - job_name: 'user-service'
    static_configs:
      - targets: ['user-service:8001']

  - job_name: 'booking-service'
    static_configs:
      - targets: ['booking-service:8003']
```

### 2. Настройка Grafana

```bash
# Создание дашборда
curl -X POST http://admin:admin@localhost:3004/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @docker/grafana/dashboard.json
```

### 3. Настройка логирования

```yaml
# docker-compose.prod.yml
services:
  api-gateway:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Резервное копирование

### 1. Скрипт резервного копирования

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/tot-mvp"

# Создание резервной копии базы данных
docker-compose exec -T postgres pg_dump -U tot_user tot_mvp > $BACKUP_DIR/db_backup_$DATE.sql

# Создание резервной копии файлов
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /opt/tot-mvp/uploads

# Удаление старых резервных копий (старше 30 дней)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### 2. Автоматизация резервного копирования

```bash
# Добавление в crontab
crontab -e

# Ежедневное резервное копирование в 2:00
0 2 * * * /opt/tot-mvp/scripts/backup.sh
```

## Масштабирование

### 1. Горизонтальное масштабирование

```bash
# Масштабирование сервисов
docker-compose up -d --scale user-service=3
docker-compose up -d --scale booking-service=3
docker-compose up -d --scale geo-service=2
```

### 2. Настройка балансировщика нагрузки

```nginx
# /etc/nginx/sites-available/tot-mvp
upstream api_backend {
    server localhost:8000;
    server localhost:8000;
    server localhost:8000;
}

location /api/ {
    proxy_pass http://api_backend/;
    # ... остальные настройки
}
```

## Обновление системы

### 1. Процедура обновления

```bash
#!/bin/bash
# update.sh

# Остановка сервисов
docker-compose down

# Получение обновлений
git pull origin main

# Сборка новых образов
docker-compose build

# Применение миграций
docker-compose run --rm api-gateway alembic upgrade head

# Запуск сервисов
docker-compose up -d

# Проверка работоспособности
sleep 30
curl http://localhost:8000/health
```

### 2. Откат изменений

```bash
# Откат к предыдущей версии
git checkout HEAD~1
docker-compose down
docker-compose build
docker-compose up -d
```

## Безопасность

### 1. Настройка файрвола

```bash
# Настройка UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Регулярные обновления

```bash
# Автоматические обновления безопасности
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 3. Мониторинг безопасности

```bash
# Установка fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Устранение неполадок

### 1. Проверка логов

```bash
# Просмотр логов всех сервисов
docker-compose logs

# Просмотр логов конкретного сервиса
docker-compose logs api-gateway

# Просмотр логов в реальном времени
docker-compose logs -f user-service
```

### 2. Проверка состояния сервисов

```bash
# Статус контейнеров
docker-compose ps

# Использование ресурсов
docker stats

# Проверка сетевых соединений
docker network ls
docker network inspect tot-mvp_tot-network
```

### 3. Восстановление после сбоя

```bash
# Перезапуск всех сервисов
docker-compose restart

# Перезапуск конкретного сервиса
docker-compose restart user-service

# Полная перезагрузка
docker-compose down
docker-compose up -d
```

## Контакты и поддержка

- **Техническая поддержка**: support@tot-mvp.com
- **Документация**: https://docs.tot-mvp.com
- **GitHub**: https://github.com/your-org/tot-mvp
- **Telegram**: @tot_support 