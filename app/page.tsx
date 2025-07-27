'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '../components/navigation';
import Hero from '@/components/sections/hero';
import CodePreview from '../components/code-preview';
import Features from '@/components/sections/features';
import Testimonials from '@/components/sections/testimonials';
import Pricing from '@/components/sections/pricing';
import CTA from '@/components/sections/cta';
import Footer from '../components/footer';
import { ContactForm } from '../components/forms/contact-form';
import { useToast } from '@/hooks/use-toast';
import Comparison from '@/components/sections/comparison';
import BlogPreview from '@/components/sections/blog-preview';

export default function LandingPage() {
  const [showContactForm, setShowContactForm] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get('payment') === 'cancelled') {
      toast({
        variant: 'destructive',
        title: 'Payment Cancelled',
        description: 'Your payment session was cancelled. You can try again anytime.',
      });
    }
  }, [searchParams, toast]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWatchDemo = () => {
    scrollToSection('demo');
  };

  const handleStartRefactoring = () => {
    scrollToSection('pricing');
  };

  const handleContactSales = () => {
    setShowContactForm(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation onScrollTo={scrollToSection} onContact={handleContactSales} />
      <main className="flex-1">
        <Hero onWatchDemo={handleWatchDemo} onStartRefactoring={handleStartRefactoring} />
        <CodePreview />
        <Features />
        <Comparison />
        <Testimonials />
        <BlogPreview />
        <Pricing onContactSales={handleContactSales} />
        <CTA />
      </main>
      <Footer onScrollTo={scrollToSection} onContact={handleContactSales} />
      <ContactForm open={showContactForm} onOpenChange={setShowContactForm} />
    </div>
  );
}
