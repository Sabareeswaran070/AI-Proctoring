from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from core.db import prisma
from core.security import get_current_user
from schemas import InstitutionCreate, InstitutionUpdate, BulkDeleteRequest, DepartmentCreate, DepartmentUpdate
from datetime import datetime

router = APIRouter(prefix="/api/super-admin/institutions", tags=["Institutions"])

async def get_institution_relation_counts(institution_id: str) -> dict[str, int]:
    relation_counts: dict[str, int] = {}

    for table, label in [
        ("User", "users"),
        ("Exam", "exams"),
        ("Department", "departments"),
        ("Announcement", "announcements"),
    ]:
        result = await prisma.query_raw(
            f'SELECT COUNT(*)::int AS count FROM "{table}" WHERE "institutionId" = $1',
            institution_id,
        )
        relation_counts[label] = int(result[0]["count"]) if result else 0

    return relation_counts

@router.get("/")
async def get_all_institutions(
    status: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    where = {}
    if status:
        where["status"] = status
    if search:
        where["OR"] = [
            {"name": {"contains": search, "mode": "insensitive"}},
            {"code": {"contains": search, "mode": "insensitive"}},
            {"city": {"contains": search, "mode": "insensitive"}}
        ]
    
    institutions = await prisma.institution.find_many(
        where=where,
        order={"createdAt": "desc"}
    )

    enriched_institutions = []
    for institution in institutions:
        counts = await get_institution_relation_counts(institution.id)
        institution_data = institution.model_dump()
        institution_data["_count"] = counts
        enriched_institutions.append(institution_data)

    return enriched_institutions

@router.post("")
@router.post("/")
async def create_institution(
    data: InstitutionCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    try:
        institution = await prisma.institution.create(
            data={
                **data.dict(),
                "expiryDate": datetime.combine(data.expiryDate, datetime.min.time()) if data.expiryDate else None
            }
        )
        return institution
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{id}")
async def get_institution_detail(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    institution = await prisma.institution.find_unique(
        where={"id": id},
        include={
            "departments": True,
        }
    )
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")

    institution_data = institution.model_dump()
    counts = await get_institution_relation_counts(id)
    institution_data["_count"] = {
        "users": counts["users"],
        "exams": counts["exams"],
    }
    return institution_data

@router.put("/{id}")
async def update_institution(
    id: str,
    data: InstitutionUpdate,
    current_user: dict = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if "expiryDate" in update_data and update_data["expiryDate"]:
        update_data["expiryDate"] = datetime.combine(update_data["expiryDate"], datetime.min.time())
        
    try:
        institution = await prisma.institution.update(
            where={"id": id},
            data=update_data
        )
        return institution
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{id}")
async def delete_institution(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")
    try:
        institution = await prisma.institution.find_unique(where={"id": id})
        if not institution:
            raise HTTPException(status_code=404, detail="Institution not found")

        relation_counts = await get_institution_relation_counts(id)
        if any(relation_counts.values()):
            linked_summary = ", ".join(
                f"{name}: {count}"
                for name, count in relation_counts.items()
                if count > 0
            )
            raise HTTPException(
                status_code=400,
                detail=f"Cannot delete institution because linked records still exist ({linked_summary}).",
            )

        await prisma.institution.delete(where={"id": id})
        return {"message": "Institution deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete institution: {str(e)}")

# ─── Department Endpoints ────────────────────────────────────────────────────

@router.get("/{institution_id}/departments")
async def list_departments(
    institution_id: str,
    current_user: dict = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")

    institution = await prisma.institution.find_unique(where={"id": institution_id})
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")

    departments = await prisma.department.find_many(
        where={"institutionId": institution_id},
        include={"hod": True},
        order={"createdAt": "asc"}
    )

    result = []
    for dept in departments:
        dept_data = dept.model_dump()
        if dept.hod:
            dept_data["hod"] = {"id": dept.hod.id, "name": dept.hod.name}
        else:
            dept_data["hod"] = None
        result.append(dept_data)

    return result


@router.post("/{institution_id}/departments")
async def create_department(
    institution_id: str,
    data: DepartmentCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")

    institution = await prisma.institution.find_unique(where={"id": institution_id})
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")

    # Check unique name within institution
    existing = await prisma.department.find_first(
        where={"name": data.name, "institutionId": institution_id}
    )
    if existing:
        raise HTTPException(status_code=400, detail=f"A department named '{data.name}' already exists in this institution.")

    create_data: dict = {
        "name": data.name,
        "institutionId": institution_id,
    }
    if data.code:
        create_data["code"] = data.code
    if data.hodId:
        # Validate HOD user exists
        hod_user = await prisma.user.find_unique(where={"id": data.hodId})
        if not hod_user:
            raise HTTPException(status_code=404, detail="HOD user not found")
        create_data["hodId"] = data.hodId

    try:
        department = await prisma.department.create(
            data=create_data,
            include={"hod": True}
        )
        dept_data = department.model_dump()
        if department.hod:
            dept_data["hod"] = {"id": department.hod.id, "name": department.hod.name}
        else:
            dept_data["hod"] = None
        return dept_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{institution_id}/departments/{dept_id}")
async def delete_department(
    institution_id: str,
    dept_id: str,
    current_user: dict = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")

    department = await prisma.department.find_first(
        where={"id": dept_id, "institutionId": institution_id}
    )
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")

    try:
        await prisma.department.delete(where={"id": dept_id})
        return {"message": "Department deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete department: {str(e)}")


# ─── Bulk Delete Institutions ─────────────────────────────────────────────────

@router.post("/bulk-delete")
async def bulk_delete_institutions(
    data: BulkDeleteRequest,
    current_user: dict = Depends(get_current_user)
):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await prisma.institution.delete_many(where={"id": {"in": data.ids}})
    return {"message": f"{len(data.ids)} institutions deleted"}
