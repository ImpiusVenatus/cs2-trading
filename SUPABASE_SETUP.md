# Supabase Setup Guide

## Database Migration

Run the migration file to create the profiles table:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_create_profiles_table.sql`
4. Run the migration

## Authentication Setup

1. Go to Authentication > Providers in Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add redirect URL: `http://localhost:3000/auth/callback` (for development)
5. Add production redirect URL when deploying

## Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Features Implemented

### Authentication
- ✅ Google OAuth sign-in/sign-up
- ✅ Automatic profile creation on signup
- ✅ Protected routes (middleware)
- ✅ Sign out functionality

### Profile Management
- ✅ Profile picture (Backblaze URL storage)
- ✅ NID document upload (Backblaze URL storage)
- ✅ Verification status (pending/verified/rejected)
- ✅ Personal information form
- ✅ Account type selection

### Account Management
- ✅ Ban system with reason
- ✅ Account closure (soft delete)
- ✅ Banned users cannot update profile
- ✅ Closed accounts cannot update profile

### Database Schema
- ✅ Profiles table with all required fields
- ✅ Row Level Security (RLS) policies
- ✅ Automatic profile creation on signup
- ✅ Timestamps (created_at, updated_at)

## Component Structure

The profile tab has been broken down into smaller components:

1. **ProfilePictureSection** - Handles profile picture URL
2. **VerificationDocumentsSection** - Handles NID document URL
3. **PersonalInformationForm** - Handles all personal info fields

Each component:
- Loads data from Supabase independently
- Saves data independently to Supabase
- Shows loading states
- Handles errors with toast notifications

## Next Steps

1. Set up Backblaze for file uploads
2. Create admin dashboard for verification
3. Add ban/close account functionality in admin panel
4. Add email notifications for verification status

