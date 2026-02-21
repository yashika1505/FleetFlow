from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.models.expense import Expense
from app.models.trip import Trip
from app.schemas.expense import ExpenseCreate
import logging

logger = logging.getLogger(__name__)

def create_expense(db: Session, expense: ExpenseCreate):
    """
    Create a new expense with validation of foreign key constraints.
    
    Raises:
        ValueError: If trip_id doesn't exist
        SQLAlchemyError: For database errors
    """
    try:
        # Validate that trip exists
        trip = db.query(Trip).filter(Trip.id == expense.trip_id).first()
        if not trip:
            logger.warning(f"Trip not found: trip_id={expense.trip_id}")
            raise ValueError(f"Trip with ID {expense.trip_id} not found")
        
        # Create expense
        db_item = Expense(**expense.dict())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        logger.info(f"Expense created: id={db_item.id}, trip_id={expense.trip_id}")
        return db_item
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Integrity error creating expense: {str(e)}")
        raise ValueError("Foreign key constraint violation: Check that trip_id exists")
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating expense: {str(e)}")
        raise ValueError(f"Database error: {str(e)}")

def get_expenses(db: Session):
    """Get all expenses."""
    try:
        expenses = db.query(Expense).all()
        logger.info(f"Retrieved {len(expenses)} expenses")
        return expenses
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching expenses: {str(e)}")
        raise ValueError(f"Database error: {str(e)}")