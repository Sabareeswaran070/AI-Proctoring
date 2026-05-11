from fastapi import APIRouter, Depends
from core.security import RoleChecker

router = APIRouter(prefix="/api", tags=["dashboard"])

@router.get("/admin/dashboard")
async def admin_dashboard(admin=Depends(RoleChecker(["SUPER_ADMIN", "COLLEGE_ADMIN"]))):
    return {"message": f"Welcome Admin {admin.name}", "stats": "System healthy"}

@router.get("/faculty/dashboard")
async def faculty_dashboard(faculty=Depends(RoleChecker(["FACULTY", "SUPER_ADMIN"]))):
    return {"message": f"Welcome Professor {faculty.name}"}

@router.get("/student/exams")
async def student_exams(student=Depends(RoleChecker(["STUDENT"]))):
    return {"message": f"Hello {student.name}, here are your exams"}
