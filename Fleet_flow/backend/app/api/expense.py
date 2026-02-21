from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.expense import ExpenseCreate, ExpenseResponse
from app.crud.expense import create_expense, get_expenses
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def add_expense(data: ExpenseCreate, db: Session = Depends(get_db)):
    """
    Create a new expense record.
    
    Requires:
    - trip_id: Must exist in trips table
    - fuel_cost: Cost of fuel (can be 0)
    - misc_cost: Miscellaneous cost (can be 0)
    
    Returns:
    - 201 Created: Expense successfully created
    - 400 Bad Request: Validation error or trip_id not found
    - 500 Internal Server Error: Unexpected database error
    """
    try:
        return create_expense(db, data)
    except ValueError as e:
        logger.warning(f"Validation error creating expense: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error creating expense: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create expense: {str(e)}"
        )

@router.get("/", response_model=list[ExpenseResponse])
def read_expenses(db: Session = Depends(get_db)):
    """
    Get all expenses.
    
    Returns:
    - 200 OK: List of all expenses (empty list if none exist)
    - 500 Internal Server Error: Database error
    """
    try:
        return get_expenses(db)
    except ValueError as e:
        logger.error(f"Error fetching expenses: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )