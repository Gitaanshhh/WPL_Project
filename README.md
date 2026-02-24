# AcademiaHub

An academic social platform combining Reddit's topic-based discussions, LinkedIn's professional profiles, and peer-regulated content quality.

## Quick Start

### Test Login Credentials

| Username | Password | Role           |
|----------|----------|----------------|
| `admin`  | `admin`  | Administrator  |
| `mod`    | `mod`    | Moderator      |
| `dev`    | `dev`    | Developer      |
| `userV`  | `userV`  | Verified User  |
| `user`   | `user`   | General User   |

### Development Setup

**Frontend (Terminal 1):**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

**Backend (Terminal 2):**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows | source venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
uvicorn app.main:app --reload
# Runs on http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### MongoDB Atlas Setup

1. Create account at https://cloud.mongodb.com/
2. Create a new cluster (free M0 tier)
3. Create database user (Database Access)
4. Whitelist IP address (Network Access - allow from anywhere: 0.0.0.0/0)
5. Get connection string: Clusters > Connect > Connect your application
6. Update `backend/.env`:
```env
MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
DATABASE_NAME=academiahub
SECRET_KEY=your-secret-key-here
```

---

## Core Features

**User Management:**
* Role-based access control (5 roles)
* JWT authentication
* User profiles with institution and interests

**Content System:**
* Topics and subtopics (hierarchical)
* Academic posts with markdown and references
* Voting system

**Moderation:**
* User reporting
* Admin tools (delete, warn, ban)
* Content quality control

**Feed:**
* Sorting (Hot/New)
* Minimal, academic-focused UI

---

## Technology Stack

**Frontend:**
* React 18 + Vite
* React Router
* CSS3 (custom styling)

**Backend:**
* FastAPI (Python)
* Uvicorn (ASGI server)
* Planned: PostgreSQL + SQLAlchemy

**Development:**
* Git version control
* Hot reload for both frontend and backend

---
## 🗄 Planned Database Schema

**Collections:**

```javascript
// users
{
  _id: ObjectId,
  email: String (unique),
  hashed_password: String,
  name: String,
  institution: String,
  bio: String,
  role: Enum (General User, Verified User, Moderator, Developer, Administrator),
  status: Enum (active, warned, banned),
  created_at: DateTime
}

// posts
{
  _id: ObjectId,
  author_id: String,
  topic: String,
  title: String,
  content: String (markdown),
  references: String,
  is_deleted: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}

// topics
{
  _id: ObjectId,
  name: String,
  parent_id: String (nullable),
  created_at: DateTime
}

// votes
{
  _id: ObjectId,
  user_id: String,
  post_id: String,
  value: Number (+1/-1)
}

// reports
{
  _id: ObjectId,
  post_id: String,
  reporter_id: String,
  reason: String,
  status: Enum (pending, ignored, actioned),
  created_at: DateTime
}
```

---

## API Endpoints

**Current:**
* GET `/api/posts` - Get all posts
* GET `/api/posts/{id}` - Get specific post
* POST `/api/posts` - Create post
* PUT `/api/posts/{id}` - Update post
* DELETE `/api/posts/{id}` - Delete post
* GET `/api/health` - Health check

**Planned:**
* POST `/api/auth/login` - User login
* POST `/api/auth/signup` - User registration
* GET `/api/users/{id}` - Get user profile
* POST `/api/votes` - Vote on post
* POST `/api/reports` - Report post
* GET `/api/topics` - Get all topics

---

## Development Notes

**Frontend runs separately during development:**
* Frontend: `http://localhost:5173` (Vite dev server)
* Backend: `http://localhost:8000` (FastAPI)
* CORS enabled for cross-origin requests

**Database:**
* MongoDB Atlas cloud database
* Motor async driver for FastAPI
* Pydantic schemas for validation

**Testing:**
* Interactive API docs at `/docs`

---

## Team

**Backend:** Gitaansh  
**Frontend:** Satyam

---

## Current Status

**In Progress:**
- Backend API development
- Database integration
- Authentication endpoints
- Full CRUD operations

**Planned:**
- Real-time voting system
- User profiles and settings
- Advanced moderation tools
- Feed sorting algorithms
- Image and video support

---

## Key Features by Role

| Feature | General User | Verified User | Moderator | Developer | Administrator |
|---------|--------------|---------------|-----------|-----------|---------------|
| View posts | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create posts | ❌ | ✅ | ✅ | ✅ | ✅ |
| Vote on posts | ❌ | ✅ | ✅ | ✅ | ✅ |
| Report posts | ❌ | ✅ | ✅ | ✅ | ✅ |
| Delete posts | ❌ | Own only | Any | Any | Any |
| Warn users | ❌ | ❌ | ✅ | ✅ | ✅ |
| Ban users | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage topics | ❌ | ❌ | ❌ | ✅ | ✅ |
| System config | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## Resources

* [FastAPI Documentation](https://fastapi.tiangolo.com/)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* [Motor (Async MongoDB)](https://motor.readthedocs.io/)
* [React Documentation](https://react.dev/)
* [Vite Documentation](https://vitejs.dev/)

---

## License

This project is in development. License TBD.