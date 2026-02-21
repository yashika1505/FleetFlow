from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.expense import ExpenseCreate, ExpenseResponse
from app.crud.expense import create_expense, get_expenses

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/", response_model=ExpenseResponse)
def add_expense(data: ExpenseCreate, db: Session = Depends(get_db)):
    return create_expense(db, data)

@router.get("/", response_model=list[ExpenseResponse])
def read_expenses(db: Session = Depends(get_db)):
    return get_expenses(db)