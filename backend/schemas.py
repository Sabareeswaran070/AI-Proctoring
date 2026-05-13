from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

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

class FacultyCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    facultyId: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[date] = None
    institutionId: str
    department: Optional[str] = None
    designation: Optional[str] = None
    specialization: Optional[str] = None

class FacultyUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    facultyId: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[date] = None
    institutionId: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    specialization: Optional[str] = None
    status: Optional[str] = None

class DepartmentCreate(BaseModel):
    name: str
    code: Optional[str] = None
    hodId: Optional[str] = None

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    hodId: Optional[str] = None

class InstitutionCreate(BaseModel):
    name: str
    code: str
    type: Optional[str] = None
    affiliation: Optional[str] = None
    accreditation: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    plan: Optional[str] = "BASIC"
    expiryDate: Optional[date] = None

class InstitutionUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    type: Optional[str] = None
    affiliation: Optional[str] = None
    accreditation: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    status: Optional[str] = None
    plan: Optional[str] = None
    expiryDate: Optional[date] = None
