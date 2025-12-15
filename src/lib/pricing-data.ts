// Pricing data for StudyMate subscription tiers

export interface PricingFeature {
  id: string;
  name: string;
  description?: string;
  free: boolean;
  premium: boolean;
  participants: boolean;
  partners: boolean;
}

export interface PricingTier {
  id: 'free' | 'premium' | 'participants' | 'partners';
  name: string;
  price: number; // in VND
  priceLabel: string;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaText: string;
  ctaLink: string;
  gradient?: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'FREE',
    price: 0,
    priceLabel: '0 VND',
    description: 'Bắt đầu học tập miễn phí',
    features: [
      'Timer học & Phiên học không giới hạn (10 người)',
      'Nhóm học tập (Study Group) giới hạn 7 người/nhóm',
      'Cộng đồng Q&A & Tin tức Sự kiện',
      'Giới hạn thời gian học (call video 45 phút)',
      'Kho lưu trữ thời gian học (500mb)',
    ],
    highlighted: false,
    ctaText: 'Bắt đầu miễn phí',
    ctaLink: '/register',
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 49000,
    priceLabel: '49,000 VND/tháng',
    description: 'Nâng cao trải nghiệm học tập',
    features: [
      'Timer học & Phiên học không giới hạn',
      'Nhóm học tập không giới hạn',
      'Tiện ích AI tạo tài liệu học chung',
      'Kho lưu trữ thời gian học (2gb)',
      'Mở khóa công cụ hỗ trợ học tập: bảng trắng, máy tính, biểu đồ...',
      'Không giới hạn thời gian học (call video)',
    ],
    highlighted: true,
    ctaText: 'Nâng cấp Premium',
    ctaLink: '/register?plan=premium',
    gradient: 'from-[#00a7c1] to-[#00C9E6]',
  },
  {
    id: 'participants',
    name: 'PREMIUM PLUS',
    price: 69000,
    priceLabel: '69,000 VND/tháng',
    description: 'Dành cho người tham gia thi',
    features: [
      'Tất cả tính năng Premium',
      'Tài khoản tham khảo (cuộc thi)',
      'Tìm kiếm Đội thi (Team Finder)',
      'Tìm kiếm Mentor (Mentor Guidance)',
      'Tin tức Cuộc thi (Competition News Board)',
      'Tham gia các phiên Mentor độc quyền',
      'Kho lưu trữ thời gian học (5gb)',
    ],
    highlighted: false,
    ctaText: 'Nâng cấp Participants',
    ctaLink: '/register?plan=participants',
    gradient: 'from-[#00a7c1] to-[#0088A0]',
  },
  {
    id: 'partners',
    name: 'PARTNERS',
    price: 349000,
    priceLabel: '349,000 VND',
    description: 'Dành cho Tổ chức/Doanh nghiệp',
    features: [
      'Đăng tải Sự kiện/Cuộc thi',
      'Quảng cáo Tuyển dụng/Sự kiện',
      'Hiển thị trên Trang chủ (Display on home page)',
      'Quảng cáo banner không giới hạn trên tất cả các trang',
      'Gói không giới hạn Profile phù hợp với ưu tiên tuyển dụng',
    ],
    highlighted: false,
    ctaText: 'Liên hệ Sales',
    ctaLink: '/contact?type=partners',
    gradient: 'from-[#00a7c1] to-[#006B7D]',
  },
];

export const PRICING_FEATURES: PricingFeature[] = [
  {
    id: 'basic_features',
    name: 'Timer học & Phiên học',
    free: true,
    premium: true,
    participants: true,
    partners: true,
  },
  {
    id: 'study_groups',
    name: 'Nhóm học tập (Study Group)',
    description: 'Free: 7 người, Premium+: Không giới hạn',
    free: true,
    premium: true,
    participants: true,
    partners: true,
  },
  {
    id: 'qa_community',
    name: 'Cộng đồng Q&A & Tin tức',
    free: true,
    premium: true,
    participants: true,
    partners: true,
  },
  {
    id: 'video_calls',
    name: 'Call video học tập',
    description: 'Free: 45 phút, Premium+: Không giới hạn',
    free: true,
    premium: true,
    participants: true,
    partners: true,
  },
  {
    id: 'storage',
    name: 'Kho lưu trữ',
    description: 'Free: 500MB, Premium: 2GB, Participants: 5GB',
    free: true,
    premium: true,
    participants: true,
    partners: false,
  },
  {
    id: 'ai_materials',
    name: 'Tiện ích AI tạo tài liệu',
    free: false,
    premium: true,
    participants: true,
    partners: false,
  },
  {
    id: 'study_tools',
    name: 'Công cụ học tập (bảng trắng, máy tính...)',
    free: false,
    premium: true,
    participants: true,
    partners: false,
  },
  {
    id: 'competition_fees',
    name: 'Tài khoản tham khảo cuộc thi',
    free: false,
    premium: false,
    participants: true,
    partners: false,
  },
  {
    id: 'team_finder',
    name: 'Tìm kiếm Đội thi (Team Finder)',
    free: false,
    premium: false,
    participants: true,
    partners: false,
  },
  {
    id: 'mentor_search',
    name: 'Tìm kiếm Mentor',
    free: false,
    premium: false,
    participants: true,
    partners: false,
  },
  {
    id: 'competition_news',
    name: 'Tin tức Cuộc thi',
    free: false,
    premium: false,
    participants: true,
    partners: false,
  },
  {
    id: 'event_organizer',
    name: 'Đăng tải Sự kiện/Cuộc thi',
    free: false,
    premium: false,
    participants: false,
    partners: true,
  },
  {
    id: 'recruitment_ads',
    name: 'Quảng cáo Tuyển dụng',
    free: false,
    premium: false,
    participants: false,
    partners: true,
  },
  {
    id: 'homepage_display',
    name: 'Hiển thị trên Trang chủ',
    free: false,
    premium: false,
    participants: false,
    partners: true,
  },
  {
    id: 'unlimited_banners',
    name: 'Banner quảng cáo không giới hạn',
    free: false,
    premium: false,
    participants: false,
    partners: true,
  },
];

