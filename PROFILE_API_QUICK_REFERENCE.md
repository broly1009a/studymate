# Profile API - Quick Reference

---

## 📍 API Endpoints

### Get Profile
```bash
GET /api/profiles/me
Authorization: Bearer <token>
```

### Update Profile
```bash
POST /api/profiles/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "...",
  "bio": "...",
  "avatar": "...",
  "coverPhoto": "...",
  "education": {...},
  "skills": [...],
  "socialLinks": {...}
}
```

### Get Activities
```bash
GET /api/profiles/me/activities?page=1&limit=10
Authorization: Bearer <token>
```

### Get Stats
```bash
GET /api/profiles/me/stats
Authorization: Bearer <token>
```

---

## 💻 Client Usage

### Import Helpers
```tsx
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserActivities, 
  getUserStats 
} from '@/lib/api/profile-client';
```

### Get Profile
```tsx
const token = localStorage.getItem('auth-token');
const { profile } = await getUserProfile(token);
```

### Update Profile
```tsx
const token = localStorage.getItem('auth-token');
const { message, profile } = await updateUserProfile(token, {
  fullName: 'New Name',
  bio: 'New bio',
  // ... other fields
});
```

### Get Activities
```tsx
const token = localStorage.getItem('auth-token');
const { activities, pagination } = await getUserActivities(token, {
  page: 1,
  limit: 10
});
```

### Get Stats
```tsx
const token = localStorage.getItem('auth-token');
const { stats } = await getUserStats(token);
```

---

## 🎯 In Components

### Profile Page Example
```tsx
'use client';

import { useState, useEffect } from 'react';
import { getUserProfile, getUserActivities } from '@/lib/api/profile-client';
import { useAuth } from '@/hooks/use-auth';

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) throw new Error('No token');

        const { profile } = await getUserProfile(token);
        setProfile(profile);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) fetchData();
  }, [user, authLoading]);

  if (isLoading) return <LoadingUI />;
  if (error) return <ErrorUI error={error} />;

  return <ProfileUI profile={profile} />;
}
```

---

## 🔐 Security Notes

1. **Token Storage**: localStorage (consider cookies in production)
2. **Token Expiration**: 24 hours (set in `/lib/api/auth.ts`)
3. **Authorization**: All endpoints require valid token
4. **Password**: Never sent plain text to API
5. **HTTPS**: Always use in production

---

## 🐛 Error Responses

All endpoints return error in this format:
```json
{
  "error": "Error message"
}
```

Common error codes:
- `401`: Missing or invalid token
- `404`: Profile not found
- `500`: Server error

---

## 📚 Related Files

- **Endpoints**: `src/app/api/profiles/me/`
- **Helpers**: `src/lib/api/profile-client.ts`
- **Pages**: `src/app/(dashboard)/profile/**`
- **Components**: `src/components/profile/**`
- **Auth**: `src/lib/api/auth.ts`

---

## ✅ Checklist for New Pages

When using profile API in new pages:

- [ ] Import helpers from `@/lib/api/profile-client`
- [ ] Import `useAuth` from `@/hooks/use-auth`
- [ ] Create state for profile, loading, error
- [ ] Create useEffect to fetch data
- [ ] Get token from localStorage
- [ ] Handle loading state (show spinner)
- [ ] Handle error state (show error message)
- [ ] Pass real data to components
- [ ] Use TypeScript types from `@/types/profile`

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Replace mock data with real database queries
- [ ] Implement proper password hashing (bcrypt)
- [ ] Use proper JWT library (jsonwebtoken)
- [ ] Add input validation (Zod schemas)
- [ ] Implement rate limiting
- [ ] Setup HTTPS
- [ ] Move token to secure HTTP-only cookies
- [ ] Add CORS configuration
- [ ] Setup database indexes
- [ ] Add logging/monitoring
- [ ] Implement caching (Redis)
- [ ] Setup backup strategy
