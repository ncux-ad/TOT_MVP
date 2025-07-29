#!/usr/bin/env python3
"""
Скрипт для установки всех зависимостей проекта TOT MVP
"""

import os
import sys
import subprocess
import platform

def run_command(command, description):
    """Выполняет команду и выводит результат"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} завершено успешно")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка при {description.lower()}: {e}")
        print(f"Вывод ошибки: {e.stderr}")
        return False

def check_python_version():
    """Проверяет версию Python"""
    print("🐍 Проверка версии Python...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"❌ Требуется Python 3.8+, текущая версия: {version.major}.{version.minor}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_node_version():
    """Проверяет версию Node.js"""
    print("📦 Проверка версии Node.js...")
    try:
        result = subprocess.run("node --version", shell=True, capture_output=True, text=True)
        version = result.stdout.strip()
        print(f"✅ Node.js {version}")
        return True
    except:
        print("❌ Node.js не найден. Установите Node.js 16+")
        return False

def check_npm():
    """Проверяет наличие npm"""
    print("📦 Проверка npm...")
    try:
        result = subprocess.run("npm --version", shell=True, capture_output=True, text=True)
        version = result.stdout.strip()
        print(f"✅ npm {version}")
        return True
    except:
        print("❌ npm не найден")
        return False

def check_docker():
    """Проверяет наличие Docker"""
    print("🐳 Проверка Docker...")
    try:
        result = subprocess.run("docker --version", shell=True, capture_output=True, text=True)
        version = result.stdout.strip()
        print(f"✅ {version}")
        return True
    except:
        print("❌ Docker не найден. Установите Docker")
        return False

def setup_python_environment():
    """Настраивает Python окружение"""
    print("\n🐍 Настройка Python окружения...")
    
    # Создаем виртуальное окружение
    if not os.path.exists("venv"):
        print("Создание виртуального окружения...")
        if not run_command("python -m venv venv", "Создание виртуального окружения"):
            return False
    
    # Активируем виртуальное окружение
    if platform.system() == "Windows":
        activate_script = "venv\\Scripts\\Activate.ps1"
        pip_path = "venv\\Scripts\\pip"
    else:
        activate_script = "source venv/bin/activate"
        pip_path = "venv/bin/pip"
    
    # Обновляем pip
    if not run_command(f"{pip_path} install --upgrade pip", "Обновление pip"):
        return False
    
    # Устанавливаем основные зависимости
    if not run_command(f"{pip_path} install -r requirements.txt", "Установка Python зависимостей"):
        return False
    
    return True

def setup_node_environment():
    """Настраивает Node.js окружение"""
    print("\n📦 Настройка Node.js окружения...")
    
    # Устанавливаем зависимости
    if not run_command("npm install", "Установка Node.js зависимостей"):
        return False
    
    return True

def setup_docker():
    """Настраивает Docker"""
    print("\n🐳 Настройка Docker...")
    
    # Создаем .env файл из примера
    if not os.path.exists(".env"):
        if os.path.exists("env.example"):
            if platform.system() == "Windows":
                run_command("copy env.example .env", "Создание .env файла")
            else:
                run_command("cp env.example .env", "Создание .env файла")
            print("✅ Файл .env создан из env.example")
        else:
            print("⚠️ Файл env.example не найден")
    
    return True

def create_directories():
    """Создает необходимые директории"""
    print("\n📁 Создание директорий...")
    
    directories = [
        "backend/api-gateway",
        "backend/user-service", 
        "backend/profile-service",
        "backend/booking-service",
        "backend/geo-service",
        "backend/payment-service",
        "backend/notification-service",
        "backend/chat-service",
        "backend/rating-service",
        "backend/event-service",
        "backend/emergency-service",
        "backend/security-service",
        "frontend/patient-app",
        "frontend/doctor-app",
        "frontend/clinic-web",
        "frontend/admin-panel",
        "docs",
        "scripts"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Создана директория: {directory}")

def main():
    """Основная функция установки"""
    print("🚀 Настройка проекта TOT MVP")
    print("=" * 50)
    
    # Проверяем системные требования
    if not check_python_version():
        sys.exit(1)
    
    if not check_node_version():
        print("⚠️ Node.js не найден, но можно продолжить без frontend")
    
    if not check_npm():
        print("⚠️ npm не найден, но можно продолжить без frontend")
    
    if not check_docker():
        print("⚠️ Docker не найден, но можно продолжить без контейнеризации")
    
    # Создаем директории
    create_directories()
    
    # Настраиваем Python окружение
    if not setup_python_environment():
        print("❌ Ошибка при настройке Python окружения")
        sys.exit(1)
    
    # Настраиваем Node.js окружение (если доступен)
    if check_node_version() and check_npm():
        setup_node_environment()
    
    # Настраиваем Docker (если доступен)
    if check_docker():
        setup_docker()
    
    print("\n" + "=" * 50)
    print("✅ Настройка завершена успешно!")
    print("\n📋 Следующие шаги:")
    print("1. Отредактируйте файл .env с вашими настройками")
    print("2. Запустите базу данных: docker-compose up postgres redis")
    print("3. Запустите сервисы: docker-compose up")
    print("4. Или запустите локально: python backend/api-gateway/main.py")
    print("\n📚 Документация:")
    print("- README.md - общая информация")
    print("- docs/ARCHITECTURE.md - архитектура системы")
    print("- docs/DEPLOYMENT.md - инструкции по развертыванию")

if __name__ == "__main__":
    main() 