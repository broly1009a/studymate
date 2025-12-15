import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRICING_TIERS, type PricingTier } from '@/lib/pricing-data';

export function PricingTiers() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={`
        relative p-8 rounded-3xl border-2 transition-all hover:shadow-xl
        ${tier.highlighted ? 'border-[#00a7c1] shadow-lg scale-105' : 'border-gray-200'}
      `}
    >
      {tier.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00a7c1] text-white px-4 py-1 rounded-full text-sm font-semibold">
          Phổ biến nhất
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-[#00a7c1]">
          {tier.price === 0 ? 'Miễn phí' : `${tier.price.toLocaleString('vi-VN')}₫`}
        </span>
        {tier.price > 0 && tier.id !== 'partners' && (
          <span className="text-gray-600">/tháng</span>
        )}
      </div>
      <p className="text-gray-600 mb-6">{tier.description}</p>

      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-[#00a7c1] flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={tier.ctaLink}>
        <Button
          className={`
            w-full rounded-full font-semibold
            ${
              tier.highlighted
                ? 'bg-[#00a7c1] hover:bg-[#008FA5] text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }
          `}
        >
          {tier.ctaText}
        </Button>
      </Link>
    </div>
  );
}

