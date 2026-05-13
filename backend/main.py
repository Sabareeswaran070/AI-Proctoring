import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

from core.db import prisma
from core.limiter import limiter
from core.security import get_password_hash
from routers import auth, super_admin, dashboard, institutions

load_dotenv()

app = FastAPI(
    title="AI Proctoring Examination System API",
    version="1.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    csp = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline' cdn.jsdelivr.net; "
        "img-src 'self' data: fastapi.tiangolo.com; "
        "connect-src 'self' cdn.jsdelivr.net;"
    )
    response.headers["Content-Security-Policy"] = csp
    return response

@app.on_event("startup")
async def startup():
    await prisma.connect()
    
    # Seed Super Admin
    super_admin_email = "admin@gmail.com"
    existing_admin = await prisma.user.find_unique(where={"email": super_admin_email})
    
    if not existing_admin:
        await prisma.user.create(
            data={
                "email": super_admin_email,
                "password": get_password_hash("123456"),
                "name": "Super Admin",
                "role": "SUPER_ADMIN",
                "status": "ACTIVE"
            }
        )

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

# Include Routers
app.include_router(auth.router)
app.include_router(super_admin.router)
app.include_router(dashboard.router)
app.include_router(institutions.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
