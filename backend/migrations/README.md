# Database Migrations

This directory contains SQL migration scripts for the AcademiaHub database.

## Files

1. **001_create_tables.sql** - Creates all database tables with proper constraints and indexes
2. **002_seed_data.sql** - Inserts sample data for development and testing

## Setup Instructions

### First-Time Setup

1. Make sure PostgreSQL is installed and running
2. Create the database:
   ```bash
   psql -U postgres
   CREATE DATABASE academiahub;
   \q
   ```

3. Run the migrations:
   ```bash
   # Create tables
   psql -U postgres -d academiahub -f migrations/001_create_tables.sql
   
   # Insert seed data
   psql -U postgres -d academiahub -f migrations/002_seed_data.sql
   ```

### Verify Setup

```bash
# Connect to database
psql -U postgres -d academiahub

# List tables
\dt

# Check row counts
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM posts;
SELECT COUNT(*) FROM topics;

# Exit
\q
```

## Test User Credentials

All test users have the password: `password123`

| Email | Role | Use Case |
|-------|------|----------|
| admin@academiahub.com | Administrator | System administration |
| mod@academiahub.com | Moderator | Content moderation |
| dev@academiahub.com | Developer | Platform development |
| verified@academiahub.com | Verified User | Verified content creator |
| user@academiahub.com | General User | Basic user testing |
| alice@academiahub.com | Verified User | Sample researcher |
| bob@academiahub.com | Verified User | Sample professor |

## Database Schema

### Tables

- **users** - User accounts with roles and profiles
- **topics** - Hierarchical academic topics/categories
- **posts** - Academic posts with markdown content
- **votes** - Upvote/downvote system for posts
- **reports** - Content moderation reports

### Relationships

```
users (1) ---> (*) posts
users (1) ---> (*) votes
users (1) ---> (*) reports
topics (1) ---> (*) posts
topics (1) ---> (*) topics (self-referential for hierarchy)
posts (1) ---> (*) votes
posts (1) ---> (*) reports
```

## Resetting the Database

To completely reset the database:

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS academiahub;"
psql -U postgres -c "CREATE DATABASE academiahub;"

# Run migrations again
psql -U postgres -d academiahub -f migrations/001_create_tables.sql
psql -U postgres -d academiahub -f migrations/002_seed_data.sql
```

## Notes

- The `001_create_tables.sql` script includes `DROP TABLE IF EXISTS` statements for clean reinstalls
- Password hashes in seed data are bcrypt hashes of "password123"
- All timestamps use PostgreSQL's `CURRENT_TIMESTAMP`
- Foreign keys use appropriate `ON DELETE` actions for data integrity
- Indexes are created for commonly queried columns

## Production Deployment

For production:

1. Remove the seed data script or create a production-specific version without test users
2. Generate secure password hashes using bcrypt with appropriate cost factor
3. Review and adjust table constraints and indexes based on actual usage patterns
4. Consider implementing proper migration versioning if schema changes are needed
