'use client';

import Link from 'next/link';
import { ArrowRight, Users, BookOpen, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSectionV2() {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-gradient-to-br from-[#e6f7f9] via-white to-[#f0f9ff]">
      {/* SVG Background Decorations */}
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-gradient-to-tr from-purple-400/20 to-pink-500/20 rounded-full blur-3xl -z-10" />

      {/* Dot Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-5 -z-10" xmlns="http://www.w3.org/2000/svg">
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" className="text-[#6059f7]" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#6059f7]/20 shadow-sm">
              <span className="w-2 h-2 bg-[#6059f7] rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">
                Nền tảng kết nối học tập #1 Việt Nam
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Bạn học chuẩn gu –{' '}
              <span className="text-[#6059f7]">Học gì cũng dễ!</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Kết nối bạn học phù hợp, tạo nhóm học tập, chia sẻ tài liệu và cùng nhau chinh phục các cuộc thi
            </p>

            {/* CTA Button */}
            <div>
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-[#6059f7] hover:bg-[#4f47d9] text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all group"
                >
                  Tìm bạn học ngay!
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Student Avatars */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6059f7] to-[#4f47d9] border-2 border-white flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 font-semibold text-xs">
                  +10K
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-semibold text-gray-900">10,000+ sinh viên</div>
                <div>đã tìm được bạn học phù hợp</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Floating Cards */}
            <div className="relative">
              {/* Main Banner Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/banner.png"
                  alt="StudyMate Banner"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating Card 1 - Top Right */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6059f7] to-[#4f47d9] rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">300+ Cuộc thi</div>
                    <div className="text-xs text-gray-500">Đang diễn ra</div>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 - Bottom Left */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">5K+ Tài liệu</div>
                    <div className="text-xs text-gray-500">Miễn phí</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </section>
  );
}
