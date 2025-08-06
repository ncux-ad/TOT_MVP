#!/usr/bin/env python3
"""
@file: test_gateway_direct.py
@description: Прямой тест API Gateway с детальным логированием
@dependencies: requests
@created: 2024-12-19
"""

import requests
import json

def test_gateway_direct():
    """Прямой тест API Gateway"""
    print("🔍 Прямой тест API Gateway...")
    
    # Тест 1: Проверка здоровья API Gateway
    print("\n1️⃣ Здоровье API Gateway:")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 2: Тест подключения через API Gateway
    print("\n2️⃣ Тест подключения через API Gateway:")
    try:
        response = requests.get("http://localhost:8000/test-connection", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"📄 Parsed response: {json.dumps(data, indent=2, ensure_ascii=False)}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 3: Тест авторизации через API Gateway
    print("\n3️⃣ Тест авторизации через API Gateway:")
    try:
        response = requests.get("http://localhost:8000/test-auth", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"📄 Parsed response: {json.dumps(data, indent=2, ensure_ascii=False)}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Тест 4: Прямая авторизация через API Gateway
    print("\n4️⃣ Прямая авторизация через API Gateway:")
    try:
        auth_data = {"email": "admin@tot.ru", "password": "admin123"}
        response = requests.post(
            "http://localhost:8000/auth/login",
            json=auth_data,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Headers: {dict(response.headers)}")
        print(f"✅ Response: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"📄 Parsed response: {json.dumps(data, indent=2, ensure_ascii=False)}")
            except:
                print("❌ Response is not JSON")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_gateway_direct() 