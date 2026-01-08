# Partner Auto-Sync Logic

## Tổng quan

Hệ thống tự động tạo/cập nhật **Partner profile** khi user hoàn tất **Onboarding** hoặc cập nhật profile.

## Luồng hoạt động

```
Register → Email Verify → Onboarding (4 steps) → Update Profile → [AUTO] Sync Partner
```

### Chi tiết các bước:

1. **User đăng ký** (`/register`)
   - Tạo User với email, username, password
   - Gửi email verification

2. **User xác thực email** (`/verify-email`)
   - Kích hoạt tài khoản

3. **User hoàn tất Onboarding** (`/onboarding`)
   - Step 1: Thông tin cá nhân + Profile images
   - Step 2: Thông tin học tập
   - Step 3: Nhu cầu & Mục tiêu
   - Step 4: Kỹ năng & Thành tựu
   - → Call API `POST /api/profiles/me`

4. **API tự động sync Partner**
   - Kiểm tra profile đã đủ thông tin
   - Tạo/cập nhật Partner profile
   - User sẵn sàng cho matching system

## Mapping dữ liệu

### User + UserProfile → Partner

| Partner Field | Nguồn dữ liệu | Ghi chú |
|--------------|---------------|---------|
| `userId` | `User._id` | Reference đến User |
| `name` | `User.fullName` | Tên đầy đủ |
| `avatar` | `User.profileImages[0].url` \|\| `User.avatar` | Ưu tiên ảnh profile đầu tiên |
| `age` | Tính từ `User.dateOfBirth` | Hàm `calculateAge()` |
| `major` | `UserProfile.education.major` | Chuyên ngành |
| `university` | `UserProfile.education.institution` | Trường đại học |
| `bio` | `UserProfile.bio` \|\| `User.bio` | Giới thiệu bản thân |
| `subjects` | `UserProfile.learningNeeds` | Nhu cầu học tập |
| `studyStyle` | `UserProfile.studyHabits` | Thói quen học tập |
| `goals` | `UserProfile.learningGoals` | Mục tiêu học tập |
| `timezone` | `'GMT+7'` | Mặc định Việt Nam |
| `languages` | `['Tiếng Việt']` | Mặc định tiếng Việt |
| `status` | `'available'` | Sẵn sàng khi profile hoàn tất |
| `availability` | `[]` | Có thể thêm sau |

## Code Implementation

### 1. Helper Functions

```typescript
/**
 * Tính tuổi từ ngày sinh
 */
function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Kiểm tra profile đã đủ thông tin
 */
function isProfileComplete(user: any, userProfile: any): boolean {
  return !!(
    user.fullName &&
    user.dateOfBirth &&
    userProfile.education?.institution &&
    userProfile.education?.major &&
    userProfile.learningNeeds?.length > 0
  );
}

/**
 * Tạo hoặc cập nhật Partner profile
 */
async function createOrUpdatePartner(
  userId: string,
  user: any,
  userProfile: any
): Promise<void> {
  // Map data from User + UserProfile
  const partnerData = {
    userId: new mongoose.Types.ObjectId(userId),
    name: user.fullName,
    avatar: user.profileImages?.[0]?.url || user.avatar,
    age: calculateAge(user.dateOfBirth),
    major: userProfile.education?.major,
    university: userProfile.education?.institution,
    bio: userProfile.bio || user.bio,
    subjects: userProfile.learningNeeds || [],
    studyStyle: userProfile.studyHabits || [],
    goals: userProfile.learningGoals || [],
    timezone: 'GMT+7',
    languages: ['Tiếng Việt'],
    status: 'available',
  };

  // Upsert (create or update)
  await Partner.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    { $set: partnerData },
    { upsert: true, new: true }
  );
}
```

### 2. Integration vào API

**File:** `src/app/api/profiles/me/route.ts`

```typescript
export async function POST(request: NextRequest) {
  // ... update User and UserProfile ...

  // Auto-sync Partner profile if complete
  if (isProfileComplete(user, userProfile)) {
    await createOrUpdatePartner(decoded.id, user, userProfile);
  }

  // ... return response ...
}
```

## Điều kiện tạo Partner

Partner chỉ được tạo khi profile đủ các thông tin **BẮT BUỘC**:

✅ `user.fullName` - Tên đầy đủ  
✅ `user.dateOfBirth` - Ngày sinh (để tính tuổi)  
✅ `userProfile.education.institution` - Trường đại học  
✅ `userProfile.education.major` - Chuyên ngành  
✅ `userProfile.learningNeeds.length > 0` - Ít nhất 1 nhu cầu học tập

## Lợi ích

### 1. **Tự động hóa**
- User không cần tạo Partner profile thủ công
- Giảm thiểu bước thừa trong onboarding

### 2. **Data consistency**
- Partner luôn sync với User và UserProfile
- Khi user cập nhật profile → Partner tự động cập nhật

### 3. **Sẵn sàng cho Matching**
- Ngay sau onboarding, user có thể:
  - Tìm kiếm partner (`/matches`)
  - Gửi partner request
  - Nhận partner request từ người khác

### 4. **Không block onboarding**
- Nếu sync Partner bị lỗi → chỉ log error
- User vẫn hoàn tất onboarding được
- Partner có thể sync lại sau

## API Endpoints liên quan

### POST /api/profiles/me
Update profile và auto-sync Partner

**Flow:**
1. Update User model
2. Update UserProfile model
3. Update Skills (nếu có)
4. **[AUTO] Create/Update Partner** ← Logic mới
5. Return updated profile

### GET /api/partners
Lấy danh sách partners để matching

**Query:**
- `subject`, `status`, `minRating`, `minMatchScore`, `search`

**Response:**
- Danh sách Partner profiles đã được sync

## Testing

### Test case 1: Onboarding hoàn chỉnh
```
1. User hoàn tất 4 bước onboarding
2. Submit step 4
3. → Kiểm tra Partner được tạo trong DB
4. → Verify các field được map đúng
```

### Test case 2: Update profile
```
1. User đã có Partner
2. Update major từ "CNTT" → "Kinh tế"
3. → Kiểm tra Partner.major được cập nhật
```

### Test case 3: Profile thiếu thông tin
```
1. User chỉ điền Step 1 + 2
2. Chưa có learningNeeds
3. → Partner KHÔNG được tạo
4. User điền thêm Step 3
5. → Partner được tạo
```

## Logs

Khi Partner được sync, sẽ có log:

```
✅ Partner profile synced for user: 507f1f77bcf86cd799439011
```

Nếu có lỗi:

```
❌ Error creating/updating partner: [error details]
```

## Next Steps

1. ✅ Implement auto-sync logic
2. ⏳ Test với real user flow
3. ⏳ Thêm field `availability` vào profile settings
4. ⏳ Implement matching algorithm
5. ⏳ Build partner search UI
