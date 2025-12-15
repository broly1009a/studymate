'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      fullName: '',
      password: '',
      passwordConfirmation: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await registerUser(data);
      toast.success(vi.auth.register.success);
    } catch (error) {
      toast.error(vi.auth.register.error);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{vi.auth.register.title}</h2>
        <p className="text-sm text-muted-foreground">
          {vi.auth.register.subtitle}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{vi.auth.register.fullName}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nguyễn Văn A"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{vi.auth.register.username}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="nguyenvana"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Chỉ cho phép chữ cái, số và dấu gạch dưới
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{vi.auth.register.email}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="nguyenvana@example.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{vi.auth.register.password}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Ít nhất 8 ký tự bao gồm chữ hoa, chữ thường và số
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{vi.auth.register.confirmPassword}</FormLabel>
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

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    {vi.auth.register.acceptTerms}{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      {vi.auth.register.termsAndConditions}
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {vi.auth.register.registerButton}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        {vi.auth.register.alreadyHaveAccount}{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          {vi.auth.register.signIn}
        </Link>
      </p>
    </div>
  );
}

