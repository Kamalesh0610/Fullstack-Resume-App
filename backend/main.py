from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend import auth, resume, database

app = FastAPI(title="AI Resume Builder - Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(resume.router, prefix="/resume", tags=["resume"])

@app.get("/")
async def root():
    return {"message": "AI Resume Builder API", "docs": "/docs"}

@app.on_event("startup")
async def startup_event():
    await database.connect()
    await auth.seed_demo_user()
