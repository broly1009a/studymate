'use client';

import { CheckCircle, X } from 'lucide-react';
import { PRICING_FEATURES, PRICING_TIERS } from '@/lib/pricing-data';

export function PricingComparison() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          So sánh <span className="text-[#00a7c1]">chi tiết</span>
        </h2>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl overflow-hidden shadow-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-900">Tính năng</th>
                <th className="text-center p-4 font-semibold text-gray-900">FREE</th>
                <th className="text-center p-4 font-semibold text-gray-900 bg-cyan-50">
                  PREMIUM
                </th>
                <th className="text-center p-4 font-semibold text-gray-900">PARTICIPANTS</th>
                <th className="text-center p-4 font-semibold text-gray-900">PARTNERS</th>
              </tr>
            </thead>
            <tbody>
              {PRICING_FEATURES.map((feature) => (
                <tr key={feature.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{feature.name}</div>
                    {feature.description && (
                      <div className="text-sm text-gray-500 mt-1">{feature.description}</div>
                    )}
                  </td>
                  <td className="text-center p-4">
                    {feature.free ? (
                      <CheckCircle className="inline h-6 w-6 text-[#00a7c1]" />
                    ) : (
                      <X className="inline h-6 w-6 text-gray-300" />
                    )}
                  </td>
                  <td className="text-center p-4 bg-cyan-50">
                    {feature.premium ? (
                      <CheckCircle className="inline h-6 w-6 text-[#00a7c1]" />
                    ) : (
                      <X className="inline h-6 w-6 text-gray-300" />
                    )}
                  </td>
                  <td className="text-center p-4">
                    {feature.participants ? (
                      <CheckCircle className="inline h-6 w-6 text-[#00a7c1]" />
                    ) : (
                      <X className="inline h-6 w-6 text-gray-300" />
                    )}
                  </td>
                  <td className="text-center p-4">
                    {feature.partners ? (
                      <CheckCircle className="inline h-6 w-6 text-[#00a7c1]" />
                    ) : (
                      <X className="inline h-6 w-6 text-gray-300" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-6">
          {PRICING_TIERS.map((tier) => (
            <div key={tier.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-[#00a7c1]">{tier.name}</h3>
              <div className="space-y-3">
                {PRICING_FEATURES.map((feature) => {
                  const isIncluded =
                    (tier.id === 'free' && feature.free) ||
                    (tier.id === 'premium' && feature.premium) ||
                    (tier.id === 'participants' && feature.participants) ||
                    (tier.id === 'partners' && feature.partners);

                  return (
                    <div key={feature.id} className="flex items-start gap-3">
                      {isIncluded ? (
                        <CheckCircle className="h-5 w-5 text-[#00a7c1] flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                        {feature.description && (
                          <div className="text-xs text-gray-500 mt-0.5">{feature.description}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

