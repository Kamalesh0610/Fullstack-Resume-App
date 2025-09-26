FROM python:3.11-slim
WORKDIR /app
COPY . /app/backend
RUN pip install --no-cache-dir fastapi uvicorn[standard] redis passlib[bcrypt] python-jose pyjwt pydantic[email]
EXPOSE 8000
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
