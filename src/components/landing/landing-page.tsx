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

export function LandingPage() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
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
                  <div className="text-3xl font-bold text-[#6059f7]">10.000+</div>
                  <p className="text-sm text-gray-600">Câu hỏi tìm được bạn học phù hợp</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#6059f7]">5.000+</div>
                  <p className="text-sm text-gray-600">Hỗ nhóm sinh viên cùng học tập</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#6059f7]">1.000+</div>
                  <p className="text-sm text-gray-600">Cuộc thi được tổ chức thành công</p>
                </div>
              </div>
            </div>

            {/* Right Content - Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Top Left - Purple Circle */}
                <div className="relative h-64 rounded-3xl bg-gradient-to-br from-purple-400 to-purple-600 overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center p-6">
                      <Users className="w-16 h-16 mx-auto mb-2" />
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-sm font-semibold">Tìm bạn học</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Right - Yellow Circle */}
                <div className="relative h-64 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center p-6">
                      <BookOpen className="w-16 h-16 mx-auto mb-2" />
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-sm font-semibold">Các sự kiện</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Left - Purple Circle */}
                <div className="relative h-64 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center p-6">
                      <Target className="w-16 h-16 mx-auto mb-2" />
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-sm font-semibold">Tìm nhóm học</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Right - Yellow Circle */}
                <div className="relative h-64 rounded-3xl bg-gradient-to-br from-orange-400 to-yellow-500 overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center p-6">
                      <MessageSquare className="w-16 h-16 mx-auto mb-2" />
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-sm font-semibold">Diễn đàn</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Chat Icon */}
              <div className="absolute -bottom-4 -right-4 bg-[#6059f7] text-white p-4 rounded-2xl shadow-2xl animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-gradient-to-r from-[#6059f7] to-purple-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-white mb-4">
            <span className="text-sm font-medium">Thành viên trong cộng đồng</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">30+</div>
              <p className="text-sm text-white/80 mt-1">Nhân sự chuyên nghiệp</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">60.000+</div>
              <p className="text-sm text-white/80 mt-1">Lượt truy cập mỗi tháng</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">500+</div>
              <p className="text-sm text-white/80 mt-1">Cuộc thi đã diễn ra</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">10.000+</div>
              <p className="text-sm text-white/80 mt-1">Đội tham gia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-[#6059f7]">Tại sao nên chọn StudyMate?</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Những tính năng kết nối học tập giúp bạn học hiệu quả hơn bao giờ hết!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="border-2 border-purple-100 hover:border-[#6059f7] transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-[#6059f7]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Ghép đôi bạn học</h3>
                <p className="text-gray-600">
                  Thuật toán AI tìm bạn học phù hợp với phong cách và mục tiêu của bạn
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 border-purple-100 hover:border-[#6059f7] transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-[#6059f7]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Tạo nhóm học tập</h3>
                <p className="text-gray-600">
                  Lập nhóm học tập bạn bè, chia sẻ tài liệu và học cùng nhau
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 border-purple-100 hover:border-[#6059f7] transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7 text-[#6059f7]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Cộng cụ hỗ trợ học tập</h3>
                <p className="text-gray-600">
                  Pomodoro, lịch học, ghi chú và nhiều công cụ hữu ích khác
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 border-purple-100 hover:border-[#6059f7] transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-[#6059f7]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Tích hợp AI</h3>
                <p className="text-gray-600">
                  Trợ lý AI hỗ trợ 24/7, giải đáp thắc mắc và lập kế hoạch học
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-2 border-purple-100 hover:border-[#6059f7] transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="w-7 h-7 text-[#6059f7]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Đăng ký sự kiện cuộc thi</h3>
                <p className="text-gray-600">
                  Tham gia các cuộc thi, hackathon, và sự kiện học thuật
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-2 border-purple-100 hover:border-[#6059f7] transition-all hover:shadow-xl group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-7 h-7 text-[#6059f7]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Gamification</h3>
                <p className="text-gray-600">
                  Leaderboard, Achievements, Study Streak và các phần thưởng
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-[#6059f7]">Cơ hội phát triển, tỏa sáng cùng cộng đồng đôi</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              StudyMate giúp bạn nhanh chóng tiếp cận các cuộc thi, hackathon,... mở rộng cơ hội phát triển kỹ năng, 
              thử thách bản thân, phối hợp cùng đội nhóm và tích lũy kinh nghiệm CV trở nên nổi bật và ấn tượng hơn.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 - CLB và BTC */}
            <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden group">
              <CardContent className="p-8 relative h-full">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="absolute top-4 right-4">
                  <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="text-6xl font-bold text-purple-600 mb-4">300+</div>
                  <h3 className="text-2xl font-bold mb-3 text-purple-900">CLB và BTC</h3>
                  <p className="text-gray-700">
                    Cập nhật các cuộc thi từ hơn 300+ CLB và Ban Tổ Chức
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 - Tìm kiếm */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-700 border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden text-white group">
              <CardContent className="p-8 relative h-full">
                {/* Decorative circles */}
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                
                <div className="absolute top-4 left-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col h-full justify-center">
                  <h3 className="text-3xl font-bold mb-4">Tìm kiếm</h3>
                  <h4 className="text-2xl font-semibold mb-3">Đồng đội</h4>
                  <p className="text-purple-100">
                    Tìm đồng đội theo kỹ năng và trình độ phù hợp của bạn
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 - Mentor */}
            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 border-0 shadow-xl hover:shadow-2xl transition-all overflow-hidden text-white group">
              <CardContent className="p-8 relative h-full">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-14 -mb-14"></div>
                
                <div className="absolute bottom-4 right-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col h-full justify-center">
                  <h3 className="text-3xl font-bold mb-4">Mentor</h3>
                  <h4 className="text-2xl font-semibold mb-3">Phù hợp</h4>
                  <p className="text-orange-100">
                    Gợi ý mentor phù hợp cho cuộc thi của bạn
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 rounded-full mb-4">
              <span className="text-purple-600 font-semibold">Testimonial</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-[#6059f7]">Câu chuyện thành công</span>
              <br />
              <span className="text-gray-800">từ cộng đồng StudyMate</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <Card className="border-2 border-purple-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">TB</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Trần Thị B</h4>
                    <p className="text-sm text-gray-500">Top 10 CodeWar National</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  &quot;Tôi luôn tin rằng truyền thống không chỉ là một nghĩ – mà là một cách để hiểu 
                  mình, hiểu người và kết nối với tất cả. Lá mật giúp viễn đài học, để thử các bạn 
                  trả thành công siêm luôn cả điểm chúng cho được trào quyền chu động sẽm, trong 
                  một không gian an toàn và sáng tạo.&quot;
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-2 border-purple-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">NV</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Nguyễn Văn A</h4>
                    <p className="text-sm text-gray-500">Giải Nhất Hackathon HCMUT 2024</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  &quot;Tôi luôn tin rằng truyền thống không chỉ là một nghĩ – mà là một cách để hiểu 
                  mình, hiểu người và kết nối với tất cả. Lá mật giúp viễn đài học, để thử các bạn 
                  trả thành công siêm luôn cả điểm chúng cho được trào quyền chu động sẽm, trong 
                  một không gian an toàn và sáng tạo.&quot;
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-2 border-purple-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">LV</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Lê Văn C</h4>
                    <p className="text-sm text-gray-500">Winner AI Challenge 2024</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  &quot;Tôi luôn tin rằng truyền thống không chỉ là một nghĩ – mà là một cách để hiểu 
                  mình, hiểu người và kết nối với tất cả. Lá mật giúp viễn đài học, để thử các bạn 
                  trả thành công siêm luôn cả điểm chúng cho được trào quyền chu động sẽm, trong 
                  một không gian an toàn và sáng tạo.&quot;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-800 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mb-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Nhận thông tin mới nhất
              <br />
              về học tập và cuộc thi
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Đăng ký để không bỏ lỡ cơ hội kết nối và phát triển cùng StudyMate
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-6 text-lg rounded-full border-2 border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:bg-white/20"
                required
              />
              <Button 
                type="submit"
                size="lg"
                className="bg-white text-[#6059f7] hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Đăng ký
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            <p className="text-sm text-purple-200 mb-12">
              Tham gia cùng <strong>10,000+ sinh viên</strong> đã đăng ký
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Cập nhật cuộc thi mới nhất</h4>
                  <p className="text-sm text-purple-200">Ưu đãi đặc biệt</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Tips & Tricks học tập</h4>
                  <p className="text-sm text-purple-200">Học tập hiệu quả hơn</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Ưu đãi đặc biệt</h4>
                  <p className="text-sm text-purple-200">Dành riêng cho thành viên</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
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
      </section>
    </div>
  );
}
