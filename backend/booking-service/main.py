from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from datetime import datetime, timedelta
from typing import Optional, List
import logging
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import uuid
import json
from fastapi import Request

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ТОТ Booking Service",
    description="Сервис управления заказами вызовов врачей",
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

# База данных
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tot_mvp.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Модели данных
class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, nullable=False, index=True)
    doctor_id = Column(String, nullable=True, index=True)  # Может быть null до назначения врача
    clinic_id = Column(String, nullable=True, index=True)
    
    # Информация о вызове
    call_type = Column(String, nullable=False)  # "urgent", "scheduled", "consultation"
    symptoms = Column(Text, nullable=True)
    address = Column(Text, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Статус заказа
    status = Column(String, nullable=False, default="pending")  # pending, assigned, in_progress, completed, cancelled
    priority = Column(String, nullable=False, default="normal")  # low, normal, high, emergency
    
    # Временные метки
    scheduled_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    assigned_at = Column(DateTime, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    
    # Дополнительная информация
    notes = Column(Text, nullable=True)
    estimated_duration = Column(Integer, nullable=True)  # в минутах
    actual_duration = Column(Integer, nullable=True)  # в минутах
    
    # Цена
    estimated_price = Column(Float, nullable=True)
    final_price = Column(Float, nullable=True)
    
    # Экстренные флаги
    is_emergency = Column(Boolean, default=False)
    emergency_type = Column(String, nullable=True)  # "danger", "complex", "hospital_transfer"
    
    # Связи
    messages = relationship("BookingMessage", back_populates="booking")
    status_updates = relationship("BookingStatusUpdate", back_populates="booking")

class BookingMessage(Base):
    __tablename__ = "booking_messages"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False)
    sender_id = Column(String, nullable=False)
    sender_role = Column(String, nullable=False)  # "patient", "doctor", "admin"
    message_type = Column(String, nullable=False, default="text")  # "text", "image", "voice"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    booking = relationship("Booking", back_populates="messages")

class BookingStatusUpdate(Base):
    __tablename__ = "booking_status_updates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False)
    old_status = Column(String, nullable=True)
    new_status = Column(String, nullable=False)
    updated_by = Column(String, nullable=False)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    booking = relationship("Booking", back_populates="status_updates")

# Создание таблиц
Base.metadata.create_all(bind=engine)

# Pydantic модели
class BookingCreate(BaseModel):
    call_type: str
    symptoms: Optional[str] = None
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    scheduled_time: Optional[datetime] = None
    priority: str = "normal"
    notes: Optional[str] = None
    estimated_duration: Optional[int] = None
    estimated_price: Optional[float] = None

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    doctor_id: Optional[str] = None
    notes: Optional[str] = None
    actual_duration: Optional[int] = None
    final_price: Optional[float] = None
    emergency_type: Optional[str] = None

class BookingResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: Optional[str]
    clinic_id: Optional[str]
    call_type: str
    symptoms: Optional[str]
    address: str
    latitude: Optional[float]
    longitude: Optional[float]
    status: str
    priority: str
    scheduled_time: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    assigned_at: Optional[datetime]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    cancelled_at: Optional[datetime]
    notes: Optional[str]
    estimated_duration: Optional[int]
    actual_duration: Optional[int]
    estimated_price: Optional[float]
    final_price: Optional[float]
    is_emergency: bool
    emergency_type: Optional[str]

class MessageCreate(BaseModel):
    content: str
    message_type: str = "text"

class MessageResponse(BaseModel):
    id: str
    booking_id: str
    sender_id: str
    sender_role: str
    message_type: str
    content: str
    created_at: datetime

# Функции для работы с базой данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_from_header(request):
    """Получение информации о пользователе из заголовков"""
    user_id = request.headers.get("X-User-ID")
    user_role = request.headers.get("X-User-Role")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not provided"
        )
    
    return {"user_id": user_id, "role": user_role}

# API endpoints
@app.post("/bookings", response_model=BookingResponse)
async def create_booking(
    booking_data: BookingCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Создание нового заказа вызова врача"""
    
    user_info = get_user_from_header(request)
    
    # Создание заказа
    booking = Booking(
        patient_id=user_info["user_id"],
        call_type=booking_data.call_type,
        symptoms=booking_data.symptoms,
        address=booking_data.address,
        latitude=booking_data.latitude,
        longitude=booking_data.longitude,
        scheduled_time=booking_data.scheduled_time,
        priority=booking_data.priority,
        notes=booking_data.notes,
        estimated_duration=booking_data.estimated_duration,
        estimated_price=booking_data.estimated_price
    )
    
    db.add(booking)
    db.commit()
    db.refresh(booking)
    
    # Создание записи о статусе
    status_update = BookingStatusUpdate(
        booking_id=booking.id,
        new_status="pending",
        updated_by=user_info["user_id"],
        reason="Booking created"
    )
    db.add(status_update)
    db.commit()
    
    return BookingResponse(
        id=booking.id,
        patient_id=booking.patient_id,
        doctor_id=booking.doctor_id,
        clinic_id=booking.clinic_id,
        call_type=booking.call_type,
        symptoms=booking.symptoms,
        address=booking.address,
        latitude=booking.latitude,
        longitude=booking.longitude,
        status=booking.status,
        priority=booking.priority,
        scheduled_time=booking.scheduled_time,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
        assigned_at=booking.assigned_at,
        started_at=booking.started_at,
        completed_at=booking.completed_at,
        cancelled_at=booking.cancelled_at,
        notes=booking.notes,
        estimated_duration=booking.estimated_duration,
        actual_duration=booking.actual_duration,
        estimated_price=booking.estimated_price,
        final_price=booking.final_price,
        is_emergency=booking.is_emergency,
        emergency_type=booking.emergency_type
    )

@app.get("/bookings/count")
async def get_bookings_count(db: Session = Depends(get_db)):
    """Получение количества заказов (без аутентификации для статистики)"""
    count = db.query(Booking).count()
    return {"count": count}

@app.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """Получение информации о заказе"""
    
    user_info = get_user_from_header(request)
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Проверка доступа
    if (user_info["role"] != "admin" and 
        booking.patient_id != user_info["user_id"] and 
        booking.doctor_id != user_info["user_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return BookingResponse(
        id=booking.id,
        patient_id=booking.patient_id,
        doctor_id=booking.doctor_id,
        clinic_id=booking.clinic_id,
        call_type=booking.call_type,
        symptoms=booking.symptoms,
        address=booking.address,
        latitude=booking.latitude,
        longitude=booking.longitude,
        status=booking.status,
        priority=booking.priority,
        scheduled_time=booking.scheduled_time,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
        assigned_at=booking.assigned_at,
        started_at=booking.started_at,
        completed_at=booking.completed_at,
        cancelled_at=booking.cancelled_at,
        notes=booking.notes,
        estimated_duration=booking.estimated_duration,
        actual_duration=booking.actual_duration,
        estimated_price=booking.estimated_price,
        final_price=booking.final_price,
        is_emergency=booking.is_emergency,
        emergency_type=booking.emergency_type
    )

@app.get("/bookings", response_model=List[BookingResponse])
async def get_user_bookings(
    request: Request,
    status_filter: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Получение списка заказов пользователя"""
    
    user_info = get_user_from_header(request)
    
    query = db.query(Booking)
    
    # Фильтрация по пользователю
    if user_info["role"] == "doctor":
        query = query.filter(Booking.doctor_id == user_info["user_id"])
    elif user_info["role"] == "patient":
        query = query.filter(Booking.patient_id == user_info["user_id"])
    elif user_info["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Фильтрация по статусу
    if status_filter:
        query = query.filter(Booking.status == status_filter)
    
    # Сортировка и пагинация
    bookings = query.order_by(Booking.created_at.desc()).offset(offset).limit(limit).all()
    
    return [
        BookingResponse(
            id=booking.id,
            patient_id=booking.patient_id,
            doctor_id=booking.doctor_id,
            clinic_id=booking.clinic_id,
            call_type=booking.call_type,
            symptoms=booking.symptoms,
            address=booking.address,
            latitude=booking.latitude,
            longitude=booking.longitude,
            status=booking.status,
            priority=booking.priority,
            scheduled_time=booking.scheduled_time,
            created_at=booking.created_at,
            updated_at=booking.updated_at,
            assigned_at=booking.assigned_at,
            started_at=booking.started_at,
            completed_at=booking.completed_at,
            cancelled_at=booking.cancelled_at,
            notes=booking.notes,
            estimated_duration=booking.estimated_duration,
            actual_duration=booking.actual_duration,
            estimated_price=booking.estimated_price,
            final_price=booking.final_price,
            is_emergency=booking.is_emergency,
            emergency_type=booking.emergency_type
        )
        for booking in bookings
    ]

@app.put("/bookings/{booking_id}/cancel")
async def cancel_booking(
    booking_id: str,
    request: Request,
    reason: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Отмена заказа"""
    
    user_info = get_user_from_header(request)
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Проверка доступа
    if (user_info["role"] != "admin" and 
        booking.patient_id != user_info["user_id"] and 
        booking.doctor_id != user_info["user_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Проверка возможности отмены
    if booking.status in ["completed", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel booking with status: " + booking.status
        )
    
    # Обновление статуса
    old_status = booking.status
    booking.status = "cancelled"
    booking.cancelled_at = datetime.utcnow()
    booking.updated_at = datetime.utcnow()
    
    # Создание записи о статусе
    status_update = BookingStatusUpdate(
        booking_id=booking.id,
        old_status=old_status,
        new_status="cancelled",
        updated_by=user_info["user_id"],
        reason=reason or "Booking cancelled"
    )
    
    db.add(status_update)
    db.commit()
    
    return {"message": "Booking cancelled successfully"}

@app.put("/bookings/{booking_id}/assign")
async def assign_doctor(
    booking_id: str,
    doctor_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """Назначение врача к заказу"""
    
    user_info = get_user_from_header(request)
    
    # Проверка прав (только админ или система)
    if user_info["role"] not in ["admin", "system"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only assign doctor to pending bookings"
        )
    
    # Обновление заказа
    old_status = booking.status
    booking.doctor_id = doctor_id
    booking.status = "assigned"
    booking.assigned_at = datetime.utcnow()
    booking.updated_at = datetime.utcnow()
    
    # Создание записи о статусе
    status_update = BookingStatusUpdate(
        booking_id=booking.id,
        old_status=old_status,
        new_status="assigned",
        updated_by=user_info["user_id"],
        reason=f"Doctor {doctor_id} assigned"
    )
    
    db.add(status_update)
    db.commit()
    
    return {"message": "Doctor assigned successfully"}

@app.put("/bookings/{booking_id}/start")
async def start_booking(
    booking_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """Начало выполнения заказа"""
    
    user_info = get_user_from_header(request)
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Проверка доступа (только назначенный врач)
    if booking.doctor_id != user_info["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    if booking.status != "assigned":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only start assigned bookings"
        )
    
    # Обновление статуса
    old_status = booking.status
    booking.status = "in_progress"
    booking.started_at = datetime.utcnow()
    booking.updated_at = datetime.utcnow()
    
    # Создание записи о статусе
    status_update = BookingStatusUpdate(
        booking_id=booking.id,
        old_status=old_status,
        new_status="in_progress",
        updated_by=user_info["user_id"],
        reason="Booking started"
    )
    
    db.add(status_update)
    db.commit()
    
    return {"message": "Booking started successfully"}

@app.put("/bookings/{booking_id}/complete")
async def complete_booking(
    booking_id: str,
    booking_data: BookingUpdate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Завершение заказа"""
    
    user_info = get_user_from_header(request)
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Проверка доступа (только назначенный врач)
    if booking.doctor_id != user_info["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    if booking.status != "in_progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only complete in-progress bookings"
        )
    
    # Обновление заказа
    old_status = booking.status
    booking.status = "completed"
    booking.completed_at = datetime.utcnow()
    booking.updated_at = datetime.utcnow()
    
    if booking_data.actual_duration is not None:
        booking.actual_duration = booking_data.actual_duration
    if booking_data.final_price is not None:
        booking.final_price = booking_data.final_price
    if booking_data.notes is not None:
        booking.notes = booking_data.notes
    
    # Создание записи о статусе
    status_update = BookingStatusUpdate(
        booking_id=booking.id,
        old_status=old_status,
        new_status="completed",
        updated_by=user_info["user_id"],
        reason="Booking completed"
    )
    
    db.add(status_update)
    db.commit()
    
    return {"message": "Booking completed successfully"}

@app.post("/bookings/{booking_id}/messages", response_model=MessageResponse)
async def send_message(
    booking_id: str,
    message_data: MessageCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Отправка сообщения в заказе"""
    
    user_info = get_user_from_header(request)
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Проверка доступа
    if (booking.patient_id != user_info["user_id"] and 
        booking.doctor_id != user_info["user_id"] and
        user_info["role"] != "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Создание сообщения
    message = BookingMessage(
        booking_id=booking_id,
        sender_id=user_info["user_id"],
        sender_role=user_info["role"],
        message_type=message_data.message_type,
        content=message_data.content
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return MessageResponse(
        id=message.id,
        booking_id=message.booking_id,
        sender_id=message.sender_id,
        sender_role=message.sender_role,
        message_type=message.message_type,
        content=message.content,
        created_at=message.created_at
    )

@app.get("/bookings/{booking_id}/messages", response_model=List[MessageResponse])
async def get_messages(
    booking_id: str,
    request: Request,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Получение сообщений заказа"""
    
    user_info = get_user_from_header(request)
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Проверка доступа
    if (booking.patient_id != user_info["user_id"] and 
        booking.doctor_id != user_info["user_id"] and
        user_info["role"] != "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    messages = db.query(BookingMessage).filter(
        BookingMessage.booking_id == booking_id
    ).order_by(BookingMessage.created_at.desc()).offset(offset).limit(limit).all()
    
    return [
        MessageResponse(
            id=message.id,
            booking_id=message.booking_id,
            sender_id=message.sender_id,
            sender_role=message.sender_role,
            message_type=message.message_type,
            content=message.content,
            created_at=message.created_at
        )
        for message in messages
    ]

@app.get("/health")
async def health_check():
    """Проверка состояния сервиса"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "booking-service"
    }

if __name__ == "__main__":
    # Создаем таблицы
    Base.metadata.create_all(bind=engine)
    
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("BOOKING_SERVICE_PORT", 8003))
    ) 