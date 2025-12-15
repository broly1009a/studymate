'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  const password = form.watch('password');

  useEffect(() => {
    if (!token) {
      toast.error('Token đặt lại mật khẩu không hợp lệ hoặc bị thiếu');
      router.push('/forgot-password');
    }
  }, [token, router]);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
  }, [password]);

  const getStrengthLabel = () => {
    if (passwordStrength < 25) return 'Yếu';
    if (passwordStrength < 50) return 'Trung bình';
    if (passwordStrength < 75) return 'Tốt';
    return 'Mạnh';
  };

  const getStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-destructive';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);

      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setResetSuccess(true);
      toast.success(vi.auth.resetPassword.success);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      toast.error(vi.auth.resetPassword.error);
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Đặt lại mật khẩu thành công!</h2>
          <p className="text-sm text-muted-foreground">
            Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới.
          </p>
        </div>

        <Link href="/login" className="block">
          <Button className="w-full">
            Tiếp tục đăng nhập
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{vi.auth.resetPassword.title}</h2>
        <p className="text-sm text-muted-foreground">
          {vi.auth.resetPassword.subtitle}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{vi.auth.resetPassword.newPassword}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Ít nhất 8 ký tự với chữ hoa, chữ thường và số
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Độ mạnh mật khẩu:</span>
                <span className={`font-medium ${
                  passwordStrength < 50 ? 'text-destructive' : 'text-green-600'
                }`}>
                  {getStrengthLabel()}
                </span>
              </div>
              <Progress value={passwordStrength} className={getStrengthColor()} />
            </div>
          )}

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{vi.auth.resetPassword.confirmPassword}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {vi.auth.resetPassword.resetButton}
          </Button>
        </form>
      </Form>

      <Link href="/login" className="block">
        <Button variant="ghost" className="w-full">
          {vi.auth.resetPassword.backToLogin}
        </Button>
      </Link>
    </div>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordContent />
    </Suspense>
  );
}
