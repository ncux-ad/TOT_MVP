#!/usr/bin/env python3
"""
@file: debug_api_gateway.py
@description: Детальная диагностика API Gateway
@dependencies: requests, json
@created: 2024-12-19
"""

import requests
import json
import time

def debug_api_gateway():
    """Детальная диагностика API Gateway"""
    base_url = "http://localhost:8000"
    
    print("🔍 Детальная диагностика API Gateway...")
    
    # 1. Тест прямого обращения к User Service
    print("\n1️⃣ Тест прямого обращения к User Service:")
    try:
        response = requests.post(
            "http://localhost:8001/auth/login",
            json={"email": "admin@tot.ru", "password": "admin123"},
            headers={"Content-Type": "application/json"}
        )
        print(f"✅ User Service direct: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"📄 User Service ответ: {json.dumps(data, indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ User Service ошибка: {response.text}")
    except Exception as e:
        print(f"❌ User Service недоступен: {e}")
    
    # 2. Тест API Gateway с логированием
    print("\n2️⃣ Тест API Gateway:")
    try:
        response = requests.post(
            f"{base_url}/auth/login",
            json={"email": "admin@tot.ru", "password": "admin123"},
            headers={"Content-Type": "application/json"}
        )
        print(f"✅ API Gateway: {response.status_code}")
        print(f"📄 Заголовки: {dict(response.headers)}")
        print(f"📄 Тело ответа: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"📄 JSON ответ: {json.dumps(data, indent=2, ensure_ascii=False)}")
            except:
                print("❌ Ответ не является JSON")
    except Exception as e:
        print(f"❌ API Gateway ошибка: {e}")
    
    # 3. Тест тестовых эндпоинтов API Gateway
    print("\n3️⃣ Тест тестовых эндпоинтов:")
    try:
        response = requests.get(f"{base_url}/test-connection")
        print(f"✅ Test connection: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"📄 Connection test: {json.dumps(data, indent=2, ensure_ascii=False)}")
    except Exception as e:
        print(f"❌ Test connection ошибка: {e}")
    
    try:
        response = requests.get(f"{base_url}/test-auth")
        print(f"✅ Test auth: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"📄 Auth test: {json.dumps(data, indent=2, ensure_ascii=False)}")
    except Exception as e:
        print(f"❌ Test auth ошибка: {e}")

if __name__ == "__main__":
    print("🚀 Запуск детальной диагностики...")
    debug_api_gateway()
    print("✅ Диагностика завершена") 