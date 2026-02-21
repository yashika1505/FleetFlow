from sqlalchemy.orm import Session
from app.models.maintenance import Maintenance
from app.schemas.maintenance import MaintenanceCreate

def create_maintenance(db: Session, maintenance: MaintenanceCreate):
    db_item = Maintenance(**maintenance.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_maintenance(db: Session):
    return db.query(Maintenance).all()