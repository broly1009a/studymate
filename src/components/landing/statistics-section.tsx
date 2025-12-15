'use client';

import { Users, Building2, UsersRound, Trophy } from 'lucide-react';
import { CountUp } from '@/lib/animations/use-counter';

const stats = [
  {
    icon: Users,
    number: 10000,
    suffix: '+',
    label: 'Sinh viên đã kết nối',
    color: 'from-[#6059f7] to-[#4f47d9]',
  },
  {
    icon: Building2,
    number: 300,
    suffix: '+',
    label: 'CLB và BTC',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: UsersRound,
    number: 5000,
    suffix: '+',
    label: 'Nhóm học tập',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Trophy,
    number: 1000,
    suffix: '+',
    label: 'Cuộc thi đã tổ chức',
    color: 'from-green-500 to-emerald-500',
  },
];

export function StatisticsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#6059f7]"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Con số ấn tượng
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Hàng nghìn sinh viên đã tin tưởng và đồng hành cùng StudyMate
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#6059f7]/30"
              >
                {/* Icon */}
                <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                {/* Number */}
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  <CountUp
                    end={stat.number}
                    duration={2500}
                    suffix={stat.suffix}
                    enableScrollTrigger={true}
                  />
                </div>

                {/* Label */}
                <p className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-gray-500 text-sm md:text-base mb-6">
            Được tin tưởng bởi các trường đại học hàng đầu
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
            {['HCMUT', 'UIT', 'HCMUS', 'USSH', 'FTU'].map((university, i) => (
              <div
                key={i}
                className="px-6 py-3 bg-white rounded-lg shadow-sm border border-gray-200 font-bold text-gray-700 text-sm md:text-base"
              >
                {university}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
