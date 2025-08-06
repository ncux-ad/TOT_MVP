#!/usr/bin/env python3
"""
@file: debug_forward.py
@description: Детальная отладка функции forward_request
@dependencies: requests
@created: 2024-12-19
"""

import requests
import json

def debug_forward():
    """Детальная отладка функции forward_request"""
    print("🔍 Детальная отладка forward_request...")
    
    # Тест 1: Прямое подключение к User Service
    print("\n1️⃣ Прямое подключение к User Service:")
    try:
        response = requests.get("http://localhost:8001/health", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 2: POST запрос к User Service
    print("\n2️⃣ POST запрос к User Service:")
    try:
        data = {"email": "admin@tot.ru", "password": "admin123"}
        response = requests.post(
            "http://localhost:8001/auth/login",
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 3: Проверка URL в API Gateway
    print("\n3️⃣ Проверка URL в API Gateway:")
    try:
        # Симулируем функцию forward_request
        service_url = "http://localhost:8001"
        path = "/auth/login"
        url = f"{service_url}{path}"
        print(f"🔗 URL: {url}")
        
        data = {"email": "admin@tot.ru", "password": "admin123"}
        headers = {"Content-Type": "application/json"}
        
        response = requests.post(url, json=data, headers=headers, timeout=30.0, verify=False)
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Headers: {dict(response.headers)}")
        print(f"✅ Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_forward() 