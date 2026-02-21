from sqlalchemy.orm import Session
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate

def create_expense(db: Session, expense: ExpenseCreate):
    db_item = Expense(**expense.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_expenses(db: Session):
    return db.query(Expense).all()