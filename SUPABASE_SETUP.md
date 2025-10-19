# Supabase Setup Guide for AlphaBooking

## Overview

This guide will help you set up Supabase for the AlphaBooking application. The application is now configured to work with both local development and cloud deployment.

## ✅ Current Status

- **Local Supabase**: ✅ Working
- **Database Schema**: ✅ Applied
- **Sample Data**: ✅ Loaded
- **React Integration**: ✅ Complete

## 🚀 Quick Start (Local Development)

The application is already configured for local development! Just run:

```bash
# Start Supabase (if not already running)
supabase start

# Start the React application
npm run dev
```

Your application will be available at `http://localhost:3000` with a fully functional database.

## 📊 Local Development URLs

- **Application**: <http://localhost:3000>
- **Supabase Studio**: <http://127.0.0.1:54323>
- **API**: <http://127.0.0.1:54321>
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/p.env.exampleostgres

## Step 1: Create Supabase Cloud Project (Optional)

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: AlphaBooking
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to you
6. Click "Create new project"
7. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. Once your project is ready, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root:

   ```bash
   touch .env.local
   ```

2. Add your Supabase credentials to `.env.local`:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

   Replace `your-project-id` and `your_anon_key_here` with your actual values.

## Step 4: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/schema.sql` and paste it into the SQL editor
4. Click **Run** to execute the schema

This will create all the necessary tables and insert sample data.

## Step 5: Configure Row Level Security (RLS)

For production, you should set up Row Level Security policies. For now, you can disable RLS for development:

1. Go to **Authentication** → **Policies**
2. For each table (services, staff, bookings, availability, blackout_dates, special_dates), you can either:
   - Disable RLS temporarily for development, or
   - Create policies to allow public access

## Step 6: Test the Application

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`
3. Try booking an appointment to test the database integration

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**:
   - Check that your `.env.local` file has the correct values
   - Make sure there are no extra spaces or quotes around the values
   - Restart your development server after changing environment variables

2. **"Failed to load data" error**:
   - Check that the database schema was created successfully
   - Verify that RLS is configured correctly
   - Check the browser console for detailed error messages

3. **CORS errors**:
   - Make sure you're using the correct Supabase URL
   - Check that your project is not paused (free tier projects pause after inactivity)

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Discord](https://discord.supabase.com) for community support
- Check the browser console for detailed error messages

## Next Steps

Once you have Supabase working:

1. **Authentication**: Set up user authentication for admin access
2. **Real-time**: Enable real-time updates for booking changes
3. **Storage**: Set up file storage for staff photos
4. **Email**: Configure email notifications for bookings
5. **Production**: Set up proper RLS policies and security

## Database Schema Overview

The database includes the following tables:

- **services**: Available services (haircuts, styling, etc.)
- **staff**: Staff members and their specializations
- **bookings**: Customer appointments
- **availability**: Staff working hours
- **blackout_dates**: Dates when the business is closed
- **special_dates**: Special hours for specific dates

Each table includes proper relationships, indexes, and constraints for data integrity.
