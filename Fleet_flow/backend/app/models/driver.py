from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    license_number = Column(String(100), unique=True, index=True)
    expiry_date = Column(String(50))
    status = Column(String(50))  # On Duty / Off Duty / Suspended