from sqlalchemy import Column, Integer, String, ForeignKey, Float
from app.core.database import Base

class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    issue = Column(String(200))
    date = Column(String(50))
    status = Column(String(50))
    cost = Column(Float)