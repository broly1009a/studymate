# Matching System - StudyMate

## Tổng quan

Hệ thống matching được thiết kế để kết nối sinh viên dựa trên 4 nhóm thông tin chính:

### 1. Thông tin cá nhân (Bắt buộc - 100%)
- **Họ tên** (`fullName`): Text
- **Giới tính** (`gender`): Nam / Nữ / Khác
- **Ngày sinh** (`dateOfBirth`): Date (dd/mm/yyyy)

### 2. Thông tin học tập (Bắt buộc - 100%)
- **Trường đại học** (`education.institution`): Dropdown
  - Các trường trong khu vực Hòa Lạc
- **Chuyên ngành** (`education.major`): Dropdown (dynamic based on university)

### 3. Nhu cầu & Mục tiêu (Bắt buộc trừ MBTI - 75%)
- **Nhu cầu học tập** (`learningNeeds`): Multi-select
- **Mục tiêu học tập** (`learningGoals`): Multi-select
- **Thói quen học tập** (`studyHabits`): Multi-select
- **MBTI** (`mbtiType`): Dropdown (Optional)
  - Link test MBTI: https://www.16personalities.com/free-personality-test

### 4. Kỹ năng & Thành tựu (Không bắt buộc - 0%)
- **GPA** (`gpa`): Dropdown (<2.5 / 2.5-3.0 / 3.0-3.5 / 3.5-4.0)
- **Giải thưởng** (`awards`): Text array
- **Chứng chỉ** (`certificates`): Text array
- **Kỹ năng** (Skill model): Separate collection

## Cấu trúc Database

### User Model (`User.ts`)
```typescript
{
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: Date;
  school: string; // Legacy field
  major: string; // Legacy field
  // ... other user fields
}
```

### UserProfile Model (`UserProfile.ts`)
```typescript
{
  userId: ObjectId;
  education: {
    level: string;
    institution: string; // Trường đại học
    major: string; // Chuyên ngành
    graduationYear: number;
  };
  
  // Matching data - Nhóm 3
  learningNeeds: string[];
  learningGoals: string[];
  studyHabits: string[];
  mbtiType: string;
  
  // Matching data - Nhóm 4
  gpa: string;
  awards: string[];
  certificates: string[];
  // ... other profile fields
}
```

### Skill Model (`Skill.ts`)
```typescript
{
  userId: ObjectId;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
}
```

## Files Created/Updated

### Models
- ✅ `src/models/User.ts` - Added gender, dateOfBirth
- ✅ `src/models/UserProfile.ts` - Added all matching fields

### Constants & Types
- ✅ `src/lib/matching-constants.ts` - All dropdown options
- ✅ `src/types/matching.ts` - TypeScript types
- ✅ `src/lib/matching-validations.ts` - Zod schemas

### Constants Included
- `UNIVERSITIES` - Danh sách 7 trường đại học
- `MAJORS_BY_UNIVERSITY` - Chuyên ngành theo từng trường
- `LEARNING_NEEDS` - 10 nhu cầu học tập
- `LEARNING_GOALS` - 6 mục tiêu học tập
- `STUDY_HABITS` - 6 thói quen học tập
- `MBTI_TYPES` - 16 loại MBTI
- `GPA_RANGES` - 4 mức GPA
- `GENDER_OPTIONS` - 3 lựa chọn giới tính

## Usage Example

### Updating Profile with Matching Data
```typescript
import { updateProfileSchema } from '@/lib/matching-validations';

const profileData = {
  fullName: 'Luyện Duy Anh',
  gender: 'male',
  dateOfBirth: new Date('2002-01-15'),
  education: {
    level: 'undergraduate',
    institution: 'Đại học FPT',
    major: 'Kỹ thuật phần mềm',
    graduationYear: 2025,
  },
  learningNeeds: [
    'Tìm bạn đồng hành học môn',
    'Luyện coding / giải thuật'
  ],
  learningGoals: [
    'Qua môn / cải thiện GPA',
    'Chuẩn bị đi thực tập'
  ],
  studyHabits: [
    'Dậy sớm',
    'Học theo nhóm hiệu quả hơn'
  ],
  mbtiType: 'INTJ',
  gpa: '3.5-4.0',
  certificates: ['IELTS 7.5', 'AWS Certified'],
};

// Validate
const validated = updateProfileSchema.parse(profileData);
```

### Getting Major Options
```typescript
import { getMajorsByUniversity } from '@/lib/matching-constants';

const majors = getMajorsByUniversity('Đại học FPT');
// Returns: ['Kỹ thuật phần mềm', 'Trí tuệ nhân tạo (AI)', ...]
```

## Matching Algorithm (To be implemented)

Điểm matching sẽ được tính dựa trên:

1. **University Match** (20%) - Cùng trường
2. **Major Match** (20%) - Cùng ngành
3. **Learning Needs** (20%) - Overlap nhu cầu
4. **Learning Goals** (15%) - Overlap mục tiêu
5. **Study Habits** (10%) - Tương đồng thói quen
6. **MBTI Compatibility** (10%) - Tương thích tính cách
7. **Age Proximity** (5%) - Cùng độ tuổi

## Next Steps

1. ✅ Update models
2. ✅ Create constants and types
3. ✅ Create validation schemas
4. ⏳ Update profile API to handle new fields
5. ⏳ Create UI components for profile form
6. ⏳ Implement matching algorithm
7. ⏳ Create matching API endpoints
8. ⏳ Build matching UI

## API Endpoints (Planned)

- `POST /api/profiles/me` - Update profile with matching data
- `GET /api/profiles/me` - Get current user profile
- `POST /api/matching/find` - Find compatible study partners
- `GET /api/matching/suggestions` - Get match suggestions
- `POST /api/matching/preferences` - Save matching preferences
