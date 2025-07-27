import Link from "next/link";
import { Logo } from "./logo";
import { Github, Twitter, Linkedin } from "lucide-react";

type FooterProps = {
  onScrollTo: (sectionId: string) => void;
  onContact: () => void;
};

export default function Footer({ onScrollTo, onContact }: FooterProps) {
  return (
    <footer id="contact" className="bg-background border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="text-muted-foreground mt-4 max-w-xs">
              AI-powered code hardening and vulnerability remediation.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-muted-foreground hover:text-accent"><Twitter /></Link>
              <Link href="#" className="text-muted-foreground hover:text-accent"><Github /></Link>
              <Link href="#" className="text-muted-foreground hover:text-accent"><Linkedin /></Link>
            </div>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold font-headline mb-4">Product</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onScrollTo('features')} className="text-muted-foreground hover:text-accent">Features</button></li>
              <li><button onClick={() => onScrollTo('pricing')} className="text-muted-foreground hover:text-accent">Pricing</button></li>
              <li><Link href="/demo" className="text-muted-foreground hover:text-accent">Demo App</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold font-headline mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onScrollTo('blog')} className="text-muted-foreground hover:text-accent">Blog</button></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent">Support</Link></li>
              <li><button onClick={onContact} className="text-muted-foreground hover:text-accent">Contact Sales</button></li>
            </ul>
          </div>
           <div className="md:col-span-2">
            <h4 className="font-semibold font-headline mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-accent">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RefactorAI. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-accent">Privacy Policy</Link>
            <Link href="#" className="hover:text-accent">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
