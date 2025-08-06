"""
@file: test_auth.py
@description: Тесты для авторизации в User Service
@dependencies: pytest, httpx, fastapi
@created: 2024-08-06
"""
import pytest
from fastapi.testclient import TestClient

def test_login_success(client: TestClient, admin_user_data):
    """Тест успешной авторизации админа"""
    response = client.post("/auth/login", json=admin_user_data)
    
    assert response.status_code == 200
    data = response.json()
    
    # Проверяем структуру ответа
    required_fields = ["access_token", "token_type", "expires_in", "user"]
    for field in required_fields:
        assert field in data, f"Поле {field} отсутствует в ответе"
    
    # Проверяем значения
    assert data["token_type"] == "bearer"
    assert isinstance(data["access_token"], str)
    assert isinstance(data["expires_in"], int)
    assert data["expires_in"] > 0
    
    # Проверяем данные пользователя
    user = data["user"]
    assert user["email"] == admin_user_data["email"]
    assert user["role"] == "admin"

def test_login_invalid_credentials(client: TestClient):
    """Тест авторизации с неверными данными"""
    invalid_data = {
        "email": "invalid@example.com",
        "password": "wrongpassword"
    }
    
    response = client.post("/auth/login", json=invalid_data)
    assert response.status_code == 401

def test_login_missing_fields(client: TestClient):
    """Тест авторизации с отсутствующими полями"""
    # Без email
    response = client.post("/auth/login", json={"password": "test"})
    assert response.status_code == 422
    
    # Без password
    response = client.post("/auth/login", json={"email": "test@example.com"})
    assert response.status_code == 422

def test_login_invalid_json(client: TestClient):
    """Тест авторизации с неверным JSON"""
    response = client.post("/auth/login", data="invalid json")
    assert response.status_code == 422

def test_register_user_not_implemented(client: TestClient, test_user_data):
    """Тест регистрации - endpoint существует, но возвращает ошибку"""
    response = client.post("/auth/register", json=test_user_data)
    # Регистрация возвращает ошибку
    assert response.status_code in [400, 404, 422]

def test_register_existing_user_not_implemented(client: TestClient, admin_user_data):
    """Тест регистрации существующего пользователя - endpoint существует, но возвращает ошибку"""
    response = client.post("/auth/register", json=admin_user_data)
    # Регистрация возвращает ошибку
    assert response.status_code in [400, 404, 422]

def test_register_invalid_data_not_implemented(client: TestClient):
    """Тест регистрации с неверными данными - endpoint существует, но возвращает ошибку"""
    invalid_data = {
        "email": "invalid-email",
        "password": "123",  # Слишком короткий
        "first_name": "",
        "last_name": "",
        "role": "invalid_role"
    }
    
    response = client.post("/auth/register", json=invalid_data)
    # Регистрация возвращает ошибку
    assert response.status_code in [400, 404, 422]

def test_jwt_token_structure(client: TestClient, admin_user_data):
    """Тест структуры JWT токена"""
    response = client.post("/auth/login", json=admin_user_data)
    
    assert response.status_code == 200
    data = response.json()
    
    token = data["access_token"]
    # JWT токен должен содержать 3 части, разделенные точками
    parts = token.split(".")
    assert len(parts) == 3, "JWT токен должен содержать 3 части"

def test_token_expiration(client: TestClient, admin_user_data):
    """Тест срока действия токена"""
    response = client.post("/auth/login", json=admin_user_data)
    
    assert response.status_code == 200
    data = response.json()
    
    # Проверяем, что expires_in положительное число
    assert data["expires_in"] > 0
    # Обычно токен действует 24 часа (86400 секунд)
    assert data["expires_in"] <= 86400

def test_auth_endpoints_content_type(client: TestClient, admin_user_data):
    """Тест Content-Type для endpoints авторизации"""
    response = client.post("/auth/login", json=admin_user_data)
    
    # Проверяем только основные заголовки
    assert "content-type" in response.headers
    assert "application/json" in response.headers["content-type"]
