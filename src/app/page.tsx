import { LandingPage } from '@/components/landing/landing-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StudyMate - Bạn học chuẩn gu, Học gì cũng dễ!',
  description: 'Kết nối bạn học phù hợp, tạo nhóm học tập, chia sẻ tài liệu và cùng nhau chinh phục các cuộc thi. Nền tảng kết nối học tập #1 Việt Nam với 10,000+ sinh viên.',
  keywords: ['học tập', 'bạn học', 'sinh viên', 'cuộc thi', 'hackathon', 'nhóm học', 'tài liệu học tập', 'kết nối sinh viên'],
  authors: [{ name: 'StudyMate Team' }],
  openGraph: {
    title: 'StudyMate - Nền tảng kết nối học tập #1 Việt Nam',
    description: 'Kết nối 10,000+ sinh viên đã tìm được bạn học phù hợp, tham gia 300+ cuộc thi và sự kiện',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'StudyMate',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StudyMate - Bạn học chuẩn gu, Học gì cũng dễ!',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyMate - Bạn học chuẩn gu, Học gì cũng dễ!',
    description: 'Nền tảng kết nối học tập #1 Việt Nam',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function HomePage() {
  return <LandingPage />;
}

// Old version kept for reference
// import { TinderLanding } from '@/components/landing/tinder-landing';
// export default function LandingPage() {
//   return <TinderLanding />;
// }
