from fastapi import APIRouter, Depends, HTTPException, status, Request
from datetime import datetime, timedelta
from core.db import prisma
from core.security import (
    create_access_token, 
    verify_password, 
    get_password_hash,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from schemas import UserLogin, Token, ProfileUpdate, PasswordChange
from core.limiter import limiter

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
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

@router.get("/me")
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
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/profile")
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
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@router.post("/change-password")
async def change_password(data: PasswordChange, current_user=Depends(get_current_user)):
    user = await prisma.user.find_unique(where={"id": current_user.id})
    if not verify_password(data.oldPassword, user.password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    hashed_password = get_password_hash(data.newPassword)
    await prisma.user.update(
        where={"id": current_user.id},
        data={"password": hashed_password}
    )
    return {"message": "Password updated successfully"}
