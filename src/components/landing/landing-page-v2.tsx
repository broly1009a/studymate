'use client';

import { Navbar } from './navbar';
import { HeroSectionV2 } from './hero-section-v2';
import { StatisticsSection } from './statistics-section';
import { FeaturesSectionV2 } from './features-section-v2';
import { CompetitionSection } from './competition-section';
import { NewsletterSection } from './newsletter-section';
import { Footer } from './footer';

export function LandingPageV2() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - Sticky */}
      <Navbar />

      {/* Hero Section */}
      <HeroSectionV2 />

      {/* Statistics Section - Build Credibility */}
      <StatisticsSection />

      {/* Features Section - 4-Column Grid */}
      <FeaturesSectionV2 />

      {/* Competition Section - CTA Card Style */}
      <CompetitionSection />

      {/* Newsletter Section - Email Collection */}
      <NewsletterSection />

      {/* Footer - 4-Column Comprehensive */}
      <Footer />
    </div>
  );
}
