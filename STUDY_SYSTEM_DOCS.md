# Study System - Complete Flow Documentation

## 📋 Tổng quan hệ thống

Hệ thống Study Management bao gồm 4 components chính:
1. **Study Records** - Học cá nhân với Pomodoro timer
2. **Study Sessions** - Học nhóm collaborative
3. **Study Streak** - Theo dõi chuỗi ngày học liên tiếp
4. **Reputation System** - Hệ thống điểm và xếp hạng

---

## 🎯 1. STUDY RECORDS (Học cá nhân)

### API Endpoints

#### Start Study Session
```
POST /api/study-records/start
Body: {
  userId: string,
  subjectId: string,
  topic: string,
  estimatedDuration: number (default: 60)
}
```

#### Pause Session
```
POST /api/study-records/:id/pause
Body: { userId: string }
```

#### Resume Session
```
POST /api/study-records/:id/resume
Body: { userId: string }
```

#### Complete Pomodoro
```
POST /api/study-records/:id/pomodoro
Body: {
  userId: string,
  focusRating: number (0-100)
}
```

#### Complete Session
```
POST /api/study-records/:id/complete
Body: {
  userId: string,
  notes: string,
  tags: string[],
  finalFocusScore: number
}
```

### Component Usage

```tsx
import StudyTimer from '@/components/dashboard/study-timer';

<StudyTimer
  subjectId="math101"
  subjectName="Mathematics"
  topic="Calculus - Derivatives"
  onComplete={() => console.log('Session completed!')}
/>
```

### Luồng hoạt động

1. **Start** → Tạo StudySessionRecord với status='ongoing'
2. **Pomodoro** → Mỗi 25 phút hoàn thành 1 Pomodoro, cập nhật focusScore
3. **Break** → Pause session, tăng breaks count
4. **Resume** → Tiếp tục học
5. **Complete** → 
   - Tính duration, lưu notes/tags
   - Update StudyStreak
   - Award reputation points (5-40 points tùy duration & focus)
   - Update Subject statistics

---

## 👥 2. STUDY SESSIONS (Học nhóm)

### API Endpoints

#### Create Session
```
POST /api/study-sessions
Body: {
  title, description, creatorId, creatorName,
  subject, topic, startTime, endTime,
  online, meetLink, maxParticipants
}
```

#### Join Session
```
POST /api/study-sessions/:id/join
Body: { userId, userName }
```

#### Leave Session
```
POST /api/study-sessions/:id/leave
Body: { userId }
```

#### Start Session (Creator only)
```
POST /api/study-sessions/:id/start
Body: { userId }
```

#### Complete Session (Creator only)
```
POST /api/study-sessions/:id/complete
Body: { userId }
```

### Component Usage

```tsx
import StudySessionDetail from '@/components/dashboard/study-session-detail';

<StudySessionDetail sessionId="session_id_here" />
```

### Luồng hoạt động

1. **Create** → Creator tạo session, status='scheduled'
2. **Join** → Participants join, tăng participants_count
3. **Start** → Creator start hoặc auto-start khi đến giờ, status='ongoing'
4. **Complete** → 
   - status='completed'
   - Award 10 points cho mỗi participant
   - Award 20 points bonus cho creator
   - Request feedback

---

## 🔥 3. STUDY STREAK

### API Endpoints

#### Get Streak
```
GET /api/study-streak?userId=xxx
Response: {
  current, longest, lastStudyDate,
  daysSinceLastStudy, isAtRisk, status
}
```

#### Leaderboard
```
GET /api/study-streak/leaderboard?limit=10&type=current
```

### Logic Update Streak

```javascript
// Được gọi tự động khi complete study session
const today = startOfDay(new Date());
const lastStudy = startOfDay(streak.lastStudyDate);
const daysDiff = differenceInDays(today, lastStudy);

if (daysDiff === 0) {
  // Same day - không thay đổi
} else if (daysDiff === 1) {
  // Consecutive day - tăng streak
  streak.current += 1;
  if (streak.current > streak.longest) {
    streak.longest = streak.current;
  }
  // Check milestones: 3, 7, 14, 30, 60, 90, 180, 365 days
} else {
  // Missed days - reset về 1
  streak.current = 1;
}
```

### Milestones & Rewards

- 3 days: +15 points
- 7 days: +35 points
- 14 days: +70 points
- 30 days: +150 points
- 60 days: +300 points
- 90 days: +500 points
- 180 days: +1000 points
- 365 days: +2500 points

---

## 🏆 4. REPUTATION SYSTEM

### API Endpoints

#### Get History
```
GET /api/reputation?userId=xxx&type=earned&startDate=xxx&endDate=xxx&page=1
```

#### Award/Deduct Points
```
POST /api/reputation
Body: {
  userId: string,
  points: number,
  reason: string,
  type: 'earned' | 'lost'
}
```

#### Get Stats
```
GET /api/reputation/stats?userId=xxx
Response: {
  reputation, rank, recentActivity, topSources, leaderboardPosition
}
```

### Reputation Ranks

| Rank | Points Required |
|------|----------------|
| Novice | 0 |
| Beginner | 100 |
| Intermediate | 500 |
| Advanced | 1,000 |
| Expert | 2,000 |
| Master | 5,000 |
| Legend | 10,000 |

### Cách kiếm điểm

**Study Activities:**
- 30min session: +5 points
- 1 hour session: +15 points
- 2+ hours session: +30 points
- High focus (80+): +10 points bonus

**Pomodoro:**
- Every 4 pomodoros: +5 points

**Group Sessions:**
- Create session: +20 points
- Join session: +5 points
- Complete session: +10 points

**Streaks:**
- See milestone table above

### Usage

```tsx
import { awardReputation, getUserRank } from '@/lib/reputation-utils';

// Award points
await awardReputation(userId, 'study_1hour');

// Custom points
await awardReputation(userId, 'study_1hour', {
  customPoints: 25,
  customReason: 'Completed advanced calculus session'
});

// Get rank
const rank = getUserRank(1500); // Returns "Advanced"
```

---

## 📊 5. DASHBOARD COMPONENT

### Usage

```tsx
import StudyDashboard from '@/components/dashboard/study-dashboard';

<StudyDashboard />
```

### Hiển thị

- Current streak với status (active/at risk)
- Reputation với rank progress
- Total study time & sessions
- Average focus score
- Recent activity (30 days)
- Milestones & goals progress

---

## 🔄 6. LUỒNG HOÀN CHỈNH - 1 NGÀY HỌC

```javascript
// 1. Morning: Start personal study
const record = await startStudyRecord({
  userId, subjectId, topic
});

// 2. Complete pomodoros
await completePomodoroSession(recordId, userId, 85);
// ... repeat

// 3. Complete session
await completeStudyRecord(recordId, userId, {
  notes: 'Learned derivatives',
  tags: ['calculus', 'important'],
  finalFocusScore: 87
});
// → Auto update streak
// → Award reputation (15 + 10 = 25 points)

// 4. Afternoon: Join group study
await joinSession(sessionId, userId);

// 5. Session completes
// → +10 points for participant
// → +20 points for creator

// End of day stats:
// - Streak: +1 day
// - Reputation: +35 points (personal) + 10 (group) = 45 points
// - Study time: 60 + 120 = 180 minutes
```

---

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── study-records/
│   │   │   ├── start/route.ts
│   │   │   └── [id]/
│   │   │       ├── pause/route.ts
│   │   │       ├── resume/route.ts
│   │   │       ├── pomodoro/route.ts
│   │   │       └── complete/route.ts
│   │   ├── study-sessions/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── join/route.ts
│   │   │       ├── leave/route.ts
│   │   │       ├── start/route.ts
│   │   │       └── complete/route.ts
│   │   ├── study-streak/
│   │   │   ├── route.ts
│   │   │   └── leaderboard/route.ts
│   │   └── reputation/
│   │       ├── route.ts
│   │       └── stats/route.ts
│   └── (dashboard)/
│       ├── study-now/page.tsx
│       └── reputation/page.tsx
├── components/
│   └── dashboard/
│       ├── study-timer.tsx
│       ├── study-session-detail.tsx
│       └── study-dashboard.tsx
├── lib/
│   └── reputation-utils.ts
└── models/
    ├── StudySessionRecord.ts
    ├── StudySession.ts
    ├── StudyStreak.ts
    └── ReputationHistory.ts
```

---

## 🚀 Getting Started

1. **Setup models** - Đã có sẵn trong `/src/models/`

2. **Import components vào pages**:
```tsx
// Dashboard page
import StudyDashboard from '@/components/dashboard/study-dashboard';

// Study now page
import StudyTimer from '@/components/dashboard/study-timer';

// Session detail page
import StudySessionDetail from '@/components/dashboard/study-session-detail';
```

3. **Test API endpoints** - Sử dụng Postman hoặc Thunder Client

4. **Customize** - Điều chỉnh points, durations, milestones theo nhu cầu

---

## 💡 Tips & Best Practices

1. **Authentication**: Thay thế `body.userId` bằng session/token thực tế
2. **Notifications**: Implement Socket.io cho real-time updates
3. **Email**: Setup email service cho reminders
4. **Cron Jobs**: Setup để auto-start sessions, check streaks
5. **Analytics**: Track user behavior để improve features
6. **Mobile**: Tất cả components đều responsive

---

## 🐛 Common Issues

1. **Streak không update**: Check timezone, đảm bảo setHours(0,0,0,0)
2. **Points không award**: Check User model có field `reputation`
3. **Session full**: Check maxParticipants và participants_count
4. **Timer không countdown**: Check useEffect dependencies

---

Hệ thống hoàn chỉnh và ready to use! 🎉
