#!/usr/bin/env python3
"""
@file: test_gateway_logs.py
@description: Тест для проверки логов API Gateway
@dependencies: requests
@created: 2024-12-19
"""

import requests
import json
import time

def test_gateway_logs():
    """Тест для проверки логов API Gateway"""
    print("🔍 Тест логов API Gateway...")
    
    # Тест 1: Проверка здоровья API Gateway
    print("\n1️⃣ Здоровье API Gateway:")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 2: Тест подключения с логированием
    print("\n2️⃣ Тест подключения с логированием:")
    try:
        # Сначала проверим, что User Service доступен напрямую
        print("🔍 Проверка User Service напрямую...")
        user_response = requests.get("http://localhost:8001/health", timeout=5)
        print(f"✅ User Service Status: {user_response.status_code}")
        
        # Теперь проверим через API Gateway
        print("🔍 Проверка через API Gateway...")
        gateway_response = requests.get("http://localhost:8000/test-connection", timeout=5)
        print(f"✅ Gateway Status: {gateway_response.status_code}")
        
        if gateway_response.status_code == 200:
            data = gateway_response.json()
            print(f"📄 Gateway Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
            
            if data.get("user_service_status") == 503:
                print("❌ API Gateway не может подключиться к User Service")
                print("🔍 Возможные причины:")
                print("   - Разные сетевые настройки")
                print("   - Брандмауэр блокирует соединение")
                print("   - User Service не слушает на localhost")
                print("   - Проблема с DNS разрешением")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 3: Проверка сетевых настроек
    print("\n3️⃣ Проверка сетевых настроек:")
    try:
        import socket
        
        # Проверяем, что localhost разрешается
        print("🔍 Проверка разрешения localhost...")
        try:
            ip = socket.gethostbyname("localhost")
            print(f"✅ localhost resolves to: {ip}")
        except Exception as e:
            print(f"❌ localhost resolution error: {e}")
        
        # Проверяем подключение к порту 8001
        print("🔍 Проверка подключения к порту 8001...")
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            result = sock.connect_ex(("localhost", 8001))
            sock.close()
            if result == 0:
                print("✅ Порт 8001 доступен")
            else:
                print(f"❌ Порт 8001 недоступен (error code: {result})")
        except Exception as e:
            print(f"❌ Socket error: {e}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_gateway_logs() 