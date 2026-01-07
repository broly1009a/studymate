/**
 * Constants for StudyMate Matching System
 * Các hằng số cho hệ thống matching - StudyMate
 */

// Danh sách trường đại học trong khu vực Hòa Lạc
export const UNIVERSITIES = {
  FPT: 'Đại học FPT',
  UET: 'ĐH Công nghệ – ĐHQGHN',
  HUS: 'ĐH Khoa học Tự nhiên – ĐHQGHN',
  USSH: 'ĐH Khoa học xã hội và nhân văn – ĐHQGHN',
  VNU_ED: 'ĐH Giáo dục – ĐHQGHN',
  VJU: 'ĐH Việt Nhật',
  HVTC: 'Học viện tài chính',
} as const;

// Danh sách chuyên ngành theo từng trường
export const MAJORS_BY_UNIVERSITY = {
  [UNIVERSITIES.FPT]: [
    'Kỹ thuật phần mềm',
    'Trí tuệ nhân tạo (AI)',
    'An toàn thông tin',
    'Khoa học dữ liệu',
    'Thiết kế đồ họa',
    'Digital Marketing',
    'Kinh doanh quốc tế',
    'Quản trị kinh doanh',
    'Ngôn ngữ Anh',
    'Ngôn ngữ Nhật',
    'Ngôn ngữ Hàn',
  ],
  [UNIVERSITIES.UET]: [
    'Công nghệ thông tin',
    'Khoa học máy tính',
    'Kỹ thuật máy tính',
    'Hệ thống thông tin',
    'Trí tuệ nhân tạo',
    'Công nghệ mạng & truyền thông',
  ],
  [UNIVERSITIES.HUS]: [
    'Toán học',
    'Toán – Tin',
    'Vật lý học',
    'Hóa học',
    'Sinh học',
    'Khoa học môi trường',
    'Khoa học dữ liệu',
  ],
  [UNIVERSITIES.USSH]: [
    'Truyền thông đa phương tiện',
    'Báo chí',
    'Quan hệ công chúng',
    'Tâm lý học',
    'Xã hội học',
    'Ngôn ngữ học',
    'Đông phương học',
    'Quốc tế học',
  ],
  [UNIVERSITIES.VNU_ED]: [
    'Sư phạm Toán',
    'Sư phạm Tin học',
    'Sư phạm Vật lý',
    'Quản lý giáo dục',
    'Công nghệ giáo dục',
  ],
  [UNIVERSITIES.VJU]: [
    'Công nghệ nano',
    'Kỹ thuật môi trường',
    'Kinh doanh quốc tế',
    'Kỹ thuật xây dựng',
    'Chính sách công',
  ],
  [UNIVERSITIES.HVTC]: [
    'Tiếng Anh tài chính kế toán',
    'Kinh tế và quản lý nguồn lực tài chính',
    'Kinh tế chính trị - tài chính',
    'Kinh tế đầu tư',
    'Toán tài chính',
    'Quản trị doanh nghiệp - Quản trị kinh doanh du lịch',
    'Marketing',
    'Tài chính - Ngân hàng',
    'Kiểm toán',
  ],
} as const;

// Nhu cầu học tập
export const LEARNING_NEEDS = [
  'Tìm bạn đồng hành học môn',
  'Tìm bạn làm đồ án / capstone',
  'Lập team tham gia cuộc thi học thuật',
  'Luyện coding / giải thuật',
  'Học nhóm ôn thi giữa kỳ – cuối kỳ',
  'Luyện IELTS / TOEIC',
  'Học kỹ năng mềm (thuyết trình, teamwork)',
  'Tìm mentor / người đi trước',
  'Tìm mentee / hỗ trợ người khác học',
  'Học chung để tạo động lực',
] as const;

// Mục tiêu học tập
export const LEARNING_GOALS = [
  'Qua môn / cải thiện GPA',
  'Giành giải cuộc thi',
  'Làm portfolio cá nhân',
  'Chuẩn bị đi thực tập',
  'Chuẩn bị xin việc',
  'Học để làm dự án startup',
] as const;

// Thói quen học tập
export const STUDY_HABITS = [
  'Cú đêm',
  'Dậy sớm',
  'Học theo chu trình tập trung ngắn',
  'Học liên tục thời gian dài',
  'Học tốt khi có deadline',
  'Học theo nhóm hiệu quả hơn',
] as const;

// MBTI Types
export const MBTI_TYPES = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
] as const;

// Link MBTI test
export const MBTI_TEST_LINK = 'https://www.16personalities.com/free-personality-test';

// GPA Ranges
export const GPA_RANGES = [
  '<2.5',
  '2.5-3.0',
  '3.0-3.5',
  '3.5-4.0',
] as const;

// Gender options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
] as const;

// Education levels
export const EDUCATION_LEVELS = [
  { value: 'high_school', label: 'Trung học phổ thông' },
  { value: 'undergraduate', label: 'Đại học' },
  { value: 'graduate', label: 'Sau đại học' },
  { value: 'other', label: 'Khác' },
] as const;

// Helper function to get majors by university
export function getMajorsByUniversity(university: string): readonly string[] {
  return MAJORS_BY_UNIVERSITY[university as keyof typeof MAJORS_BY_UNIVERSITY] || [];
}

// Helper function to get all universities as options
export function getUniversityOptions() {
  return Object.entries(UNIVERSITIES).map(([key, value]) => ({
    value: value,
    label: value,
  }));
}

// Helper function to get all majors (for general use)
export function getAllMajors(): string[] {
  return Object.values(MAJORS_BY_UNIVERSITY).flat();
}
