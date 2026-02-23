# AcademiaHub | Scholar | ..

An academic social platform that combines the best of Reddit's topic-based discussions, LinkedIn's professional profiles, and peer-regulated content quality. Built for scholars to share knowledge, connect, and maintain academic rigor.

---

## Basic Features

### User Management
* Signup / Login (JWT authentication)
* LinkedIn-style profile:
  * Name, bio
  * Institution
  * Academic interests (topics)
* User roles: `user`, `admin` and `dev`

### Content System
* **Topics & Subtopics** – Hierarchical tree structure (like subreddits)
* **Blog Posts** (text only for MVP):
  * Title
  * Markdown content
  * References (required list of URLs)
* Upvote / Downvote system

### Moderation
* **User reporting** – Report posts as non-academic or inaccurate
* **Admin capabilities:**
  * Delete post
  * Warn user
  * Ban user
  * Ignore report

### Feed
* Reddit-like feed with sorting:
  * Hot (trending)
  * New (chronological)

**Not in MVP:** DMs, follows, notifications, AI moderation, videos, images

---

## Two-Week Development Plan

### Backend Development (Week 1: Foundations)

**Day 1: Project Setup**
- FastAPI setup
- PostgreSQL database
- SQLAlchemy + Alembic migrations
- JWT authentication
- User model + roles

**Day 2: Profiles & Topics**
- Profile model (name, bio, institution)
- Topic & subtopic models (tree structure)
- Topic CRUD endpoints (admin only)

**Day 3: Content Creation**
- Post model with markdown support
- Create / edit / delete post endpoints
- Reference model and validation

**Day 4: Engagement**
- Voting system (upvote/downvote)
- Feed endpoints with sorting:
  - `/posts?sort=new`
  - `/posts?sort=hot`

**Day 5: Moderation System**
- Report model
- Admin action endpoints:
  - Warn user
  - Ban user
  - Delete post
  - Ignore report

### Backend Development (Week 2: Hardening)

**Day 6: Security & Permissions**
- Permission guards
- Soft deletes
- Rate limiting (basic)

**Day 7: Performance**
- Database indexing
- Query optimization
- Pagination

**Day 8: Reliability**
- Error handling
- Edge cases (banned users, deleted posts)
- Input validation

**Day 9: Documentation**
- API documentation (auto-generated)
- Seed data for testing
- README for API

**Day 10: Deployment**
- Dockerization
- Basic load testing
- Deployment setup

### Frontend Development (Week 1)
- Authentication pages (login/signup)
- Profile page (view/edit)
- Topic browsing interface
- Post creation and reading
- Markdown rendering

### Frontend Development (Week 2)
- Feed with sorting controls
- Voting UI
- Report button and flow
- Admin dashboard
- Mobile-responsive design

---

## Backend Architecture

### Technology Stack
* **FastAPI** – Async Python web framework
* **PostgreSQL** – Relational database
* **Redis** – Caching (optional for MVP, recommended for scale)
* **Gunicorn + Uvicorn** – Production server
* **Docker** – Containerization

### Data Model (Core Tables)

```
User
├── id (PK)
├── email (unique)
├── hashed_password
├── role (user/admin)
├── status (active/warned/banned)
└── created_at

Profile
├── user_id (FK → User, PK)
├── name
├── bio
├── institution
└── interests (array or relation)

Topic
├── id (PK)
├── name
├── parent_id (FK → Topic, nullable)
└── created_at

Post
├── id (PK)
├── author_id (FK → User)
├── topic_id (FK → Topic)
├── title
├── content_md (markdown)
├── is_deleted (soft delete)
└── created_at

Reference
├── id (PK)
├── post_id (FK → Post)
└── url

Vote
├── user_id (FK → User)
├── post_id (FK → Post)
├── value (+1 / -1)
└── PRIMARY KEY (user_id, post_id)

Report
├── id (PK)
├── post_id (FK → Post)
├── reporter_id (FK → User)
├── reason
├── status (pending/ignored/actioned)
└── created_at
```

### Critical Indexes
```sql
-- Performance essentials
CREATE INDEX idx_post_topic ON Post(topic_id);
CREATE INDEX idx_post_created ON Post(created_at DESC);
CREATE INDEX idx_vote_post ON Vote(post_id);
CREATE INDEX idx_post_author ON Post(author_id);
CREATE INDEX idx_report_status ON Report(status);
```

---

### Bottlenecks (and solutions)

❌ **N+1 Queries** → Use joins and eager loading  
❌ **Missing Indexes** → Index foreign keys and sort columns  
❌ **Fat Responses** → Paginate everything  
❌ **Stateful Auth** → Use JWT (stateless)  

### Scaling Path (Future)

1. **Stateless API** (already yes with JWT)
2. **Redis caching** for:
   - Hot posts
   - Vote counts
   - Feed rankings
3. **PostgreSQL read replicas** for heavy read traffic
4. **Horizontal scaling** – Add more API instances (FastAPI is stateless)
5. **Split services** if needed (posts, auth, moderation as separate services)

**Key insight:** Your bottleneck will be database design and query optimization, NOT Python.

---

## Development Setup

### Backend Prerequisites
* Python 3.10+
* PostgreSQL 14+
* Git

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start development server
uvicorn main:app --reload --port 8000
```

Backend API: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend: `http://localhost:3000`

---

## Project Structure

```
academiahub/
│
├── backend/
│   ├── main.py              # FastAPI app entry
│   ├── requirements.txt
│   ├── alembic.ini
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py        # Environment config
│   │   │
│   │   ├── models/          # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── profile.py
│   │   │   ├── topic.py
│   │   │   ├── post.py
│   │   │   ├── vote.py
│   │   │   └── report.py
│   │   │
│   │   ├── schemas/         # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── post.py
│   │   │   └── ...
│   │   │
│   │   ├── api/             # Route handlers
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── posts.py
│   │   │   ├── topics.py
│   │   │   ├── votes.py
│   │   │   └── admin.py
│   │   │
│   │   ├── services/        # Business logic
│   │   │   ├── auth.py
│   │   │   ├── posts.py
│   │   │   └── ranking.py   # Hot/new algorithms
│   │   │
│   │   ├── db/
│   │   │   ├── database.py  # DB connection
│   │   │   └── session.py
│   │   │
│   │   └── utils/
│   │       ├── security.py  # JWT, password hashing
│   │       └── pagination.py
│   │
│   └── alembic/             # Migrations
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── post/
│   │   │   ├── profile/
│   │   │   └── admin/
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── Post.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Admin.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js       # API client
│   │   │
│   │   └── App.jsx
│   │
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Team Roles

### Backend Developer (Gitaansh)
- API design and implementation
- Database design and optimization
- Authentication and authorization
- Moderation system
- Performance and scalability

### Frontend Developer (Satyam)
- UI/UX design
- Component implementation
- API integration
- Responsive design
- Admin dashboard

---

## Future Enhancements

### Phase 2 (Post-MVP)
- Video posts (with minimum duration requirements)
- Image support
- Enhanced markdown (LaTeX for equations)
- Topic subscription
- User achievements/reputation

### Phase 3 (Advanced)
- AI-assisted moderation
- Recommendation system
- Advanced analytics
- Direct messaging
- Collaborative papers/projects
- Export to citation formats

---

## Next Steps

### Immediate Actions
1. Set up FastAPI project skeleton
2. Design exact API endpoints
3. Create database migrations
4. Implement authentication flow
5. Build topic/subtopic hierarchy

### Questions to Answer
- Hot post ranking formula (implement Reddit-style?)
- Reference validation (check URL validity?)
- User warning system (how many warnings before ban?)
- Soft delete behavior (hide from users but keep in DB?)

---

## Technical Decisions Made

✅ **FastAPI over Django** – Better async support, faster for API-only  
✅ **PostgreSQL** – ACID compliance, good for relational data  
✅ **JWT auth** – Stateless, scales horizontally  
✅ **Soft deletes** – Preserve data for moderation review  
✅ **Markdown only** – Keep MVP simple  

---

## Resources

### Learning Materials
- FastAPI Official Docs: https://fastapi.tiangolo.com/
- SQLAlchemy ORM: https://docs.sqlalchemy.org/
- PostgreSQL Indexing: https://www.postgresql.org/docs/current/indexes.html

### Similar Projects (for inspiration)
- Reddit (open source): https://github.com/reddit-archive/reddit
- Lobsters: https://github.com/lobsters/lobsters
- Hacker News API: https://github.com/HackerNews/API

---
