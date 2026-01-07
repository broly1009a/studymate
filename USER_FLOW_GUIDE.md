# 🎯 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG STUDY

## 📌 LUỒNG SỬ DỤNG TỔNG QUAN

### **Luồng 1: User mới bắt đầu sử dụng hệ thống**

```
1. Đăng nhập → Dashboard
2. Xem Study Streak (0 days) và Reputation (Novice)
3. Vào "Study Now" để bắt đầu học lần đầu
4. Chọn môn học và topic → Start Study Timer
5. Hoàn thành session → Nhận 10 points + Streak 1 day
6. Quay lại Dashboard → Thấy stats đã update
```

### **Luồng 2: User học hàng ngày (Build Streak)**

```
Day 1: Study → Streak = 1, +10 points
Day 2: Study → Streak = 2, +15 points
Day 3: Study → Streak = 3, +15 points + Milestone bonus (+15 points)
Day 7: Study → Streak = 7, +15 points + Milestone bonus (+35 points)
Day 30: Study → Streak = 30, +15 points + Milestone bonus (+150 points)
```

### **Luồng 3: User tham gia Group Study**

```
1. Vào "Study Sessions" page
2. Browse các sessions đang có
3. Click vào session chi tiết → Join
4. Khi đến giờ → Creator start session
5. Học cùng nhau qua meet link
6. Session complete → Mỗi người +10 points, Creator +20 points
```

---

## 🚀 CÁC BƯỚC TÍCH HỢP

### **Bước 1: Thêm Navigation Links**

Trong sidebar/navigation, thêm các links:

```tsx
// src/app/(dashboard)/layout.tsx hoặc navigation component
const menuItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/study-now', icon: Timer, label: 'Study Now' },      // NEW
  { href: '/study-sessions', icon: Users, label: 'Study Sessions' },
  { href: '/reputation', icon: Award, label: 'Reputation' },    // NEW
  { href: '/goals', icon: Target, label: 'Goals' },
  // ... các items khác
];
```

### **Bước 2: Update Dashboard Page**

Thêm Study Dashboard component vào dashboard chính:

```tsx
// src/app/(dashboard)/dashboard/page.tsx
import StudyDashboard from '@/components/dashboard/study-dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Study Stats Dashboard */}
      <StudyDashboard />
      
      {/* Các components khác */}
      <FindPartnerCTA />
      <TinderEvents />
      <RecentActivity />
    </div>
  );
}
```

### **Bước 3: Tích hợp Study Sessions List**

Update study-sessions page để hiển thị list và detail:

```tsx
// src/app/(dashboard)/study-sessions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export default function StudySessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/study-sessions?status=scheduled&limit=20');
      const data = await response.json();
      if (data.success) {
        setSessions(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Study Sessions</h1>
        <Link href="/study-sessions/create">
          <Button>Create Session</Button>
        </Link>
      </div>

      {/* List sessions */}
      <div className="grid gap-4">
        {sessions.map((session) => (
          <Card key={session._id} className="p-4">
            <Link href={`/study-sessions/${session._id}`}>
              <h3 className="font-semibold">{session.title}</h3>
              <p className="text-sm text-muted-foreground">{session.description}</p>
              {/* More details */}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### **Bước 4: Create Study Session Detail Page**

```tsx
// src/app/(dashboard)/study-sessions/[id]/page.tsx
'use client';

import StudySessionDetail from '@/components/dashboard/study-session-detail';

export default function SessionDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <StudySessionDetail sessionId={params.id} />
    </div>
  );
}
```

### **Bước 5: Thêm Quick Actions vào Home**

```tsx
// src/app/(dashboard)/home/page.tsx
// Thêm quick action buttons

<div className="grid grid-cols-2 gap-4">
  <Link href="/study-now">
    <Button className="w-full" size="lg">
      <Timer className="mr-2" />
      Start Studying
    </Button>
  </Link>
  
  <Link href="/study-sessions">
    <Button variant="outline" className="w-full" size="lg">
      <Users className="mr-2" />
      Join Session
    </Button>
  </Link>
</div>
```

---

## 📱 FLOW DIAGRAMS

### **Personal Study Flow**

```
┌─────────────────┐
│   Study Now     │
│   Page          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Select Subject  │
│ & Topic         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Study Timer    │
│  Component      │
│                 │
│ - 25min timer   │
│ - Pomodoro      │
│ - Focus score   │
│ - Notes/Tags    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Complete        │
│ Session         │
│                 │
│ ✓ Update Streak │
│ ✓ Award Points  │
│ ✓ Save Stats    │
└─────────────────┘
```

### **Group Study Flow**

```
┌──────────────────┐      ┌──────────────────┐
│  Creator         │      │  Participants    │
│  Create Session  │      │  Browse Sessions │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│ Session Created  │◄─────┤  Join Session    │
│ status=scheduled │      │                  │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         └────────┬────────────────┘
                  ▼
         ┌──────────────────┐
         │ Session Starts   │
         │ status=ongoing   │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Study Together   │
         │ (Meet Link)      │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Session Complete │
         │                  │
         │ ✓ All +10 points │
         │ ✓ Creator +20    │
         └──────────────────┘
```

### **Reputation & Streak Flow**

```
┌──────────────────┐
│  Study Activity  │
└────────┬─────────┘
         │
         ├───────────────────┐
         ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│ Update Streak    │  │ Award Reputation │
│                  │  │                  │
│ Day 1 → 2 → 3    │  │ +10, +15, +30... │
│ Check milestone  │  │ Check rank up    │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         └──────────┬──────────┘
                    ▼
         ┌──────────────────┐
         │ Update Dashboard │
         │                  │
         │ - Show new rank  │
         │ - Show streak    │
         │ - Show progress  │
         └──────────────────┘
```

---

## 🎮 USER JOURNEY EXAMPLES

### **Example 1: Student học lần đầu**

1. **Day 0 - Đăng ký**
   - Reputation: 0 (Novice)
   - Streak: 0 days
   - No sessions

2. **Day 1 - 08:00 AM**
   - Click "Study Now"
   - Select "Mathematics - Calculus"
   - Study 1 hour with Pomodoro (2 pomodoros, focus score 85)
   - Complete session
   - **Result:** Streak = 1, Reputation = 25 points (15 for 1h + 10 for high focus)

3. **Day 1 - 02:00 PM**
   - Join group study session "Advanced Calculus"
   - Study 2 hours with group
   - Session completes
   - **Result:** Reputation = 35 points (+10 from session)

4. **Day 2 - 09:00 AM**
   - Study again (keep streak)
   - **Result:** Streak = 2, Reputation = 50 points

5. **Day 3 - 09:00 AM**
   - Study again
   - **Hit Milestone:** 3-day streak!
   - **Result:** Streak = 3, Reputation = 80 points (+15 bonus)
   - **Rank Up:** Novice → Beginner (reached 100 points after a few more sessions)

### **Example 2: Active student - 1 tuần**

```
Mon:  Study 1h → Streak 1, +15 pts
Tue:  Study 2h → Streak 2, +30 pts
Wed:  Study 1h + Join session → Streak 3, +25 pts + Milestone +15
Thu:  Study 1h → Streak 4, +15 pts
Fri:  Study 2h + Create session → Streak 5, +50 pts
Sat:  Study 1h → Streak 6, +15 pts
Sun:  Study 1h → Streak 7, +15 pts + Milestone +35

Total: Streak = 7 days, Reputation = 215 points
Rank: Beginner → Intermediate (500 points goal)
```

---

## 🛠️ CUSTOMIZATION OPTIONS

### **Adjust Pomodoro Timer**

```tsx
// In study-timer.tsx, change constants
const POMODORO_DURATION = 25 * 60; // Change to 30 * 60 for 30min
const BREAK_DURATION = 5 * 60;     // Change to 10 * 60 for 10min
```

### **Adjust Reputation Points**

```tsx
// In reputation-utils.ts, modify REPUTATION_RULES
study_1hour: { points: 20, reason: '...' }, // Change from 15 to 20
```

### **Adjust Streak Milestones**

```tsx
// In complete route, modify milestones array
const milestones = [3, 7, 14, 21, 30, 60, 90]; // Add 21-day milestone
```

---

## 📊 MONITORING & ANALYTICS

### **Admin Dashboard (Optional)**

Bạn có thể tạo admin dashboard để monitor:

```sql
-- Top students by reputation
SELECT userId, reputation, rank FROM users ORDER BY reputation DESC LIMIT 10

-- Active streaks
SELECT userId, current, longest FROM study_streaks WHERE current > 0 ORDER BY current DESC

-- Popular study sessions
SELECT subject, COUNT(*) as sessions FROM study_sessions GROUP BY subject

-- Total study time by user
SELECT userId, SUM(duration) as totalMinutes FROM study_session_records GROUP BY userId
```

---

## ✅ CHECKLIST TRIỂN KHAI

- [ ] 1. Copy tất cả components vào project
- [ ] 2. Copy tất cả API routes vào project  
- [ ] 3. Verify models đã có trong database
- [ ] 4. Add User.reputation field nếu chưa có
- [ ] 5. Thêm navigation links cho Study Now, Reputation
- [ ] 6. Update Dashboard page với StudyDashboard component
- [ ] 7. Create study-sessions/[id]/page.tsx
- [ ] 8. Test luồng study cá nhân
- [ ] 9. Test luồng study nhóm
- [ ] 10. Test reputation system
- [ ] 11. Setup cron jobs (optional) cho auto-start sessions
- [ ] 12. Setup notifications (optional)
- [ ] 13. Test trên mobile
- [ ] 14. Deploy to production

---

Hệ thống đã hoàn chỉnh và sẵn sàng sử dụng! 🚀
