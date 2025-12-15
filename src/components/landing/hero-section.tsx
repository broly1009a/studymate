import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Trophy, MessageSquare } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <span className="mr-2">🎓</span>
            Nền tảng học tập cộng tác
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Học cùng nhau,
            <br />
            <span className="text-primary">Đạt nhiều hơn</span>
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
            Kết nối với bạn học, chia sẻ kiến thức, tham gia nhóm học và các cuộc thi học thuật.
            Hành trình đến thành công học tập của bạn bắt đầu từ đây.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Bắt đầu miễn phí
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Đăng nhập
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Học viên hoạt động</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Nhóm học</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Câu hỏi đã trả lời</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Cuộc thi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-30">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary to-purple-400" />
        </div>
      </div>
    </section>
  );
}

