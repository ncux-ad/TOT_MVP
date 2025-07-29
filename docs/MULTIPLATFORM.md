# 🌍 Мультиплатформенная настройка TOT MVP

## Обзор

Проект "ТОТ – Твоя Точка Опоры" адаптирован для работы на различных платформах:
- **Windows 11** (PowerShell, WSL2)
- **Linux** (Ubuntu, CentOS, Debian)
- **macOS** (Terminal, Homebrew)

## 🖥️ Варианты запуска на Windows 11

### 1. Локальный Python (Рекомендуется для разработки)

```powershell
# Запуск PowerShell скрипта
.\scripts\setup.ps1 -LocalOnly

# Или вручную
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Преимущества:**
- ✅ Быстрая разработка
- ✅ Простая отладка
- ✅ Минимальные требования
- ✅ Совместимость с IDE

**Недостатки:**
- ❌ Ручная настройка зависимостей
- ❌ Сложности с PostgreSQL на Windows

### 2. WSL2 + Ubuntu (Рекомендуется для продакшена)

```powershell
# Проверка WSL
wsl --version

# Установка Ubuntu (если не установлен)
wsl --install -d Ubuntu

# Запуск в WSL
wsl
cd /mnt/c/Users/$USERNAME/OneDrive/Projects/TOT_MVP
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**Преимущества:**
- ✅ Полная совместимость с Linux
- ✅ Простая установка PostgreSQL
- ✅ Лучшая производительность
- ✅ Docker работает нативно

**Недостатки:**
- ❌ Дополнительная настройка
- ❌ Два окружения (Windows + WSL)

### 3. Docker Desktop (Рекомендуется для тестирования)

```powershell
# Установка Docker Desktop
# Скачайте с https://www.docker.com/products/docker-desktop

# Запуск через Docker
.\scripts\setup.ps1 -UseDocker
docker-compose up -d
```

**Преимущества:**
- ✅ Изолированное окружение
- ✅ Одинаковая среда на всех машинах
- ✅ Простое развертывание
- ✅ Встроенный мониторинг

**Недостатки:**
- ❌ Высокие требования к ресурсам
- ❌ Сложность отладки
- ❌ Медленная разработка

## 🐧 Запуск на Linux/macOS

### Ubuntu/Debian

```bash
# Установка зависимостей
sudo apt update
sudo apt install python3 python3-pip python3-venv nodejs npm docker.io docker-compose

# Запуск скрипта
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### CentOS/RHEL

```bash
# Установка зависимостей
sudo yum install python3 python3-pip nodejs npm docker docker-compose

# Запуск скрипта
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### macOS

```bash
# Установка Homebrew (если не установлен)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установка зависимостей
brew install python node docker docker-compose

# Запуск скрипта
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## 🔧 Сравнение вариантов

| Критерий | Windows Local | WSL2 | Docker | Linux Native |
|----------|---------------|------|--------|--------------|
| **Простота настройки** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Производительность** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Совместимость** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Отладка** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Ресурсы** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Продакшен** | ❌ | ✅ | ✅ | ✅ |

## 🚀 Рекомендуемые сценарии

### Для разработки MVP (Windows 11)

```powershell
# Вариант 1: WSL2 (рекомендуется)
wsl --install -d Ubuntu
wsl
cd /mnt/c/Users/$USERNAME/OneDrive/Projects/TOT_MVP
./scripts/setup.sh

# Вариант 2: Локальный Python
.\scripts\setup.ps1 -LocalOnly
```

### Для тестирования и демо

```powershell
# Docker (простота развертывания)
.\scripts\setup.ps1 -UseDocker
docker-compose up -d
```

### Для продакшена

```bash
# Linux сервер
./scripts/setup.sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📋 Пошаговые инструкции

### Windows 11 + WSL2

1. **Установка WSL2:**
   ```powershell
   wsl --install -d Ubuntu
   ```

2. **Настройка проекта:**
   ```bash
   wsl
   cd /mnt/c/Users/$USERNAME/OneDrive/Projects/TOT_MVP
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Запуск сервисов:**
   ```bash
   ./start.sh
   ```

4. **Проверка:**
   ```bash
   ./status.sh
   curl http://localhost:8000/health
   ```

### Windows 11 + Local Python

1. **Установка Python:**
   - Скачайте Python 3.8+ с https://python.org
   - Добавьте в PATH

2. **Настройка проекта:**
   ```powershell
   .\scripts\setup.ps1 -LocalOnly
   ```

3. **Запуск сервисов:**
   ```powershell
   .\start.ps1
   ```

4. **Проверка:**
   ```powershell
   .\status.ps1
   Invoke-RestMethod -Uri "http://localhost:8000/health"
   ```

### Linux/macOS

1. **Установка зависимостей:**
   ```bash
   # Ubuntu/Debian
   sudo apt install python3 python3-pip python3-venv nodejs npm docker.io docker-compose
   
   # macOS
   brew install python node docker docker-compose
   ```

2. **Настройка проекта:**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Запуск сервисов:**
   ```bash
   ./start.sh
   ```

4. **Проверка:**
   ```bash
   ./status.sh
   curl http://localhost:8000/health
   ```

## 🔍 Устранение проблем

### Windows 11

**Проблема:** Ошибка при установке psycopg2
```powershell
# Решение: используйте psycopg2-binary
pip install psycopg2-binary
```

**Проблема:** PostgreSQL не запускается
```powershell
# Решение: используйте Docker или WSL
docker run --name postgres -e POSTGRES_PASSWORD=tot_password -p 5432:5432 -d postgres:15
```

**Проблема:** Проблемы с путями
```powershell
# Решение: используйте WSL или относительные пути
$env:PYTHONPATH = "."
```

### Linux/macOS

**Проблема:** Permission denied
```bash
# Решение: добавьте права на выполнение
chmod +x scripts/*.sh
```

**Проблема:** Python не найден
```bash
# Решение: создайте символическую ссылку
sudo ln -s /usr/bin/python3 /usr/bin/python
```

**Проблема:** Docker требует sudo
```bash
# Решение: добавьте пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker
```

## 📊 Мониторинг и логи

### Проверка статуса

```bash
# Linux/macOS
./status.sh

# Windows
.\status.ps1
```

### Логи Docker

```bash
# Все сервисы
docker-compose logs

# Конкретный сервис
docker-compose logs api-gateway
```

### Логи локальных процессов

```bash
# Linux/macOS
ps aux | grep python

# Windows
Get-Process python
```

## 🎯 Рекомендации

### Для разработки MVP:
1. **Windows 11:** Используйте WSL2 + Ubuntu
2. **Linux/macOS:** Используйте нативное окружение
3. **Быстрое тестирование:** Используйте Docker

### Для продакшена:
1. **Облачный сервер:** Linux + Docker
2. **Локальный сервер:** Linux + Docker Compose
3. **Масштабирование:** Kubernetes

### Для команды:
1. **Унификация:** Docker для всех
2. **Документация:** README с примерами
3. **CI/CD:** GitHub Actions или GitLab CI

## 📚 Дополнительные ресурсы

- [WSL2 Installation Guide](https://docs.microsoft.com/en-us/windows/wsl/install)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**Выберите подходящий вариант в зависимости от ваших потребностей и опыта!** 🚀 