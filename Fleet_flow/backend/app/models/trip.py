from sqlalchemy import Column, Integer, String, ForeignKey, Float
from app.core.database import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    driver_id = Column(Integer, ForeignKey("drivers.id"))
    origin = Column(String(200))
    destination = Column(String(200))
    cargo_weight = Column(Float)
    fuel_estimate = Column(Float)
    status = Column(String(50))  # Draft / Dispatched / Completed