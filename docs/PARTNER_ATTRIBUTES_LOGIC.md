# Partner Attributes Logic Flow - Luồng Logic các Thuộc tính Partner

## 📊 Tổng quan

Document này giải thích **nguồn gốc và cách cập nhật** từng thuộc tính trong Partner model.

---

## 🔄 Các loại thuộc tính

### ✅ **1. Auto-Sync Attributes** (Tự động sync từ User + UserProfile)

| Thuộc tính | Nguồn | Update Logic | Khi nào update? |
|-----------|-------|--------------|----------------|
| `userId` | `User._id` | One-time set | Khi tạo Partner |
| `name` | `User.fullName` | Auto-sync | Mỗi khi update profile |
| `age` | `calculateAge(User.dateOfBirth)` | Auto-sync | Mỗi khi update profile |
| `university` | `UserProfile.education.institution` | Auto-sync | Mỗi khi update profile |
| `major` | `UserProfile.education.major` | Auto-sync | Mỗi khi update profile |
| `avatar` | `User.profileImages[0].url` \|\| `User.avatar` | Auto-sync | Mỗi khi update profile |
| `bio` | `UserProfile.bio` \|\| `User.bio` | Auto-sync | Mỗi khi update profile |
| `subjects` | `UserProfile.learningNeeds` | Auto-sync | Mỗi khi update profile |
| `studyStyle` | `UserProfile.studyHabits` | Auto-sync | Mỗi khi update profile |
| `goals` | `UserProfile.learningGoals` | Auto-sync | Mỗi khi update profile |
| `timezone` | Default: `'GMT+7'` | Auto-sync | Mỗi khi update profile |
| `languages` | Default: `['Tiếng Việt']` | Auto-sync | Mỗi khi update profile |
| `status` | `'available'` when profile complete | Auto-sync | Khi hoàn tất onboarding |

**Code thực hiện:**
```typescript
// File: src/app/api/profiles/me/route.ts
async function createOrUpdatePartner(userId, user, userProfile) {
  const partnerData = {
    userId,
    name: user.fullName,
    age: calculateAge(user.dateOfBirth),
    university: userProfile.education.institution,
    major: userProfile.education.major,
    // ... các field khác
  };
  
  await Partner.findOneAndUpdate(
    { userId },
    { $set: partnerData },
    { upsert: true }
  );
}
```

---

### 📊 **2. Accumulated Attributes** (Tích lũy từ hoạt động)

| Thuộc tính | Nguồn | Update Logic | Khi nào update? |
|-----------|-------|--------------|----------------|
| `studyHours` | Tính từ StudySession | Increment | Sau mỗi study session |
| `sessionsCompleted` | Đếm StudySession completed | Increment | Khi session hoàn tất |
| `rating` | Tính trung bình từ Reviews | Recalculate | Khi có review mới |
| `reviewsCount` | Đếm số Reviews | Increment | Khi có review mới |
| `badges` | Achievement system | Add/Remove | Khi đạt achievement |

**Chưa implement - Cần làm sau:**

```typescript
// Example: Update studyHours after session
async function completeStudySession(partnerId, hours) {
  await Partner.findByIdAndUpdate(partnerId, {
    $inc: { 
      studyHours: hours,
      sessionsCompleted: 1 
    }
  });
}

// Example: Update rating after review
async function updatePartnerRating(partnerId) {
  const reviews = await Review.find({ partnerId });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  await Partner.findByIdAndUpdate(partnerId, {
    rating: avgRating,
    reviewsCount: reviews.length
  });
}
```

---

### ⚙️ **3. Manual/Settings Attributes** (User tự set)

| Thuộc tính | Nguồn | Update Logic | Khi nào update? |
|-----------|-------|--------------|----------------|
| `availability` | User settings | Manual | Khi user cập nhật settings |
| `lastActive` | Activity tracking | Auto-update | Mỗi khi user login/active |

**Chưa implement - Cần UI để user set:**

```typescript
// Example: User updates availability
PUT /api/profile/availability
{
  "availability": ["Thứ 2 - 19:00-21:00", "Thứ 5 - 14:00-16:00"]
}
```

---

### 🎯 **4. Calculated Attributes** (Tính toán động - KHÔNG LƯU DB)

| Thuộc tính | Tính toán | Khi nào | Lưu DB? |
|-----------|-----------|---------|---------|
| `matchScore` | **calculateMatchScore()** | Mỗi lần API GET /api/partners | ❌ KHÔNG |

**⚠️ MatchScore KHÔNG được lưu vào DB!**

#### Tại sao?

1. **Dynamic per user**: Match score khác nhau cho mỗi user
   - User A nhìn Partner B: 85% match
   - User C nhìn Partner B: 60% match

2. **Real-time calculation**: Tính toán mỗi khi fetch partners
3. **Depends on current user**: Cần so sánh user hiện tại vs partner

#### Logic tính matchScore:

```typescript
// File: src/lib/matching-algorithm.ts

export function calculateMatchScore(user, partner): number {
  let score = 0;
  
  // 1. University Match (20%)
  if (user.university === partner.university) score += 20;
  
  // 2. Major Match (20%)
  if (user.major === partner.major) score += 20;
  else if (areRelatedMajors(user.major, partner.major)) score += 10;
  
  // 3. Learning Needs Overlap (20%)
  const needsOverlap = calculateArrayOverlap(user.learningNeeds, partner.subjects);
  score += needsOverlap * 20;
  
  // 4. Learning Goals Overlap (15%)
  const goalsOverlap = calculateArrayOverlap(user.learningGoals, partner.goals);
  score += goalsOverlap * 15;
  
  // 5. Study Habits Compatibility (10%)
  const habitsOverlap = calculateArrayOverlap(user.studyHabits, partner.studyStyle);
  score += habitsOverlap * 10;
  
  // 6. MBTI Compatibility (10%)
  // ... MBTI logic
  
  // 7. Age Proximity (5%)
  const ageDiff = Math.abs(user.age - partner.age);
  if (ageDiff === 0) score += 5;
  else if (ageDiff <= 2) score += 4;
  // ...
  
  return Math.round(score); // 0-100
}
```

#### Flow trong API:

```typescript
// File: src/app/api/partners/route.ts

export async function GET(request) {
  // 1. Get current user from auth token
  const currentUser = getUserFromToken(request);
  
  // 2. Fetch partners from DB (NO matchScore in DB)
  const partners = await Partner.find(query).lean();
  
  // 3. Calculate matchScore for each partner vs current user
  const partnersWithScore = partners.map(partner => ({
    ...partner,
    matchScore: calculateMatchScore(currentUser, partner)
  }));
  
  // 4. Sort by matchScore DESC
  partnersWithScore.sort((a, b) => b.matchScore - a.matchScore);
  
  // 5. Return với matchScore đã tính
  return { data: partnersWithScore };
}
```

---

## 🚀 Complete Flow Example

### Scenario: User A xem danh sách partners

```
1. User A đăng nhập
   ↓
2. Vào trang /matches
   ↓
3. Frontend call API:
   GET /api/partners
   Headers: { Authorization: "Bearer <token>" }
   ↓
4. API:
   a. Verify token → Get User A's data
      - university: "Đại học FPT"
      - major: "Kỹ thuật phần mềm"
      - learningNeeds: ["Luyện coding", "Làm đồ án"]
      - age: 22
   
   b. Fetch all partners from DB
      Partner B: {
        university: "Đại học FPT",
        major: "Kỹ thuật phần mềm",
        subjects: ["Luyện coding", "Ôn thi"],
        age: 23,
        // NO matchScore in DB
      }
   
   c. Calculate matchScore:
      - Same university: +20
      - Same major: +20
      - learningNeeds overlap: 50% → +10
      - age diff = 1 → +4
      Total: 54%
   
   d. Return:
      Partner B: { ...data, matchScore: 54 }
   ↓
5. Frontend displays:
   "Partner B - 54% Match"
```

---

## 📝 Summary Table

| Attribute | Auto-Sync | Manual | Calculated | Accumulated | Stored in DB |
|-----------|-----------|--------|------------|-------------|--------------|
| name | ✅ | | | | ✅ |
| age | ✅ | | | | ✅ |
| university | ✅ | | | | ✅ |
| major | ✅ | | | | ✅ |
| avatar | ✅ | | | | ✅ |
| bio | ✅ | | | | ✅ |
| subjects | ✅ | | | | ✅ |
| studyStyle | ✅ | | | | ✅ |
| goals | ✅ | | | | ✅ |
| timezone | ✅ | | | | ✅ |
| languages | ✅ | | | | ✅ |
| status | ✅ | | | | ✅ |
| availability | | ✅ | | | ✅ |
| lastActive | | ✅ | | | ✅ |
| studyHours | | | | ✅ | ✅ |
| rating | | | | ✅ | ✅ |
| reviewsCount | | | | ✅ | ✅ |
| sessionsCompleted | | | | ✅ | ✅ |
| badges | | | | ✅ | ✅ |
| **matchScore** | | | ✅ | | ❌ **NO** |

---

## 🎯 Key Takeaways

1. **matchScore KHÔNG LƯU trong DB** - Tính toán động mỗi request
2. **Auto-sync attributes** - Update tự động khi user cập nhật profile
3. **Accumulated attributes** - Tích lũy từ hoạt động (studyHours, rating, etc.)
4. **Manual attributes** - User tự set (availability)
5. **Calculated attributes** - Tính toán real-time (matchScore)

## 🔨 Implementation Status

- ✅ Auto-sync logic (Done)
- ✅ MatchScore calculation (Done)
- ✅ API integration (Done)
- ⏳ Accumulated attributes (TODO: StudySession, Reviews)
- ⏳ Manual attributes (TODO: Availability settings UI)
- ⏳ MBTI compatibility (TODO: Enhanced matching)
