# API Endpoints Reference

## 📚 Study Records (Personal Study)

### Start Session
```http
POST /api/study-records/start
Content-Type: application/json

{
  "userId": "user_id",
  "subjectId": "subject_id",
  "topic": "Chapter 5: Derivatives",
  "estimatedDuration": 60
}
```

### Pause Session
```http
POST /api/study-records/:id/pause
Content-Type: application/json

{
  "userId": "user_id"
}
```

### Resume Session
```http
POST /api/study-records/:id/resume
Content-Type: application/json

{
  "userId": "user_id"
}
```

### Complete Pomodoro
```http
POST /api/study-records/:id/pomodoro
Content-Type: application/json

{
  "userId": "user_id",
  "focusRating": 85
}
```

### Complete Session
```http
POST /api/study-records/:id/complete
Content-Type: application/json

{
  "userId": "user_id",
  "notes": "Completed chapter 5",
  "tags": ["calculus", "important"],
  "finalFocusScore": 87
}
```

---

## 👥 Study Sessions (Group Study)

### Get All Sessions
```http
GET /api/study-sessions?page=1&limit=10&subject=Mathematics&status=scheduled&date=today
```

### Create Session
```http
POST /api/study-sessions
Content-Type: application/json

{
  "title": "Calculus Study Group",
  "description": "Let's study together!",
  "creatorId": "user_id",
  "creatorName": "John Doe",
  "creatorAvatar": "avatar_url",
  "subject": "Mathematics",
  "topic": "Calculus",
  "goal": "Complete chapter 5",
  "startTime": "2026-01-03T15:00:00Z",
  "endTime": "2026-01-03T17:00:00Z",
  "online": true,
  "meetLink": "https://meet.google.com/xxx",
  "maxParticipants": 10
}
```

### Get Session by ID
```http
GET /api/study-sessions/:id
```

### Join Session
```http
POST /api/study-sessions/:id/join
Content-Type: application/json

{
  "userId": "user_id",
  "userName": "Jane Doe"
}
```

### Leave Session
```http
POST /api/study-sessions/:id/leave
Content-Type: application/json

{
  "userId": "user_id"
}
```

### Start Session (Creator only)
```http
POST /api/study-sessions/:id/start
Content-Type: application/json

{
  "userId": "creator_id"
}
```

### Complete Session (Creator only)
```http
POST /api/study-sessions/:id/complete
Content-Type: application/json

{
  "userId": "creator_id"
}
```

---

## 🔥 Study Streak

### Get User Streak
```http
GET /api/study-streak?userId=user_id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current": 5,
    "longest": 10,
    "lastStudyDate": "2026-01-02T10:30:00Z",
    "daysSinceLastStudy": 0,
    "isAtRisk": false,
    "status": "active"
  }
}
```

### Get Leaderboard
```http
GET /api/study-streak/leaderboard?limit=10&type=current
```

**Parameters:**
- `limit`: Number of results (default: 10)
- `type`: 'current' | 'longest'

---

## 🏆 Reputation System

### Get Reputation History
```http
GET /api/reputation?userId=user_id&type=earned&startDate=2026-01-01&endDate=2026-01-31&page=1&limit=20
```

**Parameters:**
- `userId` (required): User ID
- `type`: 'earned' | 'lost' | null (all)
- `startDate`: ISO date string
- `endDate`: ISO date string
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    },
    "stats": {
      "earned": 500,
      "earnedCount": 50,
      "lost": 50,
      "lostCount": 5,
      "net": 450
    }
  }
}
```

### Award/Deduct Reputation
```http
POST /api/reputation
Content-Type: application/json

{
  "userId": "user_id",
  "points": 25,
  "reason": "Completed advanced study session",
  "type": "earned"
}
```

### Get Reputation Stats
```http
GET /api/reputation/stats?userId=user_id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "avatar": "avatar_url"
    },
    "reputation": 1500,
    "rank": {
      "current": "Advanced",
      "next": "Expert",
      "progress": 0.75,
      "pointsToNext": 500
    },
    "recentActivity": {
      "earned": 250,
      "earnedCount": 25,
      "lost": 0,
      "lostCount": 0,
      "net": 250
    },
    "topSources": [
      {
        "reason": "Completed study sessions",
        "points": 150,
        "count": 10
      }
    ],
    "leaderboardPosition": 42
  }
}
```

---

## 📊 Study Statistics

### Get User Study Stats
```http
GET /api/study-records/stats?userId=user_id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSessions": 100,
    "totalHours": 150.5,
    "averageFocusScore": 85,
    "totalPomodoros": 300,
    "thisWeek": {
      "sessions": 7,
      "hours": 10.5
    }
  }
}
```

---

## 🔐 Authentication Note

**Important:** Tất cả các endpoints trên đang sử dụng `userId` từ request body để demo. Trong production, bạn cần:

1. Implement authentication middleware
2. Lấy userId từ session/JWT token
3. Không cho phép user thao tác với data của user khác

**Example với NextAuth:**
```typescript
import { getServerSession } from 'next-auth';

const session = await getServerSession();
const userId = session?.user?.id;
```

---

## 📝 Testing với cURL

### Example: Start Study Session
```bash
curl -X POST http://localhost:3000/api/study-records/start \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "subjectId": "math_101",
    "topic": "Calculus Derivatives",
    "estimatedDuration": 60
  }'
```

### Example: Join Group Session
```bash
curl -X POST http://localhost:3000/api/study-sessions/session_123/join \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_456",
    "userName": "Jane Doe"
  }'
```

### Example: Get Streak
```bash
curl http://localhost:3000/api/study-streak?userId=user_123
```

---

## ⚡ Rate Limiting (Recommended)

Để tránh abuse, nên implement rate limiting:

```typescript
// Example với next-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

---

## 🎯 Error Responses

Tất cả endpoints trả về error theo format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (missing fields, validation error)
- 401: Unauthorized
- 403: Forbidden (not allowed)
- 404: Not Found
- 500: Internal Server Error
