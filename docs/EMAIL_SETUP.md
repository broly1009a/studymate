# Hướng dẫn cấu hình Email với Resend

## Tổng quan

Dự án StudyMate sử dụng [Resend](https://resend.com) để gửi email xác thực và đặt lại mật khẩu. Resend là dịch vụ email hiện đại, dễ sử dụng và có gói miễn phí cho development.

## Các tính năng Email đã được implement

1. **Email xác thực tài khoản** - Gửi khi người dùng đăng ký mới
2. **Email đặt lại mật khẩu** - Gửi khi người dùng quên mật khẩu
3. **Resend verification email** - API để gửi lại email xác thực

## Cách setup

### 1. Đăng ký tài khoản Resend

1. Truy cập [https://resend.com](https://resend.com)
2. Đăng ký tài khoản miễn phí (100 emails/day)
3. Xác thực email của bạn

### 2. Lấy API Key

1. Đăng nhập vào Resend Dashboard
2. Vào mục **API Keys** 
3. Click **Create API Key**
4. Đặt tên cho key (ví dụ: "StudyMate Development")
5. Copy API key (bắt đầu với `re_...`)

### 3. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục root của project:

```bash
cp .env.example .env.local
```

Cập nhật các biến sau trong `.env.local`:

```env
# Resend API Key (bắt buộc)
RESEND_API_KEY=re_your_actual_api_key_here

# Email gửi đi
EMAIL_FROM=onboarding@resend.dev

# URL của app (để tạo verification links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB URI
MONGODB_URI=mongodb://localhost:27017/studymate

# JWT Secret
JWT_SECRET=your-secret-key-here
```

### 4. Sử dụng domain riêng (Optional - cho production)

Nếu muốn gửi email từ domain của bạn (ví dụ: `noreply@yourdomain.com`):

1. Vào **Domains** trong Resend Dashboard
2. Click **Add Domain**
3. Nhập domain của bạn (ví dụ: `yourdomain.com`)
4. Thêm các DNS records theo hướng dẫn
5. Đợi verify xong (thường 5-10 phút)
6. Cập nhật `EMAIL_FROM` trong `.env.local`:

```env
EMAIL_FROM=noreply@yourdomain.com
```

## Cấu trúc code

### Models

**`src/models/VerificationToken.ts`**
- Lưu trữ tokens với thời gian hết hạn
- Tự động xóa tokens hết hạn (TTL index)
- Hỗ trợ 2 loại: `email` và `password-reset`

### Email Service

**`src/lib/email.ts`**
- `sendVerificationEmail()` - Gửi email xác thực
- `sendPasswordResetEmail()` - Gửi email đặt lại mật khẩu
- `createVerificationToken()` - Tạo token mới
- `verifyToken()` - Xác thực token
- Email templates được viết bằng HTML inline

### API Routes

1. **`/api/auth/register`** - Tự động gửi verification email sau khi đăng ký
2. **`/api/auth/verify-email`** - Xác thực email với token
3. **`/api/auth/resend-verification`** - Gửi lại email xác thực
4. **`/api/auth/forgot-password`** - Gửi email đặt lại mật khẩu
5. **`/api/auth/reset-password`** - Đặt lại mật khẩu với token

## Flow hoạt động

### Email Verification Flow

```
1. User đăng ký tài khoản
   ↓
2. API tạo user với verified: false
   ↓
3. Tạo verification token (expires: 24h)
   ↓
4. Gửi email với link: /verify-email?token=xxx
   ↓
5. User click link
   ↓
6. API verify token và cập nhật user.verified = true
   ↓
7. Xóa token đã sử dụng
```

### Password Reset Flow

```
1. User click "Quên mật khẩu"
   ↓
2. Nhập email
   ↓
3. API tạo reset token (expires: 1h)
   ↓
4. Gửi email với link: /reset-password?token=xxx
   ↓
5. User click link và nhập mật khẩu mới
   ↓
6. API verify token và cập nhật password
   ↓
7. Xóa token đã sử dụng
```

## Testing

### Test email verification

```bash
# Đăng ký user mới
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "fullName": "Test User",
    "password": "Password123!",
    "passwordConfirmation": "Password123!",
    "acceptTerms": true
  }'

# Check email inbox cho verification link
```

### Test resend verification

```bash
curl -X POST http://localhost:3000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Test forgot password

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Troubleshooting

### Email không gửi được

1. **Kiểm tra API Key**
   - Đảm bảo `RESEND_API_KEY` đúng format `re_...`
   - Key chưa bị revoke

2. **Kiểm tra logs**
   ```bash
   # Check terminal/console logs
   # Sẽ có error message chi tiết
   ```

3. **Kiểm tra Resend Dashboard**
   - Vào **Logs** để xem trạng thái emails
   - Check quota (100 emails/day cho free tier)

### Token hết hạn

- Verification tokens: 24 giờ
- Password reset tokens: 1 giờ
- Tokens tự động xóa sau khi hết hạn (MongoDB TTL index)

### Development vs Production

**Development:**
- Sử dụng `EMAIL_FROM=onboarding@resend.dev`
- Email có thể vào spam
- Giới hạn 100 emails/day

**Production:**
- Setup domain riêng
- Verify domain trong Resend
- Upgrade plan nếu cần (3,000+ emails/month)
- Sử dụng professional email address

## Email Templates

Các template email được thiết kế responsive và đẹp mắt:

- Gradient header với brand colors
- Clear call-to-action button
- Alternative text link
- Expiration warning
- Professional footer

Để customize template, chỉnh sửa functions:
- `getVerificationEmailTemplate()` trong `src/lib/email.ts`
- `getPasswordResetEmailTemplate()` trong `src/lib/email.ts`

## Security Features

1. **Tokens an toàn** - Sử dụng `crypto.randomBytes(32)`
2. **Expiration** - Auto-delete expired tokens
3. **One-time use** - Token bị xóa sau khi sử dụng
4. **Rate limiting** - Nên thêm để tránh spam (TODO)
5. **Email privacy** - Không tiết lộ user existence

## Costs

**Resend Pricing:**
- Free: 100 emails/day, 3,000/month
- Pro: $20/month - 50,000 emails
- Enterprise: Custom pricing

**Khuyến nghị:**
- Development: Free tier
- Production nhỏ: Free tier hoặc Pro
- Production lớn: Cân nhắc Enterprise hoặc alternatives (SendGrid, AWS SES)

## Alternative Email Services

Nếu muốn thay Resend bằng service khác:

1. **SendGrid** - Popular, có free tier
2. **AWS SES** - Rẻ cho volume lớn
3. **Mailgun** - Developer-friendly
4. **Postmark** - Focus on deliverability

Chỉ cần modify `src/lib/email.ts` với API tương ứng.

## Support

- [Resend Documentation](https://resend.com/docs)
- [Resend Status](https://resend.com/status)
- [Resend Support](https://resend.com/support)
