# Database Schema & Query Guide

Scholar uses PostgreSQL in production (Render) and SQLite in local development. All data models defined in Django ORM.

## Database Diagram

```
┌─────────────────────────────────────────────┐
│         accounts_platformuser               │
├─────────────────────────────────────────────┤
│ id (pk) [indexed]                           │
│ username (str, unique)                      │
│ email (str, unique)                         │
│ password_hash (str, nullable)               │
│ email_verified (bool)                       │
│ full_name (str)                             │
│ bio (text)                                  │
│ profile_picture (URL)                       │
│ role (ADMIN|DEV|MOD|VERIFIED|GENERAL)      │
│ is_active (bool) [indexed]                  │
│ supabase_id (UUID, nullable)                │
│ created_at (datetime) [indexed]             │
│ institution, tagline, phone_number, etc.    │
└─────────────────────────────────────────────┘
         ▲ 1            ▲ 1            ▲ 1
         │              │              │
         │ author       │ reporter     │ reported_user
         │              │              │
    ┌────┴──────┐  ┌────┴──────────┐  │
    │            │  │               │  │
┌─────────┐ ┌─────────────┐ ┌─────────────────┐
│ posts   │ │ votes       │ │ interactions    │
│ post    │ │ comment     │ │ report          │
└─────────┘ └─────────────┘ └─────────────────┘

    │                    │ topic  └─────────┐
    │                    │                  │
    └────────────┬───────┘         ┌─────────────┐
                 │                 │ posts_topic │
                 └────────┬────────►└─────────────┘
                parent_id ▲ (self-reference)
```

## Tables & Fields

### accounts_platformuser

**Primary Key:** `id` (Auto-increment integer)

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| id | INTEGER | PK, AUTO | |
| username | VARCHAR(150) | UNIQUE, NOT NULL | |
| email | VARCHAR(254) | UNIQUE, NOT NULL | |
| password_hash | VARCHAR(255) | NULL | Bcrypt hash or NULL (OAuth users) |
| email_verified | BOOLEAN | DEFAULT False | Set True after email verification |
| full_name | VARCHAR(255) | | Extracted from Supabase metadata |
| institution | VARCHAR(255) | | Optional |
| bio | TEXT | | User biography |
| profile_picture | VARCHAR(500) | | URL from Supabase Storage |
| role | VARCHAR(20) | DEFAULT 'General User' | Admin/Dev/Mod/Verified/General |
| is_active | BOOLEAN | DEFAULT True | False = banned (soft delete) |
| supabase_id | VARCHAR(36) | UNIQUE, NULL | UUID from Supabase Auth |
| created_at | DATETIME | AUTO_NOW_ADD | |
| tagline | VARCHAR(255) | | |
| phone_number | VARCHAR(20) | | |
| skills | JSON | | Array of skill tags |
| links | JSON | | Dict of {platform: url} |

**Indices:**
- `(id)` — Primary key
- `(username)` — Unique, fast lookup
- `(email)` — Unique, fast lookup
- `(is_active)` — Filter active/inactive users

---

### posts_post

**Primary Key:** `id` (Auto-increment integer)

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| id | INTEGER | PK | |
| author_id | INTEGER | FK → PlatformUser, CASCADE | **Indexed** |
| topic_id | INTEGER | FK → Topic, SET_NULL, NULL | **Indexed** |
| title | VARCHAR(255) | NOT NULL | |
| content | TEXT | NOT NULL | |
| references | TEXT | | Optional URLs/citations |
| is_deleted | BOOLEAN | DEFAULT False | **Indexed**, soft delete flag |
| created_at | DATETIME | AUTO_NOW_ADD, **INDEXED** | Descending index for feed |
| updated_at | DATETIME | AUTO_NOW | |

**Indices:**
- `(-created_at, is_deleted)` — Feed sorting (newest first, skip deleted)
- `(author_id, -created_at)` — Profile feed
- Single column: `(author_id)`, `(topic_id)`, `(is_deleted)` for JOINs

**Constraints:**
- Cascading delete on author (remove user → remove posts)
- SET_NULL on topic (delete topic → is_deleted stays False but topic_id becomes NULL)

---

### posts_topic

**Primary Key:** `id` (Auto-increment integer)

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| id | INTEGER | PK | |
| name | VARCHAR(120) | UNIQUE, NOT NULL, **INDEXED** | Topic name |
| parent_id | INTEGER | FK → Topic self-ref, SET_NULL, NULL | Hierarchical (e.g., ML is child of CS) |
| created_at | DATETIME | AUTO_NOW_ADD | |

**Indices:**
- `(name)` — Unique, fast lookup for topic by name

**Constraints:**
- Self-referencing FK allows hierarchy
- SET_NULL on parent (delete parent topic → subtopics become orphaned but not deleted)

---

### interactions_vote

**Primary Key:** `id` (Auto-increment integer)

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| id | INTEGER | PK | |
| user_id | INTEGER | FK → PlatformUser, CASCADE, **INDEXED** | Voter |
| post_id | INTEGER | FK → Post, CASCADE, **INDEXED** | Target post |
| value | SMALLINT | IN (1, -1) | 1 = upvote, -1 = downvote |
| created_at | DATETIME | AUTO_NOW_ADD | |

**Constraints:**
- `UNIQUE(user_id, post_id)` — Each user votes once per post
- Cascading delete on user (remove user → remove votes)
- Cascading delete on post (delete post → remove votes)

**Indices:**
- `(post_id)` — Fast aggregation for post score

**Query Pattern:**
```sql
SELECT SUM(value) as score FROM interactions_vote WHERE post_id = 42;
```

---

### interactions_comment

**Primary Key:** `id` (Auto-increment integer)

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| id | INTEGER | PK | |
| author_id | INTEGER | FK → PlatformUser, CASCADE, **INDEXED** | Commenter |
| post_id | INTEGER | FK → Post, CASCADE, **INDEXED** | Target post |
| content | TEXT | NOT NULL | Comment body |
| is_deleted | BOOLEAN | DEFAULT False | **INDEXED**, soft delete |
| created_at | DATETIME | AUTO_NOW_ADD, **INDEXED** | |
| updated_at | DATETIME | AUTO_NOW | |

**Indices:**
- `(post_id, -created_at)` — Get comments on post (ordered by newest)
- Single column: `(author_id)`, `(is_deleted)`, `(created_at)`

---

### interactions_report

**Primary Key:** `id` (Auto-increment integer)

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| id | INTEGER | PK | |
| reporter_id | INTEGER | FK → PlatformUser, CASCADE, **INDEXED** | Who reported |
| target_type | VARCHAR(20) | IN ('post', 'user'), **INDEXED** | Report target |
| post_id | INTEGER | FK → Post, CASCADE, NULL, **INDEXED** | Reported post (if target=post) |
| reported_user_id | INTEGER | FK → PlatformUser, CASCADE, NULL, **INDEXED** | Reported user (if target=user) |
| reason | TEXT | NOT NULL | Reason for report |
| status | VARCHAR(20) | DEFAULT 'pending', **INDEXED** | pending/resolved/rejected |
| created_at | DATETIME | AUTO_NOW_ADD, **INDEXED** | |
| reviewed_at | DATETIME | NULL | When mod reviewed |

**Indices:**
- `(-created_at, status)` — Moderation dashboard (newest reports, by status)
- Single column: `(reporter_id)`, `(target_type)`, `(post_id)`, `(reported_user_id)`

**Constraints:**
- IF `target_type='post'`: `post_id` NOT NULL, `reported_user_id` IS NULL
- IF `target_type='user'`: `reported_user_id` NOT NULL, `post_id` IS NULL
- Cascading delete on reporter/post/user

---

### accounts_authtoken

**Primary Key:** `key` (VARCHAR 40, unique hash)

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| key | VARCHAR(40) | PK, UNIQUE | Random token hash |
| user_id | INTEGER | FK → PlatformUser, CASCADE | Token owner |
| created_at | DATETIME | AUTO_NOW_ADD | Creation time |
| expires_at | DATETIME | NOT NULL | Expiration time |

**Constraints:**
- Cascading delete on user (remove user → invalidate all tokens)

**Cleanup:** Expired tokens should be periodically deleted:
```sql
DELETE FROM accounts_authtoken WHERE expires_at < NOW();
```

---

## Key Queries

### Feed (Newest)
```sql
SELECT p.*, 
       u.username as author,
       COUNT(DISTINCT v.id) as comment_count,
       SUM(v.value) as score
FROM posts_post p
JOIN accounts_platformuser u ON p.author_id = u.id
LEFT JOIN interactions_vote v ON p.id = v.post_id
WHERE p.is_deleted = False
ORDER BY p.created_at DESC
LIMIT 20 OFFSET 0;
```
**Uses Index:** `(-created_at, is_deleted)`

### Feed (Top Score)
```sql
SELECT p.*, u.username as author,
       SUM(v.value) as score
FROM posts_post p
JOIN accounts_platformuser u ON p.author_id = u.id
LEFT JOIN interactions_vote v ON p.id = v.post_id
WHERE p.is_deleted = False
GROUP BY p.id
ORDER BY score DESC, p.created_at DESC
LIMIT 20;
```
**Uses Index:** `(post_id)` on votes for GROUP BY aggregation

### Filter by Topic
```sql
SELECT * FROM posts_post
WHERE is_deleted = False AND topic_id = 5
ORDER BY created_at DESC
LIMIT 20;
```
**Uses Indices:** `(is_deleted)` + `(topic_id)` + `(-created_at)`

### User Profile Feed
```sql
SELECT * FROM posts_post
WHERE author_id = 1 AND is_deleted = False
ORDER BY created_at DESC;
```
**Uses Index:** `(author_id, -created_at)`

### Post Score + User Vote
```sql
SELECT 
  p.id,
  SUM(v.value) as post_score,
  (SELECT value FROM interactions_vote 
   WHERE post_id = p.id AND user_id = 1 LIMIT 1) as user_vote
FROM posts_post p
LEFT JOIN interactions_vote v ON p.id = v.post_id
WHERE p.id IN (42, 43, 44)
GROUP BY p.id;
```

### Moderation Reports
```sql
SELECT r.*, u.username as reporter_name
FROM interactions_report r
JOIN accounts_platformuser u ON r.reporter_id = u.id
WHERE r.status = 'pending'
ORDER BY r.created_at DESC;
```
**Uses Index:** `(-created_at, status)`

### Ban User (Soft Delete)
```sql
UPDATE accounts_platformuser 
SET is_active = False 
WHERE id = 5;
```

### Hard Delete User (with Cascades)
```sql
-- Django ORM handles this:
user = PlatformUser.objects.get(id=5)
user.delete()  # Cascades to posts, comments, votes, reports
```

---

## Migrations

**Manage migrations with Django:**
```bash
# Auto-generate migrations from model changes
python manage.py makemigrations

# Apply to database
python manage.py migrate

# Show migration status
python manage.py showmigrations

# Revert to specific migration
python manage.py migrate posts 0002_post_post_topic_created_idx
```

**Current Migrations:**
- `accounts/0001_initial.py` — Initial schema
- `accounts/0002-0005.py` — Incremental updates (email_verified, etc.)
- `posts/0004_add_database_indices.py` — Indices for performance
- `interactions/0006_add_database_indices.py` — Indices for votes/reports

---

## Performance Tips

1. **Always use indices for WHERE, ORDER BY, JOIN ON clauses**
2. **Avoid N+1 queries:** Use `select_related()` (foreign keys) or `prefetch_related()` (reverse relations)
3. **Batch updates:** Prefer `update()` over individual saves
4. **Soft deletes:** Use boolean flag instead of hard delete to preserve data

---

**Last Updated:** April 7, 2026
