import { cn } from "@/lib/utils";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md shadow-primary/30">
        <span className="text-primary-foreground text-sm font-bold">RA</span>
      </div>
      <span className="text-xl font-bold text-foreground font-headline">RefactorAI</span>
    </Link>
  );
}
