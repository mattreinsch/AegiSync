import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Bot, Zap, GitPullRequest } from "lucide-react";

const features = [
  {
    icon: <Bot className="h-8 w-8 text-accent" />,
    title: "AI-Powered Remediation",
    description: "Go beyond detection. Get AI-generated, production-ready code fixes for complex vulnerabilities like SQL Injection and XSS."
  },
  {
    icon: <Zap className="h-8 w-8 text-accent" />,
    title: "CI/CD Integration",
    description: "Integrate directly into your GitHub, GitLab, and Jenkins pipelines. Automatically scan and harden code on every commit."
  },
  {
    icon: <GitPullRequest className="h-8 w-8 text-accent" />,
    title: "Automated PR Scanning",
    description: "Catch vulnerabilities before they're merged. RefactorAI automatically scans pull requests and adds security suggestions as comments."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-accent" />,
    title: "Team Security Dashboard",
    description: "Visualize security hotspots in real-time. Track remediation progress across all your repositories and report on your security posture with clarity."
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-card/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-headline font-bold">A DevSecOps Platform, Not Just Another Scanner</h2>
          <p className="text-muted-foreground mt-2">
            RefactorAI provides a comprehensive suite of tools to proactively harden your codebase and educate your team, all within your existing workflow.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background border-primary/10 hover:border-primary/30 transition-all transform hover:-translate-y-1 shadow-lg">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
