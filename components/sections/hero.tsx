import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

type HeroProps = {
  onWatchDemo: () => void;
  onStartRefactoring: () => void;
};

export default function Hero({ onWatchDemo, onStartRefactoring }: HeroProps) {
  return (
    <section id="hero" className="pt-40 pb-20 text-center bg-grid-white/[0.05]">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          Ship Secure Code, Automatically.
        </h1>
        <p className="max-w-2xl mx-auto mb-10 text-lg text-muted-foreground">
          RefactorAI is your AI co-pilot for DevSecOps. Find, fix, and fortify your code against security vulnerabilities before they hit production.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" onClick={onStartRefactoring} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-transform transform hover:scale-105 w-full sm:w-auto">
              Start Free – No Credit Card
              <MoveRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" onClick={onWatchDemo} className="bg-background/50 backdrop-blur-sm w-full sm:w-auto">
            Watch 1-Min Demo
          </Button>
        </div>
        <p className="text-center text-muted-foreground mt-8 font-headline text-sm">
          Used by 1,200+ security-conscious developers
        </p>
      </div>
    </section>
  );
}
