import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    title: 'Top 5 Code Security Risks in Node.js and How to Fix Them',
    description: 'A deep dive into common Node.js vulnerabilities and how AI-powered tools can provide instant, reliable fixes...',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'code security',
    link: '#',
  },
  {
    title: 'How AI is Transforming DevSecOps for Good',
    description: 'Explore the shift from manual code reviews to automated, intelligent security pipelines that catch vulnerabilities...',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'devops automation',
    link: '#',
  },
   {
    title: 'Understanding the OWASP Top 10: A Developer\'s Guide',
    description: 'Break down the most critical web application security risks and learn how to proactively address them in your code...',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'cybersecurity guide',
    link: '#',
  },
];

export default function BlogPreview() {
  return (
    <section id="blog" className="py-16 md:py-24 bg-card/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-headline font-bold">From the Blog</h2>
          <p className="text-muted-foreground mt-2">
            Insights on code security, DevSecOps, and the future of AI in software development.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.title} className="flex flex-col overflow-hidden bg-background border-primary/10 hover:border-primary/30 transition-all shadow-lg">
              <CardHeader className="p-0">
                <Link href={post.link}>
                    <Image src={post.image} alt={post.title} width={600} height={400} data-ai-hint={post.aiHint} />
                </Link>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col">
                <CardTitle className="font-headline text-lg mb-2 flex-grow">
                  <Link href={post.link} className="hover:text-accent">{post.title}</Link>
                </CardTitle>
                <p className="text-muted-foreground text-sm mb-4">{post.description}</p>
                 <Button asChild variant="link" className="p-0 h-auto self-start text-accent">
                    <Link href={post.link}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                 </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
