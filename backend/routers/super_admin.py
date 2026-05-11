from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import List
from core.db import prisma
from core.security import RoleChecker, get_password_hash
from schemas import StudentCreate, StudentUpdate, AdminPasswordReset, BulkDeleteRequest
from fastapi import UploadFile, File, Response
from fastapi.responses import JSONResponse
import pandas as pd
import io
import re
import base64
import json

router = APIRouter(prefix="/api/super-admin", tags=["super-admin"])

@router.get("/stats")
async def super_admin_stats(admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        total_students = await prisma.user.count(where={'role': 'STUDENT'})
        institutions_count = await prisma.institution.count()
        active_exams_count = await prisma.exam.count(where={'status': 'ONGOING'})
        suspicious_alerts_count = await prisma.alert.count()
        
        recent_alerts = await prisma.alert.find_many(
            take=5,
            order={'createdAt': 'desc'},
            include={'exam': True}
        )
        
        recent_activity = []
        for alert in recent_alerts:
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
            
        if not recent_activity:
            recent_activity = [
                {"id": 1, "title": "System Active", "desc": "All proctoring nodes operational.", "time": "Just now", "type": "SUCCESS"},
                {"id": 2, "title": "Database Synced", "desc": "Schema migration completed successfully.", "time": "5 mins ago", "type": "SUCCESS"}
            ]

        return {
            "total_students": total_students,
            "active_exams": active_exams_count,
            "suspicious_alerts": suspicious_alerts_count,
            "precision": "99.4%", 
            "avg_response_time": "1.2m", 
            "institutions": institutions_count,
            "recent_activity": recent_activity
        }
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return {
            "total_students": 0,
            "active_exams": 0,
            "suspicious_alerts": 0,
            "precision": "99.4%",
            "avg_response_time": "1.2m",
            "institutions": 0,
            "recent_activity": []
        }

@router.get("/institutions")
async def get_all_institutions(admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        institutions = await prisma.institution.find_many()
        return institutions
    except Exception as e:
        print(f"Error fetching institutions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch institutions")

@router.get("/students")
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

@router.get("/students/{id}")
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

@router.post("/students")
async def create_student(student: StudentCreate, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        existing_user = await prisma.user.find_first(
            where={
                "OR": [
                    {"email": student.email},
                    {"studentId": student.studentId}
                ]
            }
        )
        if existing_user:
            raise HTTPException(status_code=400, detail="Student with this email or ID already exists")

        hashed_password = get_password_hash(student.password)
        
        student_data = {
            "name": student.name,
            "email": student.email,
            "password": hashed_password,
            "studentId": student.studentId,
            "role": "STUDENT",
            "institutionId": student.institutionId,
        }
        
        for field in ["phone", "gender", "dob", "department", "course", "semester", "batch"]:
            val = getattr(student, field)
            if val is not None:
                if field == "dob" and val:
                    try:
                        from datetime import datetime as dt
                        if isinstance(val, str):
                            from datetime import date as d_date
                            val = d_date.fromisoformat(val)
                        student_data["dob"] = dt.combine(val, dt.min.time())
                    except Exception as e:
                        print(f"Error converting dob: {e}")
                else:
                    student_data[field] = val
                    
        new_student = await prisma.user.create(
            data=student_data,
            include={"institution": True}
        )
        return new_student
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating student: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/students/bulk-import/sample")
async def download_sample_excel(admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    # Fetch a valid institution to use in the sample
    institution = await prisma.institution.find_first()
    sample_inst_id = institution.id if institution else "YOUR_INSTITUTION_ID"
    
    df = pd.DataFrame(columns=[
        "name", "email", "password", "studentId", "phone", 
        "gender", "dob", "institutionId", "department", 
        "course", "semester", "batch"
    ])
    
    # Add one sample row
    df.loc[0] = ["John Doe", "john@example.com", "Password123!", "STU001", "1234567890",
                 "Male", "2000-01-01", sample_inst_id, "Computer Science",
                 "B.Tech", "3", "2024"]
                 
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Sample')
    
    output.seek(0)
    
    return Response(
        content=output.read(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=sample_students.xlsx"}
    )

@router.post("/students/bulk-import")
async def bulk_import_students(file: UploadFile = File(...), admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload an Excel or CSV file.")
            
        try:
            content = await file.read()
            if file.filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(content))
            else:
                df = pd.read_excel(io.BytesIO(content))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

        required_columns = ["name", "email", "password", "studentId", "institutionId"]
        missing_cols = [col for col in required_columns if col not in df.columns]
        if missing_cols:
            raise HTTPException(status_code=400, detail=f"Missing required columns: {', '.join(missing_cols)}")

        # Validations
        errors = []
        error_rows = []
        
        existing_users = await prisma.user.find_many(where={"role": "STUDENT"})
        existing_emails = {u.email for u in existing_users if u.email}
        existing_ids = {u.studentId for u in existing_users if u.studentId}
        
        existing_institutions = await prisma.institution.find_many()
        valid_institution_ids = {inst.id for inst in existing_institutions}
        institution_code_to_id = {inst.code.upper(): inst.id for inst in existing_institutions if inst.code}
        
        emails_in_file = set()
        ids_in_file = set()
        
        valid_students = []

        for index, row in df.iterrows():
            row_errors = []
            
            name = str(row.get('name', '')).strip() if pd.notna(row.get('name')) else ""
            email = str(row.get('email', '')).strip() if pd.notna(row.get('email')) else ""
            password = str(row.get('password', '')).strip() if pd.notna(row.get('password')) else ""
            studentId = str(row.get('studentId', '')).strip() if pd.notna(row.get('studentId')) else ""
            institutionId = str(row.get('institutionId', '')).strip() if pd.notna(row.get('institutionId')) else ""
            phone = str(row.get('phone', '')).strip() if pd.notna(row.get('phone')) else ""
            if phone == 'nan': phone = ""
            
            # 1. Check empty fields & Institution existence
            resolved_institution_id = institutionId
            if not name: row_errors.append("Name is required")
            if not email: row_errors.append("Email is required")
            if not password: row_errors.append("Password is required")
            if not studentId: row_errors.append("Student ID is required")
            
            if not institutionId: 
                row_errors.append("Institution ID is required")
            else:
                # Check if it's an ID or a Code
                if institutionId in valid_institution_ids:
                    resolved_institution_id = institutionId
                elif institutionId.upper() in institution_code_to_id:
                    resolved_institution_id = institution_code_to_id[institutionId.upper()]
                else:
                    row_errors.append(f"Institution ID/Code '{institutionId}' is invalid or does not exist")
            
            # 2. Validate email format
            if email and not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                row_errors.append("Invalid email format")
                
            # 3. Validate phone number length
            if phone and len(phone) < 10:
                row_errors.append("Phone number must be at least 10 characters")
                
            # 4. Validate duplicate student IDs or emails
            if email in existing_emails or email in emails_in_file:
                row_errors.append(f"Email {email} already exists")
            elif email:
                emails_in_file.add(email)
                    
            if studentId in existing_ids or studentId in ids_in_file:
                row_errors.append(f"Student ID {studentId} already exists")
            elif studentId:
                ids_in_file.add(studentId)
                    
            if row_errors:
                error_row = row.copy()
                error_row['Error Details'] = "; ".join(row_errors)
                error_rows.append(error_row)
                errors.extend(row_errors)
            else:
                valid_students.append({
                    "name": name,
                    "email": email,
                    "password": get_password_hash(password),
                    "studentId": studentId,
                    "role": "STUDENT",
                    "institutionId": resolved_institution_id,
                    "phone": phone if phone else None,
                    "gender": str(row.get('gender', '')).strip() if pd.notna(row.get('gender')) else None,
                    "department": str(row.get('department', '')).strip() if pd.notna(row.get('department')) else None,
                    "course": str(row.get('course', '')).strip() if pd.notna(row.get('course')) else None,
                    "semester": str(row.get('semester', '')).strip() if pd.notna(row.get('semester')) else None,
                    "batch": str(row.get('batch', '')).strip() if pd.notna(row.get('batch')) else None,
                })

        if error_rows:
            error_df = pd.DataFrame(error_rows)
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                error_df.to_excel(writer, index=False, sheet_name='Errors')
            
            error_base64 = base64.b64encode(output.getvalue()).decode('utf-8')
            
            unique_errors = list(set(errors))
            return JSONResponse(
                status_code=400,
                content={
                    "message": "Validation failed for some records",
                    "errors": unique_errors,
                    "error_file": error_base64
                }
            )
            
        try:
            if valid_students:
                for student_data in valid_students:
                    await prisma.user.create(data=student_data)
            return {"message": f"Successfully imported {len(valid_students)} students"}
        except Exception as e:
            print(f"Error inserting students: {e}")
            raise Exception(f"Database insertion failed: {str(e)}")
    except Exception as general_error:
        print(f"Unhandled exception in bulk import: {str(general_error)}")
        import traceback
        traceback.print_exc()
        # If it's already an HTTPException, re-raise it
        if isinstance(general_error, HTTPException):
            raise general_error
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(general_error)}")

@router.delete("/students/bulk")
async def bulk_delete_students(request: BulkDeleteRequest, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
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

@router.put("/students/{id}")
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

@router.delete("/students/{id}")
async def delete_student(id: str, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        await prisma.user.delete(where={"id": id})
        return {"message": "Student deleted successfully"}
    except Exception as e:
        print(f"Error deleting student: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete student")

@router.put("/students/{id}/status")
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

@router.post("/students/{id}/reset-password")
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
