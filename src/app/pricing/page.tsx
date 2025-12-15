import { Metadata } from 'next';
import { LandingHeader } from '@/components/landing/landing-header';
import { PricingHero } from '@/components/pricing/pricing-hero';
import { PricingTiers } from '@/components/pricing/pricing-tiers';
import { PricingComparison } from '@/components/pricing/pricing-comparison';

export const metadata: Metadata = {
  title: 'Bảng Giá - StudyMate',
  description:
    'Khám phá các gói đăng ký StudyMate: FREE, PREMIUM, PARTICIPANTS, và PARTNERS. Nâng cấp để trải nghiệm các tính năng cao cấp như AI học tập, Mentor, và Tổ chức sự kiện.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        <PricingHero />
        <PricingTiers />
        <PricingComparison />
      </main>
    </div>
  );
}

