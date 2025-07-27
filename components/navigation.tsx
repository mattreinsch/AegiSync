'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { Menu, User, LogOut, Shield } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton";

type NavigationProps = {
  onScrollTo: (sectionId: string) => void;
  onContact: () => void;
};

export default function Navigation({ onScrollTo, onContact }: NavigationProps) {
  const { user, loading, signOut, subscriptionStatus, role } = useAuth();
  const router = useRouter();

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Pricing', id: 'pricing' },
  ];

  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      )
    }

    if (user) {
      return (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-5 w-5"/>
                  <span className="hidden sm:inline">{user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {role === 'admin' && (
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </DropdownMenuItem>
              )}
              {subscriptionStatus === 'active' && (
                <DropdownMenuItem onClick={() => router.push('/demo')}>
                  Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      )
    }

    return (
      <>
        <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
        </Button>
        <Button onClick={() => onScrollTo('pricing')} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
            Get Started
        </Button>
      </>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => onScrollTo(link.id)} className="transition-colors hover:text-accent">{link.label}</button>
          ))}
          <Link href="/demo" className="transition-colors hover:text-accent">Demo</Link>
          <button onClick={onContact} className="transition-colors hover:text-accent">Contact</button>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          {renderAuthButtons()}
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 p-4">
                <Logo />
                {loading ? <Skeleton className="h-8 w-full" /> : user ? (
                  <>
                    <p className="font-semibold">{user.email}</p>
                    {role === 'admin' && (
                      <Link href="/admin" className="flex items-center transition-colors hover:text-accent">
                          <Shield className="mr-2 h-4 w-4" /> Admin
                      </Link>
                    )}
                    {subscriptionStatus === 'active' && <Link href="/demo" className="transition-colors hover:text-accent">Dashboard</Link>}
                    <Button variant="ghost" onClick={signOut} className="text-left justify-start">
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    {navLinks.map(link => (
                      <button key={link.id} onClick={() => onScrollTo(link.id)} className="text-left transition-colors hover:text-accent">{link.label}</button>
                    ))}
                    <Link href="/demo" className="transition-colors hover:text-accent">Demo</Link>
                    <button onClick={onContact} className="text-left transition-colors hover:text-accent">Contact</button>
                     <Button onClick={() => onScrollTo('pricing')} className="bg-accent text-accent-foreground hover:bg-accent/90">
                        Get Started
                    </Button>
                     <Button variant="outline" asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
