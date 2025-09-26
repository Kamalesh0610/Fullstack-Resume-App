import os
from redis.asyncio import Redis
import uuid
import json

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis = None

async def connect():
    global redis
    if not redis:
        redis = Redis.from_url(REDIS_URL, decode_responses=True)
    # ensure collections (no-op for redis)
    return redis

# User helpers
async def create_user(user: dict):
    uid = str(uuid.uuid4())
    user_record = {"id": uid, "email": user.get("email"), "password": user.get("password")}
    await redis.hset("user:"+uid, mapping=user_record)
    await redis.set("user:email:"+user_record["email"], uid)
    return uid

async def get_user(user_id: str):
    data = await redis.hgetall("user:"+user_id)
    return data or None

async def get_user_by_email(email: str):
    uid = await redis.get("user:email:"+email)
    if not uid:
        return None
    return await get_user(uid)

# Resume helpers (simple JSON storage)
async def create_resume(resume: dict):
    rid = str(uuid.uuid4())
    resume_record = {"id": rid, "owner_id": resume.get("owner_id"), "data": json.dumps(resume.get("data"))}
    await redis.hset("resume:"+rid, mapping=resume_record)
    # add to user's set
    await redis.sadd("resumes:owner:"+resume.get("owner_id"), rid)
    return rid

async def get_resume(rid: str):
    r = await redis.hgetall("resume:"+rid)
    if not r:
        return None
    r["data"] = json.loads(r["data"])
    return r

async def get_resumes_by_owner(owner_id: str):
    ids = await redis.smembers("resumes:owner:"+owner_id)
    out = []
    for rid in ids:
        r = await get_resume(rid)
        if r:
            out.append(r)
    return out

async def update_resume(rid: str, resume: dict):
    resume_record = {"id": rid, "owner_id": resume.get("owner_id"), "data": json.dumps(resume.get("data"))}
    await redis.hset("resume:"+rid, mapping=resume_record)
    return True

async def delete_resume(rid: str):
    r = await redis.hgetall("resume:"+rid)
    if not r:
        return False
    await redis.delete("resume:"+rid)
    await redis.srem("resumes:owner:"+r.get("owner_id"), rid)
    return True
