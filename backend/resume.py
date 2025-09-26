from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel
from backend import database, utils
from backend.auth import get_current_user

router = APIRouter()

class ResumeIn(BaseModel):
    title: str
    template: str = "modern"
    personal: dict
    education: List[dict] = []
    experience: List[dict] = []
    skills: List[str] = []

class ResumeOut(ResumeIn):
    id: str
    owner_id: str

@router.post("", response_model=ResumeOut)
async def create_resume(data: ResumeIn, current_user: dict = Depends(get_current_user)):
    resume = data.dict()
    resume_obj = {
        "owner_id": current_user.get("id"),
        "data": resume
    }
    rid = await database.create_resume(resume_obj)
    return {"id": rid, "owner_id": current_user.get("id"), **resume}

@router.get("", response_model=List[ResumeOut])
async def list_resumes(current_user: dict = Depends(get_current_user)):
    items = await database.get_resumes_by_owner(current_user.get("id"))
    out = []
    for r in items:
        out.append({
            "id": r.get("id"),
            "owner_id": r.get("owner_id"),
            **r.get("data")
        })
    return out

@router.put("/{resume_id}", response_model=ResumeOut)
async def update_resume(resume_id: str, data: ResumeIn, current_user: dict = Depends(get_current_user)):
    existing = await database.get_resume(resume_id)
    if not existing or existing.get("owner_id") != current_user.get("id"):
        raise HTTPException(status_code=404, detail="Resume not found")
    await database.update_resume(resume_id, {"owner_id": current_user.get("id"), "data": data.dict()})
    return {"id": resume_id, "owner_id": current_user.get("id"), **data.dict()}

@router.delete("/{resume_id}")
async def delete_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    existing = await database.get_resume(resume_id)
    if not existing or existing.get("owner_id") != current_user.get("id"):
        raise HTTPException(status_code=404, detail="Resume not found")
    await database.delete_resume(resume_id)
@router.get("/{resume_id}")
async def get_resume_public(resume_id: str):
    existing = await database.get_resume(resume_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Resume not found")
    data = existing.get("data")
    return data
    return {"detail": "Deleted"}
