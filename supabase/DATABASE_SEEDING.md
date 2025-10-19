# Database Seeding Strategy

## Overview
This document explains how AlphaBooking handles database seeding to ensure test data only appears in local development, not in production.

## The Problem We Solved

**Before:** The migration file (`20251019122410_initial_schema.sql`) contained INSERT statements with sample data. This meant:
- ❌ Sample data would run in production
- ❌ Test customers/bookings would appear in live database
- ❌ Hard to distinguish between real and test data

## The Solution

### 1. **Migrations** (`supabase/migrations/`) - Schema Only
- Contains ONLY table definitions, indexes, functions, triggers
- NO INSERT statements
- Runs in ALL environments (local, staging, production)
- Safe to deploy anywhere

### 2. **Seeds** (`supabase/seed.sql`) - Test Data Only
- Contains INSERT statements with sample data
- ONLY runs locally via `supabase db reset`
- NEVER runs in production deployments
- Can be re-run safely for testing

## How Supabase Handles This

### Local Development
```bash
# This will:
# 1. Apply all migrations (schema)
# 2. Run seed.sql (test data)
supabase db reset
```

### Production Deployment
```bash
# This will ONLY:
# 1. Apply migrations (schema)
# 2. Skip seed.sql automatically
supabase db push
```

## File Structure

```
supabase/
├── migrations/
│   └── 20251019122410_initial_schema_clean.sql  ← Schema only (runs everywhere)
└── seed.sql                                      ← Test data (local only)
```

## What's in seed.sql?

The seed file contains realistic test data for local development:
- **7 Services** (Haircuts, coloring, treatments)
- **4 Staff Members** (With photos, bios, specialties)
- **6 Sample Bookings** (Mix of confirmed, completed, cancelled)
- **Business Hours** (Mon-Sat hours)
- **Branding Settings** (Logo, colors)
- **Availability** (Sample week of staff schedules)

## How to Use

### Reset Database with Fresh Test Data
```bash
# Wipes everything and starts fresh
cd /Users/tsheposeleke/projects/AlphaBooking-
supabase db reset
```

### Deploy to Production (No Test Data)
```bash
# Only applies schema changes
supabase db push --linked
```

### Verify What Will Run
```bash
# See current migration status
supabase migration list

# Preview what would be applied
supabase db diff
```

## Important Notes

### ✅ DO:
- Keep `seed.sql` updated with realistic test scenarios
- Run `supabase db reset` when you need fresh test data
- Add new tables to migrations, new test data to seeds
- Use seed data for development and testing

### ❌ DON'T:
- Put INSERT statements in migration files
- Rely on seed data in production
- Commit production data to seed.sql
- Use seed.sql for data backups

## Checking Current Data

### Via CLI
```bash
# Count records
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "SELECT COUNT(*) FROM services;"

# View data
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "SELECT * FROM services LIMIT 5;"
```

### Via Supabase Studio
Open [http://127.0.0.1:54323](http://127.0.0.1:54323) to browse tables visually.

## Production Data Setup

When deploying to production for the first time:

1. **Schema** is applied automatically via migrations
2. **Initial business data** should be added via:
   - Admin UI (Services, Staff, Business Hours)
   - Supabase Studio (manual data entry)
   - Custom seeding script (separate from seed.sql)
   - Data import tool

## Migration Naming Convention

- `YYYYMMDDHHMMSS_description.sql` - Timestamped for ordering
- Example: `20251019122410_initial_schema_clean.sql`

## Summary

| Aspect | Migrations | Seeds |
|--------|-----------|-------|
| **Contains** | Tables, indexes, functions | Sample data (INSERTs) |
| **Runs When** | All environments | Local only |
| **Command** | `supabase db push` | `supabase db reset` |
| **Production** | ✅ Yes | ❌ No |
| **Purpose** | Database structure | Development/testing |

This ensures your production database starts clean while local development has rich test data! 🎯
