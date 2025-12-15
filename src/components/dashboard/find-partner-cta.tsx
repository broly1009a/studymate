'use client';

import Link from 'next/link';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';

export function FindPartnerCTA() {
  return (
    <Link href="/matches">
      <div className="relative group cursor-pointer">
        {/* Main CTA Button */}
        <div className="relative w-full max-w-4xl mx-auto h-32 bg-gradient-to-r from-[#00a7c1] via-[#008fa8] to-[#00a7c1] rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 animate-shine" />

          {/* Sparkle effects */}
          <div className="absolute top-4 right-8 animate-pulse">
            <Sparkles className="w-6 h-6 text-yellow-300/80" />
          </div>
          <div className="absolute bottom-6 left-12 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <Sparkles className="w-4 h-4 text-yellow-300/60" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center gap-6 px-8">
            {/* Icon */}
            <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-9 h-9 text-white fill-white/80" />
            </div>

            {/* Text Content */}
            <div className="flex-1 text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-lg">
                Tìm bạn học ngay!
              </h2>
              <p className="text-white/90 text-sm md:text-base font-medium">
                Kết nối với hàng ngàn sinh viên cùng chí hướng học tập
              </p>
            </div>

            {/* Arrow Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:translate-x-2 transition-transform duration-300">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300" />
        </div>

        {/* Stats row below button */}
        <div className="flex items-center justify-center gap-8 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>10,000+ sinh viên đang online</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00a7c1] rounded-full" />
            <span>500+ kết nối mới hôm nay</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </Link>
  );
}
