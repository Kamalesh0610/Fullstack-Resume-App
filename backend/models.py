from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class ResumeBase(BaseModel):
    title: str
    template: str = "modern"
    personal: Dict[str, Any]
    education: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []
    skills: List[str] = []
