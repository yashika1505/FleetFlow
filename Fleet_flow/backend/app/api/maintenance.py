from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.maintenance import MaintenanceCreate, MaintenanceResponse
from app.crud.maintenance import create_maintenance, get_maintenance
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

@router.post("/", response_model=MaintenanceResponse, status_code=status.HTTP_201_CREATED)
def add_maintenance(data: MaintenanceCreate, db: Session = Depends(get_db)):
    """
    Create a new maintenance record.
    
    Requires:
    - vehicle_id: Must exist in vehicles table
    - issue: Problem description
    - date: Date of maintenance (YYYY-MM-DD format)
    - status: Status (Pending, In Progress, Completed, etc.)
    - cost: Maintenance cost (non-negative number)
    
    Returns:
    - 201 Created: Maintenance record successfully created
    - 400 Bad Request: Validation error or vehicle_id not found
    - 500 Internal Server Error: Unexpected database error
    """
    try:
        return create_maintenance(db, data)
    except ValueError as e:
        logger.warning(f"Validation error creating maintenance: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error creating maintenance: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create maintenance record: {str(e)}"
        )

@router.get("/", response_model=list[MaintenanceResponse])
def read_maintenance(db: Session = Depends(get_db)):
    """
    Get all maintenance records.
    
    Returns:
    - 200 OK: List of all maintenance records (empty list if none exist)
    - 500 Internal Server Error: Database error
    """
    try:
        return get_maintenance(db)
    except ValueError as e:
        logger.error(f"Error fetching maintenance: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )