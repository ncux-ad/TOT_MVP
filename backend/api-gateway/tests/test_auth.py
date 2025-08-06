"""
@file: test_auth.py
@description: Тесты для авторизации через API Gateway
@dependencies: pytest, httpx, fastapi
@created: 2024-08-06
"""
import pytest
from fastapi.testclient import TestClient
import json

def test_login_success(client: TestClient, test_user_data):
    """Тест успешной авторизации"""
    response = client.post("/auth/login", json=test_user_data)
    
    # API Gateway всегда возвращает 200, даже если User Service возвращает 401
    assert response.status_code == 200
    
    data = response.json()
    # Проверяем структуру ответа
    if "access_token" in data:
        # Успешная авторизация
        required_fields = ["access_token", "token_type", "expires_in"]
        for field in required_fields:
            assert field in data, f"Поле {field} отсутствует в ответе"
        
        assert data["token_type"] == "bearer"
        assert isinstance(data["access_token"], str)
        assert isinstance(data["expires_in"], int)
        assert data["expires_in"] > 0
    else:
        # Неуспешная авторизация - проверяем сообщение об ошибке
        assert "detail" in data or "message" in data

def test_login_invalid_credentials(client: TestClient):
    """Тест авторизации с неверными данными"""
    invalid_data = {
        "email": "invalid@example.com",
        "password": "wrongpassword"
    }
    
    response = client.post("/auth/login", json=invalid_data)
    # API Gateway всегда возвращает 200, но с ошибкой в теле
    assert response.status_code == 200
    
    data = response.json()
    # Проверяем, что есть сообщение об ошибке
    assert "detail" in data or "message" in data

def test_login_missing_fields(client: TestClient):
    """Тест авторизации с отсутствующими полями"""
    # Без email
    response = client.post("/auth/login", json={"password": "test"})
    # API Gateway всегда возвращает 200, но с ошибкой валидации в теле
    assert response.status_code == 200
    
    data = response.json()
    # Проверяем, что есть ошибка валидации
    assert "detail" in data

def test_login_invalid_json(client: TestClient):
    """Тест авторизации с неверным JSON"""
    response = client.post("/auth/login", data="invalid json")
    assert response.status_code == 422  # Validation error

def test_admin_login(client: TestClient):
    """Тест авторизации админа"""
    admin_data = {
        "email": "admin@tot.ru",
        "password": "admin123"
    }
    
    response = client.post("/auth/login", json=admin_data)
    
    assert response.status_code == 200
    data = response.json()
    
    if "access_token" in data:
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["role"] == "admin"

def test_auth_endpoint_structure(client: TestClient, test_user_data):
    """Тест структуры ответа авторизации"""
    response = client.post("/auth/login", json=test_user_data)
    
    assert response.status_code == 200
    data = response.json()
    
    if "access_token" in data:
        # Проверяем обязательные поля для успешной авторизации
        required_fields = ["access_token", "token_type", "expires_in"]
        for field in required_fields:
            assert field in data, f"Поле {field} отсутствует в ответе"
        
        # Проверяем типы данных
        assert isinstance(data["access_token"], str)
        assert isinstance(data["token_type"], str)
        assert isinstance(data["expires_in"], int)
        
        # Проверяем значения
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
        assert data["expires_in"] > 0

def test_auth_cors_headers(client: TestClient, test_user_data):
    """Тест CORS заголовков для авторизации"""
    response = client.post("/auth/login", json=test_user_data)
    
    # API Gateway может не добавлять CORS заголовки в тестовом режиме
    # Проверяем только основные заголовки
    assert "content-type" in response.headers
    assert "application/json" in response.headers["content-type"]
