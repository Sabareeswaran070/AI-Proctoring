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
