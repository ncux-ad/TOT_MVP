import requests
import json

def test_auth():
    url = "http://localhost:8000/auth/login"
    data = {
        "email": "admin@tot.ru",
        "password": "admin123"
    }
    
    print(f"🔍 Тестируем авторизацию...")
    print(f"URL: {url}")
    print(f"Data: {data}")
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            try:
                result = response.json()
                print("✅ Авторизация успешна!")
                if isinstance(result, dict) and 'data' in result:
                    token = result['data'].get('access_token', '')
                    print(f"Token: {token[:50]}..." if token else "Token not found")
                else:
                    print(f"Unexpected response format: {result}")
            except json.JSONDecodeError:
                print("❌ Не удалось декодировать JSON ответ")
        else:
            print("❌ Ошибка авторизации")
            
    except Exception as e:
        print(f"❌ Ошибка запроса: {e}")

if __name__ == "__main__":
    test_auth() 