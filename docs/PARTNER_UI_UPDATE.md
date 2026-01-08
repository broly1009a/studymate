# Partner UI Update - Cập nhật giao diện Partner

## Tổng quan

Đã cập nhật giao diện trang **Tìm bạn học** (`/matches`) và **Chi tiết Partner** (`/matches/[id]`) để phù hợp với cấu trúc dữ liệu mới từ User + UserProfile.

## Những thay đổi chính

### 1. **Trang danh sách Partners** (`/matches`)

#### Cấu trúc hiển thị mới:

```tsx
Partner Card:
├── Avatar + Status indicator
├── Name, University, Major
├── Rating & Review count
├── Match score (nếu có)
├── Bio (2 dòng)
├── Nhu cầu học tập (learningNeeds) - 2 items
├── Thói quen học tập (studyHabits) - 2 items
└── Stats: Study hours + Sessions completed
```

#### Filters mới:

- **Tìm kiếm**: Theo tên, bio, university, major
- **Đánh giá**: Tất cả / 4+ sao / 3+ sao
- **Trường**: Tất cả / Đại học FPT / ĐH Công nghệ / ...
- **Categories dropdown**:
  - Nhu cầu học tập
  - Mục tiêu học tập
  - Theo trường đại học

### 2. **Trang chi tiết Partner** (`/matches/[id]`)

#### Thông tin hiển thị:

**Profile Header:**
- Avatar (lớn hơn, 112x112px)
- Name + Age
- University + Major (mới)
- Rating + Review count
- Match score
- Bio

**Các card thông tin:**

1. **Nhu cầu học tập** (Learning Needs)
   - Thay thế "Môn học"
   - Hiển thị từ `partner.subjects` (từ learningNeeds)
   - Badge màu secondary

2. **Thói quen học tập** (Study Habits)
   - Thay thế "Phong cách học tập"
   - Hiển thị từ `partner.studyStyle` (từ studyHabits)
   - Badge outline

3. **Mục tiêu học tập** (Learning Goals)
   - Hiển thị từ `partner.goals` (từ learningGoals)
   - Dạng bullet list

4. **Thời gian rảnh** (Availability)
   - Chỉ hiển thị nếu có data
   - Icon calendar + text

**Sidebar:**
- Stats giữ nguyên
- Badges giữ nguyên

### 3. **API Updates** (`/api/partners`)

#### Query parameters mới:

```typescript
GET /api/partners?
  page=1
  &limit=9
  &search=keyword          // Tìm trong name, bio, major, university
  &subject=learning_need   // Filter theo nhu cầu học tập
  &minRating=4            // Filter theo rating
  &university=name        // Filter theo trường
  &major=name            // Filter theo ngành
```

#### Search logic:

```typescript
if (search) {
  query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { bio: { $regex: search, $options: 'i' } },
    { major: { $regex: search, $options: 'i' } },
    { university: { $regex: search, $options: 'i' } },
  ];
}
```

## Mapping dữ liệu UI

### Partner Card (List View)

| UI Element | Data Source | Ghi chú |
|-----------|------------|---------|
| Avatar | `partner.avatar` | From profileImages[0] or user.avatar |
| Name | `partner.name` | From user.fullName |
| University | `partner.university` | From education.institution |
| Major | `partner.major` | From education.major |
| Age | `partner.age` | Calculated from dateOfBirth |
| Bio | `partner.bio` | Line-clamp-2 |
| Nhu cầu học tập | `partner.subjects` | From learningNeeds, show 2 |
| Thói quen | `partner.studyStyle` | From studyHabits, show 2 |
| Rating | `partner.rating` | Default 0 |
| Match score | `partner.matchScore` | Optional |

### Partner Detail

Tương tự như card nhưng hiển thị đầy đủ:
- Tất cả learning needs (subjects)
- Tất cả study habits (studyStyle)
- Tất cả learning goals (goals)
- Availability (nếu có)

## Categories Navigation

### Cấu trúc mới:

```typescript
const mainCategories = [
  {
    id: 'learning-needs',
    name: 'Nhu cầu học tập',
    subcategories: [
      'Tìm bạn đồng hành học môn',
      'Luyện coding / giải thuật',
      'Làm đồ án / dự án chung',
      // ...
    ]
  },
  {
    id: 'learning-goals',
    name: 'Mục tiêu học tập',
    subcategories: [
      'Qua môn / cải thiện GPA',
      'Chuẩn bị đi thực tập',
      // ...
    ]
  },
  {
    id: 'universities',
    name: 'Theo trường đại học',
    subcategories: [
      'Đại học FPT',
      'ĐH Công nghệ – ĐHQGHN',
      // ...
    ]
  }
];
```

### Behavior:
- Hover để xem subcategories
- Click subcategory để filter
- Dropdown đóng sau khi chọn

## Style Updates

### Colors & Badges:

```tsx
// Learning Needs (Subjects)
<Badge variant="secondary">Nhu cầu</Badge>

// Study Habits
<Badge variant="outline">Thói quen</Badge>

// Learning Goals
<Badge className="bg-green-500/10 text-green-700 border-green-500/20">
  Mục tiêu
</Badge>

// Match Score
<Badge className="bg-blue-500/10 text-blue-500">
  85% Match
</Badge>
```

### Status Indicators:

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'bg-green-500';
    case 'busy': return 'bg-yellow-500';
    case 'offline': return 'bg-gray-500';
  }
}
```

## Empty States

### Không tìm thấy partners:

```tsx
<Card>
  <CardContent>
    <Users className="h-12 w-12 opacity-50" />
    <h3>Không tìm thấy bạn học</h3>
    <p>Thử điều chỉnh bộ lọc tìm kiếm</p>
    <Button onClick={clearFilters}>Xóa bộ lọc</Button>
  </CardContent>
</Card>
```

## Responsive Design

### Mobile (< 768px):
- Grid: 1 column
- Search + filters stack vertically
- Categories dropdown full width

### Tablet (768px - 1024px):
- Grid: 2 columns
- Filters horizontal

### Desktop (> 1024px):
- Grid: 3 columns
- All filters visible
- Detail page: 2 cols (main) + 1 col (sidebar)

## Testing

### Test cases:

1. **Display Partner với đầy đủ thông tin**
   - Có avatar, university, major
   - Có learningNeeds, studyHabits, learningGoals
   - Match score hiển thị đúng

2. **Display Partner thiếu thông tin**
   - Không có availability → Không hiển thị card
   - Không có bio → "Chưa có giới thiệu"
   - Empty arrays → Không crash

3. **Filter hoạt động**
   - Search theo tên, university
   - Filter theo rating
   - Filter theo university
   - Combine multiple filters

4. **Pagination**
   - Next/Previous buttons
   - Current page display
   - Total pages calculation

## Files Changed

```
src/app/(dashboard)/matches/page.tsx
  - Updated state: universityFilter, majorFilter
  - Updated categories structure
  - Updated API call with new params
  - Updated Partner card UI
  - Added new filters

src/app/(dashboard)/matches/[id]/page.tsx
  - Updated profile header: show university + major
  - Renamed sections: subjects → learningNeeds
  - Renamed sections: studyStyle → studyHabits
  - Added conditional rendering for availability

src/app/api/partners/route.ts
  - Added university, major query params
  - Updated search to include university, major
  - Changed $text search to $or with regex
```

## Next Steps

1. ✅ Update UI to match new Partner structure
2. ✅ Add university & major filters
3. ✅ Update API to support new filters
4. ⏳ Implement matching algorithm with scoring
5. ⏳ Add real-time status updates (Socket.IO)
6. ⏳ Add "Similar partners" recommendation
7. ⏳ Add filter by MBTI compatibility

## Notes

- **Backward compatibility**: Code vẫn hoạt động với Partner cũ (không có university/major)
- **Performance**: Search với regex có thể chậm với DB lớn → Consider text index
- **UX**: Match score placeholder (0) cho đến khi implement matching algorithm
