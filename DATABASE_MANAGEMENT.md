# Database Management Guide

## 🎯 Quick Reference

| What You Want | Command |
|---------------|---------|
| **Reset DB (schema only, no data)** | `./scripts/reset-db-clean.sh` |
| **Add test data manually** | `./scripts/seed-local-db.sh` |
| **Reset DB with test data** | `supabase db reset` |
| **View database** | Open http://127.0.0.1:54323 |

---

## 📋 Common Workflows

### Starting Fresh (No Data)
```bash
# 1. Reset to clean schema
./scripts/reset-db-clean.sh

# 2. Work with empty database
# - Use admin UI to add services/staff
# - Test with real user flows
```

### Testing with Sample Data
```bash
# 1. Reset to clean schema
./scripts/reset-db-clean.sh

# 2. Load test data
./scripts/seed-local-db.sh

# Now you have:
# - 7 sample services
# - 4 staff members
# - 6 sample bookings
# - Business hours configured
```

### Quick Reset with Data
```bash
# One command to reset and seed
supabase db reset
```

---

## 🗂️ File Structure

```
AlphaBooking-/
├── supabase/
│   ├── migrations/
│   │   ├── 20251019122410_initial_schema.sql        ← Schema ONLY (runs in prod)
│   │   └── *.sql.backup                             ← Backups (ignored)
│   └── seed.sql                                     ← Test data (local only)
└── scripts/
    ├── reset-db-clean.sh                            ← Reset without seeding
    └── seed-local-db.sh                             ← Manual seeding
```

---

## 📚 Detailed Commands

### Option 1: Clean Reset (No Data) ⭐ RECOMMENDED FOR TESTING

```bash
./scripts/reset-db-clean.sh
```

**What it does:**
- ✅ Drops and recreates database
- ✅ Applies migration (schema only)
- ✅ Leaves tables empty
- ❌ NO test data loaded

**When to use:**
- Testing with real data entry
- Preparing for production-like environment
- Want to start completely fresh

---

### Option 2: Manual Seeding

```bash
# First, ensure database exists
supabase status

# Then load test data
./scripts/seed-local-db.sh
```

**What it does:**
- ✅ Loads seed.sql into existing database
- ✅ Shows summary of loaded data
- ⚠️ Can be run multiple times (will add duplicates unless TRUNCATE is in seed.sql)

**When to use:**
- After a clean reset
- Want test data without full reset
- Iterating on seed data design

---

### Option 3: Full Reset with Auto-Seeding

```bash
supabase db reset
```

**What it does:**
- ✅ Drops and recreates database
- ✅ Applies migration (schema)
- ✅ Automatically runs seed.sql
- ✅ One command, everything fresh

**When to use:**
- Quick development cycles
- Want fresh data frequently
- Standard workflow

---

## 🚀 Production Deployment

### What Happens in Production

When you deploy to production with `supabase db push`:

✅ **Runs:**
- All migrations in `supabase/migrations/`
- Schema, indexes, functions, triggers
- Safe, version-controlled changes

❌ **Does NOT Run:**
- `seed.sql` (never deployed)
- Any `.backup` files (ignored)
- Local development data

### Initial Production Setup

```bash
# 1. Link to production project
supabase link --project-ref your-project-ref

# 2. Push migrations (schema only)
supabase db push

# 3. Add real business data via:
#    - Admin UI at yourdomain.com/admin
#    - Supabase Studio
#    - Manual SQL inserts
```

---

## 🔍 Inspecting Your Database

### Via CLI
```bash
# Count records in all tables
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "
  SELECT 'services' as table_name, COUNT(*) FROM services
  UNION ALL SELECT 'staff', COUNT(*) FROM staff
  UNION ALL SELECT 'bookings', COUNT(*) FROM bookings
  UNION ALL SELECT 'business_hours', COUNT(*) FROM business_hours
"

# View specific table
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "SELECT * FROM services;"

# Connect to database shell
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### Via Supabase Studio
```bash
# Open in browser
open http://127.0.0.1:54323

# Or use the URL directly
# http://127.0.0.1:54323
```

---

## 🛠️ Troubleshooting

### Database won't reset
```bash
# Stop and restart Supabase
supabase stop
supabase start
```

### Seed script fails
```bash
# Check if Supabase is running
supabase status

# Verify seed file exists
ls -la supabase/seed.sql

# Run seed manually
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/seed.sql
```

### Migration conflicts
```bash
# List applied migrations
supabase migration list --local

# Check migration file
cat supabase/migrations/20251019122410_initial_schema.sql
```

---

## 📊 What's in seed.sql?

The seed file contains realistic test data:

| Item | Count | Description |
|------|-------|-------------|
| **Services** | 7 | Haircuts, coloring, treatments, beard trim |
| **Staff** | 4 | With photos, bios, specialties, surcharges |
| **Bookings** | 6 | Confirmed, completed, cancelled statuses |
| **Business Hours** | 7 | Monday-Saturday hours (Sunday closed) |
| **Branding** | 1 | Logo, colors, business name |
| **Availability** | ~24 | Staff schedules for the week |

All data uses:
- ✅ South African Rand (R) currency
- ✅ Valid UUIDs for relationships
- ✅ Realistic names, emails, phones
- ✅ Mixed booking statuses for testing

---

## 🎨 Customizing Seed Data

Edit `supabase/seed.sql` to customize test data:

```sql
-- Add your own services
INSERT INTO services (name, description, price, duration) VALUES
    ('Your Service', 'Description', 500.00, 60);

-- Add your own staff
INSERT INTO staff (name, bio, price_surcharge) VALUES
    ('Your Name', 'Your bio', 50.00);
```

Then reload:
```bash
./scripts/seed-local-db.sh
```

---

## ✅ Best Practices

### DO:
- ✅ Use `./scripts/reset-db-clean.sh` when testing empty states
- ✅ Use `./scripts/seed-local-db.sh` when you need sample data
- ✅ Keep seed.sql updated with realistic scenarios
- ✅ Test both with and without seed data
- ✅ Use Supabase Studio to inspect data visually

### DON'T:
- ❌ Put production data in seed.sql
- ❌ Put INSERT statements in migrations
- ❌ Rely on seed data being present
- ❌ Commit sensitive data to seed.sql
- ❌ Use seed data in production

---

## 🔗 Related Documentation

- [DATABASE_SEEDING.md](./supabase/DATABASE_SEEDING.md) - Seeding strategy explained
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Initial Supabase setup
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Database API reference

---

## 📝 Summary

You now have **full control** over your database:

1. **Migrations** = Schema (runs everywhere)
2. **Seeds** = Test data (local only, optional)
3. **Scripts** = Easy management commands

This gives you:
- 🎯 Clean production deployments
- 🧪 Rich test data locally
- 🔄 Easy reset workflows
- 📊 Clear separation of concerns

Happy developing! 🚀
