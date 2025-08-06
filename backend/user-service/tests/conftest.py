"""
@file: conftest.py
@description: Конфигурация pytest для User Service тестов
@dependencies: pytest, httpx, fastapi
@created: 2024-08-06
"""
import pytest
import httpx
from fastapi.testclient import TestClient
from main import app
import os
import sys

# Добавляем путь к модулям
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@pytest.fixture
def client():
    """Фикстура для тестового клиента FastAPI"""
    return TestClient(app)

@pytest.fixture
def test_user_data():
    """Фикстура для тестовых данных пользователя"""
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User",
        "role": "user"
    }

@pytest.fixture
def admin_user_data():
    """Фикстура для тестовых данных админа"""
    return {
        "email": "admin@tot.ru",
        "password": "admin123",
        "first_name": "Admin",
        "last_name": "User",
        "role": "admin"
    }

@pytest.fixture
def valid_jwt_token():
    """Фикстура для валидного JWT токена"""
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImV4cCI6MTczMzYwMDAwMH0.test_signature"

@pytest.fixture
def auth_headers(valid_jwt_token):
    """Фикстура для заголовков авторизации"""
    return {
        "Authorization": f"Bearer {valid_jwt_token}",
        "Content-Type": "application/json"
    }
