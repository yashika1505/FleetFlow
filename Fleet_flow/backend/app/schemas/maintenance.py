from pydantic import BaseModel

class MaintenanceCreate(BaseModel):
    vehicle_id: int
    issue: str
    date: str
    status: str
    cost: float

class MaintenanceResponse(MaintenanceCreate):
    id: int

    class Config:
        from_attributes = True