import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "RefactorAI cut our vulnerability remediation time by 75%. It&#39;s like having a senior DevSecOps engineer on call, 24/7. An absolute game-changer for our CI/CD pipeline.",
    name: "Alex Rivera",
    title: "Head of DevOps, SecureCloud",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "man portrait"
  },
  {
    quote: "The quality of the refactoring suggestions is top-tier. It catches subtle security flaws that our static analysis tools miss and provides production-ready code. Our &#39;security debt&#39; has never been lower.",
    name: "Samantha Lee",
    title: "Lead Security Engineer, FinTech Innovations",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "woman portrait"
  },
  {
    quote: "As a developer, I love that it doesn&#39;t just fix my code—it explains *why* the fix is necessary. It has made our entire team more security-conscious. It&#39;s an educational tool and a security shield in one.",
    name: "David Chen",
    title: "Senior Software Engineer, HealthData Corp",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "person avatar"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-headline font-bold">Don&#39;t Just Take Our Word For It</h2>
          <p className="text-muted-foreground mt-2">
            See how developers and security teams are shipping safer code, faster.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 border-primary/10 flex flex-col">
              <CardContent className="pt-6 flex-grow">
                <blockquote className="text-muted-foreground italic leading-relaxed">&#34;{testimonial.quote}&#34;</blockquote>
              </CardContent>
              <div className="p-6 pt-4 flex items-center gap-4 border-t border-primary/10 mt-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                  data-ai-hint={testimonial.aiHint}
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
