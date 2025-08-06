#!/usr/bin/env python3
"""
@file: test_gateway_debug.py
@description: Детальная отладка API Gateway
@dependencies: requests
@created: 2024-12-19
"""

import requests
import json
import time

def test_gateway_debug():
    """Детальная отладка API Gateway"""
    print("🔍 Детальная отладка API Gateway...")
    
    # Тест 1: Проверка здоровья API Gateway
    print("\n1️⃣ Здоровье API Gateway:")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 2: Проверка User Service напрямую
    print("\n2️⃣ Проверка User Service напрямую:")
    try:
        response = requests.get("http://localhost:8001/health", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 3: Проверка через API Gateway с детальным логированием
    print("\n3️⃣ Проверка через API Gateway:")
    try:
        # Симулируем запрос, который делает API Gateway
        import requests
        
        # Тест подключения
        print("🔍 Тест подключения...")
        response = requests.get("http://localhost:8001/health", timeout=5.0, verify=False)
        print(f"✅ Direct Status: {response.status_code}")
        print(f"✅ Direct Response: {response.text}")
        
        # Тест авторизации
        print("🔍 Тест авторизации...")
        data = {"email": "admin@tot.ru", "password": "admin123"}
        response = requests.post("http://localhost:8001/auth/login", json=data, timeout=5.0, verify=False)
        print(f"✅ Direct Auth Status: {response.status_code}")
        print(f"✅ Direct Auth Response: {response.text}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    # Тест 4: Проверка через API Gateway
    print("\n4️⃣ Проверка через API Gateway:")
    try:
        response = requests.get("http://localhost:8000/test-connection", timeout=5)
        print(f"✅ Gateway Status: {response.status_code}")
        print(f"✅ Gateway Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"📄 Parsed Gateway Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
            
            if data.get("user_service_status") == 503:
                print("❌ API Gateway не может подключиться к User Service")
                print("🔍 Возможные причины:")
                print("   - API Gateway и User Service запущены в разных процессах")
                print("   - Разные сетевые настройки")
                print("   - Проблема с асинхронными запросами")
                print("   - Проблема с SSL/сертификатами")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_gateway_debug() 