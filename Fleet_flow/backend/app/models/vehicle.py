from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    plate = Column(String(50), unique=True, index=True)
    model = Column(String(100))
    type = Column(String(50))
    capacity = Column(Float)
    odometer = Column(Float)
    status = Column(String(50))