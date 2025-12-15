'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import Link from 'next/link';

const subscriptionPlans = [
  {
    id: 'free',
    name: 'FREE',
    price: '0',
    priceUnit: 'VND/tháng',
    description: 'Gói học cơ bản miễn phí',
    features: [
      'Tìm bạn học & Ghép đôi giới hạn (10 người)',
      'Nhóm học tập (Study Group) giới hạn 7 người/nhóm',
      'Cộng đồng Q&A & Tin tức Sự kiện',
      'Giới hạn thời gian học (call video 45 phút)',
      'Kho Tài liệu Học tập (500MB)',
    ],
    highlighted: false,
    buttonText: 'Dùng miễn phí',
    buttonVariant: 'outline' as const,
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: '49,000',
    priceUnit: 'VND/tháng',
    description: 'Mở rộng không giới hạn tính năng học tập',
    features: [
      'Tìm bạn học & Ghép đôi không giới hạn',
      'Nhóm học tập không giới hạn',
      'Cộng đồng Q&A & Tin tức Sự kiện',
      'Tích hợp AI tạo tài liệu học chung',
      'Mở khoá công cụ hỗ trợ học: bảng trắng, máy tính, biểu đồ...',
      'Không giới hạn thời gian học (call video)',
      'Kho Tài liệu Học tập (2GB)',
    ],
    highlighted: true,
    buttonText: 'Nâng cấp Premium',
    buttonVariant: 'default' as const,
  },
  {
    id: 'contest',
    name: 'PRO',
    price: '69,000',
    priceUnit: 'VND/tháng',
    description: 'Phù hợp cho người tham gia các cuộc thi',
    features: [
      'Tất cả các tính năng của Premium',
      'Tìm kiếm Đội thi (Team Finder)',
      'Tìm kiếm Mentor hướng dẫn (Mentor Guidance)',
      'Tin tức Cuộc thi (Competition News Board)',
      'Tham gia các phiên Mentor độc quyền',
      'Tài liệu tham khảo cuộc thi',
      'Kho Tài liệu Học tập (5GB)',
    ],
    highlighted: false,
    buttonText: 'Nâng cấp ',
    buttonVariant: 'outline' as const,
  },
  {
    id: 'partners',
    name: 'EVENTS',
    price: '349,000',
    priceUnit: 'VND/tháng',
    description: 'Dành cho tổ chức, nhà tuyển dụng hoặc mentor',
    features: [
      'Đăng tải Sự kiện / Cuộc thi',
      'Quảng cáo Tuyển dụng / Sự kiện',
      'Hiển thị trên Trang chủ (Display on Home Page)',
      'Gửi thông báo sự kiện đến các đối tượng phù hợp',
      'Gợi ý những Profile phù hợp với vị trí tuyển dụng',
      'Kho Tài liệu Học tập (5GB)',
    ],
    highlighted: false,
    buttonText: 'Nâng cấp',
    buttonVariant: 'outline' as const,
  },
];

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Các gói đăng ký StudyMate</h1>
          <p className="text-muted-foreground text-lg">
            Chọn gói phù hợp với nhu cầu học tập hoặc phát triển cộng đồng của bạn
          </p>
          <div className="mt-6">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Đã có tài khoản?{' '}
              <Link href="/settings" className="underline ml-1">
                Xem thông tin thanh toán
              </Link>
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {subscriptionPlans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{
                y: -10,
                scale: 1.05,
                boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Card
                className={`relative h-full transition-all ${plan.highlighted
                  ? 'border-primary shadow-lg bg-gradient-to-b from-primary/5 to-background'
                  : 'border-border hover:shadow-md'
                  }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Phổ biến nhất
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pt-8 pb-4">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">₫{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">
                      /{plan.priceUnit.split('/')[1] || 'tháng'}
                    </span>
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full transition-transform hover:scale-[1.02] ${plan.highlighted ? 'bg-primary text-white' : ''
                      }`}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground flex-1">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">
                Sẵn sàng nâng cấp trải nghiệm học tập cùng StudyMate?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Hãy chọn gói phù hợp để mở rộng giới hạn học tập, kết nối cộng đồng
                và tận dụng các công cụ hỗ trợ hiện đại nhất.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg">Bắt đầu ngay</Button>
                <Button size="lg" variant="outline">
                  Liên hệ hỗ trợ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
