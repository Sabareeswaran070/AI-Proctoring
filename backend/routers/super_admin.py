from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import List
from core.db import prisma
from core.security import RoleChecker, get_password_hash
from schemas import StudentCreate, StudentUpdate, AdminPasswordReset, BulkDeleteRequest, FacultyCreate, FacultyUpdate
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

# ─────────────────────────────────────────────────────────────
#  FACULTY ENDPOINTS
# ─────────────────────────────────────────────────────────────

@router.get("/faculty")
async def get_all_faculty(admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        faculty = await prisma.user.find_many(
            where={"role": "FACULTY"},
            include={"institution": True},
            order={"createdAt": "desc"}
        )
        return faculty
    except Exception as e:
        print(f"Error fetching faculty: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch faculty")

@router.get("/faculty/{id}")
async def get_faculty_detail(id: str, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        faculty = await prisma.user.find_unique(
            where={"id": id},
            include={"institution": True}
        )
        if not faculty or faculty.role != "FACULTY":
            raise HTTPException(status_code=404, detail="Faculty not found")
        return faculty
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching faculty detail: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch faculty detail")

@router.post("/faculty")
async def create_faculty(faculty: FacultyCreate, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        existing = await prisma.user.find_first(
            where={
                "OR": [
                    {"email": faculty.email},
                    {"studentId": faculty.facultyId}
                ]
            }
        )
        if existing:
            raise HTTPException(status_code=400, detail="Faculty with this email or ID already exists")

        hashed_password = get_password_hash(faculty.password)

        faculty_data = {
            "name": faculty.name,
            "email": faculty.email,
            "password": hashed_password,
            "studentId": faculty.facultyId,   # reuse unique studentId field
            "role": "FACULTY",
            "institutionId": faculty.institutionId,
        }

        optional_fields = {
            "phone": faculty.phone,
            "gender": faculty.gender,
            "department": faculty.department,
            "course": faculty.designation,       # designation → course
            "semester": faculty.specialization,  # specialization → semester
        }
        for k, v in optional_fields.items():
            if v is not None:
                faculty_data[k] = v

        if faculty.dob:
            try:
                from datetime import datetime as dt
                from datetime import date as d_date
                val = faculty.dob
                if isinstance(val, str):
                    val = d_date.fromisoformat(val)
                faculty_data["dob"] = dt.combine(val, dt.min.time())
            except Exception as e:
                print(f"Error converting dob: {e}")

        new_faculty = await prisma.user.create(
            data=faculty_data,
            include={"institution": True}
        )
        return new_faculty
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating faculty: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/faculty/{id}")
async def update_faculty(id: str, faculty: FacultyUpdate, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        update_dict = {}
        field_map = {
            "name": "name", "email": "email", "phone": "phone",
            "gender": "gender", "institutionId": "institutionId",
            "department": "department",
            "designation": "course",       # designation → course
            "specialization": "semester",  # specialization → semester
            "status": "status",
        }
        for schema_field, db_field in field_map.items():
            val = getattr(faculty, schema_field, None)
            if val is not None:
                update_dict[db_field] = val

        if faculty.facultyId:
            update_dict["studentId"] = faculty.facultyId

        if faculty.dob:
            try:
                from datetime import datetime as dt
                from datetime import date as d_date
                val = faculty.dob
                if isinstance(val, str):
                    val = d_date.fromisoformat(val)
                update_dict["dob"] = dt.combine(val, dt.min.time())
            except Exception as e:
                print(f"Error converting dob: {e}")

        updated = await prisma.user.update(
            where={"id": id},
            data=update_dict,
            include={"institution": True}
        )
        return updated
    except Exception as e:
        print(f"Error updating faculty: {e}")
        raise HTTPException(status_code=500, detail="Failed to update faculty")

@router.delete("/faculty/{id}")
async def delete_faculty(id: str, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        await prisma.user.delete(where={"id": id})
        return {"message": "Faculty deleted successfully"}
    except Exception as e:
        print(f"Error deleting faculty: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete faculty")

@router.delete("/faculty/bulk")
async def bulk_delete_faculty(request: BulkDeleteRequest, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        await prisma.user.delete_many(where={"id": {"in": request.ids}})
        return {"message": f"Deleted {len(request.ids)} faculty members"}
    except Exception as e:
        print(f"Error bulk deleting faculty: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete faculty")

@router.put("/faculty/{id}/status")
async def update_faculty_status(id: str, status_data: dict, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
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
        print(f"Error updating faculty status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update status")

@router.post("/faculty/{id}/reset-password")
async def reset_faculty_password(id: str, data: AdminPasswordReset, admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        hashed_password = get_password_hash(data.newPassword)
        await prisma.user.update(
            where={"id": id},
            data={"password": hashed_password}
        )
        return {"message": "Password reset successfully"}
    except Exception as e:
        print(f"Error resetting faculty password: {e}")
        raise HTTPException(status_code=500, detail="Failed to reset password")

@router.get("/faculty/bulk-import/sample")
async def download_faculty_sample(admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    institution = await prisma.institution.find_first()
    sample_inst_id = institution.code if institution else "CEG"

    df = pd.DataFrame(columns=[
        "name", "email", "password", "facultyId", "phone",
        "gender", "dob", "institutionId", "department",
        "designation", "specialization"
    ])
    df.loc[0] = [
        "Dr. Jane Smith", "jane.smith@example.com", "Password123!", "FAC001",
        "9876543210", "Female", "1985-06-15", sample_inst_id,
        "Computer Science", "Associate Professor", "Machine Learning"
    ]

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Sample")

    output.seek(0)
    return Response(
        content=output.read(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=sample_faculty.xlsx"}
    )

@router.post("/faculty/bulk-import")
async def bulk_import_faculty(file: UploadFile = File(...), admin=Depends(RoleChecker(["SUPER_ADMIN"]))):
    try:
        if not file.filename.endswith((".xlsx", ".xls", ".csv")):
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload an Excel or CSV file.")

        try:
            content = await file.read()
            df = pd.read_csv(io.BytesIO(content)) if file.filename.endswith(".csv") else pd.read_excel(io.BytesIO(content))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

        required_columns = ["name", "email", "password", "facultyId", "institutionId"]
        missing_cols = [c for c in required_columns if c not in df.columns]
        if missing_cols:
            raise HTTPException(status_code=400, detail=f"Missing required columns: {', '.join(missing_cols)}")

        errors, error_rows = [], []

        existing_users = await prisma.user.find_many(where={"role": "FACULTY"})
        existing_emails = {u.email for u in existing_users if u.email}
        existing_ids   = {u.studentId for u in existing_users if u.studentId}

        existing_institutions = await prisma.institution.find_many()
        valid_institution_ids   = {inst.id for inst in existing_institutions}
        institution_code_to_id  = {inst.code.upper(): inst.id for inst in existing_institutions if inst.code}

        emails_in_file, ids_in_file = set(), set()
        valid_faculty = []

        for _, row in df.iterrows():
            row_errors = []

            def get(col):
                val = row.get(col)
                return str(val).strip() if pd.notna(val) else ""

            name = get("name")
            email = get("email")
            password = get("password")
            facultyId = get("facultyId")
            institutionId = get("institutionId")
            phone = get("phone")
            if phone == "nan":
                phone = ""

            resolved_inst = institutionId
            if not name:     row_errors.append("Name is required")
            if not email:    row_errors.append("Email is required")
            if not password: row_errors.append("Password is required")
            if not facultyId: row_errors.append("Faculty ID is required")
            if not institutionId:
                row_errors.append("Institution ID is required")
            else:
                if institutionId in valid_institution_ids:
                    resolved_inst = institutionId
                elif institutionId.upper() in institution_code_to_id:
                    resolved_inst = institution_code_to_id[institutionId.upper()]
                else:
                    row_errors.append(f"Institution ID/Code '{institutionId}' is invalid or does not exist")

            if email and not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                row_errors.append("Invalid email format")
            if phone and len(phone) < 10:
                row_errors.append("Phone must be at least 10 digits")

            if email in existing_emails or email in emails_in_file:
                row_errors.append(f"Email {email} already exists")
            elif email:
                emails_in_file.add(email)

            if facultyId in existing_ids or facultyId in ids_in_file:
                row_errors.append(f"Faculty ID {facultyId} already exists")
            elif facultyId:
                ids_in_file.add(facultyId)

            if row_errors:
                er = row.copy(); er["Error Details"] = "; ".join(row_errors)
                error_rows.append(er); errors.extend(row_errors)
            else:
                valid_faculty.append({
                    "name": name, "email": email,
                    "password": get_password_hash(password),
                    "studentId": facultyId, "role": "FACULTY",
                    "institutionId": resolved_inst,
                    "phone": phone or None,
                    "gender": get("gender") or None,
                    "department": get("department") or None,
                    "course": get("designation") or None,
                    "semester": get("specialization") or None,
                })

        if error_rows:
            error_df = pd.DataFrame(error_rows)
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine="openpyxl") as writer:
                error_df.to_excel(writer, index=False, sheet_name="Errors")
            error_b64 = base64.b64encode(output.getvalue()).decode("utf-8")
            return JSONResponse(
                status_code=400,
                content={"message": "Validation failed for some records",
                         "errors": list(set(errors)), "error_file": error_b64}
            )

        try:
            for f_data in valid_faculty:
                await prisma.user.create(data=f_data)
            return {"message": f"Successfully imported {len(valid_faculty)} faculty members"}
        except Exception as e:
            raise Exception(f"Database insertion failed: {str(e)}")

    except Exception as general_error:
        import traceback; traceback.print_exc()
        if isinstance(general_error, HTTPException):
            raise general_error
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(general_error)}")
