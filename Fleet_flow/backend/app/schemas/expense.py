from pydantic import BaseModel

class ExpenseCreate(BaseModel):
    trip_id: int
    fuel_cost: float
    misc_cost: float

class ExpenseResponse(ExpenseCreate):
    id: int

    class Config:
        from_attributes = True