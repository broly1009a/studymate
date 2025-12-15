'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0056b3]/95 backdrop-blur-md border-b border-[#003c8f]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">Study</span>
          <span className="text-2xl font-bold text-blue-200">Mate</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="hover:text-blue-100 font-medium">
            Tính năng
          </Link>
          <Link href="/#stories" className="hover:text-blue-100 font-medium">
            Câu chuyện
          </Link>
          <Link href="/#about" className="hover:text-blue-100 font-medium">
            Về chúng tôi
          </Link>
          <Link href="/pricing" className="hover:text-blue-100 font-medium">
            Gói sản phẩm
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              Đăng nhập
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-white text-[#0056b3] hover:bg-blue-50 rounded-full px-6">
              Tạo tài khoản
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
