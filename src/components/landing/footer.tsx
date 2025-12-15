import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  useful: [
    { name: 'Về chúng tôi', href: '/about' },
    { name: 'Tính năng', href: '/#features' },
    { name: 'Giá cả', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Liên hệ', href: '/contact' },
  ],
  resources: [
    { name: 'Diễn đàn', href: '/forum' },
    { name: 'Tài liệu', href: '/notes' },
    { name: 'Sự kiện', href: '/competitions' },
    { name: 'Hỗ trợ', href: '/help' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Điều khoản sử dụng', href: '/terms' },
    { name: 'Chính sách bảo mật', href: '/privacy' },
    { name: 'Chính sách Cookie', href: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Brand & Contact */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6059f7] to-[#4f47d9] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-[#6059f7]">
                StudyMate
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nền tảng kết nối bạn học và phát triển kỹ năng hàng đầu Việt Nam
            </p>

            {/* Contact Info */}
            <div className="space-y-2 pt-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-[#6059f7] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[#6059f7] flex-shrink-0" />
                <span className="text-gray-400">0123 456 789</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#6059f7] flex-shrink-0" />
                <span className="text-gray-400">contact@studymate.vn</span>
              </div>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liên kết hữu ích</h3>
            <ul className="space-y-3">
              {footerLinks.useful.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#6059f7] transition-colors inline-flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#6059f7] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Tài nguyên</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#6059f7] transition-colors inline-flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#6059f7] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social & Apps */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Kết nối với chúng tôi</h3>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-[#6059f7] text-gray-400 hover:text-white transition-all transform hover:scale-110"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            {/* App Download Buttons */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400 mb-3">Tải ứng dụng</p>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-900">📱</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on</div>
                  <div className="text-sm font-semibold text-white">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-900">▶️</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-sm font-semibold text-white">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} StudyMate. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-[#6059f7] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

