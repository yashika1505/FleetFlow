from sqlalchemy import Column, Integer, Float, ForeignKey
from app.core.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    fuel_cost = Column(Float)
    misc_cost = Column(Float)