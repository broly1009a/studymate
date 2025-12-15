'use client';

import Link from 'next/link';
import { ArrowRight, Target, UserCheck, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const keyPoints = [
  {
    icon: Target,
    title: '300+ CLB và BTC',
    description: 'Cập nhật các cuộc thi từ hơn 300+ CLB và Ban Tổ Chức',
    color: 'from-[#6059f7] to-[#4f47d9]',
  },
  {
    icon: UserCheck,
    title: 'Tìm đồng đội',
    description: 'Tìm đồng đội theo kỹ năng và trình độ phù hợp',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: GraduationCap,
    title: 'Mentor phù hợp',
    description: 'Gợi ý mentor phù hợp cho cuộc thi của bạn',
    color: 'from-orange-500 to-red-500',
  },
];

export function CompetitionSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-[#e6f7f9] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#6059f7]/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Content Card */}
        <div className="bg-gradient-to-br from-[#6059f7] via-[#4f47d9] to-[#3d37c4] rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center p-8 md:p-12 lg:p-16">
            {/* Left Content */}
            <div className="space-y-6 text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Cơ hội phát triển nghề nghiệp
                </span>
              </div>

              {/* Main Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Cơ hội phát triển, tỏa sáng cùng đồng đội
              </h2>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                StudyMate giúp bạn nhanh chóng tiếp cận các cuộc thi, hackathon,...mở rộng cơ hội phát triển kỹ năng, thử thách bản thân, phối hợp cùng đồng đội. Đồng thời góp phần làm CV trở nên nổi bật và ấn tượng hơn.
              </p>

              {/* CTA Button */}
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-white text-[#6059f7] hover:bg-gray-100 px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all group"
                >
                  Tham gia ngay!
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div>
                  <div className="text-3xl md:text-4xl font-bold">500+</div>
                  <div className="text-white/80 text-sm">Cuộc thi đã đăng</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold">10K+</div>
                  <div className="text-white/80 text-sm">Đội tham gia</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold">95%</div>
                  <div className="text-white/80 text-sm">Hài lòng</div>
                </div>
              </div>
            </div>

            {/* Right - Key Points */}
            <div className="space-y-4">
              {keyPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${point.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {point.title}
                        </h3>
                        <p className="text-white/80 leading-relaxed">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Pattern */}
          <div className="h-2 bg-gradient-to-r from-[#6059f7] via-purple-500 to-pink-500" />
        </div>

        {/* Success Stories Preview */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-gray-600 text-lg mb-6">
            Câu chuyện thành công từ cộng đồng StudyMate
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Nguyễn Văn A',
                achievement: 'Giải Nhất Hackathon HCMUT 2024',
                avatar: 'A',
              },
              {
                name: 'Trần Thị B',
                achievement: 'Top 10 CodeWar National',
                avatar: 'B',
              },
              {
                name: 'Lê Văn C',
                achievement: 'Winner AI Challenge 2024',
                avatar: 'C',
              },
            ].map((story, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#6059f7] to-[#4f47d9] rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
                  {story.avatar}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{story.name}</h4>
                <p className="text-sm text-gray-600">{story.achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
