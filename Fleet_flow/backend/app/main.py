from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Database
from app.core.database import engine, Base

# Import model modules so SQLAlchemy registers them
import app.models.vehicle
import app.models.driver
import app.models.trip
import app.models.maintenance
import app.models.expense

# Routers
from app.api.vehicle import router as vehicle_router
from app.api.driver import router as driver_router
from app.api.trip import router as trip_router
from app.api.maintenance import router as maintenance_router
from app.api.expense import router as expense_router
from app.api.analytics import router as analytics_router


# ----------------------------------------
# Create FastAPI App
# ----------------------------------------

app = FastAPI(
    title="FleetFlow API",
    description="Fleet Management System Backend",
    version="1.0.0"
)

# ----------------------------------------
# Database Startup
# ----------------------------------------

@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)

# ----------------------------------------
# CORS Configuration (Frontend Access)
# ----------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite frontend
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------
# Include Routers
# ----------------------------------------

app.include_router(vehicle_router)
app.include_router(driver_router)
app.include_router(trip_router)
app.include_router(maintenance_router)
app.include_router(expense_router)
app.include_router(analytics_router)

# ----------------------------------------
# Root Route
# ----------------------------------------

@app.get("/")
def root():
    return {
        "message": "FleetFlow Backend Running Successfully 🚀",
        "docs": "http://127.0.0.1:8000/docs"
    }

# ----------------------------------------
# Health Check Route
# ----------------------------------------

@app.get("/health")
def health_check():
    return {"status": "OK"}