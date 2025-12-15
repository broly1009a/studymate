'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users, BookOpen, Trophy } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { LandingHeader } from './landing-header';

interface Story {
  id: string;
  name: string;
  title: string;
  story: string;
  image: string;
}

const stories: Story[] = [
  {
    id: '1',
    name: 'Minh & Hương',
    title: 'Từ bạn học đến bạn đời',
    story: 'Chúng tôi gặp nhau trên StudyMate khi cùng tìm kiếm bạn học môn Toán. Sau 6 tháng học cùng nhau, chúng tôi nhận ra rằng không chỉ có chung đam mê học tập mà còn có nhiều điểm chung khác. Giờ đây, chúng tôi không chỉ là bạn học mà còn là đối tác trong cuộc sống. StudyMate đã thay đổi cuộc đời chúng tôi!',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
  },
  {
    id: '2',
    name: 'Tuấn Anh',
    title: 'Từ điểm 5 lên điểm 9',
    story: 'Trước khi dùng StudyMate, tôi luôn gặp khó khăn với môn Vật lý. Nhưng sau khi tìm được nhóm học phù hợp và được hỗ trợ từ cộng đồng, điểm số của tôi đã cải thiện đáng kể. Từ điểm 5, giờ tôi đạt điểm 9 và tự tin hơn rất nhiều. Cảm ơn StudyMate!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  },
  {
    id: '3',
    name: 'Nhóm Code Warriors',
    title: 'Vô địch cuộc thi lập trình',
    story: 'Chúng tôi là 4 sinh viên từ các trường khác nhau, gặp nhau qua StudyMate. Sau khi lập nhóm và luyện tập cùng nhau trong 3 tháng, chúng tôi đã giành giải nhất cuộc thi lập trình toàn quốc. StudyMate không chỉ giúp chúng tôi tìm được đồng đội mà còn cung cấp công cụ để cùng nhau tiến bộ.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
  },
  {
    id: '4',
    name: 'Lan Anh',
    title: 'Tìm được đam mê học tập',
    story: 'Tôi từng nghĩ học tập là một việc nhàm chán và cô đơn. Nhưng StudyMate đã thay đổi suy nghĩ đó. Tôi đã tìm được những người bạn có cùng đam mê, cùng nhau khám phá kiến thức mới mỗi ngày. Học tập giờ đây trở thành niềm vui thực sự!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop',
  },
];

export function TinderLanding() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="text-[#0056b3]">Tìm kiếm</span>
                <br />
                <span className="text-gray-900">Bạn học</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-xl">
                Kết nối với bạn học phù hợp. Học cùng nhau, tiến bộ cùng nhau.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-[#0056b3] hover:bg-[#003c8f] text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Tạo tài khoản
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                Tất cả ảnh chỉ mang tính chất minh họa
              </p>
            </div>

            {/* Right: Image Grid */}
            <div className="relative h-[600px] hidden lg:block">
              <div className="absolute top-0 right-0 w-72 h-96 rounded-3xl overflow-hidden shadow-2xl transform rotate-6 hover:rotate-3 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=800&fit=crop"
                  alt="Students"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute top-20 left-0 w-72 h-96 rounded-3xl overflow-hidden shadow-2xl transform -rotate-6 hover:-rotate-3 transition-transform">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=800&fit=crop"
                  alt="Study group"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Tất cả những gì bạn cần để{' '}
            <span className="text-[#0056b3]">học tập hiệu quả</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#0056b3]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tìm bạn học</h3>
              <p className="text-gray-600">Kết nối với người học phù hợp nhất với bạn</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-[#0056b3]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Nhóm học</h3>
              <p className="text-gray-600">Tạo và tham gia nhóm học cộng tác</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-[#0056b3]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cuộc thi</h3>
              <p className="text-gray-600">Tham gia cuộc thi và thử thách bản thân</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-[#0056b3]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trợ lý AI</h3>
              <p className="text-gray-600">Hỗ trợ học tập thông minh 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section id="stories" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Câu chuyện <span className="text-[#0056b3]">thành công</span>
            </h2>
            <p className="text-xl text-gray-600">
              Hàng ngàn học viên đã thay đổi cuộc đời nhờ StudyMate
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <article
                key={story.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64">
                  <Image src={story.image} alt={story.name} fill className="object-cover" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{story.name}</h3>
                  <p className="text-[#0056b3] font-semibold mb-4">{story.title}</p>
                  <p className="text-gray-600 line-clamp-4">{story.story}</p>
                  <Link
                    href="#"
                    className="inline-flex items-center text-[#0056b3] font-semibold mt-4 hover:underline"
                  >
                    Đọc thêm
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#003c8f] to-[#0056b3] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">10K+</div>
              <div className="text-xl opacity-90">Học viên hoạt động</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">500+</div>
              <div className="text-xl opacity-90">Nhóm học</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">95%</div>
              <div className="text-xl opacity-90">Hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sẵn sàng bắt đầu{' '}
            <span className="text-[#0056b3]">hành trình học tập</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Tham gia cùng hàng ngàn học viên đang học tập hiệu quả mỗi ngày
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-[#0056b3] hover:bg-[#003c8f] text-white rounded-full px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Tạo tài khoản miễn phí
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#003c8f] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Về StudyMate</h3>
              <ul className="space-y-2 text-blue-100">
                <li>
                  <Link href="#" className="hover:text-white">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-blue-100">
                <li>
                  <Link href="#" className="hover:text-white">
                    Tính năng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Bảng giá
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Ứng dụng
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-blue-100">
                <li>
                  <Link href="#" className="hover:text-white">
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    An toàn
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Pháp lý</h3>
              <ul className="space-y-2 text-blue-100">
                <li>
                  <Link href="#" className="hover:text-white">
                    Điều khoản
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Quyền riêng tư
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cookie
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-8 text-center text-blue-100">
            <p>© 2025 StudyMate. Nền tảng học tập cộng tác hàng đầu Việt Nam.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
