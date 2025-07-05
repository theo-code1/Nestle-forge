# Supabase Storage Integration

This guide explains how to set up Supabase storage for the image converter application.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Python Environment**: Make sure you have Python 3.7+ installed

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be created (this may take a few minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)
   - **Service role key** (starts with `eyJ...`)

### 3. Configure Environment Variables

1. Create a `.env` file in the `Backend` directory:
   ```bash
   cd Backend
   cp env_example.txt .env
   ```

2. Edit the `.env` file with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_anon_public_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_BUCKET_NAME=converted-images
   ```

### 4. Install Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

### 5. Create Storage Bucket

The application will automatically create a storage bucket named `converted-images` (or whatever you specify in `SUPABASE_BUCKET_NAME`) when you first run the application.

### 6. Configure Storage Policies

In your Supabase dashboard:

1. Go to **Storage** → **Policies**
2. For the `converted-images` bucket, add these policies:

**For SELECT (download):**
```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'converted-images');
```

**For INSERT (upload):**
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'converted-images');
```

### 7. Run the Application

```bash
cd Backend
python convert.py
```

## How It Works

1. **Upload**: When a user uploads an image, it's processed locally
2. **Conversion**: The image is converted to the target format in memory
3. **Storage**: The converted image is uploaded to Supabase storage
4. **Download**: Users get a public URL to download the converted image

## Benefits

- **Scalable**: No local storage limits
- **Reliable**: Cloud storage with redundancy
- **Fast**: CDN distribution for downloads
- **Cost-effective**: Free tier includes 1GB storage

## Troubleshooting

### Common Issues

1. **"Supabase URL and key must be set"**
   - Check your `.env` file exists and has correct values
   - Restart the Flask server after creating `.env`

2. **"Bucket not found"**
   - The bucket will be created automatically on first run
   - Check your Supabase dashboard for the bucket

3. **"Permission denied"**
   - Check your storage policies in Supabase dashboard
   - Ensure the bucket is public

### Fallback Mode

If Supabase is unavailable, the application will fall back to local storage automatically.

## Security Notes

- The anon key is safe to use in client-side code
- The service role key should be kept secret
- Storage policies control access to your files 