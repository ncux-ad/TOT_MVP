# Скрипт для создания демо пользователей ТОТ
Write-Host "👥 Создание демо пользователей..." -ForegroundColor Cyan

# Проверяем, что мы в корневой папке проекта
if (-not (Test-Path "backend")) {
    Write-Host "❌ Ошибка: Запустите скрипт из корневой папки проекта!" -ForegroundColor Red
    exit 1
}

# Активируем виртуальное окружение
Write-Host "📦 Активация виртуального окружения..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Создаем Python скрипт для добавления пользователей
$pythonScript = @"
import requests
import json

# URL для регистрации пользователей
base_url = "http://localhost:8001"

# Демо пользователи
demo_users = [
    {
        "email": "patient@example.com",
        "password": "password123",
        "first_name": "Иван",
        "last_name": "Иванов",
        "role": "patient",
        "phone": "+7 (999) 123-45-67"
    },
    {
        "email": "admin@tot.ru",
        "password": "admin123",
        "first_name": "Администратор",
        "last_name": "Системы",
        "role": "admin",
        "phone": "+7 (999) 999-99-99"
    },
    {
        "email": "doctor@example.com",
        "password": "doctor123",
        "first_name": "Петр",
        "last_name": "Петров",
        "role": "doctor",
        "specialization": "Кардиолог",
        "license_number": "DOC123456",
        "experience_years": 15,
        "phone": "+7 (999) 555-55-55"
    }
]

print("🚀 Создание демо пользователей...")

for user_data in demo_users:
    try:
        # Регистрируем пользователя
        response = requests.post(
            f"{base_url}/auth/register",
            json=user_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print(f"✅ Создан пользователь: {user_data['email']}")
        elif response.status_code == 400 and "already exists" in response.text:
            print(f"ℹ️ Пользователь уже существует: {user_data['email']}")
        else:
            print(f"❌ Ошибка создания пользователя {user_data['email']}: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Не удалось подключиться к сервису на {base_url}")
        print("Убедитесь, что User Service запущен на порту 8001")
        break
    except Exception as e:
        print(f"❌ Ошибка: {e}")

print("\\n📋 Демо аккаунты:")
print("• Patient App: patient@example.com / password123")
print("• Admin Panel: admin@tot.ru / admin123")
print("• Doctor App: doctor@example.com / doctor123")
"@

# Сохраняем скрипт во временный файл
$pythonScript | Out-File -FilePath "create_demo_users.py" -Encoding UTF8

# Запускаем скрипт
Write-Host "🚀 Выполнение скрипта создания пользователей..." -ForegroundColor Green
python create_demo_users.py

# Удаляем временный файл
Remove-Item "create_demo_users.py" -ErrorAction SilentlyContinue

Write-Host "`n✅ Демо пользователи созданы!" -ForegroundColor Green
Write-Host "Теперь вы можете войти в систему с демо аккаунтами." -ForegroundColor Cyan 