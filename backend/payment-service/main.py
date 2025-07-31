from fastapi import FastAPI, HTTPException, Depends, Header
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime
import os
from dotenv import load_dotenv
import uuid
import json
import hashlib
import hmac
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import qrcode
from io import BytesIO
import base64

# Импорты для ЮKassa
try:
    from yookassa import Payment as YooKassaPayment
    from yookassa import Configuration
    from yookassa.domain.request import PaymentRequest
except ImportError:
    print("ЮKassa SDK не установлен. Установите: pip install yookassa")

load_dotenv()

app = FastAPI(title="Payment Service", version="1.0.0")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tot_mvp.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Настройки платежных систем
YUKASSA_SHOP_ID = os.getenv("YUKASSA_SHOP_ID")
YUKASSA_SECRET_KEY = os.getenv("YUKASSA_SECRET_KEY")
SBP_MERCHANT_ID = os.getenv("SBP_MERCHANT_ID")
SBP_PRIVATE_KEY_PATH = os.getenv("SBP_PRIVATE_KEY_PATH")

# Инициализация ЮKassa
try:
    from yookassa import Configuration
    if YUKASSA_SHOP_ID and YUKASSA_SECRET_KEY:
        Configuration.account_id = YUKASSA_SHOP_ID
        Configuration.secret_key = YUKASSA_SECRET_KEY
except ImportError:
    print("ЮKassa SDK не установлен. Установите: pip install yookassa")

# Models
class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    booking_id = Column(Integer, index=True)
    amount = Column(Float)
    currency = Column(String(3), default="RUB")
    payment_method = Column(String(50))  # yookassa, sbp, wallet
    payment_provider = Column(String(50))  # yookassa, sbp
    status = Column(String(20))  # pending, completed, failed, refunded
    transaction_id = Column(String(100), unique=True)
    provider_payment_id = Column(String(100))  # ID платежа в платежной системе
    payment_metadata = Column(Text)  # JSON данные от провайдера
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Wallet(Base):
    __tablename__ = "wallets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    balance = Column(Float, default=0.0)
    currency = Column(String(3), default="RUB")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("wallets.id"))
    payment_id = Column(Integer, ForeignKey("payments.id"))
    amount = Column(Float)
    transaction_type = Column(String(20))  # deposit, withdrawal, payment
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic models
class PaymentBase(BaseModel):
    user_id: int
    booking_id: Optional[int] = None
    amount: float
    currency: str = "RUB"
    payment_method: Literal["yookassa", "sbp", "wallet"]
    description: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    status: Optional[str] = None
    transaction_id: Optional[str] = None
    provider_payment_id: Optional[str] = None
    metadata: Optional[dict] = None

class PaymentResponse(PaymentBase):
    id: int
    payment_provider: Optional[str] = None
    status: str
    transaction_id: Optional[str] = None
    provider_payment_id: Optional[str] = None
    metadata: Optional[dict] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class WalletBase(BaseModel):
    user_id: int
    balance: float = 0.0
    currency: str = "RUB"
    is_active: bool = True

class WalletCreate(WalletBase):
    pass

class WalletUpdate(BaseModel):
    balance: Optional[float] = None
    is_active: Optional[bool] = None

class WalletResponse(WalletBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    wallet_id: int
    payment_id: Optional[int] = None
    amount: float
    transaction_type: str
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# СБП QR-код модель
class SBPQRCode(BaseModel):
    qr_code: str  # base64 encoded QR code
    payment_url: str
    amount: float
    currency: str = "RUB"
    description: str

# ЮKassa платеж модель
class YooKassaPaymentRequest(BaseModel):
    amount: float
    currency: str = "RUB"
    description: str
    return_url: str
    capture: bool = True

class YooKassaPaymentResponse(BaseModel):
    id: str
    status: str
    paid: bool
    amount: dict
    confirmation: dict
    created_at: str
    description: str
    metadata: Optional[dict] = None

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
        # Здесь должна быть логика проверки JWT токена
        # Пока возвращаем user_id из заголовка для демо
        user_id = int(authorization.split(" ")[-1])
        return user_id
    except:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

# СБП интеграция
class SBPIntegration:
    def __init__(self):
        self.merchant_id = SBP_MERCHANT_ID
        self.private_key_path = SBP_PRIVATE_KEY_PATH
    
    def generate_qr_code(self, amount: float, description: str, payment_id: str) -> SBPQRCode:
        """Генерирует QR-код для СБП платежа"""
        try:
            # Формируем данные для QR-кода СБП
            qr_data = {
                "merchant_id": self.merchant_id,
                "amount": amount,
                "currency": "RUB",
                "description": description,
                "payment_id": payment_id
            }
            
            # Создаем QR-код
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(json.dumps(qr_data))
            qr.make(fit=True)
            
            # Создаем изображение
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Конвертируем в base64
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            qr_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            return SBPQRCode(
                qr_code=qr_base64,
                payment_url=f"sbp://pay?qr={qr_base64}",
                amount=amount,
                description=description
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка генерации QR-кода СБП: {str(e)}")

# ЮKassa интеграция
class YooKassaIntegration:
    def __init__(self):
        self.shop_id = YUKASSA_SHOP_ID
        self.secret_key = YUKASSA_SECRET_KEY
    
    def create_payment(self, amount: float, description: str, return_url: str, metadata: dict = None) -> YooKassaPaymentResponse:
        """Создает платеж в ЮKassa"""
        try:
            # Проверяем, что yookassa доступен
            if not YUKASSA_SHOP_ID or not YUKASSA_SECRET_KEY:
                raise HTTPException(status_code=500, detail="ЮKassa не настроена")
            
            payment_request = PaymentRequest(
                amount={
                    "value": str(amount),
                    "currency": "RUB"
                },
                confirmation={
                    "type": "redirect",
                    "return_url": return_url
                },
                description=description,
                metadata=metadata or {}
            )
            
            payment = YooKassaPayment.create(payment_request)
            
            return YooKassaPaymentResponse(
                id=payment.id or "",
                status=payment.status or "",
                paid=payment.paid or False,
                amount={"value": str(amount), "currency": "RUB"},
                confirmation={"type": "redirect", "return_url": return_url},
                created_at=payment.created_at or "",
                description=payment.description or description,
                metadata=payment.metadata
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка создания платежа ЮKassa: {str(e)}")

# Инициализация интеграций
sbp_integration = SBPIntegration()
yookassa_integration = YooKassaIntegration()

# Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "payment-service"}

@app.post("/payments/", response_model=PaymentResponse)
async def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    """Создает новый платеж"""
    # Генерируем уникальный transaction_id
    transaction_id = str(uuid.uuid4())
    
    # Создаем запись в БД
    db_payment = Payment(
        user_id=payment.user_id,
        booking_id=payment.booking_id,
        amount=payment.amount,
        currency=payment.currency,
        payment_method=payment.payment_method,
        status="pending",
        transaction_id=transaction_id,
        description=payment.description
    )
    
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    
    # Обрабатываем платеж в зависимости от метода
    if payment.payment_method == "yookassa":
        try:
            yookassa_payment = yookassa_integration.create_payment(
                amount=payment.amount,
                description=payment.description or f"Платеж за вызов врача",
                return_url=f"https://tot-mvp.ru/payment/return/{transaction_id}",
                metadata={"payment_id": db_payment.id, "user_id": payment.user_id}
            )
            
            # Обновляем запись с данными от ЮKassa
            db_payment.payment_provider = "yookassa"
            db_payment.provider_payment_id = yookassa_payment.id
            db_payment.payment_metadata = json.dumps(yookassa_payment.dict())
            db.commit()
            
        except Exception as e:
            db_payment.status = "failed"
            db.commit()
            raise HTTPException(status_code=500, detail=f"Ошибка создания платежа ЮKassa: {str(e)}")
    
    elif payment.payment_method == "sbp":
        try:
            # Генерируем QR-код для СБП
            qr_code = sbp_integration.generate_qr_code(
                amount=payment.amount,
                description=payment.description or f"Платеж за вызов врача",
                payment_id=transaction_id
            )
            
            # Обновляем запись с данными СБП
            db_payment.payment_provider = "sbp"
            db_payment.payment_metadata = json.dumps(qr_code.dict())
            db.commit()
            
        except Exception as e:
            db_payment.status = "failed"
            db.commit()
            raise HTTPException(status_code=500, detail=f"Ошибка создания платежа СБП: {str(e)}")
    
    elif payment.payment_method == "wallet":
        # Проверяем баланс кошелька
        wallet = db.query(Wallet).filter(Wallet.user_id == payment.user_id).first()
        if not wallet or wallet.balance < payment.amount:
            raise HTTPException(status_code=400, detail="Недостаточно средств в кошельке")
        
        # Списываем средства
        wallet.balance -= payment.amount
        db_payment.status = "completed"
        db.commit()
    
    return db_payment

@app.get("/payments/{payment_id}", response_model=PaymentResponse)
async def get_payment(payment_id: int, db: Session = Depends(get_db)):
    """Получает информацию о платеже"""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@app.put("/payments/{payment_id}", response_model=PaymentResponse)
async def update_payment(
    payment_id: int, 
    payment_update: PaymentUpdate, 
    db: Session = Depends(get_db)
):
    """Обновляет статус платежа"""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    for field, value in payment_update.dict(exclude_unset=True).items():
        if field == "metadata" and value:
            setattr(payment, field, json.dumps(value))
        else:
            setattr(payment, field, value)
    
    payment.updated_at = datetime.utcnow()  # pyright: ignore[reportAttributeAccessIssue]
    db.commit()
    db.refresh(payment)
    return payment

@app.get("/payments/user/{user_id}", response_model=List[PaymentResponse])
async def get_user_payments(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    """Получает все платежи пользователя"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    payments = db.query(Payment).filter(Payment.user_id == user_id).all()
    return payments

@app.post("/payments/{payment_id}/complete")
async def complete_payment(payment_id: int, db: Session = Depends(get_db)):
    """Завершает платеж (webhook от платежных систем)"""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    payment.status = "completed"
    payment.updated_at = datetime.utcnow()  # pyright: ignore[reportAttributeAccessIssue]
    db.commit()
    
    return {"status": "completed", "payment_id": payment_id}

@app.post("/payments/{payment_id}/refund")
async def refund_payment(payment_id: int, db: Session = Depends(get_db)):
    """Возвращает платеж"""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    if payment.status != "completed":
        raise HTTPException(status_code=400, detail="Payment is not completed")
    
    payment.status = "refunded"
    payment.updated_at = datetime.utcnow()  # pyright: ignore[reportAttributeAccessIssue]
    db.commit()
    
    return {"status": "refunded", "payment_id": payment_id}

# Wallet endpoints
@app.post("/wallets/", response_model=WalletResponse)
async def create_wallet(wallet: WalletCreate, db: Session = Depends(get_db)):
    """Создает кошелек для пользователя"""
    # Проверяем, не существует ли уже кошелек для этого пользователя
    existing_wallet = db.query(Wallet).filter(Wallet.user_id == wallet.user_id).first()
    if existing_wallet:
        raise HTTPException(status_code=400, detail="Wallet already exists for this user")
    
    db_wallet = Wallet(**wallet.dict())
    db.add(db_wallet)
    db.commit()
    db.refresh(db_wallet)
    return db_wallet

@app.get("/wallets/{user_id}", response_model=WalletResponse)
async def get_wallet(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    """Получает кошелек пользователя"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return wallet

@app.put("/wallets/{user_id}", response_model=WalletResponse)
async def update_wallet(
    user_id: int, 
    wallet_update: WalletUpdate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    """Обновляет кошелек пользователя"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    
    for field, value in wallet_update.dict(exclude_unset=True).items():
        setattr(wallet, field, value)
    
    wallet.updated_at = datetime.utcnow()  # pyright: ignore[reportAttributeAccessIssue]
    db.commit()
    db.refresh(wallet)
    return wallet

@app.post("/wallets/{user_id}/deposit")
async def deposit_to_wallet(
    user_id: int, 
    amount: float, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    """Пополняет кошелек пользователя"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    
    wallet.balance += amount
    wallet.updated_at = datetime.utcnow()  # pyright: ignore[reportAttributeAccessIssue]
    
    # Создаем запись о транзакции
    transaction = Transaction(
        wallet_id=wallet.id,
        amount=amount,
        transaction_type="deposit",
        description=f"Пополнение кошелька на {amount} RUB"
    )
    db.add(transaction)
    db.commit()
    
    return {"status": "success", "new_balance": wallet.balance}

@app.post("/wallets/{user_id}/withdraw")
async def withdraw_from_wallet(
    user_id: int, 
    amount: float, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    """Списывает средства с кошелька пользователя"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    
    if wallet.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")
    
    wallet.balance -= amount
    wallet.updated_at = datetime.utcnow()  # pyright: ignore[reportAttributeAccessIssue]
    
    # Создаем запись о транзакции
    transaction = Transaction(
        wallet_id=wallet.id,
        amount=-amount,
        transaction_type="withdrawal",
        description=f"Списание с кошелька {amount} RUB"
    )
    db.add(transaction)
    db.commit()
    
    return {"status": "success", "new_balance": wallet.balance}

# Transaction endpoints
@app.get("/transactions/wallet/{wallet_id}", response_model=List[TransactionResponse])
async def get_wallet_transactions(wallet_id: int, db: Session = Depends(get_db)):
    """Получает транзакции кошелька"""
    transactions = db.query(Transaction).filter(Transaction.wallet_id == wallet_id).all()
    return transactions

@app.get("/transactions/user/{user_id}", response_model=List[TransactionResponse])
async def get_user_transactions(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_user_from_header)
):
    """Получает все транзакции пользователя"""
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    
    transactions = db.query(Transaction).filter(Transaction.wallet_id == wallet.id).all()
    return transactions

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005) 