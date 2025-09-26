# AI Resume Builder

A full-stack resume builder application with secure authentication, multiple resume management, and PDF export functionality.

## Features

- **Secure Authentication**: Email/password signup and login
- **Resume Builder**: Create and edit resumes with personal details, education, experience, and skills
- **Multiple Templates**: Modern, Classic, and Minimal resume templates
- **Rich Text Editing**: HTML-based description editing for experience sections
- **PDF Export**: Download resumes as PDF with proper formatting
- **Dashboard**: Manage multiple resume versions
- **Public Sharing**: Share resumes via public links
- **Profile Pictures**: Upload and display profile pictures

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Quill for rich text editing
- html2canvas and jsPDF for PDF generation

### Backend
- FastAPI (Python)
- Redis for data storage
- JWT for authentication
- PassLib for password hashing

### Infrastructure
- Docker & Docker Compose
- Redis as database

## Tech Stack Justification

I chose this tech stack because:
- **React + TypeScript**: Provides type safety and excellent developer experience for building complex UIs
- **FastAPI**: Modern, fast Python web framework with automatic API documentation
- **Redis**: Lightweight, fast NoSQL database perfect for this use case with JSON storage capabilities
- **Docker**: Ensures consistent deployment across environments
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

This stack provides a good balance of performance, developer productivity, and scalability for a resume builder application.

## Demo Credentials

For evaluation purposes, a demo user is seeded:
- **Email**: hire-me@anshumat.org
- **Password**: HireMe@2025!

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kamalesh0610/Fullstack-Resume-App.git
   cd ai-resume-builder
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup (Alternative)

If you prefer not to use Docker:

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   redis-server &
   uvicorn backend.main:app --reload
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get token
- `GET /auth/me` - Get current user profile

### Resume Management
- `POST /resume` - Create new resume
- `GET /resume` - Get all user resumes
- `PUT /resume/{id}` - Update resume
- `DELETE /resume/{id}` - Delete resume
- `GET /resume/{id}` - Get public resume (no auth required)

## Project Structure

```
/frontend          # React frontend
  /src
    /api.ts        # API service functions
    /components    # Reusable UI components
    /pages         # Page components
  /public          # Static assets

/backend           # FastAPI backend
  /auth.py         # Authentication endpoints
  /resume.py       # Resume CRUD endpoints
  /database.py     # Redis database operations
  /main.py         # FastAPI app setup
  /models.py       # Pydantic models
  /utils.py        # JWT utilities

docker-compose.yml # Docker orchestration
```

## Development

### Adding New Features
1. Backend changes: Modify FastAPI routes and database operations
2. Frontend changes: Update React components and API calls
3. Test thoroughly with the demo user

### Environment Variables
- `REDIS_URL`: Redis connection URL (default: redis://localhost:6379/0)
- `JWT_SECRET`: JWT signing secret (default: change-this-secret)
- `VITE_API_URL`: Frontend API base URL (default: http://localhost:8000)

## Deployment

The application is containerized and can be deployed using Docker Compose. For production:

1. Update environment variables for security
2. Configure proper CORS origins
3. Set up reverse proxy (nginx) for production
4. Use managed Redis service
5. Implement proper logging and monitoring
