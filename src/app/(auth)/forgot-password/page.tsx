'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);

      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setEmailSent(true);
      toast.success(vi.auth.forgotPassword.success);
    } catch (error) {
      toast.error(vi.auth.forgotPassword.error);
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Kiểm tra email của bạn</h2>
          <p className="text-sm text-muted-foreground">
            Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{' '}
            <span className="font-medium text-foreground">
              {form.getValues('email')}
            </span>
          </p>
        </div>

        <Alert>
          <AlertDescription>
            Nếu bạn không thấy email, hãy kiểm tra thư mục spam hoặc thử lại với địa chỉ email khác.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setEmailSent(false)}
          >
            Thử email khác
          </Button>

          <Link href="/login" className="block">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {vi.auth.forgotPassword.backToLogin}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{vi.auth.forgotPassword.title}</h2>
        <p className="text-sm text-muted-foreground">
          {vi.auth.forgotPassword.subtitle}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{vi.auth.forgotPassword.email}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="nguyenvana@example.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email này
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {vi.auth.forgotPassword.sendLink}
          </Button>
        </form>
      </Form>

      <Link href="/login" className="block">
        <Button variant="ghost" className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {vi.auth.forgotPassword.backToLogin}
        </Button>
      </Link>
    </div>
  );
}

