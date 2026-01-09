'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Users,
    TrendingUp,
    Trophy,
    Shield,
    Target,
    Sparkles,
    CheckCircle,
    Star,
    ArrowRight,
    Heart,
    BookOpen,
    MessageSquare,
    Award,
    Gamepad2,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function LandingPage() {
    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Newsletter signup:', email);
        setEmail('');
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar - Sticky */}
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-yellow-50 pt-20 pb-32">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="inline-block">
                                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                                    <Trophy className="w-4 h-4" />
                                    Nền tảng kết nối học tập #1 Việt Nam
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                    Bạn Học Chuẩn Gu
                                    <br />
                                    <span className="text-[#6059f7]">Học gì cũng dễ</span>
                                </h1>
                                <p className="text-lg text-gray-600 max-w-xl">
                                    Kết nối bạn học phù hợp, tạo nhóm học tập, chia sẻ tài liệu,
                                    và cùng nhau chinh phục các cuộc thi
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/login">
                                    <Button size="lg" className="bg-[#6059f7] hover:bg-[#4f47d9] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                                        Tìm bạn học ngay
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">10.000+</div>
                                    <p className="text-sm text-gray-600">Sinh viên tìm được bạn học phù hợp</p>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">5.000+</div>
                                    <p className="text-sm text-gray-600">Hơi nhóm sinh viên cùng học tập</p>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">1.000+</div>
                                    <p className="text-sm text-gray-600">Cuộc thi được tổ chức thành công</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Image Grid */}
                        <div className="relative">
                            {/* Star decorations */}
                            <div className="absolute -top-6 -left-6 text-purple-500 animate-pulse z-10">
                                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" />
                                </svg>
                            </div>
                            <div className="absolute top-10 -left-4 text-purple-400 animate-pulse delay-100 z-10" style={{ animationDelay: '0.5s' }}>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-16 -right-6 text-yellow-400 animate-pulse delay-200 z-10" style={{ animationDelay: '1s' }}>
                                <svg className="w-14 h-14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" />
                                </svg>
                            </div>
                            <div className="absolute top-1/3 -right-8 text-orange-400 animate-pulse z-10" style={{ animationDelay: '0.75s' }}>
                                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" />
                                </svg>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Top Left - Orange Circle with placeholder for woman with glasses */}
                                <div className="relative h-64 rounded-[2.5rem] bg-gradient-to-br from-orange-400 to-orange-500 overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                                    <div className="absolute inset-0 flex items-end justify-center pb-4">
                                        {/* Placeholder for image - you can replace with actual image */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-orange-400/50 to-orange-500"></div>
                                        <div className="relative z-10 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
                                            <span className="text-sm font-semibold">Tìm bạn học</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Top Right - Purple Circle with placeholder for woman with laptop */}
                                <div className="relative h-64 rounded-[2.5rem] bg-gradient-to-br from-purple-500 to-purple-700 overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                                    <div className="absolute inset-0 flex items-end justify-center pb-4">
                                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/50 to-purple-700"></div>
                                        <div className="relative z-10 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
                                            <span className="text-sm font-semibold">Các sự kiện</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Left - Purple Circle with placeholder for man with laptop */}
                                <div className="relative h-64 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-purple-800 overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                                    <div className="absolute inset-0 flex items-end justify-center pb-4">
                                        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/50 to-purple-800"></div>
                                        <div className="relative z-10 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
                                            <span className="text-sm font-semibold">Tìm nhóm học</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Right - Orange/Yellow Circle with placeholder for woman with pen */}
                                <div className="relative h-64 rounded-[2.5rem] bg-gradient-to-br from-orange-400 to-yellow-500 overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                                    <div className="absolute inset-0 flex items-end justify-center pb-4">
                                        <div className="absolute inset-0 bg-gradient-to-b from-orange-400/50 to-yellow-500"></div>
                                        <div className="relative z-10 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
                                            <span className="text-sm font-semibold">Diễn đàn</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Chat Icon - Bottom Right */}
                            <div className="absolute -bottom-6 -right-6 bg-[#6059f7] text-white p-4 rounded-2xl shadow-2xl z-20">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="bg-gradient-to-r from-[#6059f7] to-purple-600 py-4 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="relative">
                        <div className="flex items-center gap-6 md:gap-8 lg:gap-12 text-white animate-scroll">
                            {/* First set of stats */}
                            <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                                <Users className="w-4 h-4" />
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">30+</span>
                                    <span className="text-sm">Nhân sự chuyên nghiệp</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                                <Shield className="w-4 h-4" />
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">60.000+</span>
                                    <span className="text-sm">Lượt truy cập mỗi tháng</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                                <Trophy className="w-4 h-4" />
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">3+</span>
                                    <span className="text-sm">Năm hoạt động</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                                <Award className="w-4 h-4" />
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">70+</span>
                                    <span className="text-sm">Đối tác chiến lược</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                                <TrendingUp className="w-4 h-4" />
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">120.000+</span>
                                    <span className="text-sm">Người dùng</span>
                                </div>
                            </div>

                            {/* Duplicate set for seamless loop */}
                            <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                                <Users className="w-4 h-4" />
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">30+</span>
                                    <span className="text-sm">Nhân sự chuyên nghiệp</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                                <Shield className="w-4 h-4" />
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">60.000+</span>
                                    <span className="text-sm">Lượt truy cập mỗi tháng</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                                <Trophy className="w-4 h-4" />
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">3+</span>
                                    <span className="text-sm">Năm hoạt động</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                                <Award className="w-4 h-4" />
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">70+</span>
                                    <span className="text-sm">Đối tác chiến lược</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                                <TrendingUp className="w-4 h-4" />
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">120.000+</span>
                                    <span className="text-sm">Người dùng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            <span className="text-[#6059f7]">Tại sao nên chọn StudyMate?</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Những tính năng kết nối học tập giúp bạn học hiệu quả hơn bao giờ hết!
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                        {/* Feature 1 */}
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                            <CardContent className="p-6">
                                {/* Icon + Title cùng hàng */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-[#6059f7] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Ghép đôi bạn học
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Thuật toán AI tìm bạn học phù hợp với phong cách và mục tiêu của bạn
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 2 */}
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                            <CardContent className="p-6">
                                {/* Icon + Title cùng hàng */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-[#6059f7] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Tạo nhóm học tập
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Lập nhóm học với bạn bè, chia sẻ tài liệu và học cùng nhau
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 3 */}
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                            <CardContent className="p-6">
                                {/* Icon + Title cùng hàng */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-[#6059f7] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Cộng cụ hỗ trợ học tập
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Pomodoro, lịch học, ghi chú và nhiều công cụ hữu ích khác
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 4 */}
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                            <CardContent className="p-6">
                                {/* Icon + Title cùng hàng */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-[#6059f7] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Tích hợp AI
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Trợ lý AI hỗ trợ 24/7, giải đáp thắc mắc và lập kế hoạch học
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 5 */}
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                            <CardContent className="p-6">
                                {/* Icon + Title cùng hàng */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-[#6059f7] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Trophy className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Đăng ký sự kiện cuộc thi
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Tham gia các cuộc thi, hackathon và sự kiện học thuật
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 6 - Chatbot Icon */}
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                            <CardContent className="p-6">
                                {/* Icon + Title cùng hàng */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-[#6059f7] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Chatbot hỗ trợ
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Trợ lý ảo thông minh sẵn sàng hỗ trợ mọi lúc mọi nơi
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Features Row */}
                    <div className="text-center max-w-5xl mx-auto">
                        <p className="text-gray-500 text-base mb-6">
                            Và còn nhiều tính năng tuyệt vời khác đang chờ bạn khám phá
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-700">
                            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all">
                                <Gamepad2 className="w-5 h-5 text-[#6059f7]" />
                                <span className="font-medium">Gamification</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all">
                                <Trophy className="w-5 h-5 text-[#6059f7]" />
                                <span className="font-medium">Leaderboard</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all">
                                <Award className="w-5 h-5 text-[#6059f7]" />
                                <span className="font-medium">Achievements</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all">
                                <Zap className="w-5 h-5 text-[#6059f7]" />
                                <span className="font-medium">Study Streak</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all">
                                <Users className="w-5 h-5 text-[#6059f7]" />
                                <span className="font-medium">Social Learning</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-[#6059f7]">
                            Cơ hội phát triển, tỏa sáng cùng cộng đội
                        </h2>
                        <p className="text-gray-600 text-base lg:text-lg max-w-4xl mx-auto leading-relaxed">
                            StudyMate giúp bạn nhanh chóng tiếp cận các cuộc thi, hackathon,... mở rộng cơ hội phát triển kỹ năng,
                            thử thách bản thân, phối hợp cùng đội nhóm và tích lũy kinh nghiệm CV trở nên nổi bật và ấn tượng hơn.
                        </p>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 mb-12">
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">500+</div>
                            <p className="text-gray-600 text-sm lg:text-base">Cuộc thi đã đăng</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">10.000+</div>
                            <p className="text-gray-600 text-sm lg:text-base">Đội tham gia</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">95%</div>
                            <p className="text-gray-600 text-sm lg:text-base">Mức độ hài lòng</p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mb-16">
                        <Link href="/login">
                            <Button size="lg" className="bg-[#6059f7] hover:bg-[#4f47d9] text-white px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all">
                                Tham gia ngay
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {/* Card 1 - CLB và BTC */}
                        <Card className="bg-gradient-to-br from-purple-200 to-purple-300 border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden group rounded-3xl">
                            <CardContent className="p-8 relative min-h-[280px] flex flex-col">
                                {/* Decorative pattern circles - positioned at top right */}
                                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-40">
                                    <div className="absolute inset-0">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute border-4 border-purple-600 rounded-full"
                                                style={{
                                                    width: `${(i + 1) * 20}px`,
                                                    height: `${(i + 1) * 20}px`,
                                                    top: `${i * 8}px`,
                                                    right: `${i * 8}px`,
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Icon at top left */}
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
                                        <div className="w-12 h-12 bg-purple-300 rounded-full flex items-center justify-center">
                                            <Target className="w-6 h-6 text-purple-700" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex-1 flex flex-col justify-end">
                                    <div className="text-5xl font-bold text-gray-900 mb-3">300+</div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">CLB và BTC</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Cập nhật các cuộc thi từ hơn 300+ CLB và Ban Tổ Chức
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 2 - Tìm kiếm Đồng đội */}
                        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden text-white group rounded-3xl">
                            <CardContent className="p-8 relative min-h-[280px] flex flex-col">
                                {/* Decorative cloud shape - positioned at top right */}
                                <div className="absolute top-4 right-4 opacity-30">
                                    <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
                                        <path d="M100 30C100 20 95 15 85 15C85 7 78 0 68 0C58 0 51 7 51 15C41 15 36 20 36 30C36 40 41 45 51 45H85C95 45 100 40 100 30Z" fill="white" />
                                    </svg>
                                </div>

                                {/* Icon badge at top left */}
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                                        <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex-1 flex flex-col justify-end">
                                    <h3 className="text-3xl font-bold mb-2">Tìm kiếm</h3>
                                    <h4 className="text-2xl font-bold mb-3">Đồng đội</h4>
                                    <p className="text-purple-100 text-sm leading-relaxed">
                                        Tìm đồng đội theo kỹ năng và trình độ phù hợp
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 3 - Mentor */}
                        <Card className="bg-gradient-to-br from-yellow-400 to-yellow-500 border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden text-gray-900 group rounded-3xl relative">
                            <CardContent className="p-8 relative min-h-[280px] flex flex-col">
                                {/* Decorative dots pattern - positioned at top right */}
                                <div className="absolute top-4 right-4 opacity-40">
                                    <div className="grid grid-cols-4 gap-2">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className="w-3 h-3 bg-white rounded-full"></div>
                                        ))}
                                    </div>
                                </div>



                                {/* Icon badge at top left with user icon */}
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center">
                                        <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                                            <Users className="w-6 h-6 text-gray-900" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex-1 flex flex-col justify-end">
                                    <h3 className="text-3xl font-bold mb-2">Mentor</h3>
                                    <h4 className="text-2xl font-bold mb-3">Phù hợp</h4>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        Gợi ý mentor phù hợp cho cuộc thi của bạn
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <p className="text-gray-500 mb-2">Testimonial</p>
                        <h2 className="text-4xl font-bold leading-tight">
                            <span className="text-[#6059f7]">Câu chuyện thành công</span>
                            <br />
                            <span className="text-gray-800">từ cộng đồng StudyMate</span>
                        </h2>
                    </div>

                    {/* Grid */}
                    <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
                        {/* LEFT COLUMN */}
                        <div className="space-y-10">
                            {/* Card 1 */}
                            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 relative">
                                <span className="absolute top-6 right-6 text-purple-500 text-5xl font-bold leading-none">
                                    “
                                </span>

                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src="/avatar.jpg"
                                        alt="Trần Thị B"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Trần Thị B</h4>
                                        <p className="text-sm text-purple-600">
                                            Top 10 CodeWar National
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Tôi luôn tin rằng truyền thông không chỉ là một nghề – mà là một cách
                                    để hiểu mình, hiểu người và kết nối với thế giới. Là một giảng viên
                                    đại học, tôi thấy các bạn trẻ thành công sớm luôn có điểm chung: họ
                                    được trao quyền chủ động sớm, trong một không gian an toàn và sáng
                                    tạo.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 relative">
                                <span className="absolute top-6 right-6 text-purple-500 text-5xl font-bold leading-none">
                                    “
                                </span>

                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src="/avatar.jpg"
                                        alt="Nguyễn Văn A"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Nguyễn Văn A</h4>
                                        <p className="text-sm text-purple-600">
                                            Giải Nhất Hackathon HCMUT 2024
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Tôi luôn tin rằng truyền thông không chỉ là một nghề – mà là một cách
                                    để hiểu mình, hiểu người và kết nối với thế giới. Là một giảng viên
                                    đại học, tôi thấy các bạn trẻ thành công sớm luôn có điểm chung: họ
                                    được trao quyền chủ động sớm, trong một không gian an toàn và sáng
                                    tạo.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (SO LE) */}
                        <div className="space-y-10 mt-16">
                            {/* Card 3 */}
                            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 relative">
                                <span className="absolute top-6 right-6 text-purple-500 text-5xl font-bold leading-none">
                                    “
                                </span>

                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src="/avatar.jpg"
                                        alt="Nguyễn Văn A"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Nguyễn Văn A</h4>
                                        <p className="text-sm text-purple-600">
                                            Giải Nhất Hackathon HCMUT 2024
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Tôi luôn tin rằng truyền thông không chỉ là một nghề – mà là một cách
                                    để hiểu mình, hiểu người và kết nối với thế giới. Là một giảng viên
                                    đại học, tôi thấy các bạn trẻ thành công sớm luôn có điểm chung: họ
                                    được trao quyền chủ động sớm, trong một không gian an toàn và sáng
                                    tạo.
                                </p>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 relative">
                                <span className="absolute top-6 right-6 text-purple-500 text-5xl font-bold leading-none">
                                    “
                                </span>

                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src="/avatar.jpg"
                                        alt="Lê Văn C"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Lê Văn C</h4>
                                        <p className="text-sm text-purple-600">
                                            Winner AI Challenge 2024
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Tôi luôn tin rằng truyền thông không chỉ là một nghề – mà là một cách
                                    để hiểu mình, hiểu người và kết nối với thế giới. Là một giảng viên
                                    đại học, tôi thấy các bạn trẻ thành công sớm luôn có điểm chung: họ
                                    được trao quyền chủ động sớm, trong một không gian an toàn và sáng
                                    tạo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


      {/* Newsletter Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative purple shapes */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-purple-600 to-purple-700 pointer-events-none rounded-bl-[200px]"></div>
        
        {/* Orange circle decoration */}
        <div className="absolute right-1/4 top-1/4 w-64 h-64 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-90 z-10"></div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#6059f7] leading-tight">
                Nhận thông tin mới nhất
                <br />
                về học tập và cuộc thi
              </h2>
              <p className="text-gray-600 text-lg max-w-xl">
                Đăng ký để không bỏ lỡ cơ hội kết nối và phát triển cùng StudyMate
              </p>

              {/* Email Form */}
              <form onSubmit={handleNewsletterSubmit} className="flex gap-4 max-w-xl">
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-6 text-base rounded-full border-2 border-gray-200 bg-white focus:border-[#6059f7]"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-[#6059f7] hover:bg-[#4f47d9] text-white px-8 py-6 text-base rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  Đăng ký
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>

              <p className="text-sm text-gray-500">
                Chúng tôi cam kết bảo mật thông tin của bạn, bạn có thể hủy đăng ký bất cứ lúc nào.
              </p>

              {/* Benefits */}
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-gray-900 text-lg">
                  Tham gia cùng 10,000+ sinh viên đã đăng ký
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#6059f7] text-sm font-bold">#</span>
                    </div>
                    <span className="text-gray-700">Cập nhật cuộc thi mới nhất</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#6059f7] text-sm font-bold">#</span>
                    </div>
                    <span className="text-gray-700">Tips & Tricks học tập</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#6059f7] text-sm font-bold">#</span>
                    </div>
                    <span className="text-gray-700">Ưu đãi đặc biệt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image - People sitting on bean bag */}
            <div className="relative lg:block hidden">
              <div className="relative z-10">
                {/* Placeholder for image - you can replace with actual image */}
                <div className="w-full h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Users className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Image: People on bean bag</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Tham gia StudyMate ngay hôm nay và khám phá cách học tập thông minh hơn
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-[#6059f7] hover:bg-[#4f47d9] text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                Đăng ký ngay
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-2 border-[#6059f7] text-[#6059f7] hover:bg-purple-50 px-10 py-6 text-lg rounded-full">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </section>            {/* Footer - 4-Column Comprehensive */}
            <Footer />
        </div>
    );
}
