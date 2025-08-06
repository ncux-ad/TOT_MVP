"""
@file: conftest.py
@description: Конфигурация pytest для API Gateway тестов
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
def auth_headers():
    """Фикстура для заголовков авторизации"""
    return {
        "Authorization": "Bearer test_jwt_token",
        "Content-Type": "application/json"
    }

@pytest.fixture
def mock_user_service():
    """Фикстура для мока User Service"""
    return {
        "url": "http://localhost:8001",
        "health": {"status": "healthy"},
        "users": [
            {"id": 1, "email": "test@example.com", "role": "user"},
            {"id": 2, "email": "admin@tot.ru", "role": "admin"}
        ]
    }

@pytest.fixture
def test_user_data():
    """Фикстура для тестовых данных пользователя"""
    return {
        "email": "test@example.com",
        "password": "testpassword123"
    }
