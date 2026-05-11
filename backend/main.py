import os
from datetime import datetime, timedelta, date
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

from core.db import prisma
from core.security import (
    create_access_token, 
    verify_password, 
    get_password_hash,
    get_current_user,
    RoleChecker,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from pydantic import BaseModel, EmailStr

load_dotenv()

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="AI Proctoring Examination System API",
    # description="Secure backend for AI Proctoring System",
    version="1.0.0"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration - More secure, only allow specific origins in production
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
    
    # Refined CSP to allow Swagger UI (FastAPI docs) and common CDNs
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

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

# Models
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    studentId: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[date] = None
    institutionId: str
    department: Optional[str] = None
    course: Optional[str] = None
    semester: Optional[str] = None
    batch: Optional[str] = None
    browserLock: Optional[bool] = True

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    studentId: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[date] = None
    institutionId: Optional[str] = None
    department: Optional[str] = None
    course: Optional[str] = None
    semester: Optional[str] = None
    batch: Optional[str] = None
    status: Optional[str] = None

class AdminPasswordReset(BaseModel):
    newPassword: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    
class PasswordChange(BaseModel):
    oldPassword: str
    newPassword: str

class BulkDeleteRequest(BaseModel):
    ids: List[str]

# Auth Routes
@app.post("/api/auth/login", response_model=Token)
@limiter.limit("5/minute") # Rate limit login attempts
async def login(request: Request, form_data: UserLogin):
    user = await prisma.user.find_unique(where={"email": form_data.email})
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "id": user.id},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "phone": user.phone,
            "gender": user.gender,
            "dob": user.dob.isoformat() if user.dob else None,
            "address": user.address
        }
    }

@app.get("/api/auth/me")
async def read_users_me(current_user=Depends(get_current_user)):
    try:
        return {
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "role": current_user.role,
            "phone": current_user.phone,
            "gender": current_user.gender,
            "dob": current_user.dob.isoformat() if current_user.dob else None,
            "address": getattr(current_user, 'address', None)
        }
    except Exception as e:
        print(f"Error in read_users_me: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/auth/profile")
async def update_profile(profile_data: ProfileUpdate, current_user=Depends(get_current_user)):
    update_dict = {k: v for k, v in profile_data.dict().items() if v is not None}
    
    if ("dob" in update_dict and update_dict["dob"]):
        try:
            if isinstance(update_dict["dob"], str):
                from datetime import date as d_date
                update_dict["dob"] = d_date.fromisoformat(update_dict["dob"])
            update_dict["dob"] = datetime.combine(update_dict["dob"], datetime.min.time())
        except Exception as e:
            print(f"Error converting dob: {e}")
            del update_dict["dob"] # Skip if invalid
        
    try:
        updated_user = await prisma.user.update(
            where={"id": current_user.id},
            data=update_dict
        )
        return {
            "id": updated_user.id,
            "email": updated_user.email,
            "name": updated_user.name,
            "role": updated_user.role,
            "phone": updated_user.phone,
            "gender": updated_user.gender,
            "dob": updated_user.dob.isoformat() if updated_user.dob else None,
            "address": updated_user.address
        }
    except Exception as e:
        print(f"Error updating profile: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@app.post("/api/auth/change-password")
async def change_password(data: PasswordChange, current_user=Depends(get_current_user)):
    # Verify old password
    user = await prisma.user.find_unique(where={"id": current_user.id})
    if not verify_password(data.oldPassword, user.password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    # Hash and update to new password
    hashed_password = get_password_hash(data.newPassword)
    await prisma.user.update(
        where={"id": current_user.id},
        data={"password": hashed_password}
    )
    return {"message": "Password updated successfully"}

# RBAC Example Routes
@app.get("/api/super-admin/stats")
async def super_admin_stats(admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        # Fetch real data from DB
        total_students = await prisma.user.count(where={'role': 'STUDENT'})
        institutions_count = await prisma.institution.count()
        active_exams_count = await prisma.exam.count(where={'status': 'ONGOING'})
        
        # Recent alerts as suspicious alerts count (e.g. from last 24h or total)
        suspicious_alerts_count = await prisma.alert.count()
        
        # Fetch recent activity (recent alerts and institution joins)
        recent_alerts = await prisma.alert.find_many(
            take=5,
            order={'createdAt': 'desc'},
            include={'exam': True}
        )
        
        recent_activity = []
        for alert in recent_alerts:
            # Calculate human-readable time
            diff = datetime.now() - alert.createdAt.replace(tzinfo=None)
            if diff.days > 0:
                time_str = f"{diff.days}d ago"
            elif diff.seconds > 3600:
                time_str = f"{diff.seconds // 3600}h ago"
            elif diff.seconds > 60:
                time_str = f"{diff.seconds // 60}m ago"
            else:
                time_str = "Just now"

            recent_activity.append({
                "id": f"alert-{alert.id}",
                "title": alert.title,
                "desc": alert.desc,
                "time": time_str,
                "type": "ALERT" if alert.type == "CRITICAL" else "WARNING"
            })
            
        # Add some system success messages if empty
        if not recent_activity:
            recent_activity = [
                {"id": 1, "title": "System Active", "desc": "All proctoring nodes operational.", "time": "Just now", "type": "SUCCESS"},
                {"id": 2, "title": "Database Synced", "desc": "Schema migration completed successfully.", "time": "5 mins ago", "type": "SUCCESS"}
            ]

        return {
            "total_students": total_students,
            "active_exams": active_exams_count,
            "suspicious_alerts": suspicious_alerts_count,
            "precision": "99.4%", # Still hardcoded for now as it's a model metric
            "avg_response_time": "1.2m", # Still hardcoded for now
            "institutions": institutions_count,
            "recent_activity": recent_activity
        }
    except Exception as e:
        print(f"Error fetching stats: {e}")
        # Fallback to zeros if something fails during transition
        return {
            "total_students": 0,
            "active_exams": 0,
            "suspicious_alerts": 0,
            "precision": "99.4%",
            "avg_response_time": "1.2m",
            "institutions": 0,
            "recent_activity": []
        }

@app.get("/api/super-admin/institutions")
async def get_all_institutions(admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        institutions = await prisma.institution.find_many()
        return institutions
    except Exception as e:
        print(f"Error fetching institutions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch institutions")

@app.get("/api/super-admin/students")
async def get_all_students(admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        students = await prisma.user.find_many(
            where={'role': 'STUDENT'},
            include={'institution': True},
            order={'createdAt': 'desc'}
        )
        return students
    except Exception as e:
        print(f"Error fetching students: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch students")

@app.get("/api/super-admin/students/{id}")
async def get_student_detail(id: str, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        student = await prisma.user.find_unique(
            where={"id": id},
            include={"institution": True}
        )
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching student detail: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch student detail")

@app.post("/api/super-admin/students")
async def create_student(student: StudentCreate, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        # Check if student already exists
        existing_user = await prisma.user.find_first(
            where={
                "OR": [
                    {"email": student.email},
                    {"studentId": student.studentId}
                ]
            }
        )
        if existing_user:
            detail = "Email already registered" if existing_user.email == student.email else "Student ID already exists"
            raise HTTPException(status_code=400, detail=detail)

        # Hash password
        hashed_password = get_password_hash(student.password)

        # Create user
        dob_dt = datetime.combine(student.dob, datetime.min.time()) if student.dob else None
        new_student = await prisma.user.create(
            data={
                "name": student.name,
                "email": student.email,
                "password": hashed_password,
                "role": "STUDENT",
                "studentId": student.studentId,
                "phone": student.phone,
                "gender": student.gender,
                "dob": dob_dt,
                "institutionId": student.institutionId,
                "department": student.department,
                "course": student.course,
                "semester": student.semester,
                "batch": student.batch,
                "browserLock": student.browserLock
            },
            include={"institution": True}
        )
        return new_student
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating student: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/super-admin/students/bulk")
async def bulk_delete_students(request: BulkDeleteRequest, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        # Delete many users with role STUDENT and IDs in the list
        delete_result = await prisma.user.delete_many(
            where={
                "id": {"in": request.ids},
                "role": "STUDENT"
            }
        )
        return {"message": f"Successfully deleted {delete_result} students", "count": delete_result}
    except Exception as e:
        print(f"Error bulk deleting students: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete students")

@app.put("/api/super-admin/students/{id}")
async def update_student(id: str, student_data: StudentUpdate, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        update_dict = {k: v for k, v in student_data.dict().items() if v is not None}
        if ("dob" in update_dict and update_dict["dob"]):
            if isinstance(update_dict["dob"], str):
                from datetime import date as d_date
                update_dict["dob"] = d_date.fromisoformat(update_dict["dob"])
            update_dict["dob"] = datetime.combine(update_dict["dob"], datetime.min.time())
            
        updated = await prisma.user.update(
            where={"id": id},
            data=update_dict,
            include={"institution": True}
        )
        return updated
    except Exception as e:
        print(f"Error updating student: {e}")
        raise HTTPException(status_code=500, detail="Failed to update student")

@app.delete("/api/super-admin/students/{id}")
async def delete_student(id: str, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        await prisma.user.delete(where={"id": id})
        return {"message": "Student deleted successfully"}
    except Exception as e:
        print(f"Error deleting student: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete student")

@app.put("/api/super-admin/students/{id}/status")
async def update_student_status(id: str, status_data: dict, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        new_status = status_data.get("status")
        if new_status not in ["ACTIVE", "BLOCKED", "SUSPENDED"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        updated = await prisma.user.update(
            where={"id": id},
            data={"status": new_status}
        )
        return updated
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update status")

@app.post("/api/super-admin/students/{id}/reset-password")
async def reset_student_password(id: str, data: AdminPasswordReset, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        hashed_password = get_password_hash(data.newPassword)
        await prisma.user.update(
            where={"id": id},
            data={"password": hashed_password}
        )
        return {"message": "Password reset successfully"}
    except Exception as e:
        print(f"Error resetting password: {e}")
        raise HTTPException(status_code=500, detail="Failed to reset password")

@app.get("/api/admin/dashboard")
async def admin_dashboard(admin=Depends(RoleChecker(["SUPER_ADMIN", "COLLEGE_ADMIN"]))):
    return {"message": f"Welcome Admin {admin.name}", "stats": "System healthy"}

@app.get("/api/faculty/dashboard")
async def faculty_dashboard(faculty=Depends(RoleChecker(["FACULTY", "SUPER_ADMIN"]))):
    return {"message": f"Welcome Professor {faculty.name}"}

@app.get("/api/student/exams")
async def student_exams(student=Depends(RoleChecker(["STUDENT"]))):
    return {"message": f"Hello {student.name}, here are your exams"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
