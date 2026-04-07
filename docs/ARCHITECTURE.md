# System Architecture

Scholar is a three-tier web application with separate backend API, frontend SPA, and cloud authentication.

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                              │
│  (React SPA on Vercel - https://scholr.vercel.app)           │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST + JWT
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API on Render                           │
│  (Django REST - https://backend.onrender.com)               │
│  • Authentication & JWT validation                          │
│  • Post/comment CRUD                                        │
│  • Voting & reporting logic                                 │
│  • Role-based access control                                │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL + HTTP
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐ ┌──────────┐ ┌──────────────┐
   │PostgreSQL│ │Supabase  │ │Supabase      │
   │(Render)  │ │Auth      │ │Storage       │
   │          │ │(OAuth+   │ │(Profile pics)│
   │• Posts   │ │Admin API)│ │              │
   │• Users   │ └──────────┘ └──────────────┘
   │• Comments│
   │• Votes   │
   └─────────┘
```

## Core Components

### Frontend (React + Vite)
**Location:** `frontend/src/`

- **Pages** (`pages/`): Route components (Home, PostDetail, Profile, etc.)
- **API Client** (`api.js`): Centralized REST API wrapper with error handling
- **State** (`App.jsx`): React hooks for user, posts, topics, moderation
- **Styling** (`index.css`): Tailwind CSS + custom utilities

**Tech Details:**
- React Query for client-side caching (2-min stale time)
- Vite for instant module reloading & optimized build
- Supabase JS client for OAuth & storage
- LucideReact for icons

### Backend (Django REST)
**Location:** `backend/`

**Apps:**
- `accounts/` — User auth, profile CRUD, role management
- `posts/` — Post/topic CRUD, feed filtering
- `interactions/` — Votes, comments, reports

**Key Features:**
- Custom `AuthToken` for session management (not Django session)
- OAuth callback that upsertes Supabase users into local DB
- Role-based permissions via `get_effective_role()`
- Supabase Admin API calls for user deletion

### Database (PostgreSQL)

**Tables:**
- `accounts_platformuser` — User accounts with roles, avatar URL, skills, links
- `posts_post` — Posts with soft-delete flag
- `posts_topic` — Topic hierarchy (parent_id allows nesting)
- `interactions_vote` — Upvote/downvote records (unique on user+post)
- `interactions_comment` — Comments on posts
- `interactions_report` — Reports on posts or users
- `accounts_authtoken` — Session tokens with expiry

**Indices:**
- `Post(-created_at, is_deleted)` — Feed sorting
- `Post(author, -created_at)` — User profile feed
- `Vote(post_id)` — Vote aggregation for scoring
- `Report(-created_at, status)` — Moderation dashboard

### Authentication Flow

#### OAuth (Recommended for Production)
```
1. User clicks "Login with Google/GitHub"
2. Frontend redirects to Supabase OAuth endpoint
3. Supabase redirects to /auth/callback with access_token
4. Frontend sends token to /accounts/oauth/callback/
5. Backend calls Supabase Admin API to fetch user profile
6. Backend creates/updates PlatformUser in local DB
7. Backend returns AuthToken + user profile
8. Frontend stores token in localStorage
```

#### Local Auth (Dev Only)
```
1. User submits username/password to /accounts/login/
2. Backend validates password_hash with bcrypt
3. Backend issues AuthToken
4. Frontend stores token in localStorage
```

**Admin Debug Mode (Settings.DEBUG=True):**
- Default login: username=`admin`, password=`admin`
- Creates admin account if it doesn't exist

### Request/Response Format

**All endpoints return JSON:**
```json
{
  "id": 123,
  "username": "alice",
  "email": "alice@university.edu",
  "role": "Verified User",
  "is_active": true,
  "created_at": "2026-04-07T10:00:00Z"
}
```

**Error responses:**
```json
{
  "detail": "User not found.",
  "code": "user_not_found"
}
```

**Pagination (posts endpoint):**
```json
{
  "results": [...],
  "count": 127,
  "page": 1,
  "total_pages": 7
}
```

### Data Flow Example: Creating a Post

```
Frontend                          Backend               Database
---------                         -------               --------
User fills form
↓
API.createPost() ────POST───→ posts_collection()
                     auth header    ↓
                               Validate role
                               Check user
                                   ↓
                          Create Post row ────INSERT→ Post
                               ↓
                           Fetch related
                          (author, topic)
                               ↓
                          Return as dict
JSON response ←────────────   ↓
↓          setPosts()
Re-render            (add to feed)
```

### Error Handling

**Role-based rejection:**
- General User tries to post → 403 Forbidden
- General User tries to vote → 403 Not allowed

**Authentication failures:**
- Missing/expired token → 401 Authentication required
- Invalid signature → 401 Authentication required

**Resource not found:**
- Post doesn't exist → 404 Post not found
- User is inactive → 404 User not found

**Server errors:**
- Supabase down → 502 Failed to reach Supabase
- Service role key wrong → 500 Supabase rejected the admin delete request

## Performance Strategy

### Backend
1. **Indices** — Fast filtering (70–90% query time reduction)
2. **Pagination** — 20 results/page instead of all
3. **Bulk prefetch** — 3 queries vs N+1 for votes on feed
4. **Caching** — In-memory cache ready for expensive endpoints

### Frontend
1. **React Query** — 2-min cache prevents duplicate API calls
2. **Code splitting** — Each page lazy-loads via Vite
3. **Asset hashing** — 1-year cache via Vercel headers
4. **Compression** — Vite gzips CSS/JS in build

### Infrastructure
1. **Keep-alive cron** — Render dyno stays warm (0s cold start)
2. **CDN** — Vercel CDN for fast asset delivery
3. **Database pooling** — Future: PgBouncer on Render

## Deployment Architecture

```
Local Dev                  Git Push            Production
---------                  --------            ----------
Frontend dev server (3000) ────→ GitHub ────→ Vercel (auto-deploy)
                                  │
                                  ├─→ Render backend (auto-deploy)
                                  │
                                  └─→ Update database schema
                                     (migrations auto-run)

Keep-alive service:
cron-job.org ──ping every 10 min──→ https://backend.onrender.com/api/
```

## Security Considerations

### Authentication
- JWT tokens signed with `SUPABASE_JWT_SECRET`
- Tokens expire after time (checked in backend)
- Supabase service role key never exposed to frontend

### Authorization
- All endpoints check `get_authenticated_user(request)`
- Role checks via `get_effective_role(request, actor)`
- Users can only edit their own profiles (except admins)

### Data Protection
- Passwords hashed with bcrypt (local auth only)
- Soft deletes preserve data (not hard-deleted unless admin choice)
- Email verification flag prevents unverified users from voting

### CSRF
- All views decorated with `@csrf_exempt` (using JWT instead of session-based CSRF)

## Extensibility

### Add a New Model
1. Define in `models.py`
2. Create migration: `python manage.py makemigrations app_name`
3. Apply: `python manage.py migrate`
4. Add views and routes
5. Register in admin if needed

### Add a New Role
1. Add to `PlatformUser.ROLE_CHOICES`
2. Define permissions in `get_allowed_role_switch_targets()`
3. Check role in endpoints: `if actor_role == PlatformUser.ROLE_NEWROLE:`

### Add a Feature
1. Backend: Create model + view + route
2. Frontend: Create page component + API helper
3. Database: Add fields/tables as needed
4. Deployment: Run migrations on Render

---

**Diagram Legend:**
- `→` = Request/data flow
- `←` = Response
- `↓` = Sequential operation

**Last Updated:** April 7, 2026
