from fastapi import FastAPI, HTTPException, Depends, Header
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Notification Service", version="1.0.0")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://tot_user:tot_password@localhost:5432/tot_mvp")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    title = Column(String(200))
    message = Column(Text)
    notification_type = Column(String(50))  # push, email, sms, in_app
    status = Column(String(20))  # sent, delivered, failed, pending
    priority = Column(String(20), default="normal")  # low, normal, high, urgent
    data = Column(Text)  # JSON data for additional info
    sent_at = Column(DateTime)
    delivered_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class NotificationTemplate(Base):
    __tablename__ = "notification_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True)
    title_template = Column(String(200))
    message_template = Column(Text)
    notification_type = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserNotificationSettings(Base):
    __tablename__ = "user_notification_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    push_enabled = Column(Boolean, default=True)
    email_enabled = Column(Boolean, default=True)
    sms_enabled = Column(Boolean, default=False)
    in_app_enabled = Column(Boolean, default=True)
    quiet_hours_start = Column(String(5), default="22:00")  # HH:MM
    quiet_hours_end = Column(String(5), default="08:00")    # HH:MM
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic models
class NotificationBase(BaseModel):
    user_id: int
    title: str
    message: str
    notification_type: str = "push"
    priority: str = "normal"
    data: Optional[str] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    status: Optional[str] = None
    sent_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None

class NotificationResponse(NotificationBase):
    id: int
    status: str
    sent_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationTemplateBase(BaseModel):
    name: str
    title_template: str
    message_template: str
    notification_type: str = "push"
    is_active: bool = True

class NotificationTemplateCreate(NotificationTemplateBase):
    pass

class NotificationTemplateUpdate(BaseModel):
    title_template: Optional[str] = None
    message_template: Optional[str] = None
    notification_type: Optional[str] = None
    is_active: Optional[bool] = None

class NotificationTemplateResponse(NotificationTemplateBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserNotificationSettingsBase(BaseModel):
    user_id: int
    push_enabled: bool = True
    email_enabled: bool = True
    sms_enabled: bool = False
    in_app_enabled: bool = True
    quiet_hours_start: str = "22:00"
    quiet_hours_end: str = "08:00"

class UserNotificationSettingsCreate(UserNotificationSettingsBase):
    pass

class UserNotificationSettingsUpdate(BaseModel):
    push_enabled: Optional[bool] = None
    email_enabled: Optional[bool] = None
    sms_enabled: Optional[bool] = None
    in_app_enabled: Optional[bool] = None
    quiet_hours_start: Optional[str] = None
    quiet_hours_end: Optional[str] = None

class UserNotificationSettingsResponse(UserNotificationSettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth dependency
def get_user_from_header(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    try:
        user_id = int(authorization.split(" ")[1])
        return user_id
    except:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "notification-service"}

# Notification endpoints
@app.post("/notifications/", response_model=NotificationResponse)
async def create_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
    db_notification = Notification(**notification.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

@app.get("/notifications/{notification_id}", response_model=NotificationResponse)
async def get_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

@app.put("/notifications/{notification_id}", response_model=NotificationResponse)
async def update_notification(
    notification_id: int, 
    notification_update: NotificationUpdate, 
    db: Session = Depends(get_db)
):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    for field, value in notification_update.dict(exclude_unset=True).items():
        setattr(notification, field, value)
    
    db.commit()
    db.refresh(notification)
    return notification

@app.get("/notifications/user/{user_id}", response_model=List[NotificationResponse])
async def get_user_notifications(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

@app.post("/notifications/send")
async def send_notification(
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "push",
    priority: str = "normal",
    data: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Проверяем настройки пользователя
    settings = db.query(UserNotificationSettings).filter(UserNotificationSettings.user_id == user_id).first()
    
    if not settings:
        # Создаем настройки по умолчанию
        settings = UserNotificationSettings(user_id=user_id)
        db.add(settings)
        db.commit()
    
    # Проверяем, включен ли данный тип уведомлений
    if notification_type == "push" and not settings.push_enabled:
        raise HTTPException(status_code=400, detail="Push notifications are disabled")
    elif notification_type == "email" and not settings.email_enabled:
        raise HTTPException(status_code=400, detail="Email notifications are disabled")
    elif notification_type == "sms" and not settings.sms_enabled:
        raise HTTPException(status_code=400, detail="SMS notifications are disabled")
    
    # Создаем уведомление
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type,
        priority=priority,
        data=data,
        status="pending"
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    # Здесь будет логика отправки уведомления
    # В реальном приложении здесь будет интеграция с Firebase, Twilio, etc.
    
    # Обновляем статус
    notification.status = "sent"
    notification.sent_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Notification sent successfully", "notification_id": notification.id}

@app.post("/notifications/send-bulk")
async def send_bulk_notifications(
    user_ids: List[int],
    title: str,
    message: str,
    notification_type: str = "push",
    priority: str = "normal",
    data: Optional[str] = None,
    db: Session = Depends(get_db)
):
    notifications = []
    for user_id in user_ids:
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority,
            data=data,
            status="pending"
        )
        notifications.append(notification)
    
    db.add_all(notifications)
    db.commit()
    
    # Здесь будет логика массовой отправки
    
    return {"message": f"Bulk notifications created for {len(user_ids)} users"}

# Template endpoints
@app.post("/templates/", response_model=NotificationTemplateResponse)
async def create_template(template: NotificationTemplateCreate, db: Session = Depends(get_db)):
    db_template = NotificationTemplate(**template.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

@app.get("/templates/{template_id}", response_model=NotificationTemplateResponse)
async def get_template(template_id: int, db: Session = Depends(get_db)):
    template = db.query(NotificationTemplate).filter(NotificationTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@app.get("/templates/name/{template_name}", response_model=NotificationTemplateResponse)
async def get_template_by_name(template_name: str, db: Session = Depends(get_db)):
    template = db.query(NotificationTemplate).filter(NotificationTemplate.name == template_name).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@app.put("/templates/{template_id}", response_model=NotificationTemplateResponse)
async def update_template(
    template_id: int, 
    template_update: NotificationTemplateUpdate, 
    db: Session = Depends(get_db)
):
    template = db.query(NotificationTemplate).filter(NotificationTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    for field, value in template_update.dict(exclude_unset=True).items():
        setattr(template, field, value)
    
    template.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(template)
    return template

@app.get("/templates/", response_model=List[NotificationTemplateResponse])
async def get_templates(db: Session = Depends(get_db)):
    return db.query(NotificationTemplate).filter(NotificationTemplate.is_active == True).all()

# Settings endpoints
@app.post("/settings/", response_model=UserNotificationSettingsResponse)
async def create_user_settings(settings: UserNotificationSettingsCreate, db: Session = Depends(get_db)):
    # Проверяем, не существуют ли уже настройки для этого пользователя
    existing_settings = db.query(UserNotificationSettings).filter(UserNotificationSettings.user_id == settings.user_id).first()
    if existing_settings:
        raise HTTPException(status_code=400, detail="Settings already exist for this user")
    
    db_settings = UserNotificationSettings(**settings.dict())
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings

@app.get("/settings/{user_id}", response_model=UserNotificationSettingsResponse)
async def get_user_settings(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    settings = db.query(UserNotificationSettings).filter(UserNotificationSettings.user_id == user_id).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

@app.put("/settings/{user_id}", response_model=UserNotificationSettingsResponse)
async def update_user_settings(
    user_id: int, 
    settings_update: UserNotificationSettingsUpdate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    settings = db.query(UserNotificationSettings).filter(UserNotificationSettings.user_id == user_id).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    for field, value in settings_update.dict(exclude_unset=True).items():
        setattr(settings, field, value)
    
    settings.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(settings)
    return settings

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006) 