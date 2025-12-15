'use client';

import { Users, UsersRound, BookOpen, Brain, Trophy, FileText } from 'lucide-react';

const features = [
  {
    id: 'matching',
    title: 'Ghép đôi bạn học',
    icon: Users,
    description: 'Thuật toán AI tìm bạn học phù hợp với phong cách và mục tiêu của bạn',
    gradient: 'from-[#6059f7] to-[#4f47d9]',
  },
  {
    id: 'groups',
    title: 'Tạo nhóm học tập',
    icon: UsersRound,
    description: 'Lập nhóm học với bạn bè, chia sẻ tài liệu và học cùng nhau',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'tools',
    title: 'Công cụ hỗ trợ học tập',
    icon: BookOpen,
    description: 'Pomodoro, lịch học, ghi chú và nhiều công cụ hữu ích khác',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'ai',
    title: 'Tích hợp AI',
    icon: Brain,
    description: 'Trợ lý AI hỗ trợ 24/7, giải đáp thắc mắc và lập kế hoạch học',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'competitions',
    title: 'Đăng ký sự kiện cuộc thi',
    icon: Trophy,
    description: 'Tham gia cuộc thi, hackathon và sự kiện học thuật',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'library',
    title: 'Kho tài liệu học tập',
    icon: FileText,
    description: 'Truy cập hàng nghìn tài liệu, bài giảng và đề thi',
    gradient: 'from-pink-500 to-rose-500',
  },
];

export function FeaturesSectionV2() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#6059f7]/5 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tại sao nên chọn <span className="text-[#6059f7]">StudyMate?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Những tính năng kết nối học tập giúp bạn học hiệu quả hơn bao giờ hết!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative bg-white rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-[#6059f7]/30 shadow-sm hover:shadow-xl transition-all duration-300 shine-animate-item overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#6059f7] transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Shine Effect Overlay */}
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-gray-600 text-lg mb-6">
            Và còn nhiều tính năng tuyệt vời khác đang chờ bạn khám phá
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-[#6059f7]/10 text-[#6059f7] rounded-full text-sm font-medium">
              Gamification
            </span>
            <span className="px-4 py-2 bg-purple-500/10 text-purple-600 rounded-full text-sm font-medium">
              Leaderboard
            </span>
            <span className="px-4 py-2 bg-orange-500/10 text-orange-600 rounded-full text-sm font-medium">
              Achievements
            </span>
            <span className="px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
              Study Streak
            </span>
            <span className="px-4 py-2 bg-pink-500/10 text-pink-600 rounded-full text-sm font-medium">
              Social Learning
            </span>
          </div>
        </div>
      </div>

      {/* Shine Animation CSS */}
      <style jsx>{`
        .shine-animate-item {
          position: relative;
        }

        .shine-animate-item::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(0, 167, 193, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg) translateX(-100%) translateY(-100%);
          transition: none;
        }

        .shine-animate-item:hover::before {
          transform: rotate(45deg) translateX(100%) translateY(100%);
          transition: transform 0.8s ease-in-out;
        }
      `}</style>
    </section>
  );
}
