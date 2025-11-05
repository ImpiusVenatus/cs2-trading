# Supabase Storage Setup Guide

## Overview

This project uses **Supabase Storage** for file uploads (profile pictures and NID documents). Supabase Storage is integrated with your existing Supabase project and uses the same authentication and database.

## Free Tier

- **1 GB** storage
- **2 GB** bandwidth per month
- Perfect for MVP and light usage

## Setup Steps

### 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `user-files`
   - **Public bucket**: `No` (we'll use signed URLs for privacy)
   - **File size limit**: 5 MB (or your preferred limit)
   - **Allowed MIME types**: Leave empty or add:
     - `image/jpeg`
     - `image/png`
     - `image/webp`
     - `application/pdf`

### 2. Configure Storage Policies

Supabase Storage uses Row Level Security (RLS) policies. You need to create policies for the `user-files` bucket.

Go to **Storage** → **Policies** → Select `user-files` bucket → **New Policy**

#### Policy 1: Users can upload their own files

```sql
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'user-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 2: Users can view their own files

```sql
CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'user-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 3: Users can update their own files

```sql
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'user-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 4: Users can delete their own files

```sql
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'user-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Run Database Migration

The files table migration is already created. Run it in your Supabase SQL Editor:

1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste the contents of `supabase/migrations/004_create_files_table.sql`
3. Run the migration

### 4. Verify Setup

After setup, you should be able to:
- Upload profile pictures from the profile page
- Upload NID documents from the profile page
- Files will be stored in Supabase Storage
- Signed URLs will be generated for private file access
- File metadata will be stored in the `files` table

## Storage Structure

Files are organized as follows:
```
user-files/
  ├── profile-pictures/
  │   └── {user-id}/
  │       └── profile_picture-{timestamp}.{ext}
  └── nid-documents/
      └── {user-id}/
          └── nid_document-{timestamp}.{ext}
```

## Environment Variables

No additional environment variables are needed! Supabase Storage uses the same credentials as your Supabase database:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Features

- ✅ File upload with validation (size, type)
- ✅ Automatic file replacement (old files are deleted when new ones are uploaded)
- ✅ Signed URLs for private file access
- ✅ File metadata tracking in database
- ✅ Integration with profile system
- ✅ Automatic verification status update when NID is uploaded

## Troubleshooting

### "Bucket not found" error
- Make sure the bucket name is exactly `user-files`
- Check that the bucket exists in your Supabase Storage

### "Policy violation" error
- Verify that all storage policies are created correctly
- Check that the user is authenticated
- Ensure the folder structure matches the policy (user-id folder)

### "File too large" error
- Check the bucket's file size limit
- Verify the 5MB client-side validation is working

