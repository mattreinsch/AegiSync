import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export default function CTA() {
  return (
    <section id="cta" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-accent p-8 md:p-12 text-center shadow-2xl shadow-primary/20">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.1]"></div>
          <div className="relative z-10">
            <Rocket className="h-12 w-12 mx-auto text-primary-foreground mb-4" />
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary-foreground">
              Ready to Fortify Your Codebase?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-primary-foreground/80">
              Join thousands of developers who are shipping more secure code with RefactorAI. Scan your first vulnerability for free.
            </p>
            <Button size="lg" asChild className="mt-8 bg-background text-foreground hover:bg-background/90 transition-transform transform hover:scale-105">
              <Link href="/#pricing">
                Start Hardening Your Code
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
