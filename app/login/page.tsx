
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createCheckoutSession } from '@/app/actions/stripe';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/demo';


  const handleAuthAction = async (action: 'signIn' | 'signUp') => {
    setError(null);
    setIsPending(true);
    const priceId = searchParams.get('priceId');

    try {
      const authFunction = action === 'signIn' ? signIn : signUp;
      const userCredential = await authFunction(email, password);

      if (priceId && userCredential.user) {
        // If there's a priceId in the URL, start the checkout process
        await createCheckoutSession(priceId, { 
            uid: userCredential.user.uid, 
            email: userCredential.user.email 
        });
        // createCheckoutSession redirects, so execution should stop here on success.
      } else {
        // Otherwise, go to the demo page or the specified redirect path
        router.push(redirectPath);
      }

    } catch (err: any) {
      // Firebase provides more user-friendly error messages
      let message = 'An unknown error occurred.';
      if (err.code) {
        switch (err.code) {
          case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            break;
          case 'auth/user-not-found': // Kept for safety, but invalid-credential is more common now
          case 'auth/wrong-password': // Kept for safety, but invalid-credential is more common now
          case 'auth/invalid-credential':
             message = 'Invalid email or password. Please try again.';
             break;
          case 'auth/email-already-in-use':
            message = 'An account with this email already exists.';
            break;
          case 'auth/weak-password':
            message = 'Password should be at least 6 characters.';
            break;
          default:
            message = 'Failed to authenticate. Please try again later.';
            console.error('Unhandled Firebase Auth Error:', err); // Log unexpected errors
        }
      }
      setError(message);
    } finally {
      setIsPending(false);
    }
  };
  
  const onTabChange = (value: string) => {
    setActiveTab(value);
    setError(null);
    // Clear fields on tab change for better UX
    setEmail('');
    setPassword('');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
            <Logo />
        </div>
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {error && activeTab === 'login' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Login Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button onClick={() => handleAuthAction('signIn')} disabled={isPending} className="w-full">
                  {isPending ? 'Signing In...' : 'Sign In'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Enter your email and password to get started.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && activeTab === 'signup' && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Sign-up Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button onClick={() => handleAuthAction('signUp')} disabled={isPending} className="w-full">
                  {isPending ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
