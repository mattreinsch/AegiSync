'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "@/app/actions/stripe";
import { useAuth } from "@/context/auth-context";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getPricingTiers = (billingCycle: 'monthly' | 'yearly') => {
  const isYearly = billingCycle === 'yearly';
  return [
    {
      name: "Developer",
      price: isYearly ? "$15" : "$19",
      priceId: isYearly ? process.env.NEXT_PUBLIC_DEVELOPER_YEARLY_PRICE_ID : process.env.NEXT_PUBLIC_DEVELOPER_PRICE_ID,
      period: "/ month",
      description: "For individual developers hardening their code.",
      features: [
        "Unlimited security scans",
        "OWASP Top 10 analysis",
        "Support for 10+ languages",
        "Community support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Team",
      price: isYearly ? "$16" : "$20",
      priceId: isYearly ? process.env.NEXT_PUBLIC_TEAM_YEARLY_PRICE_ID : process.env.NEXT_PUBLIC_TEAM_PRICE_ID,
      period: "/ user / month",
      description: "For DevSecOps teams securing their products.",
      features: [
        "All features in Developer",
        "CI/CD pipeline integration",
        "Team-based security dashboard",
        "Priority email support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      priceId: null,
      period: "",
      description: "For organizations with strict compliance needs.",
      features: [
        "All features in Team",
        "Custom compliance profiles (PCI, HIPAA)",
        "Self-hosted deployment option",
        "Dedicated security engineer support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];
};

type PricingProps = {
  onContactSales: () => void;
};

export default function Pricing({ onContactSales }: PricingProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const pricingTiers = getPricingTiers(billingCycle);

  const handleCheckout = (tierName: string, priceId: string | null | undefined) => {
    if (tierName === 'Enterprise') {
      onContactSales();
      return;
    }

    if (!priceId) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "This pricing plan is not available right now. Please contact support.",
      });
      return;
    }
    
    if (!user) {
      router.push(`/login?priceId=${priceId}`);
      return;
    }

    setSelectedTier(tierName);
    startTransition(async () => {
      try {
        await createCheckoutSession(priceId, { uid: user.uid, email: user.email });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not create checkout session. Please try again later.",
        });
        setSelectedTier(null);
      }
    });
  };

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-headline font-bold">Pricing for Every Security Team</h2>
          <p className="text-muted-foreground mt-2">
            Choose the plan that fits your compliance and security needs. Start hardening your code today.
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
            <Tabs defaultValue="monthly" onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')} className="w-auto">
                <TabsList>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {pricingTiers.map((tier) => {
            const ctaText = tier.name === 'Enterprise' ? tier.cta : !user ? 'Sign Up & Start Trial' : tier.cta;
            return (
              <Card key={`${tier.name}-${billingCycle}`} className={`flex flex-col h-full ${tier.popular ? 'border-2 border-accent shadow-2xl shadow-accent/20' : 'border-primary/10'}`}>
                <CardHeader>
                  {tier.popular && (
                    <div className="text-center">
                      <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-2">MOST POPULAR</span>
                    </div>
                  )}
                  <CardTitle className="text-center font-headline text-2xl">{tier.name}</CardTitle>
                  <div className="text-center">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <CardDescription className="text-center min-h-[40px]">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleCheckout(tier.name, tier.priceId)}
                    disabled={isPending && selectedTier === tier.name}
                    className={`w-full ${tier.popular ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary'}`}
                  >
                    {isPending && selectedTier === tier.name ? 'Processing...' : ctaText}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
