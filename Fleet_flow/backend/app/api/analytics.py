from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.expense import Expense

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/total-fuel-cost")
def total_fuel_cost(db: Session = Depends(get_db)):
    total = db.query(func.sum(Expense.fuel_cost)).scalar()
    return {"total_fuel_cost": total or 0}