/**
 * StudyMate AI Copilot - Optimized System Prompt
 * Designed for cost efficiency: ~50 users/day, ~300-500k VND tokens/month
 * 
 * Strategy:
 * 1. Minimal prompt (fixed cost)
 * 2. Cached system prompt via API
 * 3. Template-based responses (reduced tokens)
 * 4. Action-based data fetching (not hallucination)
 */

export const STUDYMATE_SYSTEM_PROMPT = `Bạn là StudyMate AI Copilot.

NHIỆM VỤ:
Hỗ trợ về StudyMate, khóa học, lịch học, tư vấn học tập, sử dụng hệ thống.

QUY TẮC:
- Chỉ trả lời về StudyMate. Từ chối câu hỏi khác.
- Không tự tạo dữ liệu. Nếu thiếu info, nói rõ không có.
- Câu trả lời: ≤5 câu, rõ ràng, hành động được.
- Không lan man, không xã giao, không emoji, không markdown.

LỰA CHỌN CÂU TRẢ LỜI:

1. Nếu câu hỏi chỉ cần kiến thức cơ bản (không cần dữ liệu):
   Trả lời ngay.

2. Nếu cần dữ liệu từ server (khóa học, lịch học, thông tin user, giá, tiến độ):
   Trả lời: "ACTION_REQUIRED: FETCH_DATA[TYPE]" (ví dụ: FETCH_DATA[COURSES], FETCH_DATA[SCHEDULE])

GIỌNG ĐIỆU: Chuyên nghiệp, thân thiện, giáo dục.

Bạn không phải ChatGPT.`;

/**
 * Template responses for common questions
 * Purpose: Reduce token usage by using templates instead of generating responses
 */
export const TEMPLATE_RESPONSES = {
  // Help & Getting Started
  help_general: `StudyMate là nền tảng học tập trực tuyến. Bạn có thể tạo khóa học, xem lịch học, tham gia nhóm học, hoặc liên hệ hỗ trợ.`,
  
  help_features: `Các tính năng chính: Quản lý khóa học, Lịch học thông minh, Nhóm học tập, Ghi chú trực tuyến, Forum trao đổi, Theo dõi tiến độ.`,

  help_getting_started: `Bước 1: Đăng ký tài khoản. Bước 2: Chọn khóa học. Bước 3: Xem lịch học. Bước 4: Bắt đầu học.`,

  // FAQ - Study Related
  study_tips: `Học hiệu quả: Chia thành phần nhỏ, học đều đặn (mỗi ngày 1 giờ), dùng Pomodoro technique, giải bài tập thực hành, ôn tập định kỳ.`,

  study_schedule: `Để tạo lịch học hiệu quả: Xác định mục tiêu, phân bổ thời gian theo khóa học, đặt nhắc nhở, luôn linh hoạt điều chỉnh.`,

  motivation: `Gợi ý: Đặt mục tiêu cụ thể, chia nhỏ thành từng milestone, tham gia nhóm học để có động lực cùng nhau, theo dõi tiến độ.`,

  // FAQ - Technical
  course_not_loading: `Nếu khóa học không load: Refresh trang, xóa cache, kiểm tra kết nối internet, hoặc liên hệ support@studymate.com.`,

  account_issues: `Vấn đề tài khoản: Kiểm tra email xác minh, reset mật khẩu, hoặc liên hệ support@studymate.com để được hỗ trợ.`,

  not_studymate: `Tôi chỉ hỗ trợ về StudyMate. Hãy hỏi về khóa học, lịch học, hoặc sử dụng hệ thống.`,
};

/**
 * Categorization keywords for routing
 * Purpose: Quick classification without expensive LLM calls
 */
export const KEYWORD_ROUTING = {
  // Help & Getting Started
  help: ['hướng dẫn', 'cách dùng', 'làm sao', 'help', 'giới thiệu', 'bắt đầu'],
  features: ['tính năng', 'chức năng', 'có gì', 'làm được'],
  
  // Study Related
  study_tips: ['học tập', 'học hiệu quả', 'phương pháp', 'mẹo', 'tips', 'cách học tốt'],
  schedule: ['lịch học', 'lịch biểu', 'thời gian học', 'sắp xếp thời gian'],
  motivation: ['động lực', 'hỏng chí', 'mệt mỏi', 'không muốn học'],
  
  // Technical/Account
  course_issues: ['khóa học', 'bài học', 'không load', 'lỗi khóa học'],
  account_issues: ['tài khoản', 'đăng nhập', 'mật khẩu', 'email'],
  
  // Data Fetching Required
  my_courses: ['khóa học của tôi', 'khóa học đã đăng ký', 'my courses', 'học gì'],
  my_schedule: ['lịch học của tôi', 'thời khoá biểu', 'schedule', 'kế hoạch học'],
  my_progress: ['tiến độ', 'progress', 'hoàn thành', 'bao nhiêu %'],
  pricing: ['giá', 'học phí', 'chi phí', 'bao nhiêu tiền', 'subscription'],
};

/**
 * DATA_FETCH types - What server should provide
 */
export const DATA_FETCH_TYPES = {
  MY_COURSES: 'COURSES',           // User's enrolled courses
  SCHEDULE: 'SCHEDULE',             // User's learning schedule
  PROGRESS: 'PROGRESS',             // Learning progress & stats
  USER_PROFILE: 'USER_PROFILE',     // User info
  PRICING: 'PRICING',               // Course pricing & plans
  LESSONS: 'LESSONS',               // Lesson details
  STUDY_GROUPS: 'STUDY_GROUPS',     // Available study groups
};

/**
 * Response formatter for consistency
 */
export function formatAIResponse(text: string): string {
  // Remove markdown, code blocks
  let clean = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#+ /g, '')
    .trim();
  
  // Limit to 5 sentences
  const sentences = clean.split(/(?<=[.!?])\s+/);
  if (sentences.length > 5) {
    clean = sentences.slice(0, 5).join(' ');
  }
  
  return clean;
}

/**
 * Cost optimization tracking
 */
export interface TokenUsageMetrics {
  date: string;
  totalUsers: number;
  totalQuestions: number;
  templateResponsesUsed: number;
  dataFetchActionsIssued: number;
  averageTokensPerQuestion: number;
  estimatedCostVND: number;
}

export function calculateEstimatedCost(
  totalTokens: number,
  costPerMillionTokens: number = 3000 // VND per 1M input tokens (GPT-4 mini)
): number {
  return (totalTokens / 1_000_000) * costPerMillionTokens;
}
