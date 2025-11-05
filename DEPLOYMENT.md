# Deployment Guide

## Production Environment Variables

When deploying to production, you **must** set the following environment variable:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

This ensures that OAuth redirects work correctly in production. Without this, the app may redirect to `localhost:3000` instead of your production domain.

### Example Environment Variables for Production

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Required for Production OAuth Redirects
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Supabase OAuth Configuration

### 1. Configure Redirect URLs in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **URL Configuration**
3. Add your production site URL to **Redirect URLs**:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com/**` (wildcard for all routes)

### 2. Configure Google OAuth Provider

1. Go to **Authentication** > **Providers** > **Google**
2. Ensure the redirect URLs match:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 3. Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Select your OAuth 2.0 Client ID
4. Add **Authorized redirect URIs**:
   - `https://your-project.supabase.co/auth/v1/callback` (Supabase callback)
   - Note: Supabase handles the redirect to your app, so you only need the Supabase callback URL

## How It Works

The application uses a `getBaseUrl()` utility function that:

1. **In Production**: Uses `NEXT_PUBLIC_SITE_URL` if set (recommended)
2. **Fallback**: Uses the request origin (from the incoming HTTP request)
3. **Client-side**: Uses `window.location.origin`

This ensures OAuth redirects work correctly in all environments.

## Troubleshooting

### Issue: Redirects to localhost:3000 in production

**Solution**: 
1. Set `NEXT_PUBLIC_SITE_URL` environment variable to your production domain
2. Verify the redirect URL is added to Supabase dashboard
3. Restart your application after setting the environment variable

### Issue: OAuth redirect_uri_mismatch error

**Solution**:
1. Check that the redirect URL in Supabase matches your `NEXT_PUBLIC_SITE_URL`
2. Verify Google Cloud Console has the correct Supabase callback URL
3. Ensure no typos in the URLs (https vs http, trailing slashes, etc.)

