
'use client';

import { useState, useRef, useTransition, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getRefactoringSuggestions, getGithubRepos, scanGithubFile } from './actions';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CheckCircle, Code, Languages, ShieldCheck, Zap, Github, GitBranch, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { RefactorCodeOutput } from "@/ai/flows/refactor-code";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
  };
};

type Suggestion = RefactorCodeOutput['suggestions'][0];

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  // TODO: Add more language options here
];

const severityVariant: { [key in Suggestion['severity']]: 'destructive' | 'secondary' | 'outline' } = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
};

const severityClass: { [key in Suggestion['severity']]: string } = {
  high: 'border-red-500/50 bg-red-500/10 text-red-400',
  medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
  low: 'border-green-500/50 bg-green-500/10 text-green-400',
};

export default function DemoPage() {
  const [codeContent, setCodeContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [scannedFile, setScannedFile] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading, subscriptionStatus } = useAuth();
  
  const [githubToken, setGithubToken] = useState('');
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isFetchingRepos, startFetchingRepos] = useTransition();
  const [repoError, setRepoError] = useState('');

  const [scanningRepoId, setScanningRepoId] = useState<number | null>(null);

  const isPaymentSuccess = searchParams.get('payment') === 'success';
  const [isFinalizing, setIsFinalizing] = useState(isPaymentSuccess);
  const [finalizationTimedOut, setFinalizationTimedOut] = useState(false);

  useEffect(() => {
    if (!isFinalizing) return;

    if (subscriptionStatus === 'active') {
      toast({
        title: "Payment Successful!",
        description: "Welcome! Your subscription is active.",
        className: "bg-green-500 text-white"
      });
      setIsFinalizing(false);
      setFinalizationTimedOut(false);
      router.replace('/demo');
      return;
    }

    const timer = setTimeout(() => {
      if (isFinalizing) { 
        setFinalizationTimedOut(true);
        setIsFinalizing(false);
        router.replace('/demo');
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [isFinalizing, subscriptionStatus, router, toast]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeContent.trim()) {
      setError('Please enter some code to analyze.');
      return;
    }
    setError('');
    setSuggestions([]);
    setScannedFile('');
    
    startTransition(async () => {
      const result = await getRefactoringSuggestions({ code: codeContent, language });
      if (result.success) {
        setSuggestions(result.data.suggestions);
        setTimeout(() => {
          suggestionsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError(result.error || 'Failed to get suggestions.');
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "An unexpected error occurred."
        })
      }
    });
  };

  const handleFetchRepos = () => {
    if (!githubToken.trim()) {
      setRepoError('Please enter your GitHub Personal Access Token.');
      return;
    }
    setRepoError('');
    setRepos([]);

    startFetchingRepos(async () => {
      const result = await getGithubRepos(githubToken);
      if (result.success && result.repos) {
        setRepos(result.repos as GitHubRepo[]);
      } else {
        setRepoError(result.error || 'Failed to fetch repositories.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Could not fetch GitHub repositories.',
        });
      }
    });
  };

  const handleRepoScan = (repo: GitHubRepo) => {
    if (!githubToken) {
      toast({ variant: 'destructive', title: 'Error', description: 'GitHub token is missing.' });
      return;
    }
    setError('');
    setSuggestions([]);
    setScannedFile('');
    setScanningRepoId(repo.id);

    startTransition(async () => {
      const result = await scanGithubFile({
        owner: repo.owner.login,
        repo: repo.name,
        token: githubToken,
      });

      if (result.success) {
        setSuggestions(result.data.suggestions || []);
        setScannedFile(result.scannedFile);
        setTimeout(() => {
          suggestionsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError(result.error || 'Failed to scan repository.');
        toast({
          variant: 'destructive',
          title: 'Scan Failed',
          description: result.error || 'An unexpected error occurred during the scan.',
        });
      }
      setScanningRepoId(null);
    });
  };

  if (isFinalizing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background space-y-4 text-center px-4">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-accent"></div>
        <h1 className="text-3xl font-headline text-foreground">Finalizing Your Subscription...</h1>
        <p className="text-muted-foreground max-w-md">
          Your payment was successful. We&#39;re now activating your account. This may take a few moments. Please don&#39;t close or refresh this page.
        </p>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
            <Logo />
            <Button variant="ghost" asChild>
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Home</Link>
            </Button>
        </div>
      </header>
      
      <main className="pt-28 pb-16 container mx-auto px-4 md:px-6">
        <header className="mb-8">
            <h1 className="text-4xl font-extrabold font-headline flex items-center gap-3">
                <ShieldCheck className="h-10 w-10 text-primary"/>
                Security Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Welcome! Here&#39;s your security overview and analysis tools.</p>
        </header>

        {subscriptionStatus === 'active' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Analysis Tools */}
            <div className="space-y-8">
               <Card className="bg-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Github className="h-5 w-5 text-accent" />
                    GitHub Repository Scan
                  </CardTitle>
                  <CardDescription>Enter a Personal Access Token (PAT) to scan your repositories.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="github-token" className="font-semibold">GitHub Personal Access Token</Label>
                        <Input 
                            id="github-token"
                            type="password"
                            value={githubToken}
                            onChange={(e) => setGithubToken(e.target.value)}
                            placeholder="ghp_..."
                            className="bg-input border-border"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            We recommend using a fine-grained token with read-only access to code.
                        </p>
                    </div>
                     <Button onClick={handleFetchRepos} disabled={isFetchingRepos} className="w-full">
                        {isFetchingRepos ? 'Fetching Repos...' : 'Fetch Repositories'}
                    </Button>
                    {repoError && <p className="text-sm text-destructive">{repoError}</p>}
                </CardContent>
              </Card>

              <Card className="bg-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Zap className="h-5 w-5 text-accent" />
                    Manual Code Analysis
                  </CardTitle>
                  <CardDescription>Paste your code to get instant security hardening suggestions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="language-select" className="flex items-center gap-2 font-semibold">
                        <Languages className="h-5 w-5 text-muted-foreground" />
                        Programming Language
                      </Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language-select" className="bg-input border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="codeContent" className="flex items-center gap-2 font-semibold">
                        <Code className="h-5 w-5 text-muted-foreground" />
                        Code to Analyze
                      </Label>
                      <Textarea
                        id="codeContent"
                        value={codeContent}
                        onChange={(e) => setCodeContent(e.target.value)}
                        rows={10}
                        className="bg-input border-border text-foreground font-code"
                        placeholder="Paste your vulnerable code snippet here..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-3 bg-accent text-accent-foreground hover:bg-accent/90 text-lg font-semibold"
                      disabled={isPending}
                    >
                      {isPending && scanningRepoId === null ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </div>
                      ) : (
                        'Get Security Suggestions'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Results */}
            <div className="space-y-8">
                {(isFetchingRepos || repos.length > 0) && (
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Your Repositories</CardTitle>
                            <CardDescription>Select a repository to begin scanning for vulnerabilities.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isFetchingRepos ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                    {repos.map(repo => (
                                        <div key={repo.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                <GitBranch className="h-5 w-5 text-muted-foreground" />
                                                <span className="font-medium">{repo.full_name}</span>
                                            </div>
                                            <Button variant="secondary" size="sm" onClick={() => handleRepoScan(repo)} disabled={isPending}>
                                                {isPending && scanningRepoId === repo.id ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Scan'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
                
              {error && (
                <Alert variant="destructive" className="w-full">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}


              {isPending && suggestions.length === 0 && !error && (
                <Card className="w-full bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin"/>
                      Analyzing...
                    </CardTitle>
                    <CardDescription>The AI is analyzing the code for potential vulnerabilities. This may take a moment.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              )}

              {suggestions.length > 0 && (
                <div ref={suggestionsRef}>
                  <Card className="bg-card">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          AI Hardening Suggestions
                        </CardTitle>
                      </div>
                      {scannedFile && <CardDescription>Scanned File: <code className="font-mono bg-muted px-1 py-0.5 rounded">{scannedFile}</code></CardDescription>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {suggestions.map((suggestion, index) => (
                        <Card key={index} className="bg-background/50 border-l-4" style={{ borderColor: `hsl(var(--${severityVariant[suggestion.severity]}))` }}>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                                    <Badge variant={severityVariant[suggestion.severity]} className={cn('capitalize', severityClass[suggestion.severity])}>{suggestion.severity}</Badge>
                                </div>
                                <CardDescription>{suggestion.compliance}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Description of Risk</h4>
                                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Remediation</h4>
                                    <p className="text-sm text-muted-foreground">{suggestion.explanation}</p>
                                </div>
                                <div className="bg-background/80 rounded-md border">
                                    <pre className="p-4 font-code text-xs text-foreground overflow-auto">{suggestion.refactoredCode}</pre>
                                </div>
                            </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

          </div>
        ) : (
           <Card className="w-full max-w-2xl mx-auto bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                {finalizationTimedOut ? 'Processing Subscription' : 'Subscription Required'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {finalizationTimedOut ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Your subscription is still being processed. This can sometimes take a minute.
                  </p>
                  <p className="text-muted-foreground">
                    Please try refreshing the page in a moment. If the issue persists, contact support.
                  </p>
                  <Button onClick={() => window.location.reload()} className="w-full">Refresh Page</Button>
                </div>
              ) : (
                <div className="space-y-4">
                   <p className="text-muted-foreground">
                    You need an active subscription to use the security analysis tool. Please choose a plan to get started.
                  </p>
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/#pricing">View Pricing Plans</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
