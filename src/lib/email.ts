import { Resend } from 'resend';
import crypto from 'crypto';
import VerificationToken from '@/models/VerificationToken';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

/**
 * Generate a secure random token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create and save verification token to database
 */
export async function createVerificationToken(
  userId: string,
  email: string,
  type: 'email' | 'password-reset' = 'email'
): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date();
  
  // Email verification: 24 hours, Password reset: 1 hour
  expiresAt.setHours(expiresAt.getHours() + (type === 'email' ? 24 : 1));

  // Delete any existing tokens for this user and type
  await VerificationToken.deleteMany({ userId, type });

  // Create new token
  await VerificationToken.create({
    userId,
    email,
    token,
    type,
    expiresAt,
  });

  return token;
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  fullName: string,
  token: string
): Promise<void> {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Xác thực tài khoản StudyMate của bạn',
      html: getVerificationEmailTemplate(fullName, verificationUrl),
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  fullName: string,
  token: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Đặt lại mật khẩu StudyMate',
      html: getPasswordResetEmailTemplate(fullName, resetUrl),
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

/**
 * Verify token and return user info
 */
export async function verifyToken(
  token: string,
  type: 'email' | 'password-reset' = 'email'
) {
  const verificationToken = await VerificationToken.findOne({
    token,
    type,
  });

  if (!verificationToken) {
    return null;
  }

  // Check if token has expired
  if (verificationToken.expiresAt < new Date()) {
    await VerificationToken.deleteOne({ _id: verificationToken._id });
    return null;
  }

  return verificationToken;
}

/**
 * Email template for verification
 */
function getVerificationEmailTemplate(fullName: string, verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác thực email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">StudyMate</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Nền tảng học tập thông minh</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Chào mừng ${fullName}!</h2>
                  
                  <p style="color: #666666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                    Cảm ơn bạn đã đăng ký tài khoản StudyMate. Để hoàn tất quá trình đăng ký và bắt đầu hành trình học tập của mình, vui lòng xác thực địa chỉ email của bạn.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                      Xác thực Email
                    </a>
                  </div>
                  
                  <p style="color: #999999; margin: 20px 0 0 0; font-size: 14px; line-height: 1.6;">
                    Hoặc sao chép và dán link sau vào trình duyệt:
                  </p>
                  <p style="color: #667eea; margin: 5px 0 0 0; font-size: 14px; word-break: break-all;">
                    ${verificationUrl}
                  </p>
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                    <p style="color: #999999; margin: 0; font-size: 14px; line-height: 1.6;">
                      <strong>Lưu ý:</strong> Link xác thực này sẽ hết hiệu lực sau 24 giờ.
                    </p>
                    <p style="color: #999999; margin: 10px 0 0 0; font-size: 14px; line-height: 1.6;">
                      Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                    © 2025 StudyMate. All rights reserved.
                  </p>
                  <p style="color: #999999; margin: 10px 0 0 0; font-size: 12px;">
                    Đây là email tự động, vui lòng không trả lời email này.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Email template for password reset
 */
function getPasswordResetEmailTemplate(fullName: string, resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Đặt lại mật khẩu</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">StudyMate</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Đặt lại mật khẩu</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Xin chào ${fullName}!</h2>
                  
                  <p style="color: #666666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                    Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản StudyMate của bạn. Nhấp vào nút bên dưới để tạo mật khẩu mới.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                      Đặt lại mật khẩu
                    </a>
                  </div>
                  
                  <p style="color: #999999; margin: 20px 0 0 0; font-size: 14px; line-height: 1.6;">
                    Hoặc sao chép và dán link sau vào trình duyệt:
                  </p>
                  <p style="color: #667eea; margin: 5px 0 0 0; font-size: 14px; word-break: break-all;">
                    ${resetUrl}
                  </p>
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                    <p style="color: #999999; margin: 0; font-size: 14px; line-height: 1.6;">
                      <strong>Lưu ý:</strong> Link này sẽ hết hiệu lực sau 1 giờ.
                    </p>
                    <p style="color: #999999; margin: 10px 0 0 0; font-size: 14px; line-height: 1.6;">
                      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center;">
                  <p style="color: #999999; margin: 0; font-size: 14px;">
                    © 2025 StudyMate. All rights reserved.
                  </p>
                  <p style="color: #999999; margin: 10px 0 0 0; font-size: 12px;">
                    Đây là email tự động, vui lòng không trả lời email này.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
