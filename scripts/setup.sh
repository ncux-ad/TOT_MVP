#!/bin/bash

# Универсальный скрипт установки для Linux/macOS
# TOT MVP - Твоя Точка Опоры

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Проверка системных требований
check_requirements() {
    print_info "Проверка системных требований..."
    
    # Проверка Python
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        print_success "Python $PYTHON_VERSION найден"
    elif command -v python &> /dev/null; then
        PYTHON_VERSION=$(python --version | cut -d' ' -f2)
        print_success "Python $PYTHON_VERSION найден"
    else
        print_error "Python не найден. Установите Python 3.8+"
        exit 1
    fi
    
    # Проверка Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js $NODE_VERSION найден"
    else
        print_warning "Node.js не найден. Frontend будет недоступен"
    fi
    
    # Проверка npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm $NPM_VERSION найден"
    else
        print_warning "npm не найден. Frontend будет недоступен"
    fi
    
    # Проверка Docker
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_success "Docker найден: $DOCKER_VERSION"
    else
        print_warning "Docker не найден. Контейнеризация будет недоступна"
    fi
    
    # Проверка Docker Compose
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose найден"
    elif docker compose version &> /dev/null; then
        print_success "Docker Compose (v2) найден"
    else
        print_warning "Docker Compose не найден"
    fi
}

# Создание виртуального окружения
setup_python_env() {
    print_info "Настройка Python окружения..."
    
    if [ ! -d "venv" ]; then
        print_info "Создание виртуального окружения..."
        python3 -m venv venv
        print_success "Виртуальное окружение создано"
    fi
    
    # Активация виртуального окружения
    source venv/bin/activate
    
    # Обновление pip
    print_info "Обновление pip..."
    pip install --upgrade pip
    
    # Установка зависимостей
    print_info "Установка Python зависимостей..."
    pip install -r requirements.txt
    
    print_success "Python окружение настроено"
}

# Настройка Node.js окружения
setup_node_env() {
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        print_info "Настройка Node.js окружения..."
        npm install
        print_success "Node.js окружение настроено"
    else
        print_warning "Node.js не найден, пропускаем настройку frontend"
    fi
}

# Настройка Docker
setup_docker() {
    if command -v docker &> /dev/null; then
        print_info "Настройка Docker..."
        
        # Создание .env файла из примера
        if [ ! -f ".env" ] && [ -f "env.example" ]; then
            cp env.example .env
            print_success "Файл .env создан из env.example"
        fi
        
        print_success "Docker настроен"
    else
        print_warning "Docker не найден, пропускаем настройку контейнеров"
    fi
}

# Создание директорий
create_directories() {
    print_info "Создание директорий..."
    
    directories=(
        "backend/api-gateway"
        "backend/user-service"
        "backend/profile-service"
        "backend/booking-service"
        "backend/geo-service"
        "backend/payment-service"
        "backend/notification-service"
        "backend/chat-service"
        "backend/rating-service"
        "backend/event-service"
        "backend/emergency-service"
        "backend/security-service"
        "frontend/patient-app"
        "frontend/doctor-app"
        "frontend/clinic-web"
        "frontend/admin-panel"
        "docs"
        "scripts"
        "logs"
        "data"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
        print_success "Создана директория: $dir"
    done
}

# Создание скриптов запуска
create_scripts() {
    print_info "Создание скриптов запуска..."
    
    # Скрипт запуска для Linux/macOS
    cat > start.sh << 'EOF'
#!/bin/bash
# Скрипт запуска TOT MVP

set -e

echo "🚀 Запуск TOT MVP..."

# Активация виртуального окружения
source venv/bin/activate

# Проверка Docker
if command -v docker &> /dev/null; then
    echo "🐳 Запуск через Docker..."
    docker-compose up -d
else
    echo "🐍 Запуск локально..."
    python backend/api-gateway/main.py &
    python backend/user-service/main.py &
    python backend/profile-service/main.py &
    python backend/booking-service/main.py &
    python backend/geo-service/main.py &
    python backend/payment-service/main.py &
    python backend/notification-service/main.py &
    echo "✅ Сервисы запущены"
fi

echo "🌐 API Gateway доступен на http://localhost:8000"
echo "📊 Swagger UI: http://localhost:8000/docs"
EOF

    chmod +x start.sh
    print_success "Создан скрипт start.sh"
    
    # Скрипт остановки
    cat > stop.sh << 'EOF'
#!/bin/bash
# Скрипт остановки TOT MVP

echo "🛑 Остановка TOT MVP..."

if command -v docker &> /dev/null; then
    docker-compose down
else
    pkill -f "python.*main.py" || true
fi

echo "✅ Сервисы остановлены"
EOF

    chmod +x stop.sh
    print_success "Создан скрипт stop.sh"
    
    # Скрипт проверки статуса
    cat > status.sh << 'EOF'
#!/bin/bash
# Скрипт проверки статуса TOT MVP

echo "📊 Статус TOT MVP..."

if command -v docker &> /dev/null; then
    docker-compose ps
else
    echo "Процессы Python:"
    ps aux | grep "python.*main.py" | grep -v grep || echo "Нет запущенных процессов"
fi

echo ""
echo "Проверка API:"
curl -s http://localhost:8000/health || echo "API Gateway недоступен"
EOF

    chmod +x status.sh
    print_success "Создан скрипт status.sh"
}

# Основная функция
main() {
    echo "🚀 Настройка проекта TOT MVP для Linux/macOS"
    echo "================================================"
    
    check_requirements
    create_directories
    setup_python_env
    setup_node_env
    setup_docker
    create_scripts
    
    echo ""
    echo "================================================"
    print_success "Настройка завершена успешно!"
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Отредактируйте файл .env с вашими настройками"
    echo "2. Запустите проект: ./start.sh"
    echo "3. Проверьте статус: ./status.sh"
    echo "4. Остановите проект: ./stop.sh"
    echo ""
    echo "📚 Документация:"
    echo "- README.md - общая информация"
    echo "- docs/ARCHITECTURE.md - архитектура системы"
    echo "- docs/DEPLOYMENT.md - инструкции по развертыванию"
    echo ""
    echo "🌐 API будет доступен на http://localhost:8000"
    echo "📊 Swagger UI: http://localhost:8000/docs"
}

# Запуск основной функции
main "$@" 