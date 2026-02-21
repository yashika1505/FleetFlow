from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.models.maintenance import Maintenance
from app.models.vehicle import Vehicle
from app.schemas.maintenance import MaintenanceCreate
import logging

logger = logging.getLogger(__name__)

def create_maintenance(db: Session, maintenance: MaintenanceCreate):
    """
    Create a new maintenance record with validation of foreign key constraints.
    
    Raises:
        ValueError: If vehicle_id doesn't exist
        SQLAlchemyError: For database errors
    """
    try:
        # Validate that vehicle exists
        vehicle = db.query(Vehicle).filter(Vehicle.id == maintenance.vehicle_id).first()
        if not vehicle:
            logger.warning(f"Vehicle not found: vehicle_id={maintenance.vehicle_id}")
            raise ValueError(f"Vehicle with ID {maintenance.vehicle_id} not found")
        
        # Create maintenance record
        db_item = Maintenance(**maintenance.dict())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        logger.info(f"Maintenance created: id={db_item.id}, vehicle_id={maintenance.vehicle_id}")
        return db_item
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Integrity error creating maintenance: {str(e)}")
        raise ValueError("Foreign key constraint violation: Check that vehicle_id exists")
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating maintenance: {str(e)}")
        raise ValueError(f"Database error: {str(e)}")

def get_maintenance(db: Session):
    """Get all maintenance records."""
    try:
        records = db.query(Maintenance).all()
        logger.info(f"Retrieved {len(records)} maintenance records")
        return records
    except SQLAlchemyError as e:
        logger.error(f"Database error fetching maintenance: {str(e)}")
        raise ValueError(f"Database error: {str(e)}")