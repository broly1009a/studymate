'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';
import { API_URL } from '@/lib/constants';
type VerificationStatus = 'verifying' | 'success' | 'error' | 'resend';

function VerifyEmailContent() {
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [countdown, setCountdown] = useState(5);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('resend');
      return;
    }

    // Verify email with token
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const error = await response.json();
          setStatus('error');
          toast.error(error.error || vi.auth.verifyEmail.error);
          return;
        }

        setStatus('success');
        toast.success(vi.auth.verifyEmail.success);
      } catch (error) {
        setStatus('error');
        toast.error(vi.auth.verifyEmail.error);
        console.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      router.push('/login');
    }
  }, [status, countdown, router]);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);

      // Get email from localStorage or use a fallback
      const storedUser = localStorage.getItem('auth-user');
      const userEmail = storedUser ? JSON.parse(storedUser).email : '';

      if (!userEmail) {
        toast.error('Không tìm thấy địa chỉ email. Vui lòng đăng nhập lại.');
        return;
      }

      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gửi email thất bại');
      }

      toast.success('Email xác thực đã được gửi! Vui lòng kiểm tra hộp thư.');
    } catch (error) {
      toast.error('Gửi email thất bại. Vui lòng thử lại.');
      console.error('Resend error:', error);
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'verifying') {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Đang xác thực email</h2>
          <p className="text-sm text-muted-foreground">
            Vui lòng đợi trong khi chúng tôi xác thực địa chỉ email của bạn...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Email đã được xác thực!</h2>
          <p className="text-sm text-muted-foreground">
            Email của bạn đã được xác thực thành công. Bạn có thể truy cập tất cả tính năng của StudyMate.
          </p>
        </div>

        <Alert>
          <AlertDescription className="text-center">
            Chuyển hướng đến trang đăng nhập trong {countdown} giây...
          </AlertDescription>
        </Alert>

        <Link href="/login" className="block">
          <Button className="w-full">
            Tiếp tục đăng nhập
          </Button>
        </Link>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Xác thực thất bại</h2>
          <p className="text-sm text-muted-foreground">
            Liên kết xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu email xác thực mới.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={handleResendEmail}
            disabled={isResending}
          >
            {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gửi lại email xác thực
          </Button>

          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">
              Quay lại đăng nhập
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // status === 'resend'
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/10 p-3">
          <Mail className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{vi.auth.verifyEmail.title}</h2>
        <p className="text-sm text-muted-foreground">
          Chúng tôi đã gửi liên kết xác thực đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư và nhấp vào liên kết để xác thực tài khoản.
        </p>
      </div>

      <Alert>
        <AlertDescription>
          Nếu bạn không thấy email, hãy kiểm tra thư mục spam hoặc yêu cầu email xác thực mới.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <Button
          className="w-full"
          onClick={handleResendEmail}
          disabled={isResending}
        >
          {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Gửi lại email xác thực
        </Button>

        <Link href="/login" className="block">
          <Button variant="outline" className="w-full">
            Quay lại đăng nhập
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">{vi.common.loading}</h2>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
