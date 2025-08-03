from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import jwt
import os
from datetime import datetime, timedelta
from typing import Optional
import logging
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker
import uuid

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ТОТ User Service",
    description="Сервис управления пользователями и аутентификации",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Настройки безопасности
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT настройки
JWT_SECRET = os.getenv("JWT_SECRET", "your-super-secret-jwt-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION = int(os.getenv("JWT_EXPIRATION_HOURS", 24))

# База данных
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tot_mvp.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Модели данных
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="patient")  # patient, doctor, clinic, admin
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Дополнительные поля для врачей
    specialization = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    experience_years = Column(Integer, nullable=True)
    
    # Дополнительные поля для клиник
    clinic_name = Column(String, nullable=True)
    clinic_address = Column(Text, nullable=True)
    clinic_license = Column(String, nullable=True)

# Создание таблиц
Base.metadata.create_all(bind=engine)

# Pydantic модели
class UserCreate(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    password: str
    first_name: str
    last_name: str
    role: str = "patient"
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    experience_years: Optional[int] = None
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None
    clinic_license: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    phone: Optional[str]
    first_name: str
    last_name: str
    role: str
    is_active: bool
    is_verified: bool
    specialization: Optional[str]
    license_number: Optional[str]
    experience_years: Optional[int]
    clinic_name: Optional[str]
    clinic_address: Optional[str]
    clinic_license: Optional[str]
    created_at: datetime
    updated_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    user: UserResponse

# Функции для работы с базой данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(hours=JWT_EXPIRATION)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
) -> User:
    user_id = token.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

# API endpoints
@app.post("/auth/register", response_model=TokenResponse)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя"""
    
    # Проверка существования пользователя
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | 
        (User.phone == user_data.phone if user_data.phone else False)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or phone already exists"
        )
    
    # Создание нового пользователя
    user = User(
        email=user_data.email,
        phone=user_data.phone,
        password_hash=get_password_hash(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        role=user_data.role,
        specialization=user_data.specialization,
        license_number=user_data.license_number,
        experience_years=user_data.experience_years,
        clinic_name=user_data.clinic_name,
        clinic_address=user_data.clinic_address,
        clinic_license=user_data.clinic_license
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Создание токена
    access_token = create_access_token(
        data={"user_id": user.id, "email": user.email, "role": user.role}
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=JWT_EXPIRATION * 3600,
        user=UserResponse(
            id=user.id,
            email=user.email,
            phone=user.phone,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role,
            is_active=user.is_active,
            is_verified=user.is_verified,
            specialization=user.specialization,
            license_number=user.license_number,
            experience_years=user.experience_years,
            clinic_name=user.clinic_name,
            clinic_address=user.clinic_address,
            clinic_license=user.clinic_license,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    )

@app.post("/auth/login", response_model=TokenResponse)
async def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    """Авторизация пользователя"""
    
    # Поиск пользователя
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Проверка пароля
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Проверка активности
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated"
        )
    
    # Создание токена
    access_token = create_access_token(
        data={"user_id": user.id, "email": user.email, "role": user.role}
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=JWT_EXPIRATION * 3600,
        user=UserResponse(
            id=user.id,
            email=user.email,
            phone=user.phone,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role,
            is_active=user.is_active,
            is_verified=user.is_verified,
            specialization=user.specialization,
            license_number=user.license_number,
            experience_years=user.experience_years,
            clinic_name=user.clinic_name,
            clinic_address=user.clinic_address,
            clinic_license=user.clinic_license,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    )

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Получение информации о текущем пользователе"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        phone=current_user.phone,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        role=current_user.role,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        specialization=current_user.specialization,
        license_number=current_user.license_number,
        experience_years=current_user.experience_years,
        clinic_name=current_user.clinic_name,
        clinic_address=current_user.clinic_address,
        clinic_license=current_user.clinic_license,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )

@app.put("/auth/me", response_model=UserResponse)
async def update_current_user(
    user_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновление информации о текущем пользователе"""
    
    # Обновление разрешенных полей
    allowed_fields = [
        "first_name", "last_name", "phone", "specialization",
        "license_number", "experience_years", "clinic_name",
        "clinic_address", "clinic_license"
    ]
    
    for field, value in user_data.items():
        if field in allowed_fields and hasattr(current_user, field):
            setattr(current_user, field, value)
    
    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        phone=current_user.phone,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        role=current_user.role,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        specialization=current_user.specialization,
        license_number=current_user.license_number,
        experience_years=current_user.experience_years,
        clinic_name=current_user.clinic_name,
        clinic_address=current_user.clinic_address,
        clinic_license=current_user.clinic_license,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: Session = Depends(get_db)):
    """Получение информации о пользователе по ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user.id,
        email=user.email,
        phone=user.phone,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified,
        specialization=user.specialization,
        license_number=user.license_number,
        experience_years=user.experience_years,
        clinic_name=user.clinic_name,
        clinic_address=user.clinic_address,
        clinic_license=user.clinic_license,
        created_at=user.created_at,
        updated_at=user.updated_at
    )

@app.get("/users", response_model=dict)
async def get_users(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Получение списка пользователей с пагинацией"""
    offset = (page - 1) * limit
    
    # Получаем общее количество пользователей
    total = db.query(User).count()
    
    # Получаем пользователей с пагинацией
    users = db.query(User).offset(offset).limit(limit).all()
    
    # Преобразуем в список UserResponse
    users_response = []
    for user in users:
        users_response.append(UserResponse(
            id=user.id,
            email=user.email,
            phone=user.phone,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role,
            is_active=user.is_active,
            is_verified=user.is_verified,
            specialization=user.specialization,
            license_number=user.license_number,
            experience_years=user.experience_years,
            clinic_name=user.clinic_name,
            clinic_address=user.clinic_address,
            clinic_license=user.clinic_license,
            created_at=user.created_at,
            updated_at=user.updated_at
        ))
    
    return {
        "users": users_response,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }

@app.get("/health")
async def health_check():
    """Проверка состояния сервиса"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "user-service"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("USER_SERVICE_PORT", 8001))
    ) 