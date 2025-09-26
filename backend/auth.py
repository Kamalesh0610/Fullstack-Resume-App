from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from backend import database, utils
from typing import Optional
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

class SignupIn(BaseModel):
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr

async def get_current_user(token: str = Depends(utils.oauth2_scheme)):
    payload = utils.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await database.get_user(payload.get("sub"))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/signup", response_model=UserOut)
async def signup(data: SignupIn):
    existing = await database.get_user_by_email(data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = pwd_context.hash(data.password)
    user = {"email": data.email, "password": hashed}
    user_id = await database.create_user(user)
    return {"id": user_id, "email": data.email}

@router.post("/login")
async def login(data: LoginIn):
    user = await database.get_user_by_email(data.email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not pwd_context.verify(data.password, user.get("password")):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = utils.create_access_token(sub=user.get("id"))
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    return {"id": current_user.get("id"), "email": current_user.get("email")}

# Demo user seeding
async def seed_demo_user():
    demo_email = "hire-me@anshumat.org"
    demo_password = "HireMe@2025!"
    existing = await database.get_user_by_email(demo_email)
    if existing:
        return
    hashed = pwd_context.hash(demo_password)
    await database.create_user({"email": demo_email, "password": hashed})
    print("Seeded demo user:", demo_email)
