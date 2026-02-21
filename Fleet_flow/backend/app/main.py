import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Configure logging for debugging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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
# CORS Configuration (MUST BE FIRST!)
# 
# WHY LOCALHOST ≠ 127.0.0.1 IN CORS:
# ============================================
# CORS (Cross-Origin Resource Sharing) checks the FULL ORIGIN:
#   Origin = protocol + hostname + port
#
# Examples:
#   http://localhost:8080 - DIFFERENT from http://127.0.0.1:8080
#   https://yourdomain.com:443 - DIFFERENT from https://yourdomain.com:8443
#
# Browser sees:
#   - Frontend accessed at: http://localhost:8080
#   - Request to: http://127.0.0.1:8000
#   - Hostnames DON'T MATCH (localhost ≠ 127.0.0.1)
#   - Result: CORS BLOCKS IT ❌
#
# Solution: Use same hostname everywhere
#   - Frontend: http://localhost:8080
#   - Backend: http://localhost:8000 (NOT 127.0.0.1)
#
# Why this happens:
#   - localhost = hostname (DNS/system name for 127.0.0.1)
#   - 127.0.0.1 = IP address
#   - Browsers treat them as DIFFERENT origins
#   - CORS is strict for security reasons
#
# Development vs Production:
#   DEV: Allow localhost + 127.0.0.1 variants for compatibility
#   PROD: Only allow your actual domain (e.g., yourdomain.com)
# ----------------------------------------

# Determine allowed origins based on environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()

if ENVIRONMENT == "production":
    # Production: ONLY allow your actual domain
    # NEVER use localhost/127.0.0.1 in production!
    ALLOWED_ORIGINS = [
        "https://yourdomain.com",
        "https://www.yourdomain.com",
    ]
    logger.info("CORS configured for PRODUCTION")
else:
    # Development: Allow all localhost variants and common dev ports
    ALLOWED_ORIGINS = [
        # Localhost (browser accesses frontend via localhost:8080)
        "http://localhost:5173",      # Vite default
        "http://localhost:8080",      # Frontend dev server
        "http://localhost:8081",      # Fallback if port 8080 taken
        "http://localhost:8082",
        "http://localhost:8083",
        "http://localhost:3000",      # React CRA default
        "http://localhost:3001",
        
        # 127.0.0.1 (IP address form, sometimes used instead of localhost)
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:8082",
        "http://127.0.0.1:8083",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]
    logger.info("CORS configured for DEVELOPMENT")

logger.info(f"Allowed Origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,
)

# ----------------------------------------
# Database Startup
# ----------------------------------------

@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)

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