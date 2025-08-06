#!/usr/bin/env python3
"""
@file: test_gateway_final.py
@description: Финальный тест для отладки API Gateway
@dependencies: requests
@created: 2024-12-19
"""

import requests
import json

def test_gateway_final():
    """Финальный тест для отладки API Gateway"""
    print("🔍 Финальный тест API Gateway...")
    
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
    
    # Тест 3: Проверка через API Gateway
    print("\n3️⃣ Проверка через API Gateway:")
    try:
        response = requests.get("http://localhost:8000/test-connection", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"📄 Parsed Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
            
            if data.get("user_service_status") == 503:
                print("❌ API Gateway не может подключиться к User Service")
                print("🔍 Возможные причины:")
                print("   - API Gateway и User Service запущены в разных процессах")
                print("   - Разные сетевые настройки")
                print("   - Проблема с асинхронными запросами")
                print("   - Проблема с SSL/сертификатами")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 4: Проверка авторизации через API Gateway
    print("\n4️⃣ Проверка авторизации через API Gateway:")
    try:
        auth_data = {"email": "admin@tot.ru", "password": "admin123"}
        response = requests.post(
            "http://localhost:8000/auth/login",
            json=auth_data,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"📄 Parsed Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
            except:
                print("❌ Response is not JSON")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_gateway_final() 