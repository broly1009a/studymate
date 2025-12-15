'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Email không hợp lệ',
        description: 'Vui lòng nhập địa chỉ email hợp lệ',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubscribed(true);
      toast({
        title: 'Đăng ký thành công!',
        description: 'Cảm ơn bạn đã đăng ký nhận bản tin từ StudyMate',
      });
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: 'Có lỗi xảy ra',
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#6059f7] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#6059f7] to-[#4f47d9] rounded-2xl shadow-lg">
              {isSubscribed ? (
                <CheckCircle2 className="w-8 h-8 text-white" />
              ) : (
                <Mail className="w-8 h-8 text-white" />
              )}
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {isSubscribed
                  ? 'Chào mừng bạn đến với cộng đồng!'
                  : 'Nhận thông tin mới nhất về học tập và cuộc thi'}
              </h2>
              <p className="text-lg text-gray-600">
                {isSubscribed
                  ? 'Bạn sẽ nhận được email cập nhật từ chúng tôi sớm nhất'
                  : 'Đăng ký để không bỏ lỡ cơ hội kết nối và phát triển cùng StudyMate'}
              </p>
            </div>

            {/* Form */}
            {!isSubscribed && (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-6 py-6 text-base border-gray-300 focus:border-[#6059f7] focus:ring-[#6059f7]"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-[#6059f7] hover:bg-[#4f47d9] text-white px-8 py-6 font-semibold whitespace-nowrap"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        Đăng ký ngay
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Chúng tôi cam kết bảo mật thông tin của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.
                </p>
              </form>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              {[
                {
                  icon: '🎯',
                  text: 'Cập nhật cuộc thi mới nhất',
                },
                {
                  icon: '💡',
                  text: 'Tips & Tricks học tập',
                },
                {
                  icon: '🎁',
                  text: 'Ưu đãi đặc biệt',
                },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                >
                  <span className="text-2xl">{benefit.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Tham gia cùng <span className="font-bold text-[#6059f7]">10,000+</span> sinh viên đã đăng ký
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
