# StudyMate AI Copilot - ChatGPT Integration Guide

## 📋 Overview

StudyMate AI Copilot được tích hợp ChatGPT (GPT-4o-mini) với các tối ưu để **giảm chi phí token**:
- **Mục tiêu**: 50 users/ngày, ~300-500k VND token/tháng
- **Mô hình**: GPT-4o-mini (~$0.15/1M input tokens)
- **Chiến lược**: Template responses + Prompt caching + RAG pattern

---

## 🚀 Quick Start

### 1. Setup Environment Variables

Tạo file `.env.local`:

```env
OPENAI_API_KEY=sk-...your-api-key...
```

Lấy API key từ: https://platform.openai.com/api-keys

### 2. Install Dependencies

```bash
npm install openai
# Already in package.json
```

### 3. Add AI Chat Widget to Your App

Trong `src/app/layout.tsx` hoặc dashboard layout:

```tsx
import { AIChatWidget } from '@/components/ai/ai-chat-widget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <AIChatWidget position="bottom-right" />
      </body>
    </html>
  );
}
```

---

## 🎯 Architecture

### API Endpoint: `POST /api/ai/chat`

**Request:**
```json
{
  "message": "Khóa học nào phù hợp cho tôi?",
  "userId": "user_123",
  "sessionId": "session_456"
}
```

**Response:**
```json
{
  "response": "Tôi cần lấy dữ liệu của bạn từ hệ thống để trả lời chính xác.",
  "type": "action_required",
  "action": "FETCH_DATA[COURSES]",
  "metadata": {
    "tokensUsed": 0,
    "costEstimate": 0,
    "dataType": "COURSES"
  }
}
```

---

## 💰 Cost Optimization Strategy

### 1. **Template Responses** (0 tokens)

Các câu hỏi phổ biến được trả lời từ templates:
- Hướng dẫn sử dụng
- Tính năng chính
- Mẹo học tập
- Vấn đề kỹ thuật

**File**: `src/lib/ai-system-prompt.ts` → `TEMPLATE_RESPONSES`

### 2. **Prompt Caching** (~25% tiết kiệm)

System prompt được cache trong 5 phút:
```typescript
cache_control: { type: 'ephemeral' }
```

**Ước tính**: Từ 150 tokens xuống 110 tokens/question

### 3. **Data Fetch Action** (Server-side handling)

Khi cần dữ liệu người dùng, AI trả về action thay vì hallucinate:

```
INPUT: "Khóa học của tôi là gì?"
OUTPUT: "ACTION_REQUIRED: FETCH_DATA[COURSES]"
```

Frontend sẽ fetch dữ liệu và trình bày lại, AI không tham gia.

### 4. **Output Token Limiting**

Max 150 tokens/response = tối đa ~5 câu:
```typescript
max_tokens: 150
```

---

## 📊 Cost Breakdown

**Giả định**: 50 users/ngày, 3 questions/user

### Scenario 1: Không tối ưu (ChatGPT thường)
- 150 questions/ngày
- ~300 tokens/question (avg)
- 45,000 tokens/ngày
- ~45k × 30 = 1.35M tokens/tháng
- **Chi phí**: ~6,750 VND/tháng ❌

### Scenario 2: Có tối ưu (StudyMate)
- 150 questions/ngày
- ~60 questions dùng template (40%) → 0 tokens
- ~60 questions dùng data fetch (40%) → 0 tokens  
- ~30 questions dùng LLM (20%) → 120 tokens (với cache)
- = 3,600 tokens/ngày
- **Chi phí**: ~432 VND/tháng ✅

**Tiết kiệm**: ~94% chi phí token! 📉

---

## 🔧 Configuration

### System Prompt

File: `src/lib/ai-system-prompt.ts`

```typescript
export const STUDYMATE_SYSTEM_PROMPT = `
Bạn là StudyMate AI Copilot.
...
`;
```

**Quy tắc đặt trong prompt**:
1. ✅ Ngắn gọn (tránh dài dòng)
2. ✅ Rõ ràng, định hướng từng bước
3. ✅ Chỉ định output format (text, không markdown)
4. ✅ Nêu rõ khi cần data fetch

### Keyword Routing

Cách phân loại câu hỏi mà **không cần gọi LLM**:

```typescript
export const KEYWORD_ROUTING = {
  my_courses: ['khóa học của tôi', 'đã đăng ký', ...],
  study_tips: ['học tập', 'phương pháp', ...],
  // ...
};
```

Thêm keywords vào để tăng coverage template responses.

---

## 🎮 Usage Examples

### Example 1: Template Response (0 tokens)

```
User: "Làm sao để học hiệu quả?"
AI:   "Học hiệu quả: Chia thành phần nhỏ, học đều đặn..."
Cost: 0 VND
```

### Example 2: Data Fetch Action (0 tokens)

```
User: "Khóa học của tôi là gì?"
AI:   "ACTION_REQUIRED: FETCH_DATA[COURSES]"
Cost: 0 VND
Frontend: Fetch từ /api/profiles, hiển thị danh sách
```

### Example 3: LLM Call (120 tokens, ~360 VND)

```
User: "Tôi muốn học Python, nhưng chưa bao giờ lập trình..."
AI:   "Bạn nên bắt đầu với khóa học cơ bản..."
Cost: ~360 VND
```

---

## 📈 Monitoring & Metrics

### Log Token Usage

```typescript
// In response metadata
metadata: {
  tokensUsed: 120,
  costEstimate: 360, // VND
  breakdown: {
    inputTokens: 90,
    outputTokens: 30,
  }
}
```

### Track in Dashboard

Thêm endpoint để theo dõi chi phí:

```typescript
// POST /api/ai/metrics
{
  date: "2024-01-15",
  totalUsers: 45,
  totalQuestions: 132,
  templateResponsesUsed: 88, // 67%
  dataFetchActionsIssued: 32, // 24%
  llmCallsUsed: 12,           // 9%
  averageTokensPerQuestion: 15,
  estimatedCostVND: 4500,
}
```

---

## 🔒 Security & Rate Limiting

### Rate Limit (Optional)

```typescript
// Trong /api/ai/chat
const rateLimit = await checkRateLimit(userId);
if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: 'Too many requests' },
    { status: 429 }
  );
}
```

### Input Validation

- Max message length: 200 characters
- Trim whitespace
- Reject empty messages

---

## 🐛 Troubleshooting

### Error: "API key is invalid"

```bash
# Check .env.local
echo $env:OPENAI_API_KEY
```

### High Token Usage

1. Kiểm tra `TEMPLATE_RESPONSES` - có thiếu keywords không?
2. Review `KEYWORD_ROUTING` - có câu hỏi nào bị miss?
3. Giảm `max_tokens` xuống 100
4. Thêm DATA_FETCH types để giảm LLM calls

### Cache Not Working?

Prompt caching chỉ hoạt động khi:
- Input ≥ 1024 tokens (system + user)
- 5 phút liên tục dùng
- Sử dụng GPT-4o/gpt-4o-mini

---

## 📝 Best Practices

### 1. **Always Use Templates First**

```typescript
// ❌ Sai
await callOpenAI("Khóa học nào phù hợp cho tôi?");

// ✅ Đúng
const classification = classifyMessage(userMessage);
if (classification.type === 'template') {
  return TEMPLATE_RESPONSES[classification.templateKey];
}
```

### 2. **Data Fetch ≠ Hallucination**

```typescript
// ❌ Sai: AI tự tạo dữ liệu
"Bạn đang học 5 khóa học: Python, JavaScript..."

// ✅ Đúng: Báo hiệu fetch data
"ACTION_REQUIRED: FETCH_DATA[COURSES]"
```

### 3. **Batch User Data Requests**

Nếu cần lấy nhiều data, fetch 1 lần:

```typescript
// Thay vì gọi N lần FETCH_DATA
return "ACTION_REQUIRED: FETCH_DATA[COURSES,SCHEDULE,PROGRESS]";
```

### 4. **Log Everything for Optimization**

```typescript
console.log({
  message: userMessage,
  classification: classification.type,
  tokensUsed: response.usage.total_tokens,
  timestamp: new Date(),
});
```

---

## 🎓 Next Steps

1. ✅ Setup OPENAI_API_KEY trong `.env.local`
2. ✅ Thêm AIChatWidget vào layout
3. ✅ Test các scenarios trong `TEMPLATE_RESPONSES`
4. ✅ Mở DevTools, kiểm tra metadata từ /api/ai/chat
5. ✅ Mở Platform > Usage trong OpenAI dashboard để track chi phí

---

## 📚 References

- OpenAI API: https://platform.openai.com/docs/api-reference
- GPT-4o-mini Pricing: https://openai.com/pricing
- Prompt Caching: https://platform.openai.com/docs/guides/prompt-caching
- Rate Limiting: https://platform.openai.com/docs/guides/rate-limits

---

**Tác giả**: StudyMate AI Team  
**Phiên bản**: 1.0.0  
**Cập nhật**: 2024-12-17
