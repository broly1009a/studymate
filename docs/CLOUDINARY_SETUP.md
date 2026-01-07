# Cloudinary Image Upload Integration

## Setup Guide

### 1. Environment Variables

Add these variables to your `.env.local` file:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=dytgwi3vi
CLOUDINARY_API_KEY=961356952131824
CLOUDINARY_API_SECRET=LPOsXqmmWHf-QwZWXwABF_Djb9A
```

### 2. Installation

```bash
npm install cloudinary
```

### 3. Features

#### ✅ Upload Images
- Upload profile images to Cloudinary
- Automatic image optimization (max 800x800, auto quality)
- Support for JPEG, PNG, WebP formats
- Max file size: 5MB

#### ✅ Replace Images
- When replacing an image, the old image is automatically deleted from Cloudinary
- Prevents accumulation of unused images
- Saves storage space

#### ✅ Delete Images
- Remove images from both database and Cloudinary
- Ensures no orphaned files

#### ✅ Image Validation
- File type validation (JPEG, PNG, WebP only)
- File size validation (max 5MB)
- User-friendly error messages

### 4. File Structure

```
src/
├── lib/
│   └── cloudinary.ts              # Cloudinary configuration & utilities
├── hooks/
│   └── use-image-upload.ts        # Custom hook for image upload
├── app/
│   └── api/
│       └── upload/
│           └── profile-image/
│               └── route.ts       # Upload API endpoint
└── models/
    └── User.ts                    # User model with profileImages field
```

### 5. API Endpoints

#### POST /api/upload/profile-image
Upload a profile image

**Request:**
```json
{
  "image": "base64_encoded_image",
  "oldPublicId": "optional_old_image_public_id",
  "index": 0
}
```

**Response:**
```json
{
  "success": true,
  "image": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "studymate/profiles/userId/profile_0"
  }
}
```

#### DELETE /api/upload/profile-image?publicId=xxx
Delete a profile image

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### 6. Usage Example

```tsx
import { useImageUpload } from '@/hooks/use-image-upload';

function ProfileImageUpload() {
  const { uploadImage, deleteImage, validateImage, isUploading } = useImageUpload();

  const handleUpload = async (file: File, index: number) => {
    // Validate
    const validation = validateImage(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    // Upload (with optional old image deletion)
    const result = await uploadImage(file, index, oldPublicId);
    
    if (result) {
      console.log('Uploaded:', result.url);
    }
  };

  return (
    <input 
      type="file" 
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file, 0);
      }}
      disabled={isUploading}
    />
  );
}
```

### 7. Database Schema

**User Model:**
```typescript
{
  profileImages: [
    {
      url: String,
      publicId: String,
      order: Number
    }
  ]
}
```

### 8. Image Optimization

Cloudinary automatically applies these transformations:
- Max dimensions: 800x800px
- Quality: auto:good
- Format: auto (WebP when supported)
- Crop: limit (maintains aspect ratio)

### 9. Security

- ✅ Token-based authentication required
- ✅ User can only upload/delete their own images
- ✅ File type validation
- ✅ File size validation
- ✅ Server-side image processing

### 10. Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| "Chỉ chấp nhận file ảnh" | Upload JPEG, PNG, or WebP only |
| "Kích thước ảnh không được vượt quá 5MB" | Compress image before upload |
| "No authentication token found" | User must be logged in |
| "Failed to upload image" | Check Cloudinary credentials |

### 11. Best Practices

1. **Always validate before upload**
   ```typescript
   const validation = validateImage(file);
   if (!validation.valid) return;
   ```

2. **Delete old images when replacing**
   ```typescript
   uploadImage(file, index, oldPublicId);
   ```

3. **Show loading state**
   ```typescript
   {isUploading && <Loader2 className="animate-spin" />}
   ```

4. **Handle errors gracefully**
   ```typescript
   if (!result) {
     toast.error('Upload failed');
     return;
   }
   ```

### 12. Cloudinary Dashboard

Access your images at: https://console.cloudinary.com/

Folder structure:
```
studymate/
└── profiles/
    └── {userId}/
        ├── profile_0
        ├── profile_1
        └── ...
```

## Troubleshooting

### Images not uploading?
1. Check Cloudinary credentials in `.env.local`
2. Verify file size < 5MB
3. Check browser console for errors
4. Ensure user is authenticated

### Images not deleting?
1. Verify publicId is correct
2. Check Cloudinary dashboard for image
3. Ensure user owns the image

### Slow uploads?
1. Compress images before upload
2. Use WebP format when possible
3. Check internet connection
4. Consider uploading fewer images at once
