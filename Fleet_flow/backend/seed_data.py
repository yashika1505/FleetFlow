#!/usr/bin/env python3
"""
Seed database with test data for development.

Run this ONCE to populate initial test data:
    python seed_data.py

This creates:
- 3 test vehicles
- 3 test drivers
- 2 test trips
- 2 test maintenance records
- 2 test expenses
"""

import sys
from sqlalchemy.orm import Session
from app.core.database import engine, SessionLocal, Base

# Import models
from app.models.vehicle import Vehicle
from app.models.driver import Driver
from app.models.trip import Trip
from app.models.maintenance import Maintenance
from app.models.expense import Expense

def seed_data():
    """Create test data in database."""
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(Vehicle).first() is not None:
            print("✓ Database already has data, skipping seed")
            return
        
        # Create vehicles
        print("Creating test vehicles...")
        vehicles = [
            Vehicle(
                license_plate="VEH-001",
                category="Truck",
                status="Active",
                fuel_capacity=100.0,
                make="Volvo",
                model="FH16"
            ),
            Vehicle(
                license_plate="VEH-002",
                category="Van",
                status="Active",
                fuel_capacity=60.0,
                make="Mercedes",
                model="Sprinter"
            ),
            Vehicle(
                license_plate="VEH-003",
                category="Truck",
                status="Maintenance",
                fuel_capacity=80.0,
                make="Scania",
                model="R440"
            ),
        ]
        for v in vehicles:
            db.add(v)
        db.commit()
        print(f"✓ Created {len(vehicles)} vehicles")
        
        # Create drivers
        print("Creating test drivers...")
        drivers = [
            Driver(
                name="John Smith",
                license_number="DRV-001",
                expiry_date="2026-12-31",
                status="Active"
            ),
            Driver(
                name="Jane Doe",
                license_number="DRV-002",
                expiry_date="2027-06-30",
                status="Active"
            ),
            Driver(
                name="Bob Johnson",
                license_number="DRV-003",
                expiry_date="2025-03-15",
                status="Inactive"
            ),
        ]
        for d in drivers:
            db.add(d)
        db.commit()
        print(f"✓ Created {len(drivers)} drivers")
        
        # Create trips (requires vehicles and drivers)
        print("Creating test trips...")
        trips = [
            Trip(
                vehicle_id=1,
                driver_id=1,
                origin="New York",
                destination="Philadelphia",
                cargo_weight=500.0,
                fuel_estimate=25.0,
                status="Completed"
            ),
            Trip(
                vehicle_id=2,
                driver_id=2,
                origin="Boston",
                destination="Washington DC",
                cargo_weight=300.0,
                fuel_estimate=40.0,
                status="In Transit"
            ),
        ]
        for t in trips:
            db.add(t)
        db.commit()
        print(f"✓ Created {len(trips)} trips")
        
        # Create maintenance records (requires vehicles)
        print("Creating test maintenance records...")
        maintenance = [
            Maintenance(
                vehicle_id=1,
                issue="Oil change and filter replacement",
                date="2026-02-15",
                status="Completed",
                cost=150.0
            ),
            Maintenance(
                vehicle_id=3,
                issue="Engine overheating issue",
                date="2026-02-21",
                status="In Progress",
                cost=500.0
            ),
        ]
        for m in maintenance:
            db.add(m)
        db.commit()
        print(f"✓ Created {len(maintenance)} maintenance records")
        
        # Create expenses (requires trips)
        print("Creating test expenses...")
        expenses = [
            Expense(
                trip_id=1,
                fuel_cost=125.0,
                misc_cost=25.0
            ),
            Expense(
                trip_id=2,
                fuel_cost=150.0,
                misc_cost=50.0
            ),
        ]
        for e in expenses:
            db.add(e)
        db.commit()
        print(f"✓ Created {len(expenses)} expenses")
        
        print("\n" + "="*50)
        print("✓ DATABASE SEEDED SUCCESSFULLY")
        print("="*50)
        print("\nTest Data Summary:")
        print(f"  - Vehicles: {len(vehicles)}")
        print(f"  - Drivers: {len(drivers)}")
        print(f"  - Trips: {len(trips)}")
        print(f"  - Maintenance: {len(maintenance)}")
        print(f"  - Expenses: {len(expenses)}")
        print("\nYou can now:")
        print("  1. Start the backend: uvicorn app.main:app --reload")
        print("  2. Open browser: http://localhost:8000/docs")
        print("  3. Test API endpoints with swagger UI")
        print("  4. Start frontend: npm run dev")
        print("  5. Create new trips/expenses/maintenance from frontend")
        
    except Exception as e:
        print(f"✗ Error seeding database: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
