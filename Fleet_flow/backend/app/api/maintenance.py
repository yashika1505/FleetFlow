from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.maintenance import MaintenanceCreate, MaintenanceResponse
from app.crud.maintenance import create_maintenance, get_maintenance

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

@router.post("/", response_model=MaintenanceResponse)
def add_maintenance(data: MaintenanceCreate, db: Session = Depends(get_db)):
    return create_maintenance(db, data)

@router.get("/", response_model=list[MaintenanceResponse])
def read_maintenance(db: Session = Depends(get_db)):
    return get_maintenance(db)